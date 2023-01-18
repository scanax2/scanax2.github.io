import { FaLinkedin } from 'react-icons/fa'

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

const ExtraAboutUs = ({id, lightBg, lightText,
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
            <SocialIcons>
                  <Heading lightText={lightText}>Our team</Heading>
                  <SocialIconWrapper>
                    <SocialIconLink href='https://www.linkedin.com/in/daniel-parkhanovich-a31a54206/' target="_blank" aria-label="Poznan University Of Technology">
                        <FaLinkedin />
                    </SocialIconLink>
                    <Subtitle darkText={darkText}>Daniel Parkhanovich - development of the website</Subtitle>
                  </SocialIconWrapper>
                  <SocialIconWrapper>
                    <SocialIconLink href='https://www.linkedin.com/in/dorota-solarska-ab69a023b/' target="_blank" aria-label="Poznan University Of Technology">
                        <FaLinkedin />
                    </SocialIconLink>
                    <Subtitle darkText={darkText}>Dorota Solarska - development of the backend service</Subtitle>
                  </SocialIconWrapper>
                  <SocialIconWrapper>
                    <SocialIconLink href='https://www.linkedin.com/in/kajetan-wencierski-bb5347218/' target="_blank" aria-label="Poznan University Of Technology">
                        <FaLinkedin />
                    </SocialIconLink>
                    <Subtitle darkText={darkText}>Kajetan Wencierski - implementation of music generator</Subtitle>
                  </SocialIconWrapper>
            </SocialIcons>
        </InfoWrapper>
      </InfoContainer>
    </ExtraInfoContainer>
  )
}

export default ExtraAboutUs
