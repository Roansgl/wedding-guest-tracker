import { cn } from "@/lib/utils";

interface OrnamentProps {
  className?: string;
  variant?: "simple" | "floral" | "line" | "victorian";
}

export const Ornament = ({ className, variant = "simple" }: OrnamentProps) => {
  if (variant === "line") {
    return (
      <div className={cn("flex items-center justify-center gap-4 w-full max-w-xs mx-auto", className)}>
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-terracotta to-transparent opacity-40" />
        <span className="text-terracotta text-lg opacity-70">❦</span>
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-terracotta to-transparent opacity-40" />
      </div>
    );
  }

  if (variant === "floral") {
    return (
      <div className={cn("flex items-center justify-center gap-3 text-terracotta/60", className)}>
        <span className="text-base transform scale-x-[-1]">❧</span>
        <span className="text-xl">❦</span>
        <span className="text-base">❧</span>
      </div>
    );
  }

  if (variant === "victorian") {
    return (
      <div className={cn("flex items-center justify-center gap-2 text-terracotta/50", className)}>
        <span className="text-sm">✧</span>
        <span className="text-xs">─────</span>
        <span className="text-lg">❦</span>
        <span className="text-xs">─────</span>
        <span className="text-sm">✧</span>
      </div>
    );
  }

  return (
    <div className={cn("flex items-center justify-center gap-3 text-terracotta/50", className)}>
      <span className="text-xs">✧</span>
      <span className="text-sm">◈</span>
      <span className="text-xs">✧</span>
    </div>
  );
};