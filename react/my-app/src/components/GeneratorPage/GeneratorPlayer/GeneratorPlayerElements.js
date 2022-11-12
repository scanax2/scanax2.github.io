import styled from 'styled-components'

export const GeneratorPlayerWrapper = styled.div`
    align-items: center;
    height: 100%;
    width: 100%;
`;

export const GeneratorPlayerToolbar = styled.div`
    background: #f0f0f0;
    width: 100%;
    height: 48px;
`;

export const GeneratorPlayerTabsWrapper = styled.div`
    margin-left: 24px;
    margin-right: 24px;
    display: flex;
    flex-direction: row;
    justify-content: left;
    align-items: center;
    height: 100%;
`;

export const GeneratorPlayerTab = styled.div`
    cursor: pointer;
    display: inline-block;
    color: #000;
    text-align: center;
    font-size: 22px;
    align-items: center;
    margin-left: 5px;
    margin-right: 5px;
    width: 150px;
    line-height: 50px;
    height: 50px;
    font-weight: lighter;
    transition: all 0.1s ease-out;

    border-bottom: 3px solid #FF1717;
    border-width: ${({ selected, label }) => (selected === label ? 3 : 0)}; // #EBEBE4

    &:hover {
        color: #00B2FF;
    }
`;

export const GeneratorPlayerWindow = styled.div`
    align-items: center;
    width: 100%;
    height: 100%;
`;