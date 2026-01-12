import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        display: ['Playfair Display', 'Cormorant Garamond', 'serif'],
        body: ['Crimson Text', 'Cormorant Garamond', 'serif'],
        script: ['Cormorant Garamond', 'serif'],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
        // Vintage terracotta palette
        terracotta: {
          DEFAULT: "hsl(var(--terracotta))",
          light: "hsl(var(--terracotta-light))",
          muted: "hsl(var(--terracotta-muted))",
        },
        caramel: {
          DEFAULT: "hsl(var(--caramel))",
          light: "hsl(var(--caramel-light))",
        },
        rust: {
          DEFAULT: "hsl(var(--rust))",
          light: "hsl(var(--rust-light))",
        },
        cinnamon: "hsl(var(--cinnamon))",
        "dusty-rose": {
          DEFAULT: "hsl(var(--dusty-rose))",
          light: "hsl(var(--dusty-rose-light))",
        },
        olive: {
          DEFAULT: "hsl(var(--olive))",
          muted: "hsl(var(--olive-muted))",
        },
        "earth-brown": "hsl(var(--earth-brown))",
        // Parchment & paper tones
        parchment: {
          DEFAULT: "hsl(var(--parchment))",
          dark: "hsl(var(--parchment-dark))",
        },
        cream: {
          DEFAULT: "hsl(var(--cream))",
          warm: "hsl(var(--cream-warm))",
        },
        "aged-paper": "hsl(var(--aged-paper))",
        lace: "hsl(var(--lace))",
        "antique-white": "hsl(var(--antique-white))",
        // Legacy tokens
        gold: "hsl(var(--gold))",
        "gold-light": "hsl(var(--gold-light))",
        burgundy: "hsl(var(--burgundy))",
        "burgundy-light": "hsl(var(--burgundy-light))",
        forest: "hsl(var(--forest))",
        "forest-light": "hsl(var(--forest-light))",
        sepia: "hsl(var(--sepia))",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;