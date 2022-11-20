import styled from "styled-components";

export const PlayerWrapper = styled.div`
    visibility: ${({isHidden}) => (isHidden ? 'hidden' : 'visible')};
`;