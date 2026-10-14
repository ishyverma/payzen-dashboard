import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react";
import { cn } from "@/lib/utils";

export type IconType = IconSvgElement;

/** One icon set, 1.5px stroke beside regular text, recolored through currentColor. */
export function Icon({
  icon,
  className,
  strokeWidth = 1.5,
}: {
  icon: IconSvgElement;
  className?: string;
  strokeWidth?: number;
}) {
  return <HugeiconsIcon icon={icon} strokeWidth={strokeWidth} className={cn("shrink-0", className)} aria-hidden />;
}
