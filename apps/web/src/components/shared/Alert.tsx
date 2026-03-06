import type { ReactNode } from "react";
import { AlertCircle, CheckCircle, InfoIcon, AlertTriangle, X } from "lucide-react";
import { cn } from "@/lib/cn";

interface AlertProps {
  type?: "info" | "success" | "warning" | "error";
  title?: string;
  message: string;
  icon?: ReactNode;
  onClose?: () => void;
  action?: ReactNode;
}

const typeMap = {
  info: {
    icon: InfoIcon,
    bg: "bg-blue-400/10",
    border: "border-blue-400/30",
    text: "text-blue-200",
    title: "text-blue-100",
  },
  success: {
    icon: CheckCircle,
    bg: "bg-emerald-400/10",
    border: "border-emerald-400/30",
    text: "text-emerald-200",
    title: "text-emerald-100",
  },
  warning: {
    icon: AlertTriangle,
    bg: "bg-amber-400/10",
    border: "border-amber-400/30",
    text: "text-amber-200",
    title: "text-amber-100",
  },
  error: {
    icon: AlertCircle,
    bg: "bg-rose-400/10",
    border: "border-rose-400/30",
    text: "text-rose-200",
    title: "text-rose-100",
  },
};

export function Alert({
  type = "info",
  title,
  message,
  icon,
  onClose,
  action,
}: AlertProps) {
  const config = typeMap[type];
  const Icon = icon || config.icon;

  return (
    <div
      className={cn(
        "rounded-lg border p-4 animate-slide-in-top",
        config.bg,
        config.border,
      )}
    >
      <div className="flex gap-4">
        <Icon className={cn("h-5 w-5 shrink-0 mt-0.5", config.text)} />
        <div className="flex-1">
          {title && <h3 className={cn("font-semibold", config.title)}>{title}</h3>}
          <p className={cn("text-sm", config.text)}>{message}</p>
          {action && <div className="mt-3">{action}</div>}
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className={cn("btn-ghost", config.text)}
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
}
