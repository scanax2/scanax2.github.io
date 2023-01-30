import React from 'react'
import { 
  SidebarContainer, 
  Icon, 
  CloseIcon,
  SidebarWrapper,
  SideBtnWrap,
  SidebarMenu,
  SidebarRoute,
  SidebarLink,
  SidebarRouteSimple
} from './SidebarElements'

const Sidebar = ({isOpen, toggle}) => {
  return (
    <SidebarContainer>
      <Icon onClick={toggle}>
        <CloseIcon />
      </Icon>
      <SidebarWrapper isOpen={isOpen} onClick={toggle} fix={false}>
        <SidebarMenu>
          <SidebarRouteSimple to="/music-generator" onClick={toggle}>Generate music</SidebarRouteSimple>
          <SidebarRouteSimple to="/about-us" onClick={toggle}>About us</SidebarRouteSimple>
          <SidebarRouteSimple to="/terms-of-service" onClick={toggle}>Terms of Service</SidebarRouteSimple>
        </SidebarMenu>
      </SidebarWrapper>
    </SidebarContainer>
  )
}

export default Sidebar
