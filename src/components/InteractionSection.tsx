"use client";

import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

export default function InteractionSection() {
  return (
    <section className="relative w-full min-h-screen bg-black flex flex-col justify-center items-center py-20 overflow-hidden">
      
      {/* Fixed background mimicking the robot reaching out (around frame 120) */}
      <div className="absolute inset-0 z-0">
        <img 
          src="/frames/ezgif-frame-120.jpg" 
          alt="Robot reaching out" 
          className="w-full h-full object-cover opacity-40 scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/90" />
      </div>

      {/* Energy core glow effect */}
      <motion.div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full blur-[100px] z-0 pointer-events-none"
        animate={{
          background: [
            "radial-gradient(circle, rgba(0,240,255,0.4) 0%, transparent 70%)",
            "radial-gradient(circle, rgba(0,102,255,0.6) 0%, transparent 70%)",
            "radial-gradient(circle, rgba(0,240,255,0.4) 0%, transparent 70%)"
          ]
        }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="relative z-10 container mx-auto px-6 text-center max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1 }}
        >
          <div className="inline-block px-4 py-1 mb-6 border border-[#00f0ff]/30 bg-[#00f0ff]/10 text-[#00f0ff] rounded-full text-xs font-mono tracking-widest text-glow uppercase">
            Protocol Initiated
          </div>
          
          <h2 className="text-4xl md:text-6xl font-bold font-['Orbitron'] text-white tracking-wider mb-6 text-glow">
            READY TO INTERACT?
          </h2>
          
          <p className="text-gray-300 text-lg md:text-xl mb-12 max-w-2xl mx-auto font-light leading-relaxed">
            The neural pathway is established. The Harizen AI framework is standing by to process your inquiries and execute commands with unprecedented precision.
          </p>

          <a href="#chat" className="inline-flex items-center gap-3 glass-panel px-8 py-4 rounded-full hover:bg-[#00f0ff]/10 hover:border-[#00f0ff]/50 hover:shadow-[0_0_20px_rgba(0,240,255,0.3)] transition-all duration-300 group text-white">
            <span className="font-['Orbitron'] font-bold tracking-widest text-sm group-hover:text-glow">INITIATE UPLINK</span>
            <ChevronDown className="group-hover:animate-bounce text-[#00f0ff]" size={20} />
          </a>
        </motion.div>
      </div>
      
      {/* Decorative scanlines */}
      <div className="absolute inset-0 scanlines opacity-20 pointer-events-none z-0" />
    </section>
  );
}
