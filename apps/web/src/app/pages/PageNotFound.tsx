import { Link } from "react-router-dom";

export default function PageNotFound() {
  return (
    <div className="panel flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
      <p className="text-xs uppercase tracking-[0.24em] text-cyan-300">404</p>
      <h1 className="text-3xl font-semibold text-slate-100">Pagina nao encontrada</h1>
      <p className="max-w-lg text-sm text-slate-400">A rota solicitada nao existe no fluxo atual do projeto.</p>
      <Link to="/" className="btn-primary">Voltar ao Dashboard</Link>
    </div>
  );
}
