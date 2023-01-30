
import React from 'react'
import {
    InfoContainer,
    InfoWrapper,
    TextWrapper,
    Heading,
    Subtitle,
    SubHeading,
    SubHeadingWrap,
} from '../LandingPage/InfoSection/InfoSectionElements'
import {
    ExtraInfoContainer,
    ExtraInfoTextWrapper,
    SocialIconLink,
    SocialIcons,
    SocialIconWrapper
} from './ExtraInfoSectionElements' 

const ExtraTermsOfService = ({id, lightBg, lightText,
    headline, darkText, title, description}) => {
  return (
    <ExtraInfoContainer>
      <InfoContainer lightBg={lightBg} id={id}>
        <InfoWrapper>
            <ExtraInfoTextWrapper>
                <Heading lightText={lightText}>{headline}</Heading>
                <SubHeadingWrap>
                    <SubHeading>{title}</SubHeading>
                    <Subtitle darkText={darkText}>{description}</Subtitle>
                </SubHeadingWrap>
            </ExtraInfoTextWrapper>
        </InfoWrapper>
      </InfoContainer>
    </ExtraInfoContainer>
  )
}

export default ExtraTermsOfService
