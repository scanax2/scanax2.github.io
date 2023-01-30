import styled from 'styled-components'

export const GeneratorContainer = styled.div`
    padding-top: 60px;
    background: #0c0c0c;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    position:absolute;
    height: 100vh;
    width: 100vw;
    overflow: clip;
    width: 100%;
    position: relative;
    z-index: 1;

    @media screen and (max-width: 720px) {
        height: 1800px;
    }
`;

export const GeneratorInputContainer = styled.div`
    background: #1F262A;
    height: 32.5%;
    width: 100%;
    z-index: 3;
    @media screen and (max-width: 720px) {
        height: 1100px;
    }
`;

export const GeneratorPlayerContainer = styled.div`
    background: #010101;
    height: 67.5%;
    width: 100%;
    z-index: 2;

    @media screen and (max-width: 720px) {
        height: 1100px;
    }
`;