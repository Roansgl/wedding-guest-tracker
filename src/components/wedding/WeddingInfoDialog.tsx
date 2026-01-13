import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { MapPin, Home, FileText, Cloud, ExternalLink } from "lucide-react";
import { Ornament } from "./Ornament";

interface WeddingInfo {
  directions_text: string | null;
  directions_map_url: string | null;
  accommodation_text: string | null;
  notes_text: string | null;
  weather_location: string | null;
}

interface WeddingInfoDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const WeddingInfoDialog = ({ open, onOpenChange }: WeddingInfoDialogProps) => {
  const [info, setInfo] = useState<WeddingInfo>({
    directions_text: null,
    directions_map_url: null,
    accommodation_text: null,
    notes_text: null,
    weather_location: null,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (open) {
      fetchWeddingInfo();
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
      <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto bg-antique-white border-antique">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl text-foreground italic text-center">
            Belangrike Inligting
          </DialogTitle>
        </DialogHeader>

        <Ornament variant="line" className="my-4" />

        {isLoading ? (
          <div className="py-8 text-center">
            <p className="text-muted-foreground">Laai inligting...</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Directions */}
            {info.directions_text && (
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-terracotta">
                  <MapPin className="w-5 h-5" />
                  <h3 className="font-display text-lg">Aanwysings</h3>
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
              </div>
            )}

            {/* Accommodation */}
            {info.accommodation_text && (
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-terracotta">
                  <Home className="w-5 h-5" />
                  <h3 className="font-display text-lg">Verblyf</h3>
                </div>
                <p className="text-muted-foreground font-body text-sm whitespace-pre-wrap">
                  {info.accommodation_text}
                </p>
              </div>
            )}

            {/* Notes */}
            {info.notes_text && (
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-terracotta">
                  <FileText className="w-5 h-5" />
                  <h3 className="font-display text-lg">Notas</h3>
                </div>
                <p className="text-muted-foreground font-body text-sm whitespace-pre-wrap">
                  {info.notes_text}
                </p>
              </div>
            )}

            {/* Weather Link */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-terracotta">
                <Cloud className="w-5 h-5" />
                <h3 className="font-display text-lg">Weer</h3>
              </div>
              <a
                href={getAccuWeatherUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-terracotta hover:text-terracotta/80 text-sm underline underline-offset-2"
              >
                Kyk hier na die weer <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            {!hasContent && (
              <p className="text-muted-foreground text-center text-sm py-4">
                Geen addisionele inligting beskikbaar nie.
              </p>
            )}
          </div>
        )}

        <div className="mt-6">
          <Button
            variant="gold"
            className="w-full"
            onClick={() => onOpenChange(false)}
          >
            Sluit
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
