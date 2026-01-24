import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import RSVP from "./pages/RSVP";
import AdminLogin from "./pages/AdminLogin";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";
import Dankie from "./pages/Dankie";
import { HashRouter, Routes, Route } from "react-router-dom";

const queryClient = new QueryClient();

// Support direct links like /rsvp on static hosting by normalizing to HashRouter URLs.
// Example: /rsvp?x=1  ->  /?x=1#/rsvp
const ensureHashRoute = () => {
  if (typeof window === "undefined") return;
  const { pathname, search, hash } = window.location;

  // Already a hash route
  if (hash && hash.startsWith("#/")) return;

  // Root is fine
  if (pathname === "/" || pathname === "/index.html") return;

  // Move the current pathname into the hash (keep query string at root)
  window.history.replaceState(null, "", `/${search}#${pathname}`);
};

ensureHashRoute();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <HashRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/rsvp" element={<RSVP />} />
          <Route path="/dankie" element={<Dankie />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </HashRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
