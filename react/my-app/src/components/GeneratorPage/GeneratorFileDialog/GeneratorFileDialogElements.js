import styled from 'styled-components'


export const ModalContentWrapper = styled.div`
    display: flex;
    flex-direction: column;
    justify-items: center;
    align-items: center;
    color: #fff;
    width: fit-content;
    height: fit-content;
    max-width: 720px;
`;

export const ModalHeader = styled.h2`
    align-items: center;
    font-size: 32px;
    color: #fff;
`;

export const ModalDescription = styled.h3`
    padding-left: 16px;
    padding-right: 16px;
    margin-top: 32px;
    margin-bottom: 32px;
    display: flex;
    text-align: left;
    font-size: 18px;
    font-weight: 100;
    color: #fff;
`; 

export const FileInputWrapper = styled.div`
    margin-bottom: 32px;
`;

export const ModalButtonWrapper = styled.div`
    height: 48px;
    width: 340px;
    background: #fff;
    border-radius: 9px;
`; 
