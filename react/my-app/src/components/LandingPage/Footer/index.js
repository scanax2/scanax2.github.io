import React from 'react'
import { FaLinkedin } from 'react-icons/fa'
import { animateScroll as scroll } from 'react-scroll'
import {
    FooterContainer,
    FooterWrap,
    FooterLinksContainer,
    FooterLinksWrapper,
    FooterLinkItems,
    FooterLinkTitle,
    FooterLink,
    SocialMedia,
    SocialMediaWrap,
    SocialLogo,
    WebsiteRights,
    SocialIcons,
    SocialIconLink
} from './FooterElements'

const Footer = () => {

  const toggleHome = () => {
    scroll.scrollToTop();
  };

  return (
    <FooterContainer>
      <FooterWrap>
        <FooterLinksContainer>
            <FooterLinksWrapper>
                <FooterLinkItems>
                    <FooterLinkTitle>Information</FooterLinkTitle>
                    <FooterLink to="/about-us" onClick={toggleHome}>About us</FooterLink>
                    <FooterLink to="/terms-of-service" onClick={toggleHome}>Terms of Service</FooterLink>
                </FooterLinkItems>
            </FooterLinksWrapper>
        </FooterLinksContainer>
        <SocialMedia>
            <SocialMediaWrap>
                <SocialLogo to='/' onClick={toggleHome}>
                    GMG
                </SocialLogo>
                <WebsiteRights>
                    GMG © {new Date().getFullYear()} All rights reserved.
                </WebsiteRights>
            </SocialMediaWrap>
        </SocialMedia>
      </FooterWrap>
    </FooterContainer>
  )
}

export default Footer
