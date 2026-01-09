import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Ornament } from "@/components/wedding/Ornament";
import { Heart, Users, Send } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen gradient-hero texture-paper">
      {/* Hero Section */}
      <section className="relative py-24 md:py-32 px-4 text-center overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
          <div className="absolute top-10 left-10 text-8xl text-foreground">❧</div>
          <div className="absolute top-40 right-10 text-6xl text-foreground">❦</div>
          <div className="absolute bottom-20 left-1/4 text-7xl text-foreground transform scale-x-[-1]">❧</div>
          <div className="absolute bottom-40 right-1/3 text-5xl text-foreground">✧</div>
        </div>

        <div className="relative z-10 max-w-3xl mx-auto space-y-8">
          <div className="animate-fade-in-up">
            <p className="text-burgundy uppercase tracking-[0.4em] text-sm font-body mb-4">
              The Wedding Celebration of
            </p>
            <h1 className="font-display text-6xl md:text-8xl text-foreground leading-tight italic">
              Roan & Lariney
            </h1>
          </div>
          
          <Ornament variant="victorian" className="py-6 animate-fade-in animate-delay-200" />
          
          <p className="font-body text-xl md:text-2xl text-muted-foreground italic animate-fade-in-up animate-delay-300">
            Manage your wedding invitations with elegance
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8 animate-fade-in-up animate-delay-400">
            <Button variant="gold" size="xl" asChild>
              <Link to="/rsvp">
                <Send className="w-5 h-5 mr-2" />
                Guest RSVP
              </Link>
            </Button>
            <Button variant="outline-gold" size="xl" asChild>
              <Link to="/admin/login">
                <Users className="w-5 h-5 mr-2" />
                Admin Portal
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <h2 className="font-display text-4xl text-foreground italic">How It Works</h2>
            <Ornament variant="line" />
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center space-y-4 p-8 bg-card rounded-sm shadow-card border-victorian animate-fade-in-up">
              <div className="w-16 h-16 mx-auto rounded-full bg-secondary flex items-center justify-center border border-gold/30">
                <Users className="w-7 h-7 text-burgundy" />
              </div>
              <h3 className="font-display text-2xl text-foreground italic">Add Guests</h3>
              <p className="text-muted-foreground font-body">
                Add your guests to the list and generate unique invitation codes for each one.
              </p>
            </div>

            <div className="text-center space-y-4 p-8 bg-card rounded-sm shadow-card border-victorian animate-fade-in-up animate-delay-100">
              <div className="w-16 h-16 mx-auto rounded-full bg-secondary flex items-center justify-center border border-gold/30">
                <Send className="w-7 h-7 text-burgundy" />
              </div>
              <h3 className="font-display text-2xl text-foreground italic">Share Invites</h3>
              <p className="text-muted-foreground font-body">
                Share the unique invite links with your guests so they can RSVP online.
              </p>
            </div>

            <div className="text-center space-y-4 p-8 bg-card rounded-sm shadow-card border-victorian animate-fade-in-up animate-delay-200">
              <div className="w-16 h-16 mx-auto rounded-full bg-secondary flex items-center justify-center border border-gold/30">
                <Heart className="w-7 h-7 text-burgundy fill-burgundy" />
              </div>
              <h3 className="font-display text-2xl text-foreground italic">Track RSVPs</h3>
              <p className="text-muted-foreground font-body">
                Monitor responses in real-time from your admin dashboard.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 text-center border-t border-border">
        <Ornament variant="floral" />
        <p className="mt-6 text-muted-foreground text-sm font-body italic">
          Made with love for your special day
        </p>
      </footer>
    </div>
  );
};

export default Index;