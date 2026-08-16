import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { RotatingQuotes } from './components/RotatingQuotes';
import { TransparentMusicPlayer } from './components/TransparentMusicPlayer';
import { soundEngine } from './utils/soundSynthesis';
import backgroundImage from './assets/images/meditation_mountain_bg_1786856664733.jpg';

export default function App() {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isControlsVisible, setIsControlsVisible] = useState<boolean>(true);
  const hideTimerRef = useRef<NodeJS.Timeout | null>(null);

  // When playing state changes: if starting to play, schedule disappearing of controls
  useEffect(() => {
    if (hideTimerRef.current) clearTimeout(hideTimerRef.current);

    if (isPlaying) {
      // Hide controls shortly after starting to play
      hideTimerRef.current = setTimeout(() => {
        setIsControlsVisible(false);
      }, 1400);
    } else {
      // When paused, controls must always stay visible
      setIsControlsVisible(true);
    }

    return () => {
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    };
  }, [isPlaying]);

  // Handle user activity: when cursor moves or user touches/presses a key, reveal controls
  const handleUserActivity = () => {
    setIsControlsVisible(true);

    if (hideTimerRef.current) clearTimeout(hideTimerRef.current);

    // If currently playing, auto-hide after 2.6s of inactivity
    if (isPlaying) {
      hideTimerRef.current = setTimeout(() => {
        setIsControlsVisible(false);
      }, 2600);
    }
  };

  useEffect(() => {
    const onActivity = () => handleUserActivity();

    window.addEventListener('mousemove', onActivity);
    window.addEventListener('touchstart', onActivity);
    window.addEventListener('keydown', onActivity);

    return () => {
      window.removeEventListener('mousemove', onActivity);
      window.removeEventListener('touchstart', onActivity);
      window.removeEventListener('keydown', onActivity);
    };
  }, [isPlaying]);

  // Global Keyboard Navigation & Meditation Hotkeys
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }

      if (e.code === 'Space' || e.key === 'p' || e.key === 'P') {
        e.preventDefault();
        const mainPlayBtn = document.getElementById('main-play-pause-btn');
        if (mainPlayBtn) mainPlayBtn.click();
      } else if (e.key === 'g' || e.key === 'G') {
        soundEngine.playTempleGong();
      } else if (e.key === 't' || e.key === 'T') {
        soundEngine.playTingsha();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div
      onMouseMove={handleUserActivity}
      onTouchStart={handleUserActivity}
      className={`min-h-screen text-[#e8decb] font-['Plus_Jakarta_Sans',sans-serif] flex flex-col relative selection:bg-[#d4a373] selection:text-[#110e08] overflow-hidden transition-all duration-700 ${
        isPlaying && !isControlsVisible ? 'cursor-none' : 'cursor-default'
      }`}
    >
      {/* Full-bleed Crystal Clear Wallpaper Background */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <motion.img
          initial={{ scale: 1.08, opacity: 0 }}
          animate={{ scale: 1.02, opacity: 1 }}
          transition={{ duration: 1.8, ease: 'easeOut' }}
          src={backgroundImage}
          alt="Serene Clifftop Mountain Lake Meditation Sanctuary"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center filter brightness-[0.88] contrast-[1.04] saturate-[1.08]"
        />

        {/* Soft Vignette Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/50" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_45%,_rgba(0,0,0,0.45)_100%)]" />

        {/* Dynamic Subtle Breathing Halo when playing */}
        <motion.div
          animate={{
            opacity: isPlaying ? [0.12, 0.28, 0.12] : 0.05,
            scale: isPlaying ? [1, 1.15, 1] : 1
          }}
          transition={{
            repeat: Infinity,
            duration: 6,
            ease: 'easeInOut'
          }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] rounded-full bg-radial from-amber-400/25 to-transparent blur-3xl"
        />
      </div>

      {/* Main Dynamic Viewport Container */}
      <div className="relative z-10 w-full min-h-screen flex flex-col justify-between p-4 sm:p-8">
        {/* Dynamic Top Balancing Space */}
        <motion.div
          layout
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className={isControlsVisible ? 'h-6 sm:h-12' : 'h-0'}
        />

        {/* Centered Quotes Section (Smoothly Animates to Perfect Center when controls disappear) */}
        <motion.main
          layout
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-5xl mx-auto flex flex-col items-center justify-center my-auto"
        >
          <RotatingQuotes autoRotateInterval={16000} />
        </motion.main>

        {/* Bottom Area: Full-Width Transparent Music Player */}
        <motion.footer
          layout
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-5xl mx-auto flex flex-col items-center justify-end"
        >
          <TransparentMusicPlayer
            isVisible={isControlsVisible}
            onPlayStateChange={setIsPlaying}
            onUserInteract={handleUserActivity}
          />
        </motion.footer>
      </div>
    </div>
  );
}
