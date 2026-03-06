import { FileText, Download } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";

const sections = [
  { title: "Visao geral", body: "Baseline em Base44, alvo local em monorepo React + Fastify + Prisma + SQLite." },
  { title: "Estrutura", body: "O projeto local se divide em apps/web e apps/api, com pages, components, hooks, services, prisma e rotas REST." },
  { title: "Regras criticas", body: "Book.status depende de progressPercent; Topic avanca por botao; Calculo depende de Matematica; Feynman aprova em nota >= 8; flashcards deduplicam por hash." },
  { title: "Integracoes", body: "IA e Anki nascem em stub, com proxies reais no backend para evitar CORS quando ativados." },
  { title: "Seed e backup", body: "Seed idempotente com 41 livros e 81 topicos. Export/Import JSON preservam ids por upsert." },
];

export default function ReportPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Relatorio Tecnico"
        subtitle="Resumo navegavel do dossie tecnico original e acesso ao markdown integral para download local."
        icon={FileText}
        actions={<a className="btn-primary" href="/report-full.md" download><Download className="h-4 w-4" />Baixar .md</a>}
      />

      <div className="grid gap-4 xl:grid-cols-[280px,1fr]">
        <aside className="panel p-4">
          <p className="text-xs uppercase tracking-[0.18em] text-cyan-300">Secoes</p>
          <nav className="mt-4 space-y-2">
            {sections.map((section) => (
              <a key={section.title} className="block rounded-xl border border-slate-800 px-3 py-3 text-sm text-slate-300 transition hover:border-cyan-500/40 hover:bg-slate-900/80" href={`#${section.title.toLowerCase().replace(/\s+/g, "-")}`}>
                {section.title}
              </a>
            ))}
          </nav>
        </aside>

        <div className="space-y-4">
          {sections.map((section) => (
            <section key={section.title} id={section.title.toLowerCase().replace(/\s+/g, "-")} className="panel p-5">
              <p className="text-xs uppercase tracking-[0.18em] text-cyan-300">{section.title}</p>
              <p className="mt-4 text-sm leading-7 text-slate-300">{section.body}</p>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
