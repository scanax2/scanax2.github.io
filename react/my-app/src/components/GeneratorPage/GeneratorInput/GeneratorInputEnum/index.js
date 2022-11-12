import React, {useState, useEffect} from 'react'
import {
    ParameterContainer,
    ParameterTitle,
    ParameterOptionsRow,
    ParameterOption
} from './GeneratorInputEnumElements'

const GeneratorInputEnum = ({title, options, clearTrigger}) => {

    // Switch state
    const enums = []
    const [currentState, setCurrentState] = useState("none")

    const toggle = (selected) => {
        setCurrentState(prevState => selected);
    };

    options.forEach((data) =>{
        enums.push(<ParameterOption selected={currentState} label={data} onClick={() => toggle(data)}>{data}</ParameterOption>)
    })

    // Clear
    useEffect(() => {
        if (clearTrigger) {
          clearAll();
        }
      }, [clearTrigger]);
      
    const clearAll = () => {
        toggle('none')
    }

    return (
        <ParameterContainer>
            <ParameterTitle>{title}</ParameterTitle>
            <ParameterOptionsRow>{enums}</ParameterOptionsRow>
        </ParameterContainer>
    )
}

export default GeneratorInputEnum
