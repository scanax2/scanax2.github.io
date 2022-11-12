import styled from 'styled-components'

export const ParameterContainer = styled.div`
    color: #000;
    width: 280px;
    height: 100px;
`;

export const ParameterTitle = styled.h2`
    color: #fff;
    font-weight: bold;
    font-size: min(3.5vw, 20px);
    text-align: center;
    max-width: 100%;
`;

export const ParameterOptionsRow = styled.div`
    margin-top: 18px;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
`;

export const ParameterOption = styled.div`
    cursor: pointer;
    display: inline-block;
    color: #FFF;
    text-align: center;
    font-size: 16px;
    border-radius: 9px;
    align-items: center;
    margin-left: 5px;
    margin-right: 5px;
    width: 150px;
    line-height: 50px;
    height: 50px;
    background: #000;
    font-weight: lighter;
    transition: all 0.1s ease-out;

    background: ${({ selected, label }) => (selected === label ? '#00B2FF' : '#000')};

    &:hover {
        transition: all 0s ease-out;
        //background: ${({ selected, label }) => (selected === label ? '#00B2FF' : '#a3a3a3')};
    }
`;