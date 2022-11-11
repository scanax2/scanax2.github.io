import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages'
import GeneratorPage from './pages/generator';

function App() {
  return (
    <Router>
      <Routes>
        <Route exact path='/' element={<Home />} />
        <Route exact path='/music-generator' element={<GeneratorPage />} />
      </Routes>
    </Router>
  );
}

export default App;