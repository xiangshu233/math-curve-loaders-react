import { cn } from "@/lib/utils";

/** Matches Pixet `Crosshair.tsx`: centered +/− in a 12×12 box, `white/30`. */
export function Crosshair({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "pointer-events-none absolute z-20 flex h-3 w-3 items-center justify-center",
        className
      )}
    >
      <div className="absolute h-[1px] w-full bg-white/30" />
      <div className="absolute h-full w-[1px] bg-white/30" />
    </div>
  );
}
