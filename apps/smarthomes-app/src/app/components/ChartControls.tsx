import styled from 'styled-components';
import { ComboBox } from '@vivid-theory/ui';
import React from 'react';
import { Button } from '@mui/material';
import { ChartData } from 'chart.js';

// eslint-disable-next-line
export interface ChartControlProps {
    serials: string[];
    deviceIds: string[];

    chartData?: ChartData;
    setChartData?: React.Dispatch<React.SetStateAction<ChartData>>;

    selectedSerial: string;
    setSelectedSerial: React.Dispatch<React.SetStateAction<string>>;

    selectedDeviceId: string;
    setSelectedDeviceId: React.Dispatch<React.SetStateAction<string>>;
}

const FormStyle = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr 75px;
    gap: 1em;
`;

export function ChartControls(props: ChartControlProps) {
    return (
        <FormStyle>
            <ComboBox
                id={'serial-number'}
                values={props.serials}
                selected={props.selectedSerial}
                name="Serial Number"
                onChange={(e) => {
                    props.setSelectedSerial(e.target.value);
                    props.setSelectedDeviceId('');
                }}
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
                onChange={(e) => {
                    props.setSelectedDeviceId(e.target.value);
                }}
            />
            <Button
                variant="outlined"
                onClick={() => {
                    props.setSelectedSerial('');
                    props.setSelectedDeviceId('');
                }}
            >
                Reset
            </Button>
        </FormStyle>
    );
}
