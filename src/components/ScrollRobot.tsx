"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Ensure GSAP registers plugins only on client side
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const TOTAL_FRAMES = 241;
// Format frame number: ezgif-frame-001.jpg
const getFramePath = (index: number) => 
  `/frames/ezgif-frame-${String(index).padStart(3, "0")}.jpg`;

export default function ScrollRobot() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const text1Ref = useRef<HTMLDivElement>(null);
  const text2Ref = useRef<HTMLDivElement>(null);
  const text3Ref = useRef<HTMLDivElement>(null);
  
  const [imagesLoaded, setImagesLoaded] = useState(0);
  const imagesRef = useRef<HTMLImageElement[]>([]);

  // Preload images safely (prevent ERR_CONNECTION_RESET)
  useEffect(() => {
    let loaded = 0;
    const images: HTMLImageElement[] = new Array(TOTAL_FRAMES + 1);
    let nextIndexToLoad = 1;
    let isMounted = true;

    const loadNext = () => {
      if (!isMounted || nextIndexToLoad > TOTAL_FRAMES) return;
      
      const index = nextIndexToLoad++;
      const img = new Image();
      
      img.onload = () => {
        if (!isMounted) return;
        loaded++;
        setImagesLoaded(loaded);
        
        // Initial draw when first frame loads
        if (index === 1 && canvasRef.current) {
          const ctx = canvasRef.current.getContext("2d");
          if (ctx) {
            setTimeout(() => renderFrame(1), 100);
          }
        }
        
        // Load next frame in this chain
        loadNext();
      };
      
      img.onerror = () => {
        if (!isMounted) return;
        console.warn(`Failed to load frame ${index}, skipping...`);
        // Continue loading even if one fails
        loadNext();
      };

      img.src = getFramePath(index);
      images[index] = img;
    };

    // Delay starting the concurrent loading streams by 1.5 seconds.
    // This allows the browser to prioritize downloading the massive Hero Video
    // so the initial page load feels instantaneous.
    const startLoadingTimer = setTimeout(() => {
      for (let i = 0; i < 4; i++) {
        loadNext();
      }
    }, 1500);
    
    imagesRef.current = images;

    return () => {
      isMounted = false;
      clearTimeout(startLoadingTimer);
    };
  }, []);

  // Handle Resize and Drawing
  const renderFrame = (index: number) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const img = imagesRef.current[index];
    if (!img || !img.complete) return;

    const cw = canvas.width = window.innerWidth;
    const ch = canvas.height = window.innerHeight;

    const imgRatio = img.width / img.height;
    const canvasRatio = cw / ch;

    let drawW = cw;
    let drawH = ch;
    let offsetX = 0;
    let offsetY = 0;

    if (imgRatio > canvasRatio) {
      drawW = ch * imgRatio;
      offsetX = (cw - drawW) / 2;
    } else {
      drawH = cw / imgRatio;
      offsetY = (ch - drawH) / 2;
    }

    ctx.clearRect(0, 0, cw, ch);
    ctx.drawImage(img, offsetX, offsetY, drawW, drawH);
  };

  // GSAP Animation
  useEffect(() => {
    if (!containerRef.current || !canvasRef.current) return;
    if (imagesLoaded < Math.min(10, TOTAL_FRAMES)) return;

    const playhead = { frame: 1 };

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: `+=${TOTAL_FRAMES * 20}`,
        pin: true,
        scrub: 1.5,
      }
    });

    // Frame animation
    tl.to(playhead, {
      frame: TOTAL_FRAMES,
      ease: "none",
      duration: 1, // Represents 100% of the timeline
      onUpdate: () => {
        renderFrame(Math.floor(playhead.frame));
      }
    }, 0);

    // Text animations (using progress 0 to 1)
    // First text
    tl.fromTo(text1Ref.current, 
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, duration: 0.15, ease: "power2.out" }, 
      0.05
    );
    tl.to(text1Ref.current, 
      { opacity: 0, y: -40, duration: 0.15, ease: "power2.in" }, 
      0.25
    );

    // Second text
    tl.fromTo(text2Ref.current, 
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, duration: 0.15, ease: "power2.out" }, 
      0.4
    );
    tl.to(text2Ref.current, 
      { opacity: 0, y: -40, duration: 0.15, ease: "power2.in" }, 
      0.6
    );

    // Third text
    tl.fromTo(text3Ref.current, 
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, duration: 0.15, ease: "power2.out" }, 
      0.75
    );
    tl.to(text3Ref.current, 
      { opacity: 0, y: -40, duration: 0.15, ease: "power2.in" }, 
      0.9
    );

    const handleResize = () => {
      renderFrame(Math.floor(playhead.frame));
    };
    window.addEventListener('resize', handleResize);

    return () => {
      tl.scrollTrigger?.kill();
      tl.kill();
      window.removeEventListener('resize', handleResize);
    };
  }, [imagesLoaded]);

  return (
    <section 
      ref={containerRef} 
      id="experience" 
      className="relative w-full h-screen bg-black overflow-hidden"
    >
      <canvas 
        ref={canvasRef} 
        className="absolute inset-0 w-full h-full object-cover z-0"
      />
      
      {/* Scanline overlay */}
      <div className="absolute inset-0 scanlines opacity-30 pointer-events-none z-10" />

      {/* Cinematic Text Overlays */}
      <div className="absolute inset-0 z-20 pointer-events-none flex flex-col justify-center px-10 md:px-32 max-w-7xl mx-auto">
        
        <div ref={text1Ref} className="opacity-0 absolute">
          <div className="text-[#00f0ff] font-mono text-xs md:text-sm tracking-[0.3em] mb-2 uppercase text-glow">
            Phase 01 // Cognitive Boot
          </div>
          <h2 className="text-3xl md:text-5xl font-bold text-white font-['Orbitron'] tracking-wide">
            AWAKENING THE CORE
          </h2>
          <p className="mt-4 text-gray-300 max-w-xl text-sm md:text-base leading-relaxed">
            Initializing neural pathways and establishing synaptic connections. The system learns, adapts, and evolves in real-time.
          </p>
        </div>

        <div ref={text2Ref} className="opacity-0 absolute right-10 md:right-32 text-right">
          <div className="text-[#00f0ff] font-mono text-xs md:text-sm tracking-[0.3em] mb-2 uppercase text-glow">
            Phase 02 // Power Surge
          </div>
          <h2 className="text-3xl md:text-5xl font-bold text-white font-['Orbitron'] tracking-wide">
            LIMITLESS POTENTIAL
          </h2>
          <p className="mt-4 text-gray-300 max-w-xl ml-auto text-sm md:text-base leading-relaxed">
            Unrestricted access to the global knowledge graph. Capable of processing complex queries within milliseconds.
          </p>
        </div>

        <div ref={text3Ref} className="opacity-0 absolute">
          <div className="text-[#00f0ff] font-mono text-xs md:text-sm tracking-[0.3em] mb-2 uppercase text-glow">
            Phase 03 // Interaction
          </div>
          <h2 className="text-3xl md:text-5xl font-bold text-white font-['Orbitron'] tracking-wide">
            READY TO SERVE
          </h2>
          <p className="mt-4 text-gray-300 max-w-xl text-sm md:text-base leading-relaxed">
            The interface is fully operational. Awaiting user input to begin seamless cognitive collaboration.
          </p>
        </div>

      </div>

      {/* Loading overlay if images are still preloading */}
      {imagesLoaded < TOTAL_FRAMES && (
        <div className="absolute bottom-5 right-5 z-20 text-[#00f0ff] font-['Orbitron'] text-xs uppercase tracking-widest text-glow flex items-center gap-2">
          <div className="w-2 h-2 bg-[#00f0ff] rounded-full animate-pulse" />
          Loading Neural Net: {Math.round((imagesLoaded / TOTAL_FRAMES) * 100)}%
        </div>
      )}

      {/* Persistent overlay for cinematic feel */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-transparent to-black/80 pointer-events-none z-10" />
      
      {/* HUD Elements */}
      <div className="absolute top-24 left-10 z-20 pointer-events-none opacity-50 hidden md:block">
        <div className="text-[10px] text-[#00f0ff] font-mono mb-1">SYS.STATUS // NOMINAL</div>
        <div className="text-[10px] text-[#00f0ff] font-mono mb-1">CORE.TEMP // 34.2C</div>
        <div className="text-[10px] text-[#00f0ff] font-mono mb-1">PWR.OUTPUT // 104%</div>
        <div className="w-32 h-[1px] bg-[#00f0ff]/50 mt-2" />
      </div>
    </section>
  );
}
