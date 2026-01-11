'use client';

import { Share2 } from 'lucide-react';
import CountUp from 'react-countup';

export default function PublicGlobalCounter({ initialCount }: { initialCount: number }) {
  
  const handleShare = () => {
    const text = encodeURIComponent(
      `I'm using LogisticsLingo to streamline my shipping communications! ${initialCount.toLocaleString()} messages have already been generated. Check it out:`
    );
    const url = encodeURIComponent("https://logistics-lingo.vercel.app");
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, "_blank");
  };

  return (
    <div className="w-full bg-slate-900 text-white py-2 px-4 shadow-md">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-4">
        
        {/* Live Counter Badge */}
        <div className="flex items-center gap-2 bg-white/5 px-4 py-1 rounded-full border border-white/10">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
          </span>
          <p className="text-[10px] sm:text-xs font-medium uppercase tracking-widest text-slate-300">
            <span className="text-blue-400 font-bold inline-block min-w-[20px]">
              <CountUp 
                end={initialCount} 
                duration={2.5} 
                separator="," 
              />
            </span> total messages generated on LogisticsLingo
          </p>
        </div>
        
        {/* Share Button */}
        <button 
          onClick={handleShare}
          className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 hover:text-white transition-all active:scale-95"
        >
          <Share2 className="h-3 w-3" />
          SHARE GROWTH
        </button>
      </div>
    </div>
  );
}