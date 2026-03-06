import type { ReactNode } from "react";
import { TriangleAlert } from "lucide-react";
import { cn } from "@/lib/cn";
interface BaseStateProps { title: string; description: string; action?: ReactNode; minHeight?: string; }
export function LoadingState({ title, description, action, minHeight = "min-h-[320px]" }: BaseStateProps) {
  return <section className={cn("panel flex flex-col items-center justify-center gap-4 px-6 py-16 text-center", minHeight)}><div className="grid h-14 w-14 place-items-center rounded-full border border-white/10 bg-white/5"><div className="h-8 w-8 animate-spin rounded-full border-2 border-white/10 border-t-cyan-300" /></div><div className="space-y-2"><h2 className="text-2xl font-semibold text-slate-100">{title}</h2><p className="max-w-lg text-sm text-slate-400">{description}</p></div>{action}</section>;
}
export function ErrorState({ title, description, action, minHeight = "min-h-[320px]" }: BaseStateProps) {
  return <section className={cn("panel flex flex-col items-center justify-center gap-4 px-6 py-16 text-center", minHeight)}><div className="grid h-14 w-14 place-items-center rounded-full border border-rose-400/20 bg-rose-400/10"><TriangleAlert className="h-7 w-7 text-rose-200" /></div><div className="space-y-2"><h2 className="text-2xl font-semibold text-slate-100">{title}</h2><p className="max-w-lg text-sm text-slate-400">{description}</p></div>{action}</section>;
}
