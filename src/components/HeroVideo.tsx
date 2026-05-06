"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ChevronDown, Volume2, VolumeX } from "lucide-react";

interface HeroVideoProps {
  onVideoEnd: () => void;
}

export default function HeroVideo({ onVideoEnd }: HeroVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hasEnded, setHasEnded] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Reset video state on mount/refresh
    video.currentTime = 0;
    
    // First try playing unmuted, browsers might block it without interaction
    video.play().catch(e => {
      console.warn("Autoplay with sound prevented, falling back to muted autoplay", e);
      video.muted = true;
      setIsMuted(true);
      video.play().catch(err => console.error("Fallback video play failed:", err));
    });

    const handleEnded = () => {
      setHasEnded(true);
      onVideoEnd();
    };

    video.addEventListener("ended", handleEnded);
    
    return () => {
      video.removeEventListener("ended", handleEnded);
    };
  }, [onVideoEnd]);

  return (
    <section id="home" className="relative w-full h-screen overflow-hidden bg-black">
      {/* Video Background */}
      <video
        ref={videoRef}
        src="/video/robo2.mp4"
        muted={isMuted}
        playsInline
        preload="auto"
        className="absolute inset-0 w-full h-full object-cover"
        style={{ opacity: 0.8 }}
      />

      {/* Dark Overlay for Readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-black/20 to-black/80 pointer-events-none" />

      {/* Content Overlay */}
      <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-4 z-10 pointer-events-none">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5, ease: "easeOut", delay: 0.5 }}
        >
          <h1 className="text-5xl md:text-7xl lg:text-9xl font-bold font-['Orbitron'] tracking-widest text-white text-glow mb-4">
            HARIZEN AI
          </h1>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5, delay: 1.5 }}
        >
          <p className="text-lg md:text-2xl text-gray-300 font-light tracking-[0.2em] uppercase">
            Next Generation Intelligent System
          </p>
        </motion.div>
      </div>

      {/* Sound Toggle */}
      <button 
        onClick={toggleMute}
        className="absolute bottom-10 right-10 z-30 p-4 rounded-full glass-panel text-[#00f0ff] hover:bg-[#00f0ff]/20 transition-all box-glow pointer-events-auto"
        aria-label="Toggle sound"
      >
        {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
      </button>

      {/* Scroll Indicator */}
      <motion.div 
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-20 flex flex-col items-center text-[#00f0ff]"
        initial={{ opacity: 0 }}
        animate={{ opacity: hasEnded ? 1 : 0 }}
        transition={{ duration: 1 }}
      >
        <span className="text-xs uppercase tracking-[0.3em] mb-2 text-glow">System Ready</span>
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
        >
          <ChevronDown size={32} className="drop-shadow-[0_0_8px_rgba(0,240,255,0.8)]" />
        </motion.div>
      </motion.div>
    </section>
  );
}
