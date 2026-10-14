type VT = { ready: Promise<void> };

/**
 * Switches theme with a clip-path wipe:
 *  light → dark reveals the new theme left → right
 *  dark → light reveals the new theme right → left
 * Falls back to an instant switch without View Transitions or with reduced motion.
 */
export function wipeTheme(next: "light" | "dark", setTheme: (t: string) => void) {
  const root = document.documentElement;
  const apply = () => {
    root.classList.toggle("dark", next === "dark");
    root.style.colorScheme = next;
    setTheme(next);
  };
  const doc = document as Document & { startViewTransition?: (cb: () => void) => VT };
  if (!doc.startViewTransition || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    apply();
    return;
  }
  const t = doc.startViewTransition(apply);
  t.ready
    .then(() =>
      root.animate(
        {
          clipPath:
            next === "dark"
              ? ["inset(0 100% 0 0)", "inset(0 0 0 0)"]
              : ["inset(0 0 0 100%)", "inset(0 0 0 0)"],
        },
        { duration: 600, easing: "cubic-bezier(0.77, 0, 0.175, 1)", pseudoElement: "::view-transition-new(root)" },
      ),
    )
    .catch(() => {});
}
