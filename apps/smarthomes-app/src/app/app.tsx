import { useEffect, useState } from 'react';
import { Header } from '@vivid-theory/ui';
import { Backdrop, CircularProgress, Container } from '@mui/material';
import { Chart, ChartControls } from './components';
import API from '@vivid-theory/api-interfaces';
import 'chart.js/auto';

const api = new API();

export const App = () => {
    const [serials, setSerials] = useState<string[]>([]);
    const [selectedSerial, setSelectedSerial] = useState('');

    const [deviceIds, setDeviceIds] = useState<string[]>([]);
    const [selectedDeviceId, setSelectedDeviceId] = useState('');

    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(0);

    useEffect(() => {
        setLoading(true);
        api.readings
            .serials()
            .then(setSerials)
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    useEffect(() => {
        if (selectedSerial.length) {
            setLoading(true);
            api.readings
                .deviceIds(selectedSerial)
                .then(setDeviceIds)
                .catch(console.error)
                .finally(() => setLoading(false));
        } else {
            setSelectedDeviceId('');
            setDeviceIds([]);
        }
    }, [selectedSerial]);

    return (
        <Container maxWidth="xl">
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
                setPage={setPage}
            />
            <Chart
                serial={selectedSerial}
                deviceId={selectedDeviceId}
                deviceIds={deviceIds}
                setLoading={setLoading}
                page={page}
                setPage={setPage}
            />
        </Container>
    );
};

export default App;
