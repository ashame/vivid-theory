import { useEffect, useState } from 'react';
import { ComboBox, Header } from '@vivid-theory/ui';
import styled from 'styled-components';

const FormStyle = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1em;
`;

export const App = () => {
    const [serials, setSerials] = useState<string[]>([]);
    const [selectedSerial, setSelectedSerial] = useState<string>('');

    const [deviceIds, setDeviceIds] = useState<string[]>([]);
    const [selectedDeviceId, setSelectedDeviceId] = useState<string>('');

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        fetch('/api/readings/serials')
            .then((r) => r.json())
            .then(setSerials)
            .finally(() => setLoading(false));
    }, []);

    useEffect(() => {
        if (selectedSerial.length) {
            setLoading(true);
            fetch(`/api/readings/${selectedSerial}/devices`)
                .then((r) => r.json())
                .then(setDeviceIds)
                .finally(() => setLoading(false));
        } else {
            setDeviceIds([]);
        }
    }, [selectedSerial]);

    return (
        <div>
            <Header title="Smart Home Data Visualizer" />
            <FormStyle>
                <ComboBox
                    id={'serial-number'}
                    values={serials}
                    selected={selectedSerial}
                    name="Serial Number"
                    onChange={(e) => {
                        setSelectedSerial(e.target.value);
                        setSelectedDeviceId('');
                    }}
                />
                <ComboBox
                    id={'device-id'}
                    values={deviceIds}
                    selected={selectedDeviceId}
                    name="Device ID"
                    disabled={
                        selectedSerial.length === 0 && deviceIds.length === 0
                    }
                    onChange={(e) => {
                        setSelectedDeviceId(e.target.value);
                    }}
                />
            </FormStyle>
        </div>
    );
};

export default App;
