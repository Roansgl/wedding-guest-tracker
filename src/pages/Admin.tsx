import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Ornament } from "@/components/wedding/Ornament";
import { toast } from "sonner";
import { 
  LogOut, 
  Plus, 
  Users, 
  CheckCircle, 
  XCircle, 
  Clock,
  Copy,
  Trash2,
  Search,
  Upload,
  Image,
  Save,
  MapPin,
  Home,
  FileText,
  Cloud
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import type { Database } from "@/integrations/supabase/types";

type Guest = Database["public"]["Tables"]["guests"]["Row"];
type RSVP = Database["public"]["Tables"]["rsvps"]["Row"];

interface GuestWithRSVP extends Guest {
  rsvps: RSVP | null;
}

interface WeddingInfo {
  directions_text: string;
  directions_map_url: string;
  accommodation_text: string;
  notes_text: string;
  weather_location: string;
  enable_dietary: boolean;
}

const Admin = () => {
  const navigate = useNavigate();
  const [guests, setGuests] = useState<GuestWithRSVP[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddingGuest, setIsAddingGuest] = useState(false);
  const [newGuestName, setNewGuestName] = useState("");
  const [newGuestEmail, setNewGuestEmail] = useState("");
  const [newGuestPlusOne, setNewGuestPlusOne] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [watermarkUrl, setWatermarkUrl] = useState<string | null>(null);
  const [isUploadingWatermark, setIsUploadingWatermark] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Wedding info state
  const [weddingInfo, setWeddingInfo] = useState<WeddingInfo>({
    directions_text: "",
    directions_map_url: "",
    accommodation_text: "",
    notes_text: "",
    weather_location: "Kirkwood,Eastern Cape,ZA",
    enable_dietary: false,
  });
  const [isSavingInfo, setIsSavingInfo] = useState(false);

  const filteredGuests = guests.filter((guest) =>
    guest.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (!session?.user) {
          navigate("/admin/login");
        }
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session?.user) {
        navigate("/admin/login");
      } else {
        fetchGuests();
        fetchWatermark();
        fetchWeddingInfo();
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const fetchWeddingInfo = async () => {
    try {
      const { data, error } = await supabase
        .from("wedding_settings")
        .select("key, value")
        .in("key", ["directions_text", "directions_map_url", "accommodation_text", "notes_text", "weather_location", "enable_dietary"]);

      if (error) throw error;

      const infoObj: WeddingInfo = {
        directions_text: "",
        directions_map_url: "",
        accommodation_text: "",
        notes_text: "",
        weather_location: "Kirkwood,Eastern Cape,ZA",
        enable_dietary: false,
      };

      data?.forEach((item) => {
        switch (item.key) {
          case "directions_text":
            infoObj.directions_text = item.value ?? "";
            break;
          case "directions_map_url":
            infoObj.directions_map_url = item.value ?? "";
            break;
          case "accommodation_text":
            infoObj.accommodation_text = item.value ?? "";
            break;
          case "notes_text":
            infoObj.notes_text = item.value ?? "";
            break;
          case "weather_location":
            infoObj.weather_location = item.value ?? "Kirkwood,Eastern Cape,ZA";
            break;
          case "enable_dietary":
            infoObj.enable_dietary = item.value === "true";
            break;
          default:
            break;
        }
      });

      setWeddingInfo(infoObj);
    } catch (error) {
      console.error("Error fetching wedding info:", error);
    }
  };

  const handleSaveWeddingInfo = async () => {
    setIsSavingInfo(true);
    try {
      const keys = Object.keys(weddingInfo) as (keyof WeddingInfo)[];

      const updates = keys.map(async (key) => {
        const rawValue = weddingInfo[key];
        const normalizedValue =
          key === "enable_dietary"
            ? rawValue
              ? "true"
              : "false"
            : (rawValue as string).trim() || null;

        const { data: existing } = await supabase
          .from("wedding_settings")
          .select("id")
          .eq("key", key)
          .maybeSingle();

        if (existing) {
          return supabase
            .from("wedding_settings")
            .update({
              value: normalizedValue,
              updated_at: new Date().toISOString(),
            })
            .eq("key", key);
        }

        return supabase.from("wedding_settings").insert({
          key,
          value: normalizedValue,
        });
      });

      await Promise.all(updates);
      toast.success("Troue-inligting gestoor!");
    } catch (error) {
      console.error("Error saving wedding info:", error);
      toast.error("Kon nie inligting stoor nie");
    } finally {
      setIsSavingInfo(false);
    }
  };

  const fetchWatermark = async () => {
    try {
      const { data } = await supabase
        .from("wedding_settings")
        .select("value")
        .eq("key", "watermark_url")
        .maybeSingle();
      
      if (data?.value) {
        setWatermarkUrl(data.value);
      }
    } catch (error) {
      console.error("Error fetching watermark:", error);
    }
  };

  const fetchGuests = async () => {
    try {
      const { data: guestsData, error: guestsError } = await supabase
        .from("guests")
        .select("*")
        .order("created_at", { ascending: false });

      if (guestsError) throw guestsError;

      const { data: rsvpsData, error: rsvpsError } = await supabase
        .from("rsvps")
        .select("*");

      if (rsvpsError) throw rsvpsError;

      const guestsWithRsvps = guestsData.map((guest) => ({
        ...guest,
        rsvps: rsvpsData.find((rsvp) => rsvp.guest_id === guest.id) || null,
      }));

      setGuests(guestsWithRsvps);
    } catch (error) {
      console.error("Error fetching guests:", error);
      toast.error("Failed to load guests");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/admin/login");
  };

  const handleAddGuest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGuestName.trim()) return;

    setIsAddingGuest(true);
    try {
      const { error } = await supabase.from("guests").insert({
        name: newGuestName.trim(),
        email: newGuestEmail.trim() || null,
        plus_one_allowed: newGuestPlusOne,
      });

      if (error) throw error;

      toast.success("Guest added successfully!");
      setNewGuestName("");
      setNewGuestEmail("");
      setNewGuestPlusOne(false);
      setDialogOpen(false);
      fetchGuests();
    } catch (error) {
      console.error("Error adding guest:", error);
      toast.error("Failed to add guest");
    } finally {
      setIsAddingGuest(false);
    }
  };

  const handleDeleteGuest = async (guestId: string) => {
    if (!confirm("Are you sure you want to remove this guest?")) return;

    try {
      const { error } = await supabase.from("guests").delete().eq("id", guestId);
      if (error) throw error;
      toast.success("Guest removed");
      fetchGuests();
    } catch (error) {
      console.error("Error deleting guest:", error);
      toast.error("Failed to remove guest");
    }
  };

  const handleWatermarkUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      return;
    }

    setIsUploadingWatermark(true);
    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `watermark.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("watermarks")
        .upload(fileName, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from("watermarks")
        .getPublicUrl(fileName);

      const publicUrl = urlData.publicUrl;

      // Save to settings - first try to update, if no rows affected then insert
      const { data: existingData } = await supabase
        .from("wedding_settings")
        .select("id")
        .eq("key", "watermark_url")
        .maybeSingle();

      let settingsError;
      if (existingData) {
        const { error } = await supabase
          .from("wedding_settings")
          .update({ value: publicUrl, updated_at: new Date().toISOString() })
          .eq("key", "watermark_url");
        settingsError = error;
      } else {
        const { error } = await supabase
          .from("wedding_settings")
          .insert({ key: "watermark_url", value: publicUrl });
        settingsError = error;
      }

      if (settingsError) throw settingsError;

      setWatermarkUrl(publicUrl);
      toast.success("Watermark uploaded successfully!");
    } catch (error) {
      console.error("Error uploading watermark:", error);
      toast.error("Failed to upload watermark");
    } finally {
      setIsUploadingWatermark(false);
    }
  };

  const copyInviteLink = (inviteCode: string) => {
    const link = `${window.location.origin}/rsvp?code=${inviteCode}`;
    navigator.clipboard.writeText(link);
    toast.success("Invite link copied!");
  };

  const getStatusIcon = (status: string | null) => {
    switch (status) {
      case "attending":
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case "not_attending":
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Clock className="w-5 h-5 text-muted-foreground" />;
    }
  };

  const getStatusLabel = (status: string | null) => {
    switch (status) {
      case "attending":
        return "Attending";
      case "not_attending":
        return "Not Attending";
      default:
        return "Pending";
    }
  };

  const stats = {
    total: guests.length,
    attending: guests.filter((g) => g.rsvps?.status === "attending").length,
    notAttending: guests.filter((g) => g.rsvps?.status === "not_attending").length,
    pending: guests.filter((g) => !g.rsvps || g.rsvps.status === "pending").length,
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="font-display text-2xl text-foreground">Wedding Dashboard</h1>
            <p className="text-sm text-muted-foreground">Manage your guest list & RSVPs</p>
          </div>
          <Button variant="ghost" onClick={handleLogout}>
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Wedding Info Section */}
        <div className="bg-card rounded-xl p-6 shadow-card space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-display text-xl text-foreground">Troue-Inligting</h2>
              <p className="text-sm text-muted-foreground">Bestuur aanwysings, verblyf en notas vir gaste</p>
            </div>
            <Button
              variant="gold"
              onClick={handleSaveWeddingInfo}
              disabled={isSavingInfo}
            >
              {isSavingInfo ? (
                "Stoor..."
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Stoor Inligting
                </>
              )}
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Directions */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-terracotta" />
                <Label className="font-medium">Aanwysings</Label>
              </div>
              <Textarea
                value={weddingInfo.directions_text}
                onChange={(e) => setWeddingInfo(prev => ({ ...prev, directions_text: e.target.value }))}
                placeholder="Voer aanwysings in..."
                className="min-h-[100px]"
              />
              <Input
                value={weddingInfo.directions_map_url}
                onChange={(e) => setWeddingInfo(prev => ({ ...prev, directions_map_url: e.target.value }))}
                placeholder="Google Maps skakel (opsioneel)"
              />
            </div>

            {/* Accommodation */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Home className="w-4 h-4 text-terracotta" />
                <Label className="font-medium">Verblyf</Label>
              </div>
              <Textarea
                value={weddingInfo.accommodation_text}
                onChange={(e) => setWeddingInfo(prev => ({ ...prev, accommodation_text: e.target.value }))}
                placeholder="Voer verblyf-inligting in..."
                className="min-h-[120px]"
              />
            </div>

            {/* Notes */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-terracotta" />
                <Label className="font-medium">Notas (bv. bring warm klere)</Label>
              </div>
              <Textarea
                value={weddingInfo.notes_text}
                onChange={(e) =>
                  setWeddingInfo((prev) => ({ ...prev, notes_text: e.target.value }))
                }
                placeholder="Voer notas vir gaste in..."
                className="min-h-[100px]"
              />
            </div>

            {/* Dietary / Allergy field toggle */}
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-4">
                <div className="space-y-1">
                  <Label className="font-medium">Dieet / Allergieë vraag</Label>
                  <p className="text-xs text-muted-foreground">
                    Wys 'n opsionele dieet/allergieë veld op die RSVP vorm
                  </p>
                </div>
                <Switch
                  checked={weddingInfo.enable_dietary}
                  onCheckedChange={(checked) =>
                    setWeddingInfo((prev) => ({ ...prev, enable_dietary: checked }))
                  }
                />
              </div>
            </div>

            {/* Weather Location */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Cloud className="w-4 h-4 text-terracotta" />
                <Label className="font-medium">Weer Ligging (vir AccuWeather)</Label>
              </div>
              <Input
                value={weddingInfo.weather_location}
                onChange={(e) =>
                  setWeddingInfo((prev) => ({
                    ...prev,
                    weather_location: e.target.value,
                  }))
                }
                placeholder="Stad, Provinsie, Land"
              />
              <p className="text-xs text-muted-foreground">Formaat: Kirkwood,Eastern Cape,ZA</p>
            </div>
          </div>
        </div>

        {/* Watermark Upload */}
        <div className="bg-card rounded-xl p-6 shadow-card">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-display text-xl text-foreground">Invite Watermark</h2>
              <p className="text-sm text-muted-foreground">Upload an image to display behind your names on invites</p>
            </div>
            <div className="flex items-center gap-4">
              {watermarkUrl && (
                <div className="w-16 h-16 rounded-lg border border-border overflow-hidden bg-muted">
                  <img 
                    src={watermarkUrl} 
                    alt="Current watermark" 
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleWatermarkUpload}
                accept="image/*"
                className="hidden"
              />
              <Button
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploadingWatermark}
              >
                {isUploadingWatermark ? (
                  "Uploading..."
                ) : watermarkUrl ? (
                  <>
                    <Image className="w-4 h-4 mr-2" />
                    Change Image
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Image
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-card rounded-xl p-6 shadow-card">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Users className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-display text-foreground">{stats.total}</p>
                <p className="text-sm text-muted-foreground">Total Guests</p>
              </div>
            </div>
          </div>
          
          <div className="bg-card rounded-xl p-6 shadow-card">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-display text-foreground">{stats.attending}</p>
                <p className="text-sm text-muted-foreground">Attending</p>
              </div>
            </div>
          </div>
          
          <div className="bg-card rounded-xl p-6 shadow-card">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                <XCircle className="w-5 h-5 text-red-500" />
              </div>
              <div>
                <p className="text-2xl font-display text-foreground">{stats.notAttending}</p>
                <p className="text-sm text-muted-foreground">Declined</p>
              </div>
            </div>
          </div>
          
          <div className="bg-card rounded-xl p-6 shadow-card">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
                <Clock className="w-5 h-5 text-amber-500" />
              </div>
              <div>
                <p className="text-2xl font-display text-foreground">{stats.pending}</p>
                <p className="text-sm text-muted-foreground">Awaiting</p>
              </div>
            </div>
          </div>
        </div>

        {/* Guest List */}
        <div className="bg-card rounded-xl shadow-card overflow-hidden">
          <div className="p-6 border-b border-border flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="font-display text-xl text-foreground">Guest List</h2>
              <p className="text-sm text-muted-foreground">Manage invitations and track responses</p>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 w-64"
                />
              </div>
            
              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="gold">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Guest
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle className="font-display text-2xl">Add New Guest</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleAddGuest} className="space-y-4 mt-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Guest Name *</Label>
                      <Input
                        id="name"
                        value={newGuestName}
                        onChange={(e) => setNewGuestName(e.target.value)}
                        placeholder="Full name"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email (Optional)</Label>
                      <Input
                        id="email"
                        type="email"
                        value={newGuestEmail}
                        onChange={(e) => setNewGuestEmail(e.target.value)}
                        placeholder="email@example.com"
                      />
                    </div>
                    <div className="flex items-center justify-between py-2">
                      <Label htmlFor="plusOne">Allow Plus One</Label>
                      <Switch
                        id="plusOne"
                        checked={newGuestPlusOne}
                        onCheckedChange={setNewGuestPlusOne}
                      />
                    </div>
                    <Button
                      type="submit"
                      variant="gold"
                      className="w-full"
                      disabled={isAddingGuest}
                    >
                      {isAddingGuest ? "Adding..." : "Add Guest"}
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {isLoading ? (
            <div className="p-12 text-center">
              <p className="text-muted-foreground">Loading guests...</p>
            </div>
          ) : guests.length === 0 ? (
            <div className="p-12 text-center space-y-4">
              <Ornament variant="simple" />
              <p className="text-muted-foreground">No guests yet. Add your first guest to get started!</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Guest Name</TableHead>
                  <TableHead>Invite Code</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Plus One</TableHead>
                  <TableHead>Liedjie Versoek</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredGuests.map((guest) => (
                  <TableRow key={guest.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{guest.name}</p>
                        {guest.email && (
                          <p className="text-sm text-muted-foreground">{guest.email}</p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <code className="text-sm bg-muted px-2 py-1 rounded font-mono">
                        {guest.invite_code}
                      </code>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(guest.rsvps?.status || null)}
                        <span className="text-sm">{getStatusLabel(guest.rsvps?.status || null)}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {guest.rsvps?.plus_one_name ? (
                        <p className="text-sm">{guest.rsvps.plus_one_name}</p>
                      ) : guest.plus_one_allowed ? (
                        <span className="text-sm text-muted-foreground">Allowed</span>
                      ) : (
                        <span className="text-sm text-muted-foreground">—</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-muted-foreground line-clamp-1 max-w-[200px]">
                        {guest.rsvps?.message || "—"}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyInviteLink(guest.invite_code)}
                          title="Copy invite link"
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteGuest(guest.id)}
                          title="Remove guest"
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </main>
    </div>
  );
};

export default Admin;
