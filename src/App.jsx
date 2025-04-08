import React from "react";
import GridBackground from './Components/NiceGlowGrid';
import LandingPage from "./Components/LandingPage";
import Yooho from "./Components/Yooho";
import Combined from "./Components/Combined";
import Combined2 from "./Components/Combined2";
import Sponsors from "./Components/responsivedesign";
import Navbar from "./Components/Navbar";
import Footer from "./Components/Footer";
import HackBattle from "./Components/HackBattle";
import Why from "./Components/WhyShouldI";
import Happie from "./Components/Happie";
import Faq from "./Components/faq";
import WhatIsArcs from "./Components/whatisarcs";
// Import new canvas components
import RotatingSheets from "./Components/RotatingSheets";
import GeometricStar from "./Components/GeometricStar";
import GreenFountain from "./Components/GreenFountain";

function App() {
  return (
    <div className="relative">
      {/* Grid Background (behind everything) */}
      <GridBackground />
 
      {/* Website Content (in front of grid) */}
      <main className="relative z-10">
        <Navbar />
        <LandingPage />
        
        {/* Add canvas components where appropriate */}
        <div className="p-8">
          <h2 className="text-2xl mb-4"></h2>
          <RotatingSheets />
        </div>
        
        <WhatIsArcs />
        
        <div className="p-8">
          <h2 className="text-2xl mb-4"></h2>
          <GeometricStar />
        </div>
        
        <Yooho />
        <Combined />
        
        <div className="p-8">
          <h2 className="text-2xl mb-4"></h2>
          <GreenFountain />
        </div>
        
        <Combined2 />
        <Why />
        <Happie />
        <Faq />
        {/* <Footer /> */}
      </main>
    </div>
  );
}

export default App;
