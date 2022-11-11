import React, {useState} from 'react'
import { 
  GeneratorContainer,
  GeneratorInputContainer,
  GeneratorInputWrapper,
  GeneratorInputRow,
  GeneratorPlayer,
  BtnWrapper,
  DropdownWrapper,
  GeneratorSettingsWrapper
} from './GeneratorElements'
import GeneratorInputEnum from './GeneratorInputEnum'
import { tempoEnum, sRangeEnum, volumeEnum, sentimentEnum } from './EnumParametersData'
import { instrumentsDropdown, durationDropdown } from './EnumDropdownData'
import { Button } from '../ButtonElements'
import GeneratorEnumDropdown from './GeneratorEnumDropdown'

const GeneratorSection = () => {

  const [currentSampleState, setCurrentState] = useState("Add sample")

  const toggleSampleState = () => {
    console.log(currentSampleState)
    if (currentSampleState === "Add sample"){
      setCurrentState(prevState => "Back");
    }
    else{
      setCurrentState(prevState => "Add sample");
    }
  };

  return (
    <>
      <GeneratorContainer>
            <GeneratorInputContainer>
              <GeneratorInputWrapper>
                <GeneratorInputRow>
                  <GeneratorInputEnum {...tempoEnum}/>
                  <GeneratorInputEnum {...sRangeEnum}/>
                  <GeneratorInputEnum {...volumeEnum}/>
                  <GeneratorInputEnum {...sentimentEnum}/>
                </GeneratorInputRow>
                <GeneratorInputRow>
                  <GeneratorSettingsWrapper>
                    <BtnWrapper background={'#000'}>
                      <Button onClick={toggleSampleState} primary={false} dark={false} fontBig={true}>{currentSampleState}</Button>
                    </BtnWrapper>
                    <DropdownWrapper>
                      <GeneratorEnumDropdown {...durationDropdown}/>
                    </DropdownWrapper>
                    <DropdownWrapper>
                      <GeneratorEnumDropdown {...instrumentsDropdown}/>
                    </DropdownWrapper>
                    <BtnWrapper background={'#32CD32'}>
                      <Button primary={false} dark={false} fontBig={true}>Generate music</Button>
                    </BtnWrapper>
                  </GeneratorSettingsWrapper>
                </GeneratorInputRow>
              </GeneratorInputWrapper>
            </GeneratorInputContainer>
            <GeneratorPlayer>
            </GeneratorPlayer>
      </GeneratorContainer>
    </>
  )
}

export default GeneratorSection
