import { useEffect, useMemo, useState } from "react";
import {
  addDays,
  addMonths,
  differenceInDays,
  differenceInHours,
  differenceInMonths,
  isValid,
} from "date-fns";

interface TimeLeft {
  months: number;
  days: number;
  hours: number;
}

interface WeddingCountdownProps {
  weddingDate?: string | null;
}

export const WeddingCountdown = ({ weddingDate }: WeddingCountdownProps) => {
  const targetDate = useMemo(() => {
    // Prefer yyyy-mm-dd from settings; fallback to Aug 1, 2026
    const raw = (weddingDate?.trim() || "2026-08-01").slice(0, 10);
    // Ensure a stable parse across browsers by appending time
    return new Date(`${raw}T00:00:00`);
  }, [weddingDate]);

  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ months: 0, days: 0, hours: 0 });

  useEffect(() => {
    const calculateTimeLeft = () => {
      if (!isValid(targetDate)) {
        setTimeLeft({ months: 0, days: 0, hours: 0 });
        return;
      }

      const now = new Date();
      const target = targetDate;

      if (target <= now) {
        setTimeLeft({ months: 0, days: 0, hours: 0 });
        return;
      }

      // Calendar-accurate breakdown
      const months = Math.max(0, differenceInMonths(target, now));
      const afterMonths = addMonths(now, months);
      const days = Math.max(0, differenceInDays(target, afterMonths));
      const afterDays = addDays(afterMonths, days);
      const hours = Math.max(0, differenceInHours(target, afterDays));

      setTimeLeft({ months, days, hours });
    };

    calculateTimeLeft();
    const interval = setInterval(calculateTimeLeft, 1000 * 60); // update every minute
    return () => clearInterval(interval);
  }, [targetDate]);

  return (
    <div className="flex justify-center gap-6 md:gap-8 py-4 animate-fade-in">
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
