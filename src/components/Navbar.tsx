"use client";

import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";

export default function Navbar({ isVisible = true }: { isVisible?: boolean }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!isVisible) return null;

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "glass-panel py-3" : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex justify-between items-center">
        <div className="text-2xl font-bold font-['Orbitron'] text-white tracking-widest text-glow cursor-pointer">
          HARIZEN
        </div>

        {/* Desktop Nav */}
        <div className="hidden md:flex space-x-8">
          <a href="#home" className="text-sm font-medium hover:text-[#00f0ff] transition-colors uppercase tracking-wider">Home</a>
          <a href="#experience" className="text-sm font-medium hover:text-[#00f0ff] transition-colors uppercase tracking-wider">Experience</a>
          <a href="#chat" className="text-sm font-medium text-[#00f0ff] hover:text-white transition-colors uppercase tracking-wider text-glow">Connect System</a>
        </div>

        {/* Mobile Toggle */}
        <div className="md:hidden">
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-white hover:text-[#00f0ff]">
            {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden glass-panel absolute top-full left-0 right-0 py-4 flex flex-col items-center space-y-4 border-t-0 rounded-b-xl shadow-lg shadow-[#00f0ff]/10">
          <a href="#home" onClick={() => setMobileMenuOpen(false)} className="text-sm font-medium hover:text-[#00f0ff] uppercase tracking-wider">Home</a>
          <a href="#experience" onClick={() => setMobileMenuOpen(false)} className="text-sm font-medium hover:text-[#00f0ff] uppercase tracking-wider">Experience</a>
          <a href="#chat" onClick={() => setMobileMenuOpen(false)} className="text-sm font-medium text-[#00f0ff] text-glow uppercase tracking-wider">Connect System</a>
        </div>
      )}
    </nav>
  );
}
