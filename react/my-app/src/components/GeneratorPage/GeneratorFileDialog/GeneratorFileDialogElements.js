import styled from 'styled-components'

export const ModalWrapper = styled.div`
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);

    border: 1px solid #ccc;
    background: #fff;
    overflow: auto;
    border-radius: 4px;
    outline: none;
    padding: 20px;
    z-index: 4;
    background-color: rgba(0, 0, 0, 0.75);
    transition: opacity 500ms ease-in-out;
`; 