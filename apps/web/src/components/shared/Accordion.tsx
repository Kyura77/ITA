import { useState, type ReactNode } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/cn";

interface AccordionItem {
  id: string;
  title: string;
  content: ReactNode;
  icon?: ReactNode;
}

interface AccordionProps {
  items: AccordionItem[];
  allowMultiple?: boolean;
  defaultOpen?: string[];
}

export function Accordion({
  items,
  allowMultiple = false,
  defaultOpen = [],
}: AccordionProps) {
  const [openItems, setOpenItems] = useState<Set<string>>(new Set(defaultOpen));

  const toggleItem = (id: string) => {
    const newOpen = new Set(openItems);
    if (newOpen.has(id)) {
      newOpen.delete(id);
    } else {
      if (!allowMultiple) {
        newOpen.clear();
      }
      newOpen.add(id);
    }
    setOpenItems(newOpen);
  };

  return (
    <div className="space-y-2">
      {items.map((item) => (
        <div
          key={item.id}
          className="border border-white/10 rounded-lg overflow-hidden hover:border-white/20 transition-colors duration-200"
        >
          <button
            onClick={() => toggleItem(item.id)}
            className="w-full flex items-center justify-between px-4 py-3 bg-white/5 hover:bg-white/10 transition-colors duration-200"
          >
            <div className="flex items-center gap-3">
              {item.icon}
              <span className="font-medium text-slate-100">{item.title}</span>
            </div>
            <ChevronDown
              className={cn(
                "h-4 w-4 text-slate-400 transition-transform duration-300",
                openItems.has(item.id) && "rotate-180",
              )}
            />
          </button>
          {openItems.has(item.id) && (
            <div className="px-4 py-3 bg-slate-950/50 border-t border-white/10 animate-slide-in-top">
              {item.content}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
