import { useState, type ReactNode } from "react";
import { cn } from "@/lib/cn";

interface Tab {
  id: string;
  label: string;
  content: ReactNode;
  icon?: ReactNode;
}

interface TabsProps {
  tabs: Tab[];
  defaultTab?: string;
  onChange?: (tabId: string) => void;
  variant?: "default" | "pills";
}

export function Tabs({
  tabs,
  defaultTab,
  onChange,
  variant = "default",
}: TabsProps) {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id);

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    onChange?.(tabId);
  };

  return (
    <div className="space-y-4">
      <div
        className={cn(
          "flex gap-2",
          variant === "pills" && "flex-wrap",
        )}
      >
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleTabChange(tab.id)}
            className={cn(
              "inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200",
              activeTab === tab.id
                ? "bg-cyan-400/20 text-cyan-200 border border-cyan-400/30"
                : "text-slate-400 hover:text-slate-200 border border-transparent hover:bg-white/5",
              variant === "pills" && "rounded-full",
            )}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>
      <div className="animate-fade-up">
        {tabs.find((tab) => tab.id === activeTab)?.content}
      </div>
    </div>
  );
}
