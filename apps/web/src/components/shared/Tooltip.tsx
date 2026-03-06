import type { ReactNode } from "react";
import { useState } from "react";
import { cn } from "@/lib/cn";

interface TooltipProps {
  children: ReactNode;
  content: string;
  position?: "top" | "bottom" | "left" | "right";
  delay?: number;
}

export function Tooltip({
  children,
  content,
  position = "top",
  delay = 200,
}: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    const id = setTimeout(() => setIsVisible(true), delay);
    setTimeoutId(id);
  };

  const handleMouseLeave = () => {
    if (timeoutId) clearTimeout(timeoutId);
    setIsVisible(false);
  };

  const positionClasses = {
    top: "bottom-full mb-2 left-1/2 -translate-x-1/2",
    bottom: "top-full mt-2 left-1/2 -translate-x-1/2",
    left: "right-full mr-2 top-1/2 -translate-y-1/2",
    right: "left-full ml-2 top-1/2 -translate-y-1/2",
  };

  return (
    <div className="relative inline-block" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      {children}
      {isVisible && (
        <div
          className={cn(
            "absolute z-50 whitespace-nowrap rounded-lg bg-slate-900 px-3 py-2 text-xs text-slate-100 shadow-lg border border-slate-700 animate-fade-up",
            positionClasses[position],
          )}
        >
          {content}
          <div
            className={cn(
              "absolute w-2 h-2 bg-slate-900 border-slate-700",
              position === "top" && "top-full left-1/2 -translate-x-1/2 border-t border-l",
              position === "bottom" && "bottom-full left-1/2 -translate-x-1/2 border-b border-r",
              position === "left" && "left-full top-1/2 -translate-y-1/2 border-l border-b",
              position === "right" && "right-full top-1/2 -translate-y-1/2 border-r border-t",
            )}
          />
        </div>
      )}
    </div>
  );
}
