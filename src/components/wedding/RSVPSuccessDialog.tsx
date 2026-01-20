import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { MapPin, Home, FileText, Cloud, ExternalLink, ChevronDown } from "lucide-react";
import { Ornament } from "./Ornament";
import { DancingCouple } from "./DancingCouple";

interface WeddingInfo {
  directions_text: string | null;
  directions_map_url: string | null;
  accommodation_text: string | null;
  notes_text: string | null;
  weather_location: string | null;
}

interface RSVPSuccessDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const RSVPSuccessDialog = ({ open, onOpenChange }: RSVPSuccessDialogProps) => {
  const [info, setInfo] = useState<WeddingInfo>({
    directions_text: null,
    directions_map_url: null,
    accommodation_text: null,
    notes_text: null,
    weather_location: null,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [showCouple, setShowCouple] = useState(false);
  const [showInfo, setShowInfo] = useState(false);

  useEffect(() => {
    if (open) {
      fetchWeddingInfo();
      // Reset animation states
      setShowCouple(false);
      setShowInfo(false);
      // Trigger couple animation after 1 second
      const coupleTimer = setTimeout(() => setShowCouple(true), 1000);
      // Show info section after couple appears
      const infoTimer = setTimeout(() => setShowInfo(true), 2000);
      return () => {
        clearTimeout(coupleTimer);
        clearTimeout(infoTimer);
      };
    }
  }, [open]);

  const fetchWeddingInfo = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("wedding_settings")
        .select("key, value")
        .in("key", ["directions_text", "directions_map_url", "accommodation_text", "notes_text", "weather_location"]);

      if (error) throw error;

      const infoObj: WeddingInfo = {
        directions_text: null,
        directions_map_url: null,
        accommodation_text: null,
        notes_text: null,
        weather_location: "Kirkwood,Eastern Cape,ZA",
      };

      data?.forEach((item) => {
        if (item.key in infoObj) {
          infoObj[item.key as keyof WeddingInfo] = item.value;
        }
      });

      setInfo(infoObj);
    } catch (error) {
      console.error("Error fetching wedding info:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getAccuWeatherUrl = () => {
    const location = info.weather_location || "Kirkwood,Eastern Cape,ZA";
    return `https://www.accuweather.com/en/search-locations?query=${encodeURIComponent(location)}`;
  };

  const hasContent = info.directions_text || info.accommodation_text || info.notes_text;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto bg-antique-white border-antique p-0">
        {/* Hero Thank You Section */}
        <div className="px-6 pt-10 pb-6 text-center space-y-6">
          {/* Main "Baie Dankie" text with animation */}
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="space-y-3"
          >
            <h1 className="font-display text-5xl md:text-6xl text-foreground italic tracking-wide">
              Baie Dankie
            </h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="text-muted-foreground font-body text-lg"
            >
              Ons is so opgewonde om saam met jou te vier!
            </motion.p>
          </motion.div>

          {/* Ornament */}
          <motion.div
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ delay: 0.5, duration: 0.6, ease: "easeOut" }}
          >
            <Ornament variant="line" />
          </motion.div>

          {/* Dancing Couple Animation - appears after 1 second */}
          <AnimatePresence>
            {showCouple && (
              <motion.div
                initial={{ opacity: 0, y: 30, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              >
                <DancingCouple />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Important Information Section - scrollable */}
        <AnimatePresence>
          {showInfo && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="px-6 pb-6"
            >
              {/* Scroll hint */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="flex flex-col items-center gap-1 mb-4"
              >
                <p className="text-xs text-muted-foreground/70 font-body">Belangrike Inligting</p>
                <motion.div
                  animate={{ y: [0, 4, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                >
                  <ChevronDown className="w-4 h-4 text-terracotta/50" />
                </motion.div>
              </motion.div>

              {isLoading ? (
                <div className="py-4 text-center">
                  <p className="text-muted-foreground text-sm">Laai inligting...</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Directions */}
                  {info.directions_text && (
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 }}
                      className="space-y-2 p-4 rounded-lg bg-background/50"
                    >
                      <div className="flex items-center gap-2 text-terracotta">
                        <MapPin className="w-4 h-4" />
                        <h4 className="font-display text-base">Aanwysings</h4>
                      </div>
                      <p className="text-muted-foreground font-body text-sm whitespace-pre-wrap">
                        {info.directions_text}
                      </p>
                      {info.directions_map_url && (
                        <a
                          href={info.directions_map_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-terracotta hover:text-terracotta/80 text-sm underline underline-offset-2"
                        >
                          Sien Kaart <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </motion.div>
                  )}

                  {/* Accommodation */}
                  {info.accommodation_text && (
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 }}
                      className="space-y-2 p-4 rounded-lg bg-background/50"
                    >
                      <div className="flex items-center gap-2 text-terracotta">
                        <Home className="w-4 h-4" />
                        <h4 className="font-display text-base">Verblyf</h4>
                      </div>
                      <p className="text-muted-foreground font-body text-sm whitespace-pre-wrap">
                        {info.accommodation_text}
                      </p>
                    </motion.div>
                  )}

                  {/* Notes */}
                  {info.notes_text && (
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 }}
                      className="space-y-2 p-4 rounded-lg bg-background/50"
                    >
                      <div className="flex items-center gap-2 text-terracotta">
                        <FileText className="w-4 h-4" />
                        <h4 className="font-display text-base">Notas</h4>
                      </div>
                      <p className="text-muted-foreground font-body text-sm whitespace-pre-wrap">
                        {info.notes_text}
                      </p>
                    </motion.div>
                  )}

                  {/* Weather Link */}
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                    className="space-y-2 p-4 rounded-lg bg-background/50"
                  >
                    <div className="flex items-center gap-2 text-terracotta">
                      <Cloud className="w-4 h-4" />
                      <h4 className="font-display text-base">Weer</h4>
                    </div>
                    <a
                      href={getAccuWeatherUrl()}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-terracotta hover:text-terracotta/80 text-sm underline underline-offset-2"
                    >
                      Kyk hier na die weer <ExternalLink className="w-3 h-3" />
                    </a>
                  </motion.div>

                  {!hasContent && (
                    <p className="text-muted-foreground text-center text-sm py-2">
                      Meer inligting sal binnekort beskikbaar wees.
                    </p>
                  )}
                </div>
              )}

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="mt-6"
              >
                <Button
                  variant="gold"
                  className="w-full"
                  onClick={() => onOpenChange(false)}
                >
                  Sluit
                </Button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
};
