import React, {useState} from 'react'

import { aboutUs } from '../components/InformationPage/Data'
import Navbar from '../components/Navbar'
import Sidebar from '../components/Sidebar'
import Footer from '../components/LandingPage/Footer'
import ExtraAboutUs from '../components/InformationPage/ExtraAboutUs'

const AboutUs = () => {
  const [isOpen, setIsOpen] = useState(false)

  const toggle = () => {
    setIsOpen(!isOpen)
  };

  return (
    <>
      <Sidebar isOpen={isOpen} toggle={toggle}/>
      <Navbar isOpen={isOpen} toggle={toggle} clear={true} onlyButton={true}/>
      <ExtraAboutUs {...aboutUs} />
      <Footer />
    </>
  )
}

export default AboutUs
