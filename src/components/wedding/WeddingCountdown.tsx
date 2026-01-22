import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface TimeLeft {
  months: number;
  days: number;
  hours: number;
}

export const WeddingCountdown = () => {
  const [weddingDate, setWeddingDate] = useState<Date | null>(null);
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ months: 0, days: 0, hours: 0 });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchWeddingDate();
  }, []);

  useEffect(() => {
    if (!weddingDate) return;

    const calculateTimeLeft = () => {
      const now = new Date();
      const target = weddingDate;
      
      if (target <= now) {
        setTimeLeft({ months: 0, days: 0, hours: 0 });
        return;
      }

      const diffMs = target.getTime() - now.getTime();
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      const diffDays = Math.floor(diffHours / 24);
      
      // Calculate months and remaining days
      const months = Math.floor(diffDays / 30);
      const days = diffDays % 30;
      const hours = diffHours % 24;

      setTimeLeft({ months, days, hours });
    };

    calculateTimeLeft();
    const interval = setInterval(calculateTimeLeft, 1000 * 60); // Update every minute

    return () => clearInterval(interval);
  }, [weddingDate]);

  const fetchWeddingDate = async () => {
    try {
      const { data, error } = await supabase
        .from("wedding_settings")
        .select("value")
        .eq("key", "wedding_date")
        .maybeSingle();

      if (error) throw error;

      if (data?.value) {
        setWeddingDate(new Date(data.value));
      } else {
        // Default to August 1, 2026 if not set
        setWeddingDate(new Date("2026-08-01"));
      }
    } catch (error) {
      console.error("Error fetching wedding date:", error);
      setWeddingDate(new Date("2026-08-01"));
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return null;
  }

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
