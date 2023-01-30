import React, { useEffect, useState } from 'react'
import { animateScroll as scroll } from 'react-scroll'
import {
    Nav, 
    NavbarContainer, 
    NavLogo, 
    HamburgerIcon,
    CloseIcon, 
    NavMenu, 
    NavItem, 
    NavLinks,
    NavBtn,
    NavBtnLink
} from './NavbarElements'

const Navbar = ({isOpen, toggle, clear, onlyButton}) => {

  const [scrollNav, setScrollNav] = useState(false);

  const changeNav = () => {
    if (window.scrollY > 80){
        setScrollNav(true)
    } else {
        setScrollNav(false)
    }
  }

  useEffect(() => {
    window.addEventListener('scroll', changeNav)
  }, [])

  const toggleHome = () => {
    scroll.scrollToTop();
  }

  return (
    <>
        <Nav scrollNav={scrollNav} isOpen={isOpen} clear={clear}>
            <NavbarContainer>
                <HamburgerIcon onClick={toggle} isOpen={isOpen} />
                <CloseIcon onClick={toggle} isOpen={isOpen}/>
                <NavLogo to="/" onClick={toggleHome}>
                    GMG
                </NavLogo>
                <NavMenu clear={clear}>
                    <NavItem>
                        <NavLinks to="about"
                        smooth={true} duration={500} spy={true}
                        exact='true' offset={-60}
                        >About</NavLinks>
                    </NavItem>
                    <NavItem>
                        <NavLinks to="turing-test"
                        smooth={true} duration={500} spy={true}
                        exact='true' offset={-60}
                        >Turing test</NavLinks>
                    </NavItem>
                </NavMenu>
                <NavBtn clear={clear && !onlyButton}>
                    <NavBtnLink to='/music-generator'>Generate Music</NavBtnLink>
                </NavBtn>
            </NavbarContainer>
        </Nav>
    </>
  )
}

export default Navbar
