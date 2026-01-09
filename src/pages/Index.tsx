import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Ornament } from "@/components/wedding/Ornament";
import { Heart, Users, Send } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen gradient-hero">
      {/* Hero Section */}
      <section className="relative py-24 md:py-32 px-4 text-center overflow-hidden">
        <div className="absolute inset-0 opacity-5 pointer-events-none">
          <div className="absolute top-10 left-10 text-8xl text-gold">✿</div>
          <div className="absolute top-40 right-10 text-6xl text-gold">❀</div>
          <div className="absolute bottom-20 left-1/4 text-7xl text-gold">✿</div>
          <div className="absolute bottom-40 right-1/3 text-5xl text-gold">❀</div>
        </div>

        <div className="relative z-10 max-w-3xl mx-auto space-y-8">
          <div className="animate-fade-in-up">
            <p className="text-gold uppercase tracking-[0.4em] text-sm font-body mb-4">
              Wedding Invitation
            </p>
            <h1 className="font-display text-6xl md:text-8xl text-foreground leading-tight">
              Sarah & James
            </h1>
          </div>
          
          <Ornament variant="floral" className="py-6 animate-fade-in animate-delay-200" />
          
          <p className="font-display text-xl md:text-2xl text-muted-foreground italic animate-fade-in-up animate-delay-300">
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
            <h2 className="font-display text-4xl text-foreground">How It Works</h2>
            <Ornament variant="line" />
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center space-y-4 p-8 bg-card rounded-2xl shadow-card animate-fade-in-up">
              <div className="w-16 h-16 mx-auto rounded-full bg-accent flex items-center justify-center">
                <Users className="w-7 h-7 text-gold" />
              </div>
              <h3 className="font-display text-2xl text-foreground">Add Guests</h3>
              <p className="text-muted-foreground">
                Add your guests to the list and generate unique invitation codes for each one.
              </p>
            </div>

            <div className="text-center space-y-4 p-8 bg-card rounded-2xl shadow-card animate-fade-in-up animate-delay-100">
              <div className="w-16 h-16 mx-auto rounded-full bg-accent flex items-center justify-center">
                <Send className="w-7 h-7 text-gold" />
              </div>
              <h3 className="font-display text-2xl text-foreground">Share Invites</h3>
              <p className="text-muted-foreground">
                Share the unique invite links with your guests so they can RSVP online.
              </p>
            </div>

            <div className="text-center space-y-4 p-8 bg-card rounded-2xl shadow-card animate-fade-in-up animate-delay-200">
              <div className="w-16 h-16 mx-auto rounded-full bg-accent flex items-center justify-center">
                <Heart className="w-7 h-7 text-gold fill-gold" />
              </div>
              <h3 className="font-display text-2xl text-foreground">Track RSVPs</h3>
              <p className="text-muted-foreground">
                Monitor responses in real-time from your admin dashboard.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 text-center border-t border-border">
        <Ornament variant="simple" />
        <p className="mt-6 text-muted-foreground text-sm">
          Made with love for your special day
        </p>
      </footer>
    </div>
  );
};

export default Index;
