import { Line } from 'react-chartjs-2';
import API, { Reading } from '@vivid-theory/api-interfaces';
import { usePrevious, getRandomColors } from '@vivid-theory/ui/functions';
import React, { useEffect, useState } from 'react';
import { ChartDataset } from 'chart.js';
import 'chartjs-adapter-date-fns';
import { format } from 'date-fns';
import { Button } from '@mui/material';
import styled from 'styled-components';

interface ReadingCache {
    [serial: string]: {
        [deviceId: string]: {
            [page: number]: Reading[];
        };
    };
}

const api = new API();
const ChartContainer = styled.div`
    display: grid;
    grid-template-columns: 50px auto 50px;
`;
export interface ChartPropTypes {
    serial: string;
    deviceId: string;
    deviceIds: string[];
    page: number;
    setPage: React.Dispatch<React.SetStateAction<number>>;
    setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

export function Chart(props: ChartPropTypes) {
    const { serial, deviceId, deviceIds, page, setPage, setLoading } = props;
    const prevSerial = usePrevious(serial);
    const prevDeviceId = usePrevious(deviceId);
    const prevDeviceIds = usePrevious(deviceIds);
    const [chartDatasets, setChartDatasets] = useState<ChartDataset<'line'>[]>(
        []
    );
    const [readingCache, setReadingCache] = useState<ReadingCache>({});
    const prevPage = usePrevious(page);

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
            if (!serial || !deviceIds.length) return;
            if (
                prevDeviceIds &&
                deviceIds[0] === prevDeviceIds[0] &&
                (prevPage == null || (prevPage != null && page === prevPage))
            )
                return;
            setLoading(true);
            const devices = deviceId ? [deviceId] : deviceIds;
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
    }, [
        serial,
        deviceIds,
        readingCache,
        page,
        setLoading,
        prevDeviceIds,
        prevPage,
        deviceId,
    ]);

    return (
        <ChartContainer>
            <Button
                variant="text"
                style={{ maxHeight: '50px', alignSelf: 'center' }}
                onClick={() => setPage(page - 1)}
                disabled={page === 0}
            >
                &lt;
            </Button>
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
            <Button
                variant="text"
                style={{ maxHeight: '50px', alignSelf: 'center' }}
                onClick={() => setPage(page + 1)}
            >
                &gt;
            </Button>
        </ChartContainer>
    );
}
