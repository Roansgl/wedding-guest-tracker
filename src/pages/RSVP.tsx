import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { RSVPForm } from "@/components/wedding/RSVPForm";
import { Ornament } from "@/components/wedding/Ornament";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Heart, MapPin, Calendar, Clock } from "lucide-react";

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

  useEffect(() => {
    const code = searchParams.get("code");
    if (code) {
      lookupGuest(code);
    }
  }, [searchParams]);

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
        setError("We couldn't find your invitation. Please check your code.");
        setGuest(null);
      } else {
        setGuest(data);
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
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

  if (submitted) {
    return (
      <div className="min-h-screen gradient-hero flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center space-y-8 animate-fade-in-up">
          <div className="w-20 h-20 mx-auto rounded-full bg-accent flex items-center justify-center">
            <Heart className="w-10 h-10 text-gold fill-gold" />
          </div>
          <h1 className="font-display text-4xl text-foreground">Thank You!</h1>
          <Ornament variant="line" />
          <p className="text-muted-foreground text-lg">
            Your response has been received. We're so excited to celebrate with you!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen gradient-hero">
      {/* Hero Section */}
      <section className="relative py-20 px-4 text-center overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-10 left-10 text-8xl text-gold">✿</div>
          <div className="absolute top-20 right-20 text-6xl text-gold">❀</div>
          <div className="absolute bottom-10 left-1/4 text-7xl text-gold">✿</div>
        </div>

        <div className="relative z-10 max-w-2xl mx-auto space-y-6 animate-fade-in-up">
          <p className="text-gold uppercase tracking-[0.3em] text-sm font-body">You're Invited</p>
          
          <h1 className="font-display text-5xl md:text-7xl text-foreground leading-tight">
            Roan & Lariney
          </h1>
          
          <Ornament variant="floral" className="py-4" />
          
          <p className="font-display text-xl text-muted-foreground italic">
            Request the pleasure of your company
          </p>
        </div>
      </section>

      {/* Event Details */}
      <section className="py-12 px-4">
        <div className="max-w-2xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="space-y-3 animate-fade-in-up animate-delay-100">
            <div className="w-12 h-12 mx-auto rounded-full bg-accent flex items-center justify-center">
              <Calendar className="w-5 h-5 text-gold" />
            </div>
            <h3 className="font-display text-xl text-foreground">Date</h3>
            <p className="text-muted-foreground">Saturday, June 15, 2025</p>
          </div>
          
          <div className="space-y-3 animate-fade-in-up animate-delay-200">
            <div className="w-12 h-12 mx-auto rounded-full bg-accent flex items-center justify-center">
              <Clock className="w-5 h-5 text-gold" />
            </div>
            <h3 className="font-display text-xl text-foreground">Time</h3>
            <p className="text-muted-foreground">Ceremony at 4:00 PM</p>
          </div>
          
          <div className="space-y-3 animate-fade-in-up animate-delay-300">
            <div className="w-12 h-12 mx-auto rounded-full bg-accent flex items-center justify-center">
              <MapPin className="w-5 h-5 text-gold" />
            </div>
            <h3 className="font-display text-xl text-foreground">Location</h3>
            <p className="text-muted-foreground">The Grand Estate<br />123 Garden Lane</p>
          </div>
        </div>
      </section>

      {/* RSVP Section */}
      <section className="py-16 px-4">
        <div className="max-w-lg mx-auto">
          <div className="bg-card shadow-elegant rounded-2xl p-8 md:p-10 animate-fade-in-up animate-delay-400">
            {!guest ? (
              <div className="space-y-8">
                <div className="text-center space-y-4">
                  <h2 className="font-display text-3xl text-foreground">RSVP</h2>
                  <p className="text-muted-foreground">
                    Enter your invitation code to respond
                  </p>
                </div>

                <Ornament variant="line" />

                <form onSubmit={handleCodeSubmit} className="space-y-4">
                  <Input
                    value={inviteCode}
                    onChange={(e) => setInviteCode(e.target.value)}
                    placeholder="Enter your invitation code"
                    className="text-center text-lg h-14 bg-background"
                  />
                  {error && (
                    <p className="text-destructive text-sm text-center">{error}</p>
                  )}
                  <Button
                    type="submit"
                    variant="gold"
                    size="xl"
                    className="w-full"
                    disabled={isLoading}
                  >
                    {isLoading ? "Looking up..." : "Find My Invitation"}
                  </Button>
                </form>
              </div>
            ) : (
              <RSVPForm guest={guest} onSuccess={() => setSubmitted(true)} />
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 text-center">
        <Ornament variant="simple" />
        <p className="mt-6 text-muted-foreground text-sm">
          We can't wait to celebrate with you
        </p>
      </footer>
    </div>
  );
};

export default RSVP;
