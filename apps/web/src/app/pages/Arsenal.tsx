import { useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { BookOpen } from "lucide-react";
import { toast } from "sonner";
import { BookCard } from "@/components/arsenal/BookCard";
import { BookFormDialog } from "@/components/arsenal/BookFormDialog";
import { EmptyState } from "@/components/shared/EmptyState";
import { PageHeader } from "@/components/shared/PageHeader";
import { ErrorState, LoadingState } from "@/components/shared/StatePanel";
import { StatusPill } from "@/components/shared/StatusPill";
import { humanizeEnum } from "@/lib/labels";
import { api, ApiError } from "@/services/apiClient";
import type { Book } from "@/types/entities";

export default function ArsenalPage() {
  const queryClient = useQueryClient();
  const [filters, setFilters] = useState({ subject: "", phase: "", status: "", priority: "", q: "" });
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Book | null>(null);

  const booksQuery = useQuery({ queryKey: ["books", filters], queryFn: () => api.get<Book[]>("/books", filters) });

  const books = booksQuery.data ?? [];
  const hasFilters = useMemo(() => Object.values(filters).some(Boolean), [filters]);
  const completed = books.filter((book) => book.status === "concluido").length;
  const active = books.filter((book) => book.status === "em_andamento").length;
  const essentials = books.filter((book) => book.priority === "essencial").length;
  const averageProgress = books.length ? Math.round(books.reduce((sum, book) => sum + book.progressPercent, 0) / books.length) : 0;

  const reload = async () => {
    await queryClient.invalidateQueries({ queryKey: ["books"] });
  };

  const handleSave = async (payload: Omit<Book, "id" | "status"> & Record<string, unknown>) => {
    try {
      if (editing) {
        await api.patch(`/books/${editing.id}`, payload);
        toast.success("Livro atualizado.");
      } else {
        await api.post("/books", payload);
        toast.success("Livro criado.");
      }
      setEditing(null);
      await reload();
    } catch (error) {
      toast.error(error instanceof ApiError ? error.message : "Falha ao salvar livro.");
    }
  };

  const handleDelete = async (book: Book) => {
    try {
      await api.delete(`/books/${book.id}`);
      toast.success("Livro deletado.");
      setEditing(null);
      await reload();
    } catch (error) {
      toast.error(error instanceof ApiError ? error.message : "Falha ao deletar livro.");
    }
  };

  if (booksQuery.isLoading && booksQuery.data === undefined) {
    return <LoadingState title="Carregando arsenal" description="Lendo livros locais, progresso e prioridades para montar a frente de estudo." />;
  }

  if (booksQuery.isError && booksQuery.data === undefined) {
    return <ErrorState title="Falha ao carregar o arsenal" description={booksQuery.error instanceof Error ? booksQuery.error.message : "A API local nao respondeu como esperado."} action={<button type="button" className="btn-primary" onClick={() => void booksQuery.refetch()}>Tentar novamente</button>} />;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Arsenal"
        subtitle="Seu estoque de livros precisa responder a prioridade real do plano, nao virar uma lista sem dono. Aqui o foco e enxergar progresso, gargalo e cobertura de base."
        icon={BookOpen}
        actions={<>{hasFilters ? <button type="button" className="btn-secondary" onClick={() => setFilters({ subject: "", phase: "", status: "", priority: "", q: "" })}>Limpar filtros</button> : null}<button type="button" className="btn-primary" onClick={() => { setEditing(null); setDialogOpen(true); }}>Novo livro</button></>}
      />

      <div className="grid gap-3 md:grid-cols-4">
        <StatusPill label="Catalogo" value={`${books.length} livros`} tone="slate" />
        <StatusPill label="Essenciais" value={`${essentials} itens`} tone={essentials ? "amber" : "slate"} />
        <StatusPill label="Em andamento" value={`${active} frentes`} tone={active ? "cyan" : "slate"} />
        <StatusPill label="Media" value={`${averageProgress}%`} tone={averageProgress >= 70 ? "emerald" : averageProgress >= 35 ? "cyan" : "amber"} />
      </div>

      <section className="panel grid gap-3 p-4 md:grid-cols-6">
        <input className="input md:col-span-2" placeholder="Buscar por titulo ou autor" value={filters.q} onChange={(event) => setFilters({ ...filters, q: event.target.value })} />
        <select className="select" value={filters.subject} onChange={(event) => setFilters({ ...filters, subject: event.target.value })}><option value="">Materia</option><option value="matematica">Matematica</option><option value="fisica">Fisica</option><option value="quimica">Quimica</option><option value="calculo">Calculo</option><option value="geral">Geral</option></select>
        <select className="select" value={filters.phase} onChange={(event) => setFilters({ ...filters, phase: event.target.value })}><option value="">Fase</option><option value="base">Base</option><option value="aprofundamento">Aprofundamento</option></select>
        <select className="select" value={filters.priority} onChange={(event) => setFilters({ ...filters, priority: event.target.value })}><option value="">Prioridade</option><option value="essencial">Essencial</option><option value="recomendado">Recomendado</option><option value="opcional">Opcional</option></select>
        <select className="select" value={filters.status} onChange={(event) => setFilters({ ...filters, status: event.target.value })}><option value="">Status</option><option value="nao_iniciado">{humanizeEnum("nao_iniciado")}</option><option value="em_andamento">{humanizeEnum("em_andamento")}</option><option value="concluido">Concluido</option></select>
      </section>

      {books.length ? (<><section className="panel p-5"><div className="flex flex-wrap items-center justify-between gap-3"><div><p className="text-[10px] uppercase tracking-[0.22em] text-slate-500">leituras em rota</p><h2 className="mt-2 text-2xl font-semibold text-slate-100">Mapa do arsenal</h2></div><div className="text-sm text-slate-400">{completed} concluidos | {active} em andamento</div></div></section><div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{books.map((book) => <BookCard key={book.id} book={book} onEdit={(item) => { setEditing(item); setDialogOpen(true); }} onDelete={(item) => void handleDelete(item)} />)}</div></>) : <EmptyState title={hasFilters ? "Nenhum livro encontrado" : "Arsenal vazio"} description={hasFilters ? "Ajuste os filtros ou limpe a busca para voltar a enxergar seus livros." : "Crie o primeiro livro ou rode o seed inicial a partir do dashboard."} action={<button type="button" className="btn-primary" onClick={() => setDialogOpen(true)}>Criar primeiro livro</button>} />}

      <BookFormDialog open={dialogOpen} onOpenChange={setDialogOpen} book={editing} onSave={handleSave} onDelete={handleDelete} />
    </div>
  );
}
