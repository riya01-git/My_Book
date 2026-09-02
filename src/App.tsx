import React from 'react';
import { MengToSketchbookLandingPage } from "./shaders/landing-pages/LandingPages";
import { CharacterCarousel } from "./shaders/character-carousel/CharacterCarousel";
import "./shaders/threeui.css";

export function App() {
  return (
    <div style={{ width: '100vw', height: '100vh', margin: 0, padding: 0, overflowY: 'auto', overflowX: 'hidden' }}>
      
      {/* Section 1: The Book */}
      <div id="top" className="shader-frame" style={{ width: '100vw', height: '100vh', position: 'relative' }}>
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
        <button 
          onClick={() => document.getElementById('top')?.scrollIntoView({behavior:'smooth'})}
          style={{
            position: 'absolute',
            top: '30px',
            left: '30px',
            zIndex: 1000,
            padding: '12px 24px',
            background: 'rgba(255, 245, 245, 0.8)',
            border: '1px solid rgba(210, 166, 166, 0.4)',
            borderRadius: '30px',
            cursor: 'pointer',
            fontFamily: '"Newsreader", serif',
            fontSize: '18px',
            color: '#5A4648',
            boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
            transition: 'all 0.2s ease',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
          onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.95)'}
          onMouseOut={(e) => e.currentTarget.style.background = 'rgba(255, 245, 245, 0.8)'}
        >
          <span>&uarr;</span> Back to Book
        </button>

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
