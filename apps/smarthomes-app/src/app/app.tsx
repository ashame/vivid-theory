import { useEffect, useMemo, useState } from 'react';
import { Header } from '@vivid-theory/ui';
import { Backdrop, CircularProgress, Container } from '@mui/material';
import { ChartControls } from './components/ChartControls';
import API, { Reading } from '@vivid-theory/api-interfaces';

interface Cache {
    [key: string]: {
        [key: string]: Reading[];
    };
}

export const App = () => {
    const api = useMemo(() => new API(), []);
    const [cache, setCache] = useState<Cache>({});
    const [serials, setSerials] = useState<string[]>([]);
    const [selectedSerial, setSelectedSerial] = useState<string>('');

    const [deviceIds, setDeviceIds] = useState<string[]>([]);
    const [selectedDeviceId, setSelectedDeviceId] = useState<string>('');

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!serials.length) {
            setLoading(true);
            api.readings
                .serials()
                .then(setSerials)
                .finally(() => setLoading(false));
        }
    }, [api, serials]);

    useEffect(() => {
        if (selectedSerial.length) {
            setLoading(true);
            api.readings
                .deviceIds(selectedSerial)
                .then(setDeviceIds)
                .finally(() => setLoading(false));
        } else {
            setDeviceIds([]);
        }
    }, [selectedSerial, api]);

    useEffect(() => {
        if (!selectedSerial.length || !deviceIds.length) return;
        if (!(selectedSerial in cache)) cache[selectedSerial] = {};
        (async () => {
            setLoading(true);
            for (const deviceId of deviceIds) {
                if (deviceId in cache[selectedSerial]) continue;
                cache[selectedSerial][deviceId] = await api.readings.get(
                    selectedSerial,
                    deviceId
                );
            }
            setCache(cache);
            setLoading(false);
        })();
    }, [selectedSerial, deviceIds, cache, api]);

    useEffect(() => {
        if (!selectedDeviceId.length) return;
        console.log('Cache updated.');
        console.log({
            [selectedDeviceId]: cache[selectedSerial][selectedDeviceId],
        });
    }, [selectedDeviceId, selectedSerial, cache]);

    return (
        <Container maxWidth="md">
            <Backdrop
                sx={{ color: '#fff', zIndex: (t) => t.zIndex.drawer + 1 }}
                open={loading}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
            <Header title="Smart Home Data Visualizer" />
            <ChartControls
                serials={serials}
                deviceIds={deviceIds}
                selectedSerial={selectedSerial}
                setSelectedSerial={setSelectedSerial}
                selectedDeviceId={selectedDeviceId}
                setSelectedDeviceId={setSelectedDeviceId}
            />
        </Container>
    );
};

export default App;
