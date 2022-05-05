import styled from 'styled-components';
import { ComboBox } from '@vivid-theory/ui';
import React from 'react';
import { Button } from '@mui/material';

// eslint-disable-next-line
export interface ChartControlProps {
    serials: string[];
    deviceIds: string[];

    selectedSerial: string;
    setSelectedSerial: React.Dispatch<React.SetStateAction<string>>;

    selectedDeviceId: string;
    setSelectedDeviceId: React.Dispatch<React.SetStateAction<string>>;
    setPage: React.Dispatch<React.SetStateAction<number>>;
}

const FormStyle = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr 75px;
    gap: 1em;
`;

export function ChartControls(props: ChartControlProps) {
    function onChange(newSerial: string, newDeviceId = '') {
        props.setSelectedDeviceId(newDeviceId);
        props.setSelectedSerial(newSerial);
        props.setPage(0);
    }

    return (
        <FormStyle>
            <ComboBox
                id={'serial-number'}
                values={props.serials}
                selected={props.selectedSerial}
                name="Serial Number"
                onChange={(e) => onChange(e.target.value)}
            />
            <ComboBox
                id={'device-id'}
                values={props.deviceIds}
                selected={props.selectedDeviceId}
                name="Device ID"
                disabled={
                    props.selectedSerial.length === 0 &&
                    props.deviceIds.length === 0
                }
                onChange={(e) => onChange(props.selectedSerial, e.target.value)}
            />
            <Button variant="outlined" onClick={() => onChange('', '')}>
                Reset
            </Button>
        </FormStyle>
    );
}
