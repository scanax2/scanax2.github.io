import styled from 'styled-components'
import BeatLoader from 'react-spinners/BeatLoader'


export const LoadingIndicatorWrapper = styled.div`
    position: fixed;
    background-color: rgba(0, 0, 0, 0.75);
    z-index: 10;
    width: 100%;
    height: 100%;
`;

export const BeatLoadingIndicator = styled(BeatLoader)`
    position: fixed;
    left: 50%;
    top: 50%;
`;
