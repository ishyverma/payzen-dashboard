import { cn } from "@/lib/utils";

/** One-time staggered entrance. Pure CSS: runs before hydration, off the main thread. */
export function Reveal({ children, i = 0, className }: { children: React.ReactNode; i?: number; className?: string }) {
  return (
    <div className={cn("animate-rise", className)} style={{ animationDelay: `${i * 50}ms` }}>
      {children}
    </div>
  );
}
