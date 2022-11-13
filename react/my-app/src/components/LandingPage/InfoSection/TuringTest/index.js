import React from 'react'
import { ButtonR } from '../../../ButtonElements'
import {
    InfoContainer,
    InfoWrapper,
    TextWrapper,
    Heading,
    Subtitle,
    BtnWrap,
    SubHeading,
    SubHeadingWrap,
    IconWrap,
    Icon,
    SubHeadingWrapSmall
} from './../InfoSectionElements'

const InfoSectionTuringTest = ({id, lightBg, topLine, lightText, 
    headline, darkText, description, buttonLabel, img, alt, primary, dark, dark2}) => {
  return (
      <InfoContainer lightBg={lightBg} id={id}>
        <InfoWrapper>
            <TextWrapper>
                <Heading lightText={lightText}>{headline}</Heading>
                <SubHeadingWrapSmall>
                    <Subtitle centerAlign={true} darkText={darkText}>{description}</Subtitle>
                </SubHeadingWrapSmall>
                <SubHeadingWrap>
                    <SubHeading centerAlign={true} lightText={lightText} large={true}>98 %</SubHeading>
                    <Subtitle centerAlign={true} darkText={darkText} large={true}>success rate</Subtitle>
                </SubHeadingWrap>
                <BtnWrap>
                    <ButtonR to='/TuringTest'
                    smooth={true}
                    duration={500}
                    spy={true}
                    exact="true"
                    offset={-60}
                    primary={primary ? 1 : 0}
                    dark={dark ? 1 : 0}
                    dark2 ={dark2 ? 1 : 0}
                    big={true}
                    >{buttonLabel}</ButtonR>
                </BtnWrap>
            </TextWrapper>
        </InfoWrapper>
      </InfoContainer>
  )
}

export default InfoSectionTuringTest
