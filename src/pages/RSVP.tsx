import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { RSVPForm } from "@/components/wedding/RSVPForm";
import { Ornament } from "@/components/wedding/Ornament";
import { WeddingInfoDialog } from "@/components/wedding/WeddingInfoDialog";
import { RSVPSuccessDialog } from "@/components/wedding/RSVPSuccessDialog";
import { WeddingCountdown } from "@/components/wedding/WeddingCountdown";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Heart, MapPin, Calendar, Clock, Info } from "lucide-react";

interface Guest {
  id: string;
  name: string;
  plus_one_allowed: boolean;
}

const RSVP = () => {
  const [searchParams] = useSearchParams();
  const [inviteCode, setInviteCode] = useState(searchParams.get("code") || "");
  const [guest, setGuest] = useState<Guest | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [watermarkUrl, setWatermarkUrl] = useState<string | null>(null);
  const [enableDietary, setEnableDietary] = useState(false);
  const [weddingDate, setWeddingDate] = useState<string>("2026-08-01");
  const [showInfoDialog, setShowInfoDialog] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);

  useEffect(() => {
    const code = searchParams.get("code");
    if (code) {
      lookupGuest(code);
    }
    fetchWeddingSettings();
  }, [searchParams]);

  const fetchWeddingSettings = async () => {
    try {
      const { data, error } = await supabase
        .from("wedding_settings")
        .select("key, value")
        .in("key", ["watermark_url", "enable_dietary", "wedding_date"]);

      if (error) throw error;

      const watermark = data?.find((x) => x.key === "watermark_url")?.value ?? null;
      const enableDietaryValue = data?.find((x) => x.key === "enable_dietary")?.value;
      const weddingDateValue = data?.find((x) => x.key === "wedding_date")?.value;

      setWatermarkUrl(watermark);
      setEnableDietary(enableDietaryValue === "true");
      if (weddingDateValue) setWeddingDate(weddingDateValue);
    } catch (error) {
      console.error("Error fetching wedding settings:", error);
    }
  };

  const lookupGuest = async (code: string) => {
    setIsLoading(true);
    setError("");

    try {
      const { data, error } = await supabase
        .from("guests")
        .select("id, name, plus_one_allowed")
        .eq("invite_code", code.toLowerCase().trim())
        .single();

      if (error || !data) {
        setError("Ons kon nie u uitnodiging vind nie. Kontroleer asseblief u kode.");
        setGuest(null);
      } else {
        setGuest(data);
      }
    } catch (err) {
      setError("Iets het verkeerd gegaan. Probeer asseblief weer.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inviteCode.trim()) {
      lookupGuest(inviteCode);
    }
  };

  const handleRSVPSuccess = (isAttending: boolean) => {
    setSubmitted(true);
    if (isAttending) {
      setShowSuccessDialog(true);
    }
  };

  if (submitted && !showSuccessDialog) {
    return (
      <div className="min-h-screen texture-paper lace-overlay sepia-tint flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center space-y-8 animate-fade-in-up">
          <div className="w-20 h-20 mx-auto rounded-full bg-antique-white flex items-center justify-center border-2 border-terracotta/35 worn-edges">
            <Heart className="w-10 h-10 text-terracotta fill-terracotta/80" />
          </div>
          <h1 className="font-display text-4xl text-foreground italic">Baie Dankie!</h1>
          <Ornament variant="line" />
          <p className="text-muted-foreground text-lg font-body">
            U antwoord is ontvang.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen texture-paper lace-overlay sepia-tint watermark-botanical">
      {/* Hero Section */}
      <section className="relative py-20 px-4 text-center overflow-hidden">
        {/* Decorative vintage flourishes */}
        <div className="absolute inset-0 opacity-[0.035] pointer-events-none">
          <div className="absolute top-8 left-8 text-7xl text-rust font-serif">❧</div>
          <div className="absolute top-16 right-16 text-5xl text-terracotta font-serif">❦</div>
          <div className="absolute bottom-12 left-1/4 text-6xl text-rust font-serif transform scale-x-[-1]">❧</div>
          <div className="absolute bottom-8 right-1/3 text-4xl text-caramel font-serif">✿</div>
        </div>

        <div className="relative z-10 max-w-2xl mx-auto space-y-6 animate-fade-in-up">
          <p className="text-terracotta uppercase tracking-[0.35em] text-sm font-body">
            Ons nooi u hartlik uit na die begin van ons "vir ewig en altyd"
          </p>
          
          <div className="relative py-8">
            {watermarkUrl && (
              <img 
                src={watermarkUrl} 
                alt="" 
                className="absolute inset-0 w-full h-full object-contain opacity-8 pointer-events-none sepia"
              />
            )}
            <h1 className="font-display text-5xl md:text-7xl text-foreground leading-tight italic relative z-10">
              Roan & Lariney
            </h1>
          </div>
          
          <Ornament variant="victorian" className="py-4" />
          
          <p className="font-script text-2xl text-muted-foreground">
            RSVP asseblief teen 10 Februarie 2026
          </p>

          {/* Countdown Timer - Always visible */}
          <WeddingCountdown />

          {/* Belangrike Inligting Link */}
          <button
            onClick={() => setShowInfoDialog(true)}
            className="inline-flex items-center gap-2 mt-4 text-terracotta hover:text-terracotta/80 font-display text-lg underline underline-offset-4 decoration-2 transition-colors"
          >
            <Info className="w-5 h-5" />
            Belangrike Inligting
          </button>
        </div>
      </section>

      {/* Event Details */}
      <section className="py-12 px-4">
        <div className="max-w-2xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="space-y-3 animate-fade-in-up animate-delay-100">
            <div className="w-14 h-14 mx-auto rounded-full bg-antique-white flex items-center justify-center border border-terracotta/25 worn-edges">
              <Calendar className="w-5 h-5 text-terracotta" />
            </div>
            <h3 className="font-display text-xl text-foreground italic">Datum</h3>
            <p className="text-muted-foreground font-body">Saterdag, 1 Augustus 2026</p>
          </div>
          
          <div className="space-y-3 animate-fade-in-up animate-delay-200">
            <div className="w-14 h-14 mx-auto rounded-full bg-antique-white flex items-center justify-center border border-terracotta/25 worn-edges">
              <Clock className="w-5 h-5 text-terracotta" />
            </div>
            <h3 className="font-display text-xl text-foreground italic">Tyd</h3>
            <p className="text-muted-foreground font-body">Seremonie om 15:00</p>
          </div>
          
          <div className="space-y-3 animate-fade-in-up animate-delay-300">
            <div className="w-14 h-14 mx-auto rounded-full bg-antique-white flex items-center justify-center border border-terracotta/25 worn-edges">
              <MapPin className="w-5 h-5 text-terracotta" />
            </div>
            <h3 className="font-display text-xl text-foreground italic">Plek</h3>
            <a href="https://maps.app.goo.gl/1GAG8P298AB3p9586" target="_blank" rel="noopener noreferrer" className="text-muted-foreground font-body hover:text-terracotta transition-colors underline underline-offset-2">Dstasie Kirkwood</a>
          </div>
        </div>
      </section>

      {/* RSVP Section */}
      <section className="py-16 px-4">
        <div className="max-w-lg mx-auto">
          <div className="bg-antique-white shadow-vintage rounded-sm p-8 md:p-10 border-antique worn-edges animate-fade-in-up animate-delay-400">
            {!guest ? (
              <div className="space-y-8">
                <div className="text-center space-y-4">
                  <h2 className="font-display text-3xl text-foreground italic">Antwoord Asseblief</h2>
                  <p className="text-muted-foreground font-body">
                    Voer u uitnodigingskode in
                  </p>
                </div>

                <Ornament variant="line" />

                <form onSubmit={handleCodeSubmit} className="space-y-4">
                  <Input
                    value={inviteCode}
                    onChange={(e) => setInviteCode(e.target.value)}
                    placeholder="Voer u uitnodigingskode in"
                    className="text-center text-lg h-14 bg-background font-body"
                  />
                  {error && (
                    <p className="text-destructive text-sm text-center font-body">{error}</p>
                  )}
                  <Button
                    type="submit"
                    variant="gold"
                    size="xl"
                    className="w-full"
                    disabled={isLoading}
                  >
                    {isLoading ? "Besig om te soek..." : "Vind My Uitnodiging"}
                  </Button>
                </form>
              </div>
            ) : (
              <RSVPForm guest={guest} onSuccess={handleRSVPSuccess} enableDietary={enableDietary} />
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 text-center">
        <Ornament variant="floral" />
        <p className="mt-6 text-muted-foreground text-sm font-body italic">
          Ons kan nie wag om saam met u te vier nie
        </p>
      </footer>

      {/* Wedding Info Dialog */}
      <WeddingInfoDialog open={showInfoDialog} onOpenChange={setShowInfoDialog} />
      
      {/* RSVP Success Dialog */}
      <RSVPSuccessDialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog} />
    </div>
  );
};

export default RSVP;
