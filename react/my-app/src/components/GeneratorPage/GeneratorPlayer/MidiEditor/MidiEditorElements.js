import styled from "styled-components";

export const EditorWrapper = styled.div`
    visibility: ${({isHidden}) => (isHidden ? 'hidden' : 'visible')};

    display: flex;
    justify-content: center;

    width: 100%;
    height: 100%;
    padding-top: 5px;
`;