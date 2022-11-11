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
          <SidebarRouteSimple to="/api" onClick={toggle}>API</SidebarRouteSimple>
          <SidebarRouteSimple to="/about-us" onClick={toggle}>About</SidebarRouteSimple>
        </SidebarMenu>
      </SidebarWrapper>
    </SidebarContainer>
  )
}

export default Sidebar
