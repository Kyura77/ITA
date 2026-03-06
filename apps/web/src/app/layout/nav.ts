import type { LucideIcon } from "lucide-react";
import { BookOpen, Brain, ClipboardList, FileJson, FileText, LayoutDashboard, Medal, Network, Settings, Sparkles, Timer, TriangleAlert } from "lucide-react";
export interface NavItem { to: string; label: string; summary: string; icon: LucideIcon; }
export const navItems: NavItem[] = [
  { to: "/", label: "Dashboard", summary: "Visão geral, gargalos e quick actions", icon: LayoutDashboard },
  { to: "/arsenal", label: "Arsenal", summary: "Biblioteca, progresso e decks padrão", icon: BookOpen },
  { to: "/topic-map", label: "Mapa de Tópicos", summary: "Sequência, avanço e pré-requisitos", icon: Network },
  { to: "/error-diary", label: "Diário de Erros", summary: "Lacunas, análise e geração de cards", icon: TriangleAlert },
  { to: "/flashcards", label: "Flashcards", summary: "Revisão local e sincronização com Anki", icon: Sparkles },
  { to: "/exams", label: "Provas", summary: "Histórico de banca, tempo e acerto", icon: ClipboardList },
  { to: "/feynman", label: "Feynman", summary: "Explicação, feedback e aprovação por nota", icon: Brain },
  { to: "/study-sessions", label: "Sessões", summary: "Tempo acumulado, pomodoros e qualidade", icon: Timer },
  { to: "/olympiads", label: "Olimpíadas", summary: "Inscrições, fases e medalhas", icon: Medal },
  { to: "/settings", label: "Configurações", summary: "Tema, integrações e backup", icon: Settings },
  { to: "/project-config", label: "Config JSON", summary: "Editor do projeto em JSON", icon: FileJson },
  { to: "/report", label: "Relatório", summary: "Dossiê técnico e documentação local", icon: FileText },
];
export function getActiveNavItem(pathname: string) { return navItems.find((item) => (item.to === "/" ? pathname === "/" : pathname.startsWith(item.to))) ?? navItems[0]; }
