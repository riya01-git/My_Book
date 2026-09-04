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
        <feGaussianBlur stdDeviation="2" result="coloredBlur" />
        <feMerge>
          <feMergeNode in="coloredBlur" />
          <feMergeNode in="SourceGraphic" />
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
  const [isOpening, setIsOpening] = useState(false);
  const [showPetals, setShowPetals] = useState(false);

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
          
          /* From Uiverse.io by anandita-3217 */
          .heart {
            display: inline-grid;
            grid-template-columns: repeat(13, clamp(12px, 3.8vw, 20px));
            grid-template-rows: repeat(11, clamp(12px, 3.8vw, 20px));
            gap: 1px;
            padding: 10px;
            animation: heartbeat 2s infinite ease-in-out;
            user-select: none;
          }
          .pixel {
            width: clamp(12px, 3.8vw, 20px);
            height: clamp(12px, 3.8vw, 20px);
            transition: all 0.3s ease;
            transform: scale(1);
          }
          .pixel.pink {
            background: #e63946;
            animation: pinkPulse 2.5s infinite ease-in-out;
          }
          .pixel.soft-pink {
            background: #f1a1b4;
            animation: softPinkPulse 2.2s infinite ease-in-out;
          }
          .pixel.white {
            background: #ffeaea;
            animation: whitePulse 2.8s infinite ease-in-out;
          }
          @keyframes heartbeat {
            0%,
            100% {
              transform: scale(1);
            }
            50% {
              transform: scale(1.04);
            }
          }
          @keyframes pinkPulse {
            0%,
            100% {
              background: #ff6b81;
              transform: scale(1);
              box-shadow: 0 0 0 rgba(230, 57, 70, 0);
            }
            50% {
              background: #e63946;
              transform: scale(1.05);
              box-shadow: 0 0 10px rgba(230, 57, 70, 0.6);
            }
          }
          @keyframes softPinkPulse {
            0%,
            100% {
              background: #e63946;
              transform: scale(1);
              box-shadow: 0 0 0 rgba(241, 161, 180, 0);
            }
            50% {
              background: #f1a1b4;
              transform: scale(1.05);
              box-shadow: 0 0 8px rgba(241, 161, 180, 0.6);
            }
          }
          @keyframes whitePulse {
            0%,
            100% {
              background: #ffe3e3;
              transform: scale(1);
              box-shadow: 0 0 0 rgba(255, 234, 234, 0);
            }
            50% {
              background: #ffeaea;
              transform: scale(1.05);
              box-shadow: 0 0 15px rgba(255, 234, 234, 0.8);
            }
          }

          @keyframes gentlePetalFall {
            0% {
              transform: translate3d(0, -60px, 0) rotate(0deg) rotateX(0deg) rotateY(0deg) scale(0.6);
              opacity: 0;
            }
            12% {
              opacity: 0.95;
            }
            85% {
              opacity: 0.95;
            }
            100% {
              transform: translate3d(var(--x-dest), 115vh, 0) rotate(var(--rot)) rotateX(540deg) rotateY(360deg) scale(1.08);
              opacity: 0;
            }
          }

          .rose-petal-shower {
            position: fixed;
            background: radial-gradient(ellipse at 35% 35%, #ffffff 0%, #ffdde5 40%, #ff9ebb 75%, #e26a88 100%);
            border-radius: 120% 15% 120% 15% / 120% 15% 120% 15%;
            box-shadow: 0 4px 14px rgba(212, 119, 141, 0.35), inset 0 1px 3px rgba(255, 255, 255, 0.85);
            pointer-events: none;
            z-index: 10000000;
            animation: gentlePetalFall linear forwards;
          }
        `}
      </style>

      {/* Persistent Shower of Baby Pink Rose Petals (visible for 7.5s across opening & book) */}
      {showPetals && (
        <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 10000000, overflow: 'hidden' }}>
          {Array.from({ length: 48 }).map((_, i) => {
            const size = Math.random() * 14 + 14;
            const left = Math.random() * 105 - 2.5;
            const delay = Math.random() * 2.2;
            const duration = Math.random() * 2.2 + 4.8;
            const xDest = (Math.random() * 260 - 130) + 'px';
            const rot = (Math.random() * 720 - 360) + 'deg';
            return (
              <div
                key={i}
                className="rose-petal-shower"
                style={{
                  top: '-40px',
                  left: `${left}vw`,
                  width: `${size}px`,
                  height: `${size * 1.3}px`,
                  animationDelay: `${delay}s`,
                  animationDuration: `${duration}s`,
                  ['--x-dest' as any]: xDest,
                  ['--rot' as any]: rot
                }}
              />
            );
          })}
        </div>
      )}

      {/* Entry Screen Overlay with Uiverse Pixel Heart Doors */}
      {!isEntered && (
        <div
          onClick={() => {
            if (!isOpening) {
              setIsOpening(true);
              setShowPetals(true);
              if (audioRef.current) {
                audioRef.current.volume = 0.3;
                audioRef.current.play().then(() => setIsPlaying(true)).catch(console.error);
              }
              setTimeout(() => {
                setIsEntered(true);
              }, 1400);
              setTimeout(() => {
                setShowPetals(false);
              }, 7500);
            }
          }}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 999999,
            background: 'radial-gradient(circle at center, #fff0f5 0%, #ffd6e0 55%, #fcaec0 100%)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            cursor: 'pointer',
            opacity: isOpening ? 0 : 1,
            transition: 'opacity 1.4s cubic-bezier(0.4, 0, 0.2, 1)',
            overflow: 'hidden',
            perspective: '1200px'
          }}
        >
          {/* Pixel Heart Assembly with 3D French Door Open Effect */}
          <div
            style={{
              position: 'relative',
              width: 'clamp(180px, 55vw, 280px)',
              height: 'clamp(160px, 48vw, 240px)',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              transformStyle: 'preserve-3d',
              perspective: '1200px'
            }}
          >
            {/* Left Door Half */}
            <div
              style={{
                position: 'absolute',
                left: 0,
                top: 0,
                width: '50%',
                height: '100%',
                overflow: 'hidden',
                transformOrigin: '0% 50%',
                transformStyle: 'preserve-3d',
                transform: isOpening
                  ? 'rotateY(-110deg) translateZ(30px)'
                  : 'rotateY(0deg) translateZ(0px)',
                opacity: isOpening ? 0 : 1,
                transition: 'transform 1.4s cubic-bezier(0.16, 1, 0.3, 1), opacity 1.3s ease',
                pointerEvents: 'none'
              }}
            >
              <div style={{ position: 'absolute', left: 0, top: 0, width: '200%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <div className="heart">
                  <div className="pixel"></div>
                  <div className="pixel"></div>
                  <div className="pixel pink"></div>
                  <div className="pixel pink"></div>
                  <div className="pixel pink"></div>
                  <div className="pixel"></div>
                  <div className="pixel"></div>
                  <div className="pixel"></div>
                  <div className="pixel pink"></div>
                  <div className="pixel pink"></div>
                  <div className="pixel pink"></div>
                  <div className="pixel"></div>
                  <div className="pixel"></div>

                  <div className="pixel"></div>
                  <div className="pixel pink"></div>
                  <div className="pixel soft-pink"></div>
                  <div className="pixel soft-pink"></div>
                  <div className="pixel soft-pink"></div>
                  <div className="pixel pink"></div>
                  <div className="pixel"></div>
                  <div className="pixel pink"></div>
                  <div className="pixel soft-pink"></div>
                  <div className="pixel soft-pink"></div>
                  <div className="pixel soft-pink"></div>
                  <div className="pixel pink"></div>
                  <div className="pixel"></div>

                  <div className="pixel pink"></div>
                  <div className="pixel soft-pink"></div>
                  <div className="pixel soft-pink"></div>
                  <div className="pixel white"></div>
                  <div className="pixel white"></div>
                  <div className="pixel soft-pink"></div>
                  <div className="pixel pink"></div>
                  <div className="pixel soft-pink"></div>
                  <div className="pixel white"></div>
                  <div className="pixel white"></div>
                  <div className="pixel soft-pink"></div>
                  <div className="pixel soft-pink"></div>
                  <div className="pixel pink"></div>

                  <div className="pixel pink"></div>
                  <div className="pixel soft-pink"></div>
                  <div className="pixel white"></div>
                  <div className="pixel white"></div>
                  <div className="pixel white"></div>
                  <div className="pixel white"></div>
                  <div className="pixel soft-pink"></div>
                  <div className="pixel white"></div>
                  <div className="pixel white"></div>
                  <div className="pixel white"></div>
                  <div className="pixel white"></div>
                  <div className="pixel soft-pink"></div>
                  <div className="pixel pink"></div>

                  <div className="pixel pink"></div>
                  <div className="pixel soft-pink"></div>
                  <div className="pixel white"></div>
                  <div className="pixel white"></div>
                  <div className="pixel white"></div>
                  <div className="pixel white"></div>
                  <div className="pixel white"></div>
                  <div className="pixel white"></div>
                  <div className="pixel white"></div>
                  <div className="pixel white"></div>
                  <div className="pixel white"></div>
                  <div className="pixel soft-pink"></div>
                  <div className="pixel pink"></div>

                  <div className="pixel"></div>
                  <div className="pixel pink"></div>
                  <div className="pixel soft-pink"></div>
                  <div className="pixel white"></div>
                  <div className="pixel white"></div>
                  <div className="pixel white"></div>
                  <div className="pixel white"></div>
                  <div className="pixel white"></div>
                  <div className="pixel white"></div>
                  <div className="pixel white"></div>
                  <div className="pixel soft-pink"></div>
                  <div className="pixel pink"></div>
                  <div className="pixel"></div>

                  <div className="pixel"></div>
                  <div className="pixel"></div>
                  <div className="pixel pink"></div>
                  <div className="pixel soft-pink"></div>
                  <div className="pixel white"></div>
                  <div className="pixel white"></div>
                  <div className="pixel white"></div>
                  <div className="pixel white"></div>
                  <div className="pixel white"></div>
                  <div className="pixel soft-pink"></div>
                  <div className="pixel pink"></div>
                  <div className="pixel"></div>
                  <div className="pixel"></div>

                  <div className="pixel"></div>
                  <div className="pixel"></div>
                  <div className="pixel"></div>
                  <div className="pixel pink"></div>
                  <div className="pixel soft-pink"></div>
                  <div className="pixel white"></div>
                  <div className="pixel white"></div>
                  <div className="pixel white"></div>
                  <div className="pixel soft-pink"></div>
                  <div className="pixel pink"></div>
                  <div className="pixel"></div>
                  <div className="pixel"></div>
                  <div className="pixel"></div>

                  <div className="pixel"></div>
                  <div className="pixel"></div>
                  <div className="pixel"></div>
                  <div className="pixel"></div>
                  <div className="pixel pink"></div>
                  <div className="pixel soft-pink"></div>
                  <div className="pixel white"></div>
                  <div className="pixel soft-pink"></div>
                  <div className="pixel pink"></div>
                  <div className="pixel"></div>
                  <div className="pixel"></div>
                  <div className="pixel"></div>
                  <div className="pixel"></div>

                  <div className="pixel"></div>
                  <div className="pixel"></div>
                  <div className="pixel"></div>
                  <div className="pixel"></div>
                  <div className="pixel"></div>
                  <div className="pixel pink"></div>
                  <div className="pixel soft-pink"></div>
                  <div className="pixel pink"></div>
                  <div className="pixel"></div>
                  <div className="pixel"></div>
                  <div className="pixel"></div>
                  <div className="pixel"></div>
                  <div className="pixel"></div>

                  <div className="pixel"></div>
                  <div className="pixel"></div>
                  <div className="pixel"></div>
                  <div className="pixel"></div>
                  <div className="pixel"></div>
                  <div className="pixel"></div>
                  <div className="pixel pink"></div>
                  <div className="pixel"></div>
                  <div className="pixel"></div>
                  <div className="pixel"></div>
                  <div className="pixel"></div>
                  <div className="pixel"></div>
                  <div className="pixel"></div>
                </div>
              </div>
            </div>

            {/* Right Door Half */}
            <div
              style={{
                position: 'absolute',
                right: 0,
                top: 0,
                width: '50%',
                height: '100%',
                overflow: 'hidden',
                transformOrigin: '100% 50%',
                transformStyle: 'preserve-3d',
                transform: isOpening
                  ? 'rotateY(110deg) translateZ(30px)'
                  : 'rotateY(0deg) translateZ(0px)',
                opacity: isOpening ? 0 : 1,
                transition: 'transform 1.4s cubic-bezier(0.16, 1, 0.3, 1), opacity 1.3s ease',
                pointerEvents: 'none'
              }}
            >
              <div style={{ position: 'absolute', right: 0, top: 0, width: '200%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <div className="heart">
                  <div className="pixel"></div>
                  <div className="pixel"></div>
                  <div className="pixel pink"></div>
                  <div className="pixel pink"></div>
                  <div className="pixel pink"></div>
                  <div className="pixel"></div>
                  <div className="pixel"></div>
                  <div className="pixel"></div>
                  <div className="pixel pink"></div>
                  <div className="pixel pink"></div>
                  <div className="pixel pink"></div>
                  <div className="pixel"></div>
                  <div className="pixel"></div>

                  <div className="pixel"></div>
                  <div className="pixel pink"></div>
                  <div className="pixel soft-pink"></div>
                  <div className="pixel soft-pink"></div>
                  <div className="pixel soft-pink"></div>
                  <div className="pixel pink"></div>
                  <div className="pixel"></div>
                  <div className="pixel pink"></div>
                  <div className="pixel soft-pink"></div>
                  <div className="pixel soft-pink"></div>
                  <div className="pixel soft-pink"></div>
                  <div className="pixel pink"></div>
                  <div className="pixel"></div>

                  <div className="pixel pink"></div>
                  <div className="pixel soft-pink"></div>
                  <div className="pixel soft-pink"></div>
                  <div className="pixel white"></div>
                  <div className="pixel white"></div>
                  <div className="pixel soft-pink"></div>
                  <div className="pixel pink"></div>
                  <div className="pixel soft-pink"></div>
                  <div className="pixel white"></div>
                  <div className="pixel white"></div>
                  <div className="pixel soft-pink"></div>
                  <div className="pixel soft-pink"></div>
                  <div className="pixel pink"></div>

                  <div className="pixel pink"></div>
                  <div className="pixel soft-pink"></div>
                  <div className="pixel white"></div>
                  <div className="pixel white"></div>
                  <div className="pixel white"></div>
                  <div className="pixel white"></div>
                  <div className="pixel soft-pink"></div>
                  <div className="pixel white"></div>
                  <div className="pixel white"></div>
                  <div className="pixel white"></div>
                  <div className="pixel white"></div>
                  <div className="pixel soft-pink"></div>
                  <div className="pixel pink"></div>

                  <div className="pixel pink"></div>
                  <div className="pixel soft-pink"></div>
                  <div className="pixel white"></div>
                  <div className="pixel white"></div>
                  <div className="pixel white"></div>
                  <div className="pixel white"></div>
                  <div className="pixel white"></div>
                  <div className="pixel white"></div>
                  <div className="pixel white"></div>
                  <div className="pixel white"></div>
                  <div className="pixel white"></div>
                  <div className="pixel soft-pink"></div>
                  <div className="pixel pink"></div>

                  <div className="pixel"></div>
                  <div className="pixel pink"></div>
                  <div className="pixel soft-pink"></div>
                  <div className="pixel white"></div>
                  <div className="pixel white"></div>
                  <div className="pixel white"></div>
                  <div className="pixel white"></div>
                  <div className="pixel white"></div>
                  <div className="pixel white"></div>
                  <div className="pixel white"></div>
                  <div className="pixel soft-pink"></div>
                  <div className="pixel pink"></div>
                  <div className="pixel"></div>

                  <div className="pixel"></div>
                  <div className="pixel"></div>
                  <div className="pixel pink"></div>
                  <div className="pixel soft-pink"></div>
                  <div className="pixel white"></div>
                  <div className="pixel white"></div>
                  <div className="pixel white"></div>
                  <div className="pixel white"></div>
                  <div className="pixel white"></div>
                  <div className="pixel soft-pink"></div>
                  <div className="pixel pink"></div>
                  <div className="pixel"></div>
                  <div className="pixel"></div>

                  <div className="pixel"></div>
                  <div className="pixel"></div>
                  <div className="pixel"></div>
                  <div className="pixel pink"></div>
                  <div className="pixel soft-pink"></div>
                  <div className="pixel white"></div>
                  <div className="pixel white"></div>
                  <div className="pixel white"></div>
                  <div className="pixel soft-pink"></div>
                  <div className="pixel pink"></div>
                  <div className="pixel"></div>
                  <div className="pixel"></div>
                  <div className="pixel"></div>

                  <div className="pixel"></div>
                  <div className="pixel"></div>
                  <div className="pixel"></div>
                  <div className="pixel"></div>
                  <div className="pixel pink"></div>
                  <div className="pixel soft-pink"></div>
                  <div className="pixel white"></div>
                  <div className="pixel soft-pink"></div>
                  <div className="pixel pink"></div>
                  <div className="pixel"></div>
                  <div className="pixel"></div>
                  <div className="pixel"></div>
                  <div className="pixel"></div>

                  <div className="pixel"></div>
                  <div className="pixel"></div>
                  <div className="pixel"></div>
                  <div className="pixel"></div>
                  <div className="pixel"></div>
                  <div className="pixel pink"></div>
                  <div className="pixel soft-pink"></div>
                  <div className="pixel pink"></div>
                  <div className="pixel"></div>
                  <div className="pixel"></div>
                  <div className="pixel"></div>
                  <div className="pixel"></div>
                  <div className="pixel"></div>

                  <div className="pixel"></div>
                  <div className="pixel"></div>
                  <div className="pixel"></div>
                  <div className="pixel"></div>
                  <div className="pixel"></div>
                  <div className="pixel"></div>
                  <div className="pixel pink"></div>
                  <div className="pixel"></div>
                  <div className="pixel"></div>
                  <div className="pixel"></div>
                  <div className="pixel"></div>
                  <div className="pixel"></div>
                  <div className="pixel"></div>
                </div>
              </div>
            </div>
          </div>

          <p style={{
            fontFamily: '"Newsreader", serif',
            fontSize: '22px',
            color: '#b82e56',
            marginTop: '34px',
            fontStyle: 'italic',
            letterSpacing: '0.04em',
            animation: 'pulseText 2.5s infinite ease-in-out',
            opacity: isOpening ? 0 : 1,
            transition: 'opacity 0.6s ease'
          }}>
            Tap our heart to open... ♡
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
          onClick={() => document.getElementById('memories')?.scrollIntoView({ behavior: 'smooth' })}
          style={{
            position: 'absolute',
            bottom: 'clamp(10px, 3vh, 24px)',
            left: 'clamp(10px, 3vw, 24px)',
            zIndex: 1000,
            width: 'clamp(95px, 22vw, 130px)',
            height: 'clamp(95px, 22vw, 130px)',
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
            fontSize: 'clamp(10px, 2.4vw, 12px)',
            color: '#d4778d',
            textAlign: 'center',
            padding: '6px',
            lineHeight: '1.2',
            zIndex: 1
          }}>
            Read book,<br />then click to<br />memories 🌸
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
        {Array.from({ length: 25 }).map((_, i) => (
          <div
            key={i}
            className="particle"
            style={{
              left: `${Math.random() * 100}vw`,
              width: `${Math.random() * 8 + 4}px`,
              height: `${Math.random() * 8 + 4}px`,
              animationDuration: `${Math.random() * 10 + 10}s`,
              animationDelay: `${Math.random() * 10}s`
            }}
          />
        ))}

        {/* Emotional Text Overlay */}
        <div style={{
          position: 'absolute',
          top: 'clamp(14px, 3.5vh, 32px)',
          width: '100%',
          textAlign: 'center',
          zIndex: 20,
          fontFamily: '"Instrument Serif", serif',
          color: '#fdf0d5',
          fontSize: 'clamp(18px, 4vw, 32px)',
          padding: '0 90px 0 16px',
          textShadow: '0 2px 10px rgba(0,0,0,0.6)',
          animation: 'pulseText 4s infinite',
          pointerEvents: 'none',
          boxSizing: 'border-box'
        }}>
          Every frame, a piece of my heart ♡
        </div>

        <button
          onClick={() => document.getElementById('top')?.scrollIntoView({ behavior: 'smooth' })}
          style={{
            position: 'absolute',
            top: 'clamp(12px, 3vh, 28px)',
            right: 'clamp(12px, 3vw, 28px)',
            zIndex: 1000,
            padding: '8px 18px',
            background: 'rgba(255, 255, 255, 0.12)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            border: '1px solid rgba(255, 255, 255, 0.25)',
            borderRadius: '25px',
            cursor: 'pointer',
            fontFamily: '"Newsreader", serif',
            fontSize: 'clamp(13px, 2.5vw, 16px)',
            color: '#fdf0d5',
            boxShadow: '0 6px 24px rgba(0,0,0,0.3)',
            transition: 'all 0.3s ease',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.25)';
            e.currentTarget.style.transform = 'translateY(-2px)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.12)';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          <span>&uarr;</span> Book
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
