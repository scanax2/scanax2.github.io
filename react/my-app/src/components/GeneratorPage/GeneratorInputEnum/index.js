import React, {useState} from 'react'
import {
    ParameterContainer,
    ParameterTitle,
    ParameterOptionsRow,
    ParameterOption
} from './GeneratorInputEnumElements'

const GeneratorInputEnum = ({title, options}) => {

    const enums = []
    const [currentState, setCurrentState] = useState("none")

    const toggle = (selected) => {
        setCurrentState(prevState => selected);
    };

    options.forEach((data) =>{
        enums.push(<ParameterOption selected={currentState} label={data} onClick={() => toggle(data)}>{data}</ParameterOption>)
    })

    return (
        <ParameterContainer>
            <ParameterTitle>{title}</ParameterTitle>
            <ParameterOptionsRow>{enums}</ParameterOptionsRow>
        </ParameterContainer>
    )
}

export default GeneratorInputEnum
