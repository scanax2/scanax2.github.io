import styled from 'styled-components'
import { Link as LinkR } from 'react-router-dom'
import { Link as LinkS } from 'react-scroll'
import {FaBars, FaTimes} from 'react-icons/fa'

export const Nav = styled.nav`
    background: ${({scrollNav, isOpen, clear}) => (scrollNav || isOpen || clear ? '#000' : 'transparent')};
    transition: background-color 0.5s ease;
    margin-top: -60px;
    height: 60px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 1rem;
    position: sticky;
    top: 0;
    z-index: 10;

    @media screen and (max-width: 960px) {
        transition: 0.8s all ease;
    }
`;

export const NavbarContainer = styled.div`
    height: 60px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 1rem;
    z-index: 1;
    width: 100%;
    padding: 0 24px;
    max-width: 1100px;
`;

export const NavLogo = styled(LinkR)`
    color: #fff;
    cursor: pointer;
    font-size: 1.5rem;
    align-items: center;
    margin-left: 80px;
    font-weight: bold;
    text-decoration: none;
    text-align: center;

    line-height: 60px;
    display: inline-block;
    position: absolute;
    height: 100%;
    width: 120px;

    left: 0;

    &:hover {
        color: #00B2FF;
    }
`;

export const NavLinks = styled(LinkS)`
    color: #fff;
    display: flex;
    align-items: center;
    text-decoration: none;
    padding: 0 1rem;
    height: 100%;
    cursor: pointer;

    &.active {
        border-bottom: 3px solid #00B2FF;
    }

    &:hover {
        color: #00B2FF;
    }
`;

export const HamburgerIcon = styled(FaBars)`
    display: block;
    position: absolute;
    top: 0;
    left: 0;
    transform: translate(100%, 50%);
    font-size: 1.8rem;
    cursor: pointer;
    color: #fff;

    transition: 0.25s ease-out;
    opacity: ${({ isOpen }) => (isOpen ? '0' : '100%')};
    z-index: ${({ isOpen }) => (isOpen ? 0 : 1)};

    &:hover {
        color: #00B2FF;
    }
`;

export const CloseIcon = styled(FaTimes)`
    display: block;
    position: absolute;
    top: 0;
    left: 0;
    transform: translate(85%, 40%);
    font-size: 2rem;
    cursor: pointer;
    color: #fff;

    transition: 0.25s ease-in;
    opacity: ${({ isOpen }) => (isOpen ? '100%' : '0')};
    z-index: ${({ isOpen }) => (isOpen ? 1 : 0)};

    &:hover {
        color: #00B2FF;
    }
`;

export const NavMenu = styled.ul`
    justify-self: center;
    align-items: center;
    list-style: none;
    text-align: center;
    margin: auto;

    display: ${({ clear }) => (clear ? 'none' : 'flex')};

    @media screen and (max-width: 768px){
        display: none;
    }
`;

export const NavItem = styled.li`
    height: 60px;
`;

export const NavBtn = styled.nav`
    position: absolute;
    right: 15px;
    top: 15%;
    right: 45px;

    display: ${({ clear }) => (clear ? 'none' : 'flex')};
`;

export const NavBtnLink = styled(LinkR)`
    border-radius: 5px;
    background: #00B2FF;
    white-space: nowrap;
    padding: 9px 18px;
    color: #010606;
    font-size: 16px;
    outline: none;
    border: none;
    cursor: pointer;
    transition: all 0.2s ease-in-out;
    text-decoration: none;
    font-weight: bold;

    &:hover{
        transition: all 0.2s ease-in-out;
        background: #fff;
        color: #010606;
    }
`;