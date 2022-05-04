import styled from 'styled-components';

/* eslint-disable-next-line */
export interface HeaderProps {
    title?: string;
}

const StyledHeader = styled.div`
    color: navy;
    text-align: center;
`;

export function Header(props: HeaderProps) {
    return (
        <StyledHeader>
            <h1>{props.title ?? 'Welcome to Header!'}</h1>
        </StyledHeader>
    );
}

export default Header;
