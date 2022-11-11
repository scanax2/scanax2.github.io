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
      <SidebarWrapper isOpen={isOpen} onClick={toggle}>
        <SidebarMenu>
          <SidebarRouteSimple to="/generate_music" onClick={toggle}>Generate music</SidebarRouteSimple>
          <SidebarRouteSimple to="/api" onClick={toggle}>API</SidebarRouteSimple>
          <SidebarRouteSimple to="/about_us" onClick={toggle}>About</SidebarRouteSimple>
        </SidebarMenu>
      </SidebarWrapper>
    </SidebarContainer>
  )
}

export default Sidebar
