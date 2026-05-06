"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import HeroVideo from "@/components/HeroVideo";
import ScrollRobot from "@/components/ScrollRobot";
import InteractionSection from "@/components/InteractionSection";
import ChatUI from "@/components/ChatUI";
import Footer from "@/components/Footer";
import CursorGlow from "@/components/CursorGlow";

export default function Home() {
  const [videoEnded, setVideoEnded] = useState(false);

  useEffect(() => {
    // Force scroll to top on reload so the user always sees the Hero section first
    window.scrollTo(0, 0);
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }

    // Lock scroll while video is playing
    if (!videoEnded) {
      document.body.classList.add('scroll-locked');
    } else {
      document.body.classList.remove('scroll-locked');
    }

    return () => {
      document.body.classList.remove('scroll-locked');
    };
  }, [videoEnded]);

  return (
    <main className="relative bg-black min-h-screen text-white font-sans selection:bg-[#00f0ff]/30 selection:text-white">
      <CursorGlow />
      <Navbar isVisible={videoEnded} />
      
      <HeroVideo onVideoEnd={() => setVideoEnded(true)} />
      
      {/* Rest of the content only renders or becomes scrollable after video ends */}
      <div className={`transition-opacity duration-1000 ${videoEnded ? 'opacity-100' : 'opacity-0'}`}>
        <ScrollRobot />
        <InteractionSection />
        <ChatUI />
        <Footer />
      </div>
    </main>
  );
}
