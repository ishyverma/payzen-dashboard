"use client";

import { useId, useState } from "react";
import { Icon } from "@/components/ui/icon";
import { Tick02Icon } from "@hugeicons/core-free-icons";

/**
 * Press-and-hold confirm. A darker layer is revealed left → right with clip-path while held (linear).
 * Releasing early snaps it back (200ms ease-out). Only a full hold calls onConfirm.
 * Works with pointer, touch and keyboard (hold Space / Enter).
 */
export function HoldButton({
  label,
  hint,
  duration = 1200,
  invalid,
  onInvalid,
  onConfirm,
}: {
  label: string;
  hint: string;
  duration?: number;
  invalid?: boolean;
  onInvalid?: () => void;
  onConfirm: () => void;
}) {
  const [holding, setHolding] = useState(false);
  const [done, setDone] = useState(false);
  const hintId = useId();

  const start = () => {
    if (done) return;
    if (invalid) return onInvalid?.();
    setHolding(true);
  };
  const stop = () => setHolding(false);
  const finish = () => {
    setHolding(false);
    setDone(true);
    onConfirm();
    setTimeout(() => setDone(false), 1500);
  };

  return (
    <div className="mt-3">
      <button
        type="button"
        aria-describedby={hintId}
        onPointerDown={(e) => {
          if (e.button !== 0) return;
          e.currentTarget.setPointerCapture(e.pointerId);
          start();
        }}
        onPointerUp={stop}
        onPointerCancel={stop}
        onLostPointerCapture={stop}
        onBlur={stop}
        onContextMenu={(e) => e.preventDefault()}
        onKeyDown={(e) => {
          if ((e.key === " " || e.key === "Enter") && !e.repeat) {
            e.preventDefault();
            start();
          }
        }}
        onKeyUp={(e) => (e.key === " " || e.key === "Enter") && stop()}
        className="press relative block h-10 w-full touch-none select-none overflow-hidden rounded-[10px] bg-[#0582FB] text-[14px] font-medium tracking-[-0.035em] text-white shadow-[inset_0_1px_0_rgb(255_255_255/0.22),0_1px_2px_rgb(5_130_251/0.4)] [-webkit-touch-callout:none]"
      >
        <span className="grid size-full place-items-center">
          {done ? (
            <span className="flex items-center gap-1.5">
              <Icon icon={Tick02Icon} className="size-[17px]" /> Confirmed
            </span>
          ) : (
            label
          )}
        </span>
        <span
          aria-hidden
          onTransitionEnd={(e) => holding && e.propertyName === "clip-path" && finish()}
          className="absolute inset-0 grid place-items-center bg-[#0366CC]"
          style={{
            clipPath: holding ? "inset(0 0 0 0)" : "inset(0 100% 0 0)",
            transition: holding ? `clip-path ${duration}ms linear` : "clip-path 200ms cubic-bezier(0.23, 1, 0.32, 1)",
          }}
        >
          {label}
        </span>
      </button>
      <p id={hintId} className="mt-2 text-center text-[11.5px] leading-4 tracking-[-0.02em] text-mute">
        {hint}
      </p>
    </div>
  );
}
