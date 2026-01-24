import { useEffect, useState } from "react";

interface WeddingCountdownProps {
  weddingDate?: string | null;
}

export const WeddingCountdown = ({ weddingDate }: WeddingCountdownProps) => {
  // Target: August 1, 2026 at midnight
  const targetDate = new Date("2026-08-01T00:00:00");
  
  const [timeLeft, setTimeLeft] = useState({ months: 0, days: 0, hours: 0 });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const diff = targetDate.getTime() - now.getTime();
      
      if (diff <= 0) {
        setTimeLeft({ months: 0, days: 0, hours: 0 });
        return;
      }
      
      // Calculate total remaining time
      const totalHours = Math.floor(diff / (1000 * 60 * 60));
      const totalDays = Math.floor(totalHours / 24);
      
      // Approximate months (30 days per month)
      const months = Math.floor(totalDays / 30);
      const remainingDays = totalDays % 30;
      const hours = totalHours % 24;
      
      setTimeLeft({ months, days: remainingDays, hours });
    };

    calculateTimeLeft();
    const interval = setInterval(calculateTimeLeft, 1000 * 60); // update every minute
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex justify-center gap-6 md:gap-8 py-4">
      <div className="text-center">
        <div className="font-display text-3xl md:text-4xl text-terracotta italic">
          {timeLeft.months}
        </div>
        <div className="text-xs md:text-sm text-muted-foreground font-body uppercase tracking-wider">
          Maande
        </div>
      </div>
      <div className="text-center">
        <div className="font-display text-3xl md:text-4xl text-terracotta italic">
          {timeLeft.days}
        </div>
        <div className="text-xs md:text-sm text-muted-foreground font-body uppercase tracking-wider">
          Dae
        </div>
      </div>
      <div className="text-center">
        <div className="font-display text-3xl md:text-4xl text-terracotta italic">
          {timeLeft.hours}
        </div>
        <div className="text-xs md:text-sm text-muted-foreground font-body uppercase tracking-wider">
          Ure
        </div>
      </div>
    </div>
  );
};
