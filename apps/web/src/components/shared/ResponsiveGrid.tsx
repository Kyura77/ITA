import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

interface ResponsiveGridProps {
  children: ReactNode;
  cols?: {
    mobile?: number;
    tablet?: number;
    desktop?: number;
  };
  gap?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

const colsMap = {
  1: "grid-cols-1",
  2: "grid-cols-2",
  3: "grid-cols-3",
  4: "grid-cols-4",
  6: "grid-cols-6",
};

const gapMap = {
  sm: "gap-2",
  md: "gap-4",
  lg: "gap-6",
  xl: "gap-8",
};

export function ResponsiveGrid({
  children,
  cols = { mobile: 1, tablet: 2, desktop: 3 },
  gap = "md",
  className,
}: ResponsiveGridProps) {
  const mobileClass = cols.mobile ? colsMap[cols.mobile as keyof typeof colsMap] : "grid-cols-1";
  const tabletClass = cols.tablet ? `md:${colsMap[cols.tablet as keyof typeof colsMap]}` : "md:grid-cols-2";
  const desktopClass = cols.desktop ? `lg:${colsMap[cols.desktop as keyof typeof colsMap]}` : "lg:grid-cols-3";

  return (
    <div className={cn("grid", mobileClass, tabletClass, desktopClass, gapMap[gap], className)}>
      {children}
    </div>
  );
}
