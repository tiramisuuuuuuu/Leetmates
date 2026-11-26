import type { ReactNode } from "react";

export function SpeechTriangle({
  direction,
  background = "muted",
  borderOpacity = 0.4,
  className = "",
}: {
  direction: "up" | "down";
  background?: "cream" | "muted";
  borderOpacity?: number;
  className?: string;
}) {
  const path = direction === "up" ? "M0 7 5 0 10 7 Z" : "M0 0 5 7 10 0 Z";
  const outline = direction === "up" ? "M0 7 5 0 10 7" : "M0 0 5 7 10 0";

  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 10 7"
      className={`pointer-events-none absolute my-[1px] h-[7px] w-[10px] overflow-visible ${className}`}
    >
      <path
        d={path}
        style={{
          fill:
            background === "cream"
              ? "var(--color-cream)"
              : "var(--color-cream-muted)",
        }}
      />
      <path
        d={outline}
        fill="none"
        stroke={`color-mix(in srgb, var(--color-ink) ${borderOpacity * 100}%, transparent)`}
        strokeWidth="1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function Menu({
  position,
  children,
}: {
  position: "top" | "bottom";
  children: ReactNode;
}) {
  return (
    <div
      className={`absolute ${position == "top" ? "bottom-full" : "top-full"} left-1/2 -translate-x-1/2 rounded-md border border-ink/40 bg-cream-muted p-2 py-1 mb-0.5 text-[10px] flex justify-center items-center`}
    >
      <SpeechTriangle
        direction={position === "top" ? "down" : "up"}
        className={
          position === "top"
            ? "left-1/2 top-[calc(100%-1px)] -translate-x-1/2"
            : "left-1/2 bottom-[calc(100%-1px)] -translate-x-1/2"
        }
      />
      {children}
    </div>
  );
}
