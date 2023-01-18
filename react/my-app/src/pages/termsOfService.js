import React, {useState} from 'react'

import { termsOfService } from '../components/InformationPage/Data'
import Navbar from '../components/Navbar'
import Sidebar from '../components/Sidebar'
import Footer from '../components/LandingPage/Footer'
import ExtraTermsOfService from '../components/InformationPage/ExtraTermsOfService'

const AboutUs = () => {
  const [isOpen, setIsOpen] = useState(false)

  const toggle = () => {
    setIsOpen(!isOpen)
  };

  return (
    <>
      <Sidebar isOpen={isOpen} toggle={toggle}/>
      <Navbar isOpen={isOpen} toggle={toggle} clear={true} onlyButton={true}/>
      <ExtraTermsOfService {...termsOfService} />
      <Footer />
    </>
  )
}

export default AboutUs
