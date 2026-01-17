import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Ornament } from "./Ornament";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Guest {
  id: string;
  name: string;
  plus_one_allowed: boolean;
}

interface RSVPFormProps {
  guest: Guest;
  onSuccess: (isAttending: boolean) => void;
  enableDietary?: boolean;
}

type RsvpStatus = "attending" | "not_attending";

export const RSVPForm = ({ guest, onSuccess, enableDietary }: RSVPFormProps) => {
  const [status, setStatus] = useState<RsvpStatus>("attending");
  const [songRequest, setSongRequest] = useState("");
  const [plusOneName, setPlusOneName] = useState("");
  const [dietaryNotes, setDietaryNotes] = useState("");
  const [songError, setSongError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate song request is required
    if (status === "attending" && !songRequest.trim()) {
      setSongError("Hierdie veld is verpligtend");
      return;
    }
    
    setIsSubmitting(true);
    setSongError("");

    try {
      const { error } = await supabase
        .from("rsvps")
        .upsert({
          guest_id: guest.id,
          status,
          dietary_notes: null,
          plus_one_name: status === "attending" && guest.plus_one_allowed ? plusOneName : null,
          message: songRequest,
          responded_at: new Date().toISOString(),
        }, {
          onConflict: 'guest_id'
        });

      if (error) throw error;

      toast.success("Dankie vir u antwoord!");
      onSuccess(status === "attending");
    } catch (error) {
      console.error("RSVP error:", error);
      toast.error("Iets het verkeerd gegaan. Probeer asseblief weer.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="text-center">
        <h3 className="font-display text-2xl text-foreground mb-2">Liewe {guest.name}</h3>
        <p className="text-muted-foreground text-sm">Laat weet ons asseblief of u by ons kan aansluit</p>
      </div>

      <Ornament variant="line" />

      <div className="space-y-6">
        <div className="space-y-3">
          <Label className="text-sm font-medium text-foreground">Sal u die troue bywoon?</Label>
          <RadioGroup
            value={status}
            onValueChange={(value) => setStatus(value as RsvpStatus)}
            className="grid grid-cols-1 gap-3"
          >
            <label className="flex items-center space-x-3 p-4 rounded-lg border border-border bg-card hover:bg-accent/30 transition-colors cursor-pointer">
              <RadioGroupItem value="attending" />
              <span className="font-display text-lg">Ja, ons sal daar wees</span>
            </label>
            <label className="flex items-center space-x-3 p-4 rounded-lg border border-border bg-card hover:bg-accent/30 transition-colors cursor-pointer">
              <RadioGroupItem value="not_attending" />
              <span className="font-display text-lg">Nee, ons sal dit nie kan maak nie</span>
            </label>
          </RadioGroup>
        </div>

        {status === "attending" && guest.plus_one_allowed && (
          <div className="space-y-4 p-4 rounded-lg bg-accent/20 animate-fade-in">
            <p className="text-sm font-medium text-foreground">U is welkom om 'n gas saam te bring!</p>
            <div className="space-y-3">
              <Label className="text-sm text-muted-foreground">Gas se Naam</Label>
              <Input
                value={plusOneName}
                onChange={(e) => setPlusOneName(e.target.value)}
                placeholder="Gas se volle naam"
                className="bg-card"
              />
            </div>
          </div>
        )}

        {status === "attending" && (
          <div className="space-y-3 animate-fade-in">
            <Label className="text-sm font-medium text-foreground">
              Liedjie Versoek <span className="text-terracotta">*</span>
            </Label>
            <p className="text-xs text-muted-foreground">Watter liedjie sal u laat dans?</p>
            <Textarea
              value={songRequest}
              onChange={(e) => {
                setSongRequest(e.target.value);
                if (songError) setSongError("");
              }}
              placeholder="Vertel ons watter liedjie u sal laat dans!"
              className={`bg-card min-h-[100px] ${songError ? 'border-destructive' : ''}`}
              required
            />
            {songError && (
              <p className="text-destructive text-xs">{songError}</p>
            )}
          </div>
        )}
      </div>

      <Button
        type="submit"
        variant="gold"
        size="xl"
        className="w-full"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Besig om te stuur..." : "Stuur Antwoord"}
      </Button>
    </form>
  );
};
