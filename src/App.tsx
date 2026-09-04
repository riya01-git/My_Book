import React, { useEffect, useRef, useState } from 'react';
import { MengToSketchbookLandingPage } from "./shaders/landing-pages/LandingPages";
import { CharacterCarousel } from "./shaders/character-carousel/CharacterCarousel";
import "./shaders/threeui.css";

const Beautiful3DFlower = () => (
  <svg viewBox="0 0 200 200" width="100%" height="100%" preserveAspectRatio="xMidYMid meet" style={{ filter: 'drop-shadow(0 8px 16px rgba(255, 182, 193, 0.4))' }}>
    <defs>
      <radialGradient id="petal-grad" cx="35%" cy="35%" r="65%">
        <stop offset="0%" stopColor="#ffffff" />
        <stop offset="40%" stopColor="#ffebf0" />
        <stop offset="100%" stopColor="#ffccd5" />
      </radialGradient>
      <radialGradient id="center-grad" cx="35%" cy="35%" r="65%">
        <stop offset="0%" stopColor="#fff8fa" />
        <stop offset="50%" stopColor="#ffebf0" />
        <stop offset="100%" stopColor="#f4c2c2" />
      </radialGradient>
      <filter id="glow">
        <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
        <feMerge>
          <feMergeNode in="coloredBlur"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
    </defs>
    <g filter="url(#glow)">
      <circle cx="100" cy="40" r="42" fill="url(#petal-grad)" />
      <circle cx="157" cy="81" r="42" fill="url(#petal-grad)" />
      <circle cx="135" cy="148" r="42" fill="url(#petal-grad)" />
      <circle cx="65" cy="148" r="42" fill="url(#petal-grad)" />
      <circle cx="43" cy="81" r="42" fill="url(#petal-grad)" />
      <circle cx="100" cy="100" r="48" fill="url(#center-grad)" />
    </g>
  </svg>
);

export function App() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const memorySectionRef = useRef<HTMLDivElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isEntered, setIsEntered] = useState(false);

  // Initialize interaction to play audio
  useEffect(() => {
    const playAudio = () => {
      if (audioRef.current && !isPlaying) {
        audioRef.current.volume = 0.3; // Base volume
        audioRef.current.play().then(() => {
          setIsPlaying(true);
        }).catch(e => console.log("Audio play failed:", e));
      }
    };

    // Try to play immediately on mount (might be blocked by browser)
    playAudio();
    
    // Listen for any interaction to start audio as a fallback
    window.addEventListener('click', playAudio, { once: true });
    window.addEventListener('scroll', playAudio, { once: true });
    window.addEventListener('touchstart', playAudio, { once: true });
    
    return () => {
      window.removeEventListener('click', playAudio);
      window.removeEventListener('scroll', playAudio);
      window.removeEventListener('touchstart', playAudio);
    };
  }, [isPlaying]);

  // Handle intersection for memory section volume control
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (audioRef.current && !audioRef.current.muted) {
            if (entry.isIntersecting) {
              // Smoothly fade volume up to 1.0
              fadeAudio(audioRef.current, 1.0, 1500);
            } else {
              // Smoothly fade volume down to 0.3
              fadeAudio(audioRef.current, 0.3, 1500);
            }
          }
        });
      },
      { threshold: 0.3 } // Trigger when 30% of the memory section is visible
    );

    if (memorySectionRef.current) {
      observer.observe(memorySectionRef.current);
    }

    return () => {
      if (memorySectionRef.current) {
        observer.unobserve(memorySectionRef.current);
      }
    };
  }, [isMuted]);

  const fadeAudio = (audio: HTMLAudioElement, targetVolume: number, duration: number) => {
    const steps = 20;
    const stepTime = duration / steps;
    const currentVolume = audio.volume;
    const volumeChange = (targetVolume - currentVolume) / steps;
    
    let currentStep = 0;
    
    const fadeInterval = setInterval(() => {
      currentStep++;
      if (currentStep >= steps) {
        clearInterval(fadeInterval);
        audio.volume = targetVolume;
      } else {
        // Ensure volume stays between 0 and 1
        const newVolume = currentVolume + (volumeChange * currentStep);
        audio.volume = Math.max(0, Math.min(1, newVolume));
      }
    }, stepTime);
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !audioRef.current.muted;
      setIsMuted(audioRef.current.muted);
    }
  };

  return (
    <div style={{ width: '100vw', height: '100vh', margin: 0, padding: 0, overflowY: 'auto', overflowX: 'hidden' }}>
      
      {/* CSS for animations */}
      <style>
        {`
          @keyframes floatUp {
            0% { transform: translateY(100vh) scale(0.5); opacity: 0; }
            20% { opacity: 0.8; }
            80% { opacity: 0.8; }
            100% { transform: translateY(-20vh) scale(1.2); opacity: 0; }
          }
          
          .particle {
            position: absolute;
            background: radial-gradient(circle, rgba(255, 255, 255, 0.8) 0%, rgba(255, 220, 220, 0) 70%);
            border-radius: 50%;
            pointer-events: none;
            animation: floatUp linear infinite;
            z-index: 10;
          }

          @keyframes pulseText {
            0% { opacity: 0.7; transform: scale(1); }
            50% { opacity: 1; transform: scale(1.02); }
            100% { opacity: 0.7; transform: scale(1); }
          }
          
          @keyframes bounceSubtle {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(10px); }
          }
          
          @keyframes fadeOut {
            to { opacity: 0; visibility: hidden; }
          }
          
          .heart {
            height: 70px;
            width: 70px;
            background: #f20044;
            transform: rotate(-45deg);
            box-shadow: -10px -10px 90px #f20044;
            animation: heartAnim 0.6s linear infinite;
            position: relative;
          }
          
          @keyframes heartAnim {
            0% {
              transform: rotate(-45deg) scale(1.07);
              filter: blur(0px);
            }
            80% {
              transform: rotate(-45deg) scale(1);
              filter: blur(1px);
            }
            100% {
              transform: rotate(-45deg) scale(0.8);
              filter: blur(2px);
            }
          }
          
          .heart:before {
            content: "";
            position: absolute;
            height: 70px;
            width: 70px;
            background: #f20044;
            top: -50%;
            border-radius: 50px;
          }
          .heart:after {
            content: "";
            position: absolute;
            height: 70px;
            width: 70px;
            background: #f20044;
            right: -50%;
            border-radius: 50px;
          }
        `}
      </style>

      {/* Entry Screen Overlay */}
      {!isEntered && (
        <div 
          onClick={() => {
            setIsEntered(true);
            if (audioRef.current) {
              audioRef.current.volume = 0.3;
              audioRef.current.play().then(() => setIsPlaying(true)).catch(console.error);
            }
          }}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 999999,
            background: 'radial-gradient(circle at center, #fff0f5 0%, #ffccd5 100%)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            cursor: 'pointer'
          }}
        >
          <div style={{ position: 'relative', width: '200px', height: '200px', display: 'flex', justifyContent: 'center', alignItems: 'center', filter: 'drop-shadow(0 10px 20px rgba(255,182,193,0.6))' }}>
            <div style={{ position: 'absolute', inset: 0, zIndex: -1, display: 'flex', justifyContent: 'center', alignItems: 'center', transform: 'scale(1.5)' }}>
              <div className="heart"></div>
            </div>

          </div>
          <p style={{
            fontFamily: '"Newsreader", serif',
            fontSize: '24px',
            color: '#d4778d',
            marginTop: '40px',
            fontStyle: 'italic',
            animation: 'pulseText 2.5s infinite ease-in-out'
          }}>
            Tap anywhere to enter...
          </p>
        </div>
      )}

      {/* Audio Element */}
      <audio ref={audioRef} src="/audio/man_jaie.mp4" loop preload="auto" autoPlay />
      
      {/* Tiny Mute Button in a flower shape */}
      <button 
        onClick={toggleMute}
        style={{
          position: 'fixed',
          top: '20px',
          left: '20px',
          zIndex: 9999,
          width: '45px',
          height: '45px',
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
          transition: 'transform 0.2s',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          filter: 'drop-shadow(0 4px 8px rgba(255,182,193,0.4))'
        }}
        onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
        onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
      >
        <div style={{ position: 'absolute', width: '100%', height: '100%', top: 0, left: 0, zIndex: -1 }}>
          <Beautiful3DFlower />
        </div>
        <span style={{ fontSize: '18px' }}>
          {isMuted ? '🔇' : '🎵'}
        </span>
      </button>

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

        {/* Cute baby pink flower button */}
        <button 
          onClick={() => document.getElementById('memories')?.scrollIntoView({behavior:'smooth'})}
          style={{
            position: 'absolute',
            bottom: '20px',
            left: '20px',
            zIndex: 1000,
            width: '130px',
            height: '130px',
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            animation: 'bounceSubtle 2.5s infinite ease-in-out',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            filter: 'drop-shadow(0 4px 8px rgba(255,182,193,0.4))'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = 'scale(1.05)';
            e.currentTarget.style.animationPlayState = 'paused';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.animationPlayState = 'running';
          }}
        >
          <div style={{ position: 'absolute', width: '100%', height: '100%', top: 0, left: 0, zIndex: -1 }}>
            <Beautiful3DFlower />
          </div>
          <div style={{
            fontFamily: '"Newsreader", serif',
            fontSize: '12px',
            color: '#d4778d',
            textAlign: 'center',
            padding: '10px',
            lineHeight: '1.2',
            zIndex: 1
          }}>
            Read book,<br/>then click to<br/>memories 🌸
            <div style={{ fontSize: '10px', marginTop: '2px' }}>&darr;</div>
          </div>
        </button>
      </div>
      
      {/* Section 2: Memories Filmstrip */}
      <div 
        id="memories" 
        ref={memorySectionRef}
        className="shader-frame" 
        style={{ 
          width: '100vw', 
          height: '100vh', 
          position: 'relative',
          background: 'radial-gradient(circle at center, rgba(42,31,32,0.9) 0%, rgba(13,10,11,1) 100%)',
          overflow: 'hidden'
        }}
      >
        {/* Floating Particles */}
        {Array.from({ length: 30 }).map((_, i) => (
          <div 
            key={i} 
            className="particle"
            style={{
              left: `${Math.random() * 100}vw`,
              width: `${Math.random() * 10 + 5}px`,
              height: `${Math.random() * 10 + 5}px`,
              animationDuration: `${Math.random() * 10 + 10}s`,
              animationDelay: `${Math.random() * 10}s`
            }}
          />
        ))}

        {/* Emotional Text Overlay */}
        <div style={{
          position: 'absolute',
          top: '12%',
          width: '100%',
          textAlign: 'center',
          zIndex: 20,
          fontFamily: '"Instrument Serif", serif',
          color: '#fdf0d5',
          fontSize: '32px',
          textShadow: '0 2px 10px rgba(0,0,0,0.5)',
          animation: 'pulseText 4s infinite',
          pointerEvents: 'none'
        }}>
          Every frame, a piece of my heart 💖
        </div>

        <button 
          onClick={() => document.getElementById('top')?.scrollIntoView({behavior:'smooth'})}
          style={{
            position: 'absolute',
            top: '30px',
            left: '30px',
            zIndex: 1000,
            padding: '12px 24px',
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '30px',
            cursor: 'pointer',
            fontFamily: '"Newsreader", serif',
            fontSize: '18px',
            color: '#fdf0d5',
            boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
            transition: 'all 0.3s ease',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
            e.currentTarget.style.transform = 'translateY(-2px)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
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
