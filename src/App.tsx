import React from 'react';
import { MengToSketchbookLandingPage } from "./shaders/landing-pages/LandingPages";
import { CharacterCarousel } from "./shaders/character-carousel/CharacterCarousel";
import "./shaders/threeui.css";

export function App() {
  return (
    <div style={{ width: '100vw', height: '100vh', margin: 0, padding: 0, overflowY: 'auto', overflowX: 'hidden' }}>
      
      {/* Section 1: The Book */}
      <div className="shader-frame" style={{ width: '100vw', height: '100vh', position: 'relative' }}>
        <MengToSketchbookLandingPage
          headingFont="instrument-serif"
          bodyFont="newsreader"
          headingWeight="400"
          bodyWeight="400"
          primaryColor="#2b2721"
          headingSize={30}
          bodySize={20}
          headingLetterSpacing={0.010}
        />
      </div>
      
      {/* Section 2: Memories Filmstrip */}
      <div id="memories" className="shader-frame" style={{ width: '100vw', height: '100vh', position: 'relative' }}>
        <CharacterCarousel
          variant="filmstrip"
          speed={1.00}
          scale={1.00}
          opacity={1.00}
          hue={0}
          saturation={1.00}
          brightness={1.00}
        />
      </div>

    </div>
  );
}
