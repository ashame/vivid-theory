import { render } from '@testing-library/react';

import Header from './header';

describe('Header', () => {
    it('should render successfully', () => {
        const { baseElement } = render(<Header />);
        expect(baseElement).toBeTruthy();
        expect(baseElement.innerHTML.includes('Welcome to Header!')).toBe(true);
    });

    it('should should custom text passed as a title prop', () => {
        const { baseElement } = render(<Header title="Custom Text" />);
        expect(baseElement).toBeTruthy();
        expect(baseElement.innerHTML.includes('Welcome to Header!')).toBe(
            false
        );
        expect(baseElement.innerHTML.includes('Custom Text')).toBe(true);
    });
});
