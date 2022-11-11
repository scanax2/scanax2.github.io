import React, {useState} from 'react'
import HeroSection from '../components/LandingPage/HeroSection'
import InfoSection from '../components/LandingPage/InfoSection'
import { homeObjOne, homeObjTwo } from '../components/LandingPage/InfoSection/Data'
import Navbar from '../components/Navbar'
import Sidebar from '../components/Sidebar'
import Footer from '../components/LandingPage/Footer'

const Home = () => {
  const [isOpen, setIsOpen] = useState(false)

  const toggle = () => {
    setIsOpen(!isOpen)
  };

  return (
    <>
      <Sidebar isOpen={isOpen} toggle={toggle}/>
      <Navbar isOpen={isOpen} toggle={toggle} clear={false}/>
      <HeroSection />
      <InfoSection {...homeObjOne} />
      <InfoSection {...homeObjTwo} />
      <Footer />
    </>
  )
}

export default Home
