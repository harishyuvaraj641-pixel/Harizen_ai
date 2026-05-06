export default function Footer() {
  return (
    <footer className="w-full bg-[#050810] border-t border-[#00f0ff]/10 py-12 relative z-10">
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col md:flex-row justify-between items-center gap-6">
        
        <div className="flex flex-col items-center md:items-start">
          <div className="text-xl font-bold font-['Orbitron'] tracking-widest text-glow mb-2">
            HARIZEN AI
          </div>
          <div className="text-sm text-gray-400">
            Next Generation Intelligent System
          </div>
        </div>

        <div className="flex flex-col items-center">
          <div className="text-sm text-gray-400 mb-1">Developed by</div>
          <div className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#00f0ff] to-[#0066ff]">
            Harish Yuvaraj
          </div>
        </div>

        <div className="flex flex-col items-center md:items-end gap-2">
          <div className="px-3 py-1 rounded-full border border-[#00f0ff]/30 bg-[#00f0ff]/5 text-xs text-[#00f0ff] uppercase tracking-widest">
            Powered by NVIDIA AI
          </div>
          <div className="text-xs text-gray-500">
            &copy; {new Date().getFullYear()} Harizen AI. All rights reserved.
          </div>
        </div>

      </div>
    </footer>
  );
}
