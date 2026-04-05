import { cn } from "@/lib/utils";

export function Crosshair({ className }: { className?: string }) {
  return (
    <div className={cn("absolute w-3 h-3 pointer-events-none", className)}>
      <div className="absolute top-1/2 left-0 w-full h-[1px] bg-white/20 -translate-y-1/2" />
      <div className="absolute left-1/2 top-0 w-[1px] h-full bg-white/20 -translate-x-1/2" />
    </div>
  );
}
