import { Suspense, lazy, type LazyExoticComponent, type ComponentType } from "react";
import { createBrowserRouter, createHashRouter, createRoutesFromElements, Route } from "react-router-dom";
import { AppShell } from "@/app/layout/AppShell";
import { LoadingState } from "@/components/shared/StatePanel";

const DashboardPage = lazy(() => import("@/app/pages/Dashboard"));
const ArsenalPage = lazy(() => import("@/app/pages/Arsenal"));
const TopicMapPage = lazy(() => import("@/app/pages/TopicMap"));
const ErrorDiaryPage = lazy(() => import("@/app/pages/ErrorDiary"));
const FlashcardsPage = lazy(() => import("@/app/pages/Flashcards"));
const ExamsPage = lazy(() => import("@/app/pages/Exams"));
const FeynmanPage = lazy(() => import("@/app/pages/Feynman"));
const StudySessionsPage = lazy(() => import("@/app/pages/StudySessions"));
const OlympiadsPage = lazy(() => import("@/app/pages/Olympiads"));
const SettingsPage = lazy(() => import("@/app/pages/SettingsPage"));
const ProjectConfigPage = lazy(() => import("@/app/pages/ProjectConfigPage"));
const ReportPage = lazy(() => import("@/app/pages/ReportPage"));
const PageNotFound = lazy(() => import("@/app/pages/PageNotFound"));

function withSuspense(Component: LazyExoticComponent<ComponentType>) {
  return (
    <Suspense fallback={<LoadingState title="Carregando tela" description="Montando a pagina local solicitada." minHeight="min-h-[480px]" />}>
      <Component />
    </Suspense>
  );
}

const routes = createRoutesFromElements(
  <Route path="/" element={<AppShell />}>
    <Route index element={withSuspense(DashboardPage)} />
    <Route path="arsenal" element={withSuspense(ArsenalPage)} />
    <Route path="topic-map" element={withSuspense(TopicMapPage)} />
    <Route path="error-diary" element={withSuspense(ErrorDiaryPage)} />
    <Route path="flashcards" element={withSuspense(FlashcardsPage)} />
    <Route path="exams" element={withSuspense(ExamsPage)} />
    <Route path="feynman" element={withSuspense(FeynmanPage)} />
    <Route path="study-sessions" element={withSuspense(StudySessionsPage)} />
    <Route path="olympiads" element={withSuspense(OlympiadsPage)} />
    <Route path="settings" element={withSuspense(SettingsPage)} />
    <Route path="project-config" element={withSuspense(ProjectConfigPage)} />
    <Route path="report" element={withSuspense(ReportPage)} />
    <Route path="*" element={withSuspense(PageNotFound)} />
  </Route>,
);

const shouldUseHashRouter = typeof window !== "undefined" && window.location.protocol === "file:";

export const router = shouldUseHashRouter ? createHashRouter(routes) : createBrowserRouter(routes);