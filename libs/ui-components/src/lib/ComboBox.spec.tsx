import { render } from '@testing-library/react';

import ComboBox from './ComboBox';

describe('UiComponents', () => {
    it('should render successfully', () => {
        const { baseElement } = render(
            <ComboBox
                id={''}
                values={[]}
                onChange={function () {
                    throw new Error('Function not implemented.');
                }}
                selected={''}
            />
        );
        expect(baseElement).toBeTruthy();
    });
});
