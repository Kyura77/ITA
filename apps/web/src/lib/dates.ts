export function formatDate(value?: string | null) {
  if (!value) return "-";
  return new Intl.DateTimeFormat("pt-BR").format(new Date(`${value}T00:00:00`));
}

export function formatDateTime(value?: string | null) {
  if (!value) return "-";
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(value));
}

export function daysUntil(value?: string | null) {
  if (!value) return null;
  const today = new Date();
  const target = new Date(`${value}T00:00:00`);
  const diff = target.getTime() - new Date(today.toDateString()).getTime();
  return Math.ceil(diff / 86_400_000);
}
