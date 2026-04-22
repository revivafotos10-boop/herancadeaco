import React, { useState, useEffect } from 'react';
import { Flame, Timer } from 'lucide-react';

interface UrgencyBannerProps {
  className?: string;
}

const UrgencyBanner = ({ className = "" }: UrgencyBannerProps) => {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    // Target date for Father's Day (Dia dos Pais) - 2nd Sunday of August
    // For 2025, it's August 10th. For now, we use a fallback if passed.
    const currentYear = new Date().getFullYear();
    let target = new Date(`${currentYear}-08-10T00:00:00`).getTime();
    
    const updateCountdown = () => {
      const now = new Date().getTime();
      let distance = target - now;
      
      if (distance < 0) {
        // If date passed, show a 3-day countdown for demo purposes
        const demoDate = new Date();
        demoDate.setDate(demoDate.getDate() + 3);
        distance = demoDate.getTime() - now;
      }
      
      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000)
      });
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`bg-destructive text-destructive-foreground py-2 px-4 text-center text-sm font-bold flex flex-wrap items-center justify-center gap-2 md:gap-4 overflow-hidden animate-in fade-in slide-in-from-top duration-500 ${className}`}>
      <div className="flex items-center gap-2">
        <Flame className="w-4 h-4 animate-pulse text-yellow-400" />
        <span className="uppercase tracking-tight md:tracking-wider">Entrega garantida para o Dia dos Pais</span>
      </div>
      <div className="flex gap-2 items-center bg-black/20 px-3 py-1 rounded-full border border-white/10">
        <Timer className="w-4 h-4 text-yellow-400" />
        <div className="flex gap-1.5 font-mono text-xs md:text-sm">
          <div className="flex items-center">
            <span>{String(timeLeft.days).padStart(2, '0')}d</span>
          </div>
          <span className="opacity-50">:</span>
          <div className="flex items-center">
            <span>{String(timeLeft.hours).padStart(2, '0')}h</span>
          </div>
          <span className="opacity-50">:</span>
          <div className="flex items-center">
            <span>{String(timeLeft.minutes).padStart(2, '0')}m</span>
          </div>
          <span className="opacity-50">:</span>
          <div className="flex items-center">
            <span className="text-yellow-400">{String(timeLeft.seconds).padStart(2, '0')}s</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UrgencyBanner;
