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
                    <FooterLink to="/about-us">about us</FooterLink>
                    <FooterLink to="/Terms-of-service">Terms of Service</FooterLink>
                    <FooterLink to="/How-it-works">How it works</FooterLink>
                    <FooterLink to="/Testimonials">Testimonials</FooterLink>
                    <FooterLink to="/Prices">Prices</FooterLink>
                </FooterLinkItems>
                <FooterLinkItems>
                    <FooterLinkTitle>Information</FooterLinkTitle>
                    <FooterLink to="/about-us">about us</FooterLink>
                    <FooterLink to="/Terms-of-service">Terms of Service</FooterLink>
                    <FooterLink to="/How-it-works">How it works</FooterLink>
                    <FooterLink to="/Testimonials">Testimonials</FooterLink>
                    <FooterLink to="/Prices">Prices</FooterLink>
                </FooterLinkItems>
            </FooterLinksWrapper>
            <FooterLinksWrapper>
                <FooterLinkItems>
                    <FooterLinkTitle>Information</FooterLinkTitle>
                    <FooterLink to="/about-us">about us</FooterLink>
                    <FooterLink to="/Terms-of-service">Terms of Service</FooterLink>
                    <FooterLink to="/How-it-works">How it works</FooterLink>
                    <FooterLink to="/Testimonials">Testimonials</FooterLink>
                    <FooterLink to="/Prices">Prices</FooterLink>
                </FooterLinkItems>
                <FooterLinkItems>
                    <FooterLinkTitle>Information</FooterLinkTitle>
                    <FooterLink to="/about-us">about us</FooterLink>
                    <FooterLink to="/Terms-of-service">Terms of Service</FooterLink>
                    <FooterLink to="/How-it-works">How it works</FooterLink>
                    <FooterLink to="/Testimonials">Testimonials</FooterLink>
                    <FooterLink to="/Prices">Prices</FooterLink>
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
                <SocialIcons>
                    <SocialIconLink href='/' target="_blank" aria-label="Poznan University">
                        <FaLinkedin />
                    </SocialIconLink>
                    <SocialIconLink href='/' target="_blank" aria-label="Linkedin">
                        <FaLinkedin />
                    </SocialIconLink>
                </SocialIcons>
            </SocialMediaWrap>
        </SocialMedia>
      </FooterWrap>
    </FooterContainer>
  )
}

export default Footer
