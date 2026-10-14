export function Logo({ size = 28 }: { size?: number }) {
  return (
    <span
      style={{ width: size, height: size }}
      className="grid shrink-0 place-items-center rounded-[9px] bg-gradient-to-b from-[#5AAEFF] to-[#2D6BF5] shadow-[inset_0_1px_0_rgb(255_255_255/0.35),0_1px_2px_rgb(45_107_245/0.35)]"
    >
      <svg viewBox="0 0 24 24" className="size-[62%]" aria-hidden>
        <circle cx="9.5" cy="12" r="5.5" fill="#fff" />
        <circle cx="15" cy="12" r="5.5" fill="#fff" fillOpacity=".55" />
      </svg>
    </span>
  );
}
