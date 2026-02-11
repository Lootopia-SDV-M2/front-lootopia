import { cn } from "@/lib/utils";
import Image from "next/image";

export interface AvatarProps {
  src?: string | null;
  alt?: string;
  name?: string;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

/**
 * An avatar component that shows an image or fallback initials.
 * Supports multiple sizes with consistent styling.
 */
export function Avatar({
  src,
  alt = "Avatar",
  name,
  size = "md",
  className,
}: AvatarProps) {
  const sizes = {
    sm: "h-8 w-8 text-xs",
    md: "h-10 w-10 text-sm",
    lg: "h-14 w-14 text-base",
    xl: "h-20 w-20 text-xl",
  };

  // Generate initials from name
  const initials = name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div
      className={cn(
        "relative flex items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-primary to-gold-600 font-medium text-primary-foreground shadow-glow-sm",
        sizes[size],
        className
      )}
    >
      {src ? (
        <Image src={src} alt={alt} fill className="object-cover" />
      ) : (
        <span>{initials || "?"}</span>
      )}
    </div>
  );
}
