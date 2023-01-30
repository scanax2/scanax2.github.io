import styled from "styled-components";

export const PlayerWrapper = styled.section`
    visibility: ${({isHidden}) => (isHidden ? 'hidden' : 'visible')};
`;