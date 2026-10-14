import type { CoinId } from "@/lib/data";
import { cn } from "@/lib/utils";

const BG: Record<Exclude<CoinId, "ETH">, string> = {
  BTC: "#F7931A",
  SOL: "#8B3DFF",
  QNT: "#F26B2A",
  LTC: "#2B6BF5",
};

function Glyph({ id }: { id: CoinId }) {
  switch (id) {
    case "BTC":
      return <text x="12" y="17" textAnchor="middle" fontSize="15" fontWeight="700" fill="#fff">₿</text>;
    case "ETH":
      return (
        <>
          <path d="M12 3.5l-5.5 8.8 5.5 3.2 5.5-3.2L12 3.5z" fill="currentColor" />
          <path d="M12 16.9l-5.5-3.2L12 21l5.5-7.3-5.5 3.2z" fill="currentColor" />
        </>
      );
    case "SOL":
      return <path d="M7.5 7.5h10l-2 2.4h-10l2-2.4zM5.5 14.1h10l2 2.4h-10l-2-2.4zM7.5 10.8h10l-2 2.4h-10l2-2.4z" fill="#fff" />;
    case "QNT":
      return (
        <>
          <circle cx="11.5" cy="11.5" r="4.6" fill="none" stroke="#fff" strokeWidth="2.2" />
          <path d="M14.8 14.8l3.6 3.6" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" />
        </>
      );
    case "LTC":
      return <text x="12" y="17" textAnchor="middle" fontSize="15" fontWeight="700" fill="#fff">Ł</text>;
  }
}

export function CoinIcon({ id, size = 32, circle = false, className }: { id: CoinId; size?: number; circle?: boolean; className?: string }) {
  return (
    <span
      style={{ width: size, height: size, ...(id === "ETH" ? {} : { backgroundColor: BG[id] }) }}
      className={cn(
        "grid shrink-0 place-items-center",
        circle ? "rounded-full" : "rounded-[25%]",
        id === "ETH" && "bg-[#EEEEF1] text-[#111] dark:bg-[#2A2A30] dark:text-white",
        className,
      )}
    >
      <svg viewBox="0 0 24 24" className="size-[78%]" aria-hidden>
        <Glyph id={id} />
      </svg>
    </span>
  );
}

export function BnbIcon({ size = 31 }: { size?: number }) {
  return (
    <span style={{ width: size, height: size }} className="grid shrink-0 place-items-center rounded-[9px] bg-[#111113] dark:ring-1 dark:ring-white/10">
      <svg viewBox="0 0 24 24" className="size-[70%]" aria-hidden>
        <path
          d="M12 4l2.2 2.2L12 8.4 9.8 6.2 12 4zM6.2 9.8L8.4 12l-2.2 2.2L4 12l2.2-2.2zM17.8 9.8L20 12l-2.2 2.2-2.2-2.2 2.2-2.2zM12 15.6l2.2 2.2L12 20l-2.2-2.2 2.2-2.2zM12 10.5l1.5 1.5-1.5 1.5-1.5-1.5 1.5-1.5z"
          fill="#F3BA2F"
        />
      </svg>
    </span>
  );
}

export function Flag({ id, size = 16 }: { id: "USD" | "EUR" | "INR"; size?: number }) {
  if (id === "USD")
    return (
      <svg width={size} height={size} viewBox="0 0 20 20" className="shrink-0" aria-hidden>
        <defs><clipPath id="c"><circle cx="10" cy="10" r="10" /></clipPath></defs>
        <g clipPath="url(#c)">
          <rect width="20" height="20" fill="#fff" />
          {[0, 2, 4, 6, 8, 10, 12].map((i) => <rect key={i} y={i * 1.54} width="20" height="1.54" fill="#D9363E" />)}
          <rect width="9" height="10.8" fill="#2B4DA3" />
        </g>
      </svg>
    );
  return (
    <span
      style={{ width: size, height: size }}
      className={cn("grid shrink-0 place-items-center rounded-full text-[10px] font-semibold text-white", id === "EUR" ? "bg-[#2B4DA3]" : "bg-[#F08A24]")}
    >
      {id === "EUR" ? "€" : "₹"}
    </span>
  );
}
