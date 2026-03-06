const SPECIAL_LABELS: Record<string, string> = {
  nao_iniciado: "Nao iniciado",
  em_andamento: "Em andamento",
  base_concluida: "Base concluida",
  honra_ao_merito: "Honra ao merito",
  conta_incorreta: "Conta incorreta",
  conceito_errado: "Conceito errado",
  formula_esquecida: "Formula esquecida",
  mecanismo_nao_visto: "Mecanismo nao visto",
  aplicacao_incompleta: "Aplicacao incompleta",
  erro_recorrente: "Erro recorrente",
  reacao_quimica: "Reacao quimica",
  livro_exercicio: "Livro/exercicio",
  prova_afa: "Prova AFA",
  prova_ime: "Prova IME",
  prova_ita: "Prova ITA",
  ITA_1fase: "ITA 1a fase",
  ITA_2fase: "ITA 2a fase",
  IME_1fase: "IME 1a fase",
  IME_2fase: "IME 2a fase",
  "1fase": "1a fase",
  "2fase": "2a fase",
  "3fase": "3a fase",
};

export function humanizeEnum(value?: string | null) {
  if (!value) return "-";
  if (SPECIAL_LABELS[value]) return SPECIAL_LABELS[value];
  return value.replace(/_/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export function formatPercent(value?: number | null, digits = 0) {
  if (value == null || Number.isNaN(value)) return "-";
  return `${value.toFixed(digits)}%`;
}

export function formatScore(score?: number | null, scoreMax?: number | null) {
  if (score == null && scoreMax == null) return "-";
  if (scoreMax == null) return String(score ?? "-");
  return `${score ?? 0}/${scoreMax}`;
}

export function formatDate(value?: string | null) {
  if (!value) return "-";
  try {
    return new Date(`${value.slice(0, 10)}T00:00:00`).toLocaleDateString("pt-BR");
  } catch {
    return value;
  }
}

export function truncateText(value?: string | null, limit = 120) {
  if (!value) return "";
  return value.length > limit ? `${value.slice(0, limit - 1)}...` : value;
}

