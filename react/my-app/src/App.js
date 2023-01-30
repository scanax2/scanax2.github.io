import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages'
import GeneratorPage from './pages/generator';
import AboutUs from './pages/aboutUs';
import TermsOfService from './pages/termsOfService';

function App() {
  return (
    <Router>
      <Routes>
        <Route exact path='/' element={<Home />} />
        <Route exact path='/music-generator' element={<GeneratorPage />} />
        <Route exact path='/about-us' element={<AboutUs />} />
        <Route exact path='/terms-of-service' element={<TermsOfService />} />
      </Routes>
    </Router>
  );
}

export default App;