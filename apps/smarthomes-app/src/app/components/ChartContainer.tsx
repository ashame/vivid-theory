import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
} from '@mui/material';
import API, { Reading } from '@vivid-theory/api-interfaces';
import React, { useEffect, useMemo, useRef, useState } from 'react';

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

export function Chart(props: ChartPropTypes) {
    const api = useMemo(() => new API(), []);
    const { serial, deviceId, deviceIds, setLoading } = props;
    const prevDeviceIds = usePrevious(deviceIds);
    const [readingCache, setReadingCache] = useState<ReadingCache>({});
    const [page, setPage] = useState(0);

    useEffect(() => {
        (async () => {
            if (readingCache[serial])
                return console.log({ [serial]: readingCache[serial] });
            if (!deviceIds.length) return;
            if (prevDeviceIds && deviceIds[0] === prevDeviceIds[0]) return;
            setLoading(true);
            const devices = deviceIds;
            const readings = await Promise.all(
                devices.map((deviceId) => {
                    if (readingCache?.[serial]?.[deviceId]?.[page]?.length)
                        return Promise.resolve(
                            readingCache[serial][deviceId][page]
                        );
                    return api.readings
                        .get(serial, deviceId, page)
                        .catch(console.error);
                })
            );

            for (let i = 0; i < devices.length; i++) {
                const deviceId = devices[i];
                const deviceReadings = readings[i];
                if (!deviceReadings || !deviceReadings?.length) continue;
                if (!readingCache[serial]) readingCache[serial] = {};
                if (!readingCache[serial][deviceId])
                    readingCache[serial][deviceId] = {};
                readingCache[serial][deviceId][page] = deviceReadings;
            }

            setReadingCache(readingCache);
            console.log({ readingCache });
            setLoading(false);
        })();
    }, [serial, deviceIds, readingCache, api, page, setLoading, prevDeviceIds]);

    return (
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
    );
}
