import { useEffect, useMemo, useState } from 'react';
import { Header } from '@vivid-theory/ui';
import { Backdrop, CircularProgress, Container } from '@mui/material';
import { ChartControls } from './components/ChartControls';
import API from '@vivid-theory/api-interfaces';

export const App = () => {
    const api = useMemo(() => new API(), []);
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
        setLoading(true);
        api.readings
            .get(
                selectedSerial,
                selectedDeviceId.length ? [selectedDeviceId] : deviceIds
            )
            .then((res) => {
                console.log({ res });
            })
            .finally(() => setLoading(false));
    }, [selectedSerial, selectedDeviceId, api, deviceIds]);

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
