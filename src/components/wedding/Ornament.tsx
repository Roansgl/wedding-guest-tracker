import { cn } from "@/lib/utils";

interface OrnamentProps {
  className?: string;
  variant?: "simple" | "floral" | "line" | "victorian";
}

export const Ornament = ({ className, variant = "simple" }: OrnamentProps) => {
  if (variant === "line") {
    return (
      <div className={cn("flex items-center justify-center gap-4 w-full max-w-xs mx-auto", className)}>
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gold to-transparent opacity-50" />
        <span className="text-gold text-lg">❦</span>
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gold to-transparent opacity-50" />
      </div>
    );
  }

  if (variant === "floral") {
    return (
      <div className={cn("flex items-center justify-center gap-3 text-gold/70", className)}>
        <span className="text-base transform scale-x-[-1]">❧</span>
        <span className="text-xl">❦</span>
        <span className="text-base">❧</span>
      </div>
    );
  }

  if (variant === "victorian") {
    return (
      <div className={cn("flex items-center justify-center gap-2 text-gold/60", className)}>
        <span className="text-sm">✧</span>
        <span className="text-xs">─────</span>
        <span className="text-lg">❦</span>
        <span className="text-xs">─────</span>
        <span className="text-sm">✧</span>
      </div>
    );
  }

  return (
    <div className={cn("flex items-center justify-center gap-3 text-gold/60", className)}>
      <span className="text-xs">✧</span>
      <span className="text-sm">◈</span>
      <span className="text-xs">✧</span>
    </div>
  );
};