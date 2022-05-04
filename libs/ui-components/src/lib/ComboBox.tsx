import styled from 'styled-components';
import {
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    SelectChangeEvent,
} from '@mui/material';
import { ReactNode } from 'react';

/* eslint-disable-next-line */
export interface ComboBoxProps {
    id: string;
    values: string[];
    selected: string;
    onChange: (event: SelectChangeEvent<string>, child: ReactNode) => void;
    disabled?: boolean;
    name?: string;
}

const StyledUiComponents = styled.div`
    margin-top: 0.2em;
    margin-bottom: 0.2em;
`;

export function ComboBox(props: ComboBoxProps) {
    return (
        <StyledUiComponents>
            <FormControl fullWidth>
                <InputLabel htmlFor={props.id + '-label'}>
                    {props.name ?? 'Select a Value'}
                </InputLabel>
                <Select
                    labelId={props.id + '-label'}
                    value={props.selected}
                    id={props.id}
                    onChange={props.onChange}
                    disabled={props.disabled}
                >
                    {props.values.map((value) => (
                        <MenuItem key={value} value={value}>
                            {value}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        </StyledUiComponents>
    );
}

export default ComboBox;
