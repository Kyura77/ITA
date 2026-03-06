import React, { type ReactNode } from "react";
import ReactDOM from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "@/styles/globals.css";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 15_000,
      refetchOnWindowFocus: false,
    },
  },
});

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function formatError(error: unknown) {
  if (error instanceof Error) {
    return [error.name ? `${error.name}: ${error.message}` : error.message, error.stack].filter(Boolean).join("\n\n");
  }
  if (typeof error === "string") return error;
  try {
    return JSON.stringify(error, null, 2);
  } catch {
    return "Erro desconhecido durante a inicializacao do frontend.";
  }
}

function FatalScreen({ error }: { error: unknown }) {
  const detail = escapeHtml(formatError(error));

  return (
    <section style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: 32, background: "#07111a", color: "#e7f0fa", fontFamily: "'Segoe UI Variable Text','Segoe UI',sans-serif" }}>
      <div style={{ width: "min(920px, 100%)", border: "1px solid rgba(244,63,94,.24)", background: "rgba(15,23,42,.84)", borderRadius: 28, padding: 28, boxShadow: "0 30px 80px rgba(2,6,23,.45)" }}>
        <p style={{ margin: "0 0 10px", fontSize: 11, letterSpacing: ".22em", textTransform: "uppercase", color: "#fda4af" }}>fatal frontend error</p>
        <h1 style={{ margin: "0 0 12px", fontSize: 32, lineHeight: 1.1 }}>O frontend quebrou antes de montar.</h1>
        <p style={{ margin: "0 0 18px", fontSize: 15, lineHeight: 1.7, color: "#cbd5e1" }}>O localhost respondeu, mas a SPA falhou em runtime. O detalhe bruto está abaixo para debug objetivo.</p>
        <pre style={{ margin: 0, overflow: "auto", padding: 18, borderRadius: 20, background: "#020617", color: "#e2e8f0", fontSize: 13, lineHeight: 1.6, whiteSpace: "pre-wrap" }} dangerouslySetInnerHTML={{ __html: detail }} />
      </div>
    </section>
  );
}

class FatalBoundary extends React.Component<{ children: ReactNode }, { error: unknown }> {
  state: { error: unknown } = { error: null };

  static getDerivedStateFromError(error: unknown) {
    return { error };
  }

  componentDidCatch(error: unknown) {
    console.error("Fatal React render error", error);
  }

  render() {
    if (this.state.error) {
      return <FatalScreen error={this.state.error} />;
    }

    return this.props.children;
  }
}

function mountFatal(error: unknown) {
  const root = document.getElementById("root");
  if (!root) return;
  ReactDOM.createRoot(root).render(<FatalScreen error={error} />);
}

window.addEventListener("error", (event) => {
  mountFatal(event.error ?? event.message);
});

window.addEventListener("unhandledrejection", (event) => {
  mountFatal(event.reason);
});

async function bootstrap() {
  const [{ default: App }, { ThemeProvider }] = await Promise.all([
    import("@/app/App"),
    import("@/hooks/useTheme"),
  ]);

  ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
      <FatalBoundary>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider>
            <App />
          </ThemeProvider>
        </QueryClientProvider>
      </FatalBoundary>
    </React.StrictMode>,
  );
}

void bootstrap().catch((error) => {
  mountFatal(error);
});
