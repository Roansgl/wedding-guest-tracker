import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  Image
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
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

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

      // Save to settings
      const { error: settingsError } = await supabase
        .from("wedding_settings")
        .upsert({
          key: "watermark_url",
          value: publicUrl,
        }, { onConflict: "key" });

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
                  <TableHead>Message</TableHead>
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