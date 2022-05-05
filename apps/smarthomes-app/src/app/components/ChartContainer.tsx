import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
} from '@mui/material';
import { Line } from 'react-chartjs-2';
import API, { Reading } from '@vivid-theory/api-interfaces';
import React, { useEffect, useRef, useState } from 'react';
import { ChartDataset } from 'chart.js';
import 'chartjs-adapter-date-fns';
import { format } from 'date-fns';

interface ReadingCache {
    [serial: string]: {
        [deviceId: string]: {
            [page: number]: Reading[];
        };
    };
}

function usePrevious<T>(value: T): T | undefined {
    const ref = useRef<T>();
    useEffect(() => {
        ref.current = value;
    });
    return ref.current;
}

export interface ChartPropTypes {
    serial: string;
    deviceId: string;
    deviceIds: string[];
    setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

const api = new API();
const getRandomColors = () => {
    const r = Math.floor(Math.random() * 255);
    const g = Math.floor(Math.random() * 255);
    const b = Math.floor(Math.random() * 255);
    const a = Math.random() * 0.5 + 0.5;
    return [`rgb(${r}, ${g}, ${b})`, `rgba(${r}, ${g}, ${b}, ${a})`];
};

export function Chart(props: ChartPropTypes) {
    const { serial, deviceId, deviceIds, setLoading } = props;
    const prevSerial = usePrevious(serial);
    const prevDeviceId = usePrevious(deviceId);
    const prevDeviceIds = usePrevious(deviceIds);
    const [chartDatasets, setChartDatasets] = useState<ChartDataset<'line'>[]>(
        []
    );
    const [readingCache, setReadingCache] = useState<ReadingCache>({});
    const [page, setPage] = useState(0);

    useEffect(() => {
        if (!readingCache[serial]) return;
        const datasets: ChartDataset<'line'>[] = [];
        for (const id of deviceId ? [deviceId] : deviceIds) {
            const [borderColor, backgroundColor] = getRandomColors();
            const dataset = {
                label: id,
                backgroundColor,
                borderColor,
                data: readingCache[serial][id]?.[page]?.map((r) => ({
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    x: r.DateTime as any, //this is a valid type for a time scaling chart
                    y: Number(r.Wattage),
                })),
            };
            datasets.push(dataset);
        }
        setChartDatasets(datasets);
    }, [
        serial,
        deviceId,
        prevSerial,
        prevDeviceId,
        readingCache,
        page,
        deviceIds,
    ]);

    useEffect(() => {
        if (!serial.length) setChartDatasets([]);
    }, [serial]);

    useEffect(() => {
        (async () => {
            if (readingCache[serial] || !deviceIds.length) return;
            if (prevDeviceIds && deviceIds[0] === prevDeviceIds[0]) return;
            setLoading(true);
            const devices = deviceIds;
            let changed = false;
            const readings = await Promise.all(
                devices.map(async (id) => {
                    if (readingCache?.[serial]?.[id]?.[page]?.length)
                        return readingCache[serial][id][page];
                    try {
                        changed = true;
                        return await api.readings.get(serial, id, page);
                    } catch (e) {
                        console.error(
                            `Failed to get readings for ${serial}/${id}`
                        );
                        console.error(e);
                        return [];
                    }
                })
            );

            const cache = { ...readingCache };
            for (let i = 0; i < devices.length; i++) {
                const deviceId = devices[i];
                const deviceReadings = readings[i];
                if (!deviceReadings || !deviceReadings?.length) continue;
                if (!cache[serial]) cache[serial] = {};
                if (!cache[serial][deviceId]) cache[serial][deviceId] = {};
                cache[serial][deviceId][page] = deviceReadings;
                changed = true;
            }

            if (changed) setReadingCache(cache);
            setLoading(false);
        })();
    }, [serial, deviceIds, readingCache, page, setLoading, prevDeviceIds]);

    return (
        <div>
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>serial</TableCell>
                            <TableCell>deviceId</TableCell>
                            <TableCell>deviceIds</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        <TableRow>
                            <TableCell>{props.serial}</TableCell>
                            <TableCell>{props.deviceId}</TableCell>
                            <TableCell>{props.deviceIds.join(', ')}</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>
            <Line
                data={{
                    labels: [],
                    datasets: chartDatasets,
                }}
                options={{
                    scales: {
                        xAxes: {
                            type: 'time',
                            time: {
                                unit: 'minute',
                                stepSize: 20,
                                displayFormats: {
                                    minute: 'HH:mm',
                                },
                            },
                        },
                        yAxes: {
                            type: 'linear',
                        },
                    },
                    plugins: {
                        legend: {
                            position: 'bottom' as const,
                        },
                        tooltip: {
                            callbacks: {
                                title: ([context]: any[]) =>
                                    format(
                                        new Date(context.raw.x),
                                        'yyyy-MM-dd HH:mm'
                                    ),
                                label: (context: any) =>
                                    `${context.dataset.label} - ${context.raw.y} watt consumption`,
                            },
                        },
                    },
                }}
            />
        </div>
    );
}
