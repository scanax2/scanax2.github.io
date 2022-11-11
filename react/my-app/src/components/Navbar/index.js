import React from 'react'
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
import { FaBars } from 'react-icons/fa'

const Navbar = ({isOpen, toggle}) => {
  return (
    <>
        <Nav>
            <NavbarContainer>
                <HamburgerIcon onClick={toggle} isOpen={isOpen}>
                    
                </HamburgerIcon>
                <CloseIcon onClick={toggle} isOpen={isOpen}/>
                <NavLogo to="/">
                    GMG
                </NavLogo>
                <NavMenu>
                    <NavItem>
                        <NavLinks to="about">About</NavLinks>
                    </NavItem>
                    <NavItem>
                        <NavLinks to="turing_test">Turing test</NavLinks>
                    </NavItem>
                </NavMenu>
                <NavBtn>
                    <NavBtnLink to='/generate_music'>Generate Music</NavBtnLink>
                </NavBtn>
            </NavbarContainer>
        </Nav>
    </>
  )
}

export default Navbar
