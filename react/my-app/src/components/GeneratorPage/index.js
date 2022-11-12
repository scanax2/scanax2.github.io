import React, {useState, useRef} from 'react'
import { 
  GeneratorContainer,
  GeneratorInputContainer,
  GeneratorInputWrapper,
  GeneratorInputRow,
  GeneratorPlayer,
  BtnWrapper,
  DropdownWrapper,
  GeneratorSettingsWrapper,
  SmallBtnWrapper
} from './GeneratorElements'
import GeneratorInputEnum from './GeneratorInputEnum'
import { tempoEnum, sRangeEnum, volumeEnum, sentimentEnum } from './EnumParametersData'
import { instrumentsDropdown, durationDropdown } from './EnumDropdownData'
import { Button } from '../ButtonElements'
import GeneratorEnumDropdown from './GeneratorEnumDropdown'

const GeneratorSection = () => {
  
  // Sample add process
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

  // Clear all presets
  const [clearTrigger, setTrigger] = useState(0);

  return (
    <>
      <GeneratorContainer>
            <GeneratorInputContainer>
              <GeneratorInputWrapper>
                <GeneratorInputRow>
                  <GeneratorInputEnum {...tempoEnum} clearTrigger={clearTrigger}/>
                  <GeneratorInputEnum {...sRangeEnum} clearTrigger={clearTrigger}/>
                  <GeneratorInputEnum {...volumeEnum} clearTrigger={clearTrigger}/>
                  <GeneratorInputEnum {...sentimentEnum} clearTrigger={clearTrigger}/>
                </GeneratorInputRow>
                <GeneratorInputRow>
                  <SmallBtnWrapper background={'#08080890'}>
                    <Button primary={false} dark={false} fontBig={false} onClick={() => {
                        setTrigger(() => clearTrigger + 1);
                      }}>Clear x
                    </Button>
                  </SmallBtnWrapper>
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