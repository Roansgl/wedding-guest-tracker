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
  onSuccess: () => void;
}

type RsvpStatus = "attending" | "not_attending";

export const RSVPForm = ({ guest, onSuccess }: RSVPFormProps) => {
  const [status, setStatus] = useState<RsvpStatus>("attending");
  const [songRequest, setSongRequest] = useState("");
  const [plusOneName, setPlusOneName] = useState("");
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

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

      toast.success("Thank you for your response!");
      onSuccess();
    } catch (error) {
      console.error("RSVP error:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="text-center">
        <h3 className="font-display text-2xl text-foreground mb-2">Dear {guest.name}</h3>
        <p className="text-muted-foreground text-sm">Please let us know if you can join us</p>
      </div>

      <Ornament variant="line" />

      <div className="space-y-6">
        <div className="space-y-3">
          <Label className="text-sm font-medium text-foreground">Will you be attending?</Label>
          <RadioGroup
            value={status}
            onValueChange={(value) => setStatus(value as RsvpStatus)}
            className="grid grid-cols-1 gap-3"
          >
            <label className="flex items-center space-x-3 p-4 rounded-lg border border-border bg-card hover:bg-accent/30 transition-colors cursor-pointer">
              <RadioGroupItem value="attending" />
              <span className="font-display text-lg">Joyfully Accepts</span>
            </label>
            <label className="flex items-center space-x-3 p-4 rounded-lg border border-border bg-card hover:bg-accent/30 transition-colors cursor-pointer">
              <RadioGroupItem value="not_attending" />
              <span className="font-display text-lg">Regretfully Declines</span>
            </label>
          </RadioGroup>
        </div>

        {status === "attending" && guest.plus_one_allowed && (
          <div className="space-y-4 p-4 rounded-lg bg-accent/20 animate-fade-in">
            <p className="text-sm font-medium text-foreground">You're welcome to bring a guest!</p>
            <div className="space-y-3">
              <Label className="text-sm text-muted-foreground">Guest Name</Label>
              <Input
                value={plusOneName}
                onChange={(e) => setPlusOneName(e.target.value)}
                placeholder="Guest's full name"
                className="bg-card"
              />
            </div>
          </div>
        )}

        <div className="space-y-3">
          <Label className="text-sm font-medium text-foreground">Song Request</Label>
          <p className="text-xs text-muted-foreground">What song will get you on the dance floor?</p>
          <Textarea
            value={songRequest}
            onChange={(e) => setSongRequest(e.target.value)}
            placeholder="Tell us the song that will make you dance!"
            className="bg-card min-h-[100px]"
          />
        </div>
      </div>

      <Button
        type="submit"
        variant="gold"
        size="xl"
        className="w-full"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Sending..." : "Send Response"}
      </Button>
    </form>
  );
};