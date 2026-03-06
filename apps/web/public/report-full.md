# RELÁTORIO TÉCNICO (REPORT\_FULL):

\# 1. Visão Geral do Projeto





\*\*Nome:\*\* ITA Prep  

\*\*Propósito:\*\* Plataforma de preparação para o ITA (Instituto Tecnológico de Aeronáutica) e concursos militares correlatos (IME, AFA). Plano de 3 anos.



\### Stack com Versões Exatas



| Tecnologia | Versão |

|-----------|--------|

| React | 18.2.0 |

| Vite (@base44/vite-plugin) | ^0.2.29 |

| Tailwind CSS | ~3.x |

| @tanstack/react-query | ^5.84.1 |

| react-router-dom | ^6.26.0 |

| recharts | ^2.15.4 |

| framer-motion | ^11.16.4 |

| lucide-react | ^0.475.0 |

| sonner | ^2.0.1 |

| @base44/sdk | ^0.8.18 |

| shadcn/ui (Radix UI) | vários ^1.x |

| date-fns | ^3.6.0 |

| react-hook-form | ^7.54.2 |

| react-markdown | ^9.0.1 |

| @hello-pangea/dnd | ^17.0.0 |



\### Fases de Desenvolvimento



| Fase | Commit | Descrição | Status |

|------|--------|-----------|--------|

| Phase 1 | `phase/1-shell` | Layout, sidebar, routing, tema dark/light | ✅ |

| Phase 2 | `phase/2-entities` | Schemas de todas as entidades | ✅ |

| Phase 3 | `phase/3-seed` | 41 livros + 81 tópicos, seed idempotente | ✅ |

| Phase 4 | `phase/4-arsenal` | Arsenal de livros com BookCard e CRUD | ✅ |

| Phase 5 | `phase/5-topicmap` | Mapa de tópicos tabela + kanban + FormDialog | ✅ |

| Phase 6 | `phase/6-errors-cards` | Diário de erros, flashcards, Feynman | ✅ |

| Phase 7 | `phase/7-exams` | Provas, olimpíadas, sessões de estudo | ✅ |

| Phase 8 | `phase/8-dashboard` | Dashboard com métricas, backup, configurações | ✅ |





---



\# 2. Estrutura de Pastas Completa





Cada arquivo e sua responsabilidade:



```

pages/

&nbsp; Dashboard.jsx          Painel principal com métricas e gráficos

&nbsp; TopicMap.jsx           Mapa de tópicos (tabela + kanban), CRUD completo

&nbsp; Arsenal.jsx            Arsenal de livros com filtros

&nbsp; ErrorDiary.jsx         Diário de erros conceituais + análise IA

&nbsp; Flashcards.jsx         Gestão de flashcards + sync Anki

&nbsp; Feynman.jsx            Avaliação pelo método Feynman + IA

&nbsp; Exams.jsx              Registro e análise de provas

&nbsp; StudySessions.jsx      Registro de sessões de estudo (pomodoro)

&nbsp; Olympiads.jsx          Registro de olimpíadas

&nbsp; SettingsPage.jsx       Configurações, tema, integrações, backup

&nbsp; ProjectConfigPage.jsx  Config JSON do projeto

&nbsp; ReportPage.jsx         Este relatório técnico



components/

&nbsp; arsenal/

&nbsp;   BookCard.jsx         Card de livro com badges status/fase/prioridade

&nbsp;   BookFormDialog.jsx   Dialog CRUD completo de livro

&nbsp; errors/

&nbsp;   ErrorCard.jsx        Card de erro com badge de severidade

&nbsp;   ErrorFormDialog.jsx  Dialog CRUD + botão "Analisar com IA"

&nbsp; exams/

&nbsp;   ExamCard.jsx         Card de prova com scores e percentuais

&nbsp;   ExamFormDialog.jsx   Dialog CRUD de prova

&nbsp; flashcards/

&nbsp;   FlashcardItem.jsx    Card flip frente/verso

&nbsp;   FlashcardFormDialog.jsx Dialog CRUD + sync Anki

&nbsp; layout/

&nbsp;   Header.jsx           Header com busca e toggle de tema

&nbsp;   Sidebar.jsx          Sidebar colapsável com todos os nav items

&nbsp; seed/

&nbsp;   seedBooks.js         SEED\_BOOKS (41 livros) + SEED\_TOPICS (81 tópicos)

&nbsp;   useSeed.js           Hook de seed idempotente com batches

&nbsp; shared/

&nbsp;   EmptyState.jsx       Estado vazio reutilizável

&nbsp;   PageHeader.jsx       Cabeçalho de página com breadcrumbs e actions

&nbsp;   StatCard.jsx         Card de estatística com gradiente e trend

&nbsp; topics/

&nbsp;   TopicFormDialog.jsx  Dialog CRUD completo — edição sem restrição de status

&nbsp;   TopicKanban.jsx      Kanban board com 5 colunas de status

&nbsp;   TopicRow.jsx         Linha de tabela de tópico

&nbsp; ui/                    shadcn/ui — não editar manualmente



entities/               JSON schemas (Base44 BaaS)

&nbsp; Book.json

&nbsp; Topic.json

&nbsp; ConceptualError.json

&nbsp; Flashcard.json

&nbsp; Exam.json

&nbsp; FeynmanSession.json

&nbsp; StudySession.json

&nbsp; Olympiad.json

&nbsp; AppSettings.json

&nbsp; ProjectConfig.json



lib/

&nbsp; PageNotFound.jsx       Página 404

&nbsp; utils.js               cn(), createPageUrl()

```





---



\# 3. Variáveis CSS do Tema





Definidas em `globals.css` via `@layer base`.



\### CSS Variables — Dark / Light



| Variável | Light | Dark | Uso |

|---|---|---|---|

| `--background` | `0 0% 100%` | `222.2 84% 4.9%` | body, cards, dialogs |

| `--foreground` | `222.2 47.4% 11.2%` | `210 40% 98%` | textos primários |

| `--card` | `0 0% 100%` | `222.2 84% 4.9%` | Card, BookCard, StatCard |

| `--primary` | `221.2 83.2% 53.3%` | `217.2 91.2% 59.8%` | Button default |

| `--secondary` | `210 40% 96.1%` | `217.2 32.6% 17.5%` | Badge secondary |

| `--muted` | `210 40% 96.1%` | `217.2 32.6% 17.5%` | placeholders |

| `--muted-foreground` | `215.4 16.3% 46.9%` | `215 20.2% 65.1%` | texto secundário |

| `--destructive` | `0 84.2% 60.2%` | `0 62.8% 30.6%` | botões de delete |

| `--border` | `214.3 31.8% 91.4%` | `217.2 32.6% 17.5%` | divisores, inputs |

| `--ring` | `221.2 83.2% 53.3%` | `224.3 76.3% 48%` | focus rings |

| `--radius` | `0.5rem` | `0.5rem` | border-radius global |



\### Classes Tailwind Adicionais (aplicadas diretamente)



| Classe | Uso |

|---|---|

| `bg-cyan-600 / hover:bg-cyan-700` | Botões primários de ação |

| `text-cyan-500` | Ícones de PageHeader, links hover |

| `bg-slate-950` | Fundo da sidebar |

| `bg-slate-900` | Fundo de cards no dark mode |

| `border-slate-800` | Bordas no dark mode |

| `dark:bg-slate-800/30` | Hover de rows na tabela |

| `dark:bg-slate-800/50` | Quick access cards no dashboard |



\### Toggle de Tema



```javascript

// Header.jsx — toggle

localStorage.setItem("ita-theme", newTheme);

document.documentElement.classList.toggle("dark", newTheme === "dark");



// Layout.js — inicialização

const saved = localStorage.getItem("ita-theme") || "dark";

document.documentElement.classList.toggle("dark", saved === "dark");

```





---



\# 4. Entidades do Banco





Todos os registros possuem campos built-in automáticos: `id` (UUID), `created\_date` (ISO), `updated\_date` (ISO), `created\_by` (email).



---



\### Book



| Campo | Tipo TS | Enum Values | Default | Required |

|---|---|---|---|---|

| title | string | — | — | ✅ |

| author | string | — | — | ✅ |

| subject | string | matematica / fisica / quimica / calculo / geral | geral | — |

| phase | string | base / aprofundamento | — | ✅ |

| priority | string | essencial / recomendado / opcional | recomendado | — |

| status | string | nao\_iniciado / em\_andamento / concluido | nao\_iniciado | — |

| progressPercent | number | 0–100 | 0 | — |

| notes | string | — | — | — |

| defaultAnkiDeck | string | — | — | — |

| recommendedOrder | string | — | — | — |



\*\*Relações:\*\* ← `Topic.bookBaseId`, ← `Topic.bookAdvancedId`, ← `StudySession.bookId`, ← `Flashcard.bookId`, ← `ConceptualError.bookId`



---



\### Topic



| Campo | Tipo TS | Enum Values | Default | Required |

|---|---|---|---|---|

| subject | string | matematica / fisica / quimica / calculo / geral | — | ✅ |

| area | string | — | — | ✅ |

| topic | string | — | — | ✅ |

| subtopic | string | — | — | — |

| bookBaseId | string (FK→Book) | — | — | — |

| bookAdvancedId | string (FK→Book) | — | — | — |

| status | string | nao\_iniciado / em\_andamento / base\_concluida / aprofundando / dominado | nao\_iniciado | — |

| yearPlan | number | 1 / 2 / 3 | 1 | — |

| priorityIta | string | baixa / media / alta / critica | media | — |

| startDate | string (date) | — | — | — |

| lastReviewedAt | string (date) | — | — | — |

| totalStudyMinutes | number | — | 0 | — |

| forOlympiad | boolean | — | false | — |

| ankiDeck | string | — | — | — |

| notes | string | — | — | — |

| prerequisites | string | CSV de Topic IDs | — | — |



\*\*⚠️ REGRA CRÍTICA:\*\* `allStatusesEditable = true` — status NUNCA bloqueia edição. Qualquer tópico em qualquer status pode ser editado via `TopicFormDialog`.



\*\*Regras de Avanço de Status (botão Avançar):\*\*

\- `nao\_iniciado → em\_andamento`: seta `startDate = today` se vazio + `lastReviewedAt = today`

\- Qualquer outro avanço: seta `lastReviewedAt = today`

\- Cálculo: requer tópicos de Matemática do mesmo `yearPlan` com status ≥ `base\_concluida`



---



\### StudyPlan \*(a criar — schema documentado)\*



| Campo | Tipo | Default | Required |

|---|---|---|---|

| startYear | number | — | ✅ |

| currentYear | 1 | 2 | 3 | 1 | ✅ |

| targetExamYear | number | — | ✅ |

| dailyStudyHours | number | 6 | — |

| weeklyProblemGoal | number | 50 | — |

| reviewFrequency | daily / weekly / biweekly | weekly | — |

| active | boolean | true | — |



---



\### ConceptualError



| Campo | Tipo TS | Enum Values | Required |

|---|---|---|---|

| date | string (date) | — | — |

| topicId | string (FK→Topic) | — | — |

| bookId | string (FK→Book) | — | — |

| descriptionGap | string | — | ✅ |

| context | string | — | ✅ |

| source | string | livro\_exercicio / prova\_afa / prova\_ime / prova\_ita / simulado / olimpiada | ✅ |

| gapType | string | conceito\_errado / formula\_esquecida / mecanismo\_nao\_visto / conta\_incorreta / aplicacao\_incompleta / outro | ✅ |

| severity | string | leve / moderada / grave | ✅ |

| resolved | boolean | — (default false) | — |

| iaAnalysis | string | Markdown gerado pela IA | — |

| cardsGenerated | boolean | — (default false) | — |



---



\### Flashcard



| Campo | Tipo TS | Enum Values | Required |

|---|---|---|---|

| topicId | string (FK→Topic) | — | — |

| bookId | string (FK→Book) | — | — |

| errorId | string (FK→ConceptualError) | — | — |

| front | string | — | ✅ |

| back | string | — | ✅ |

| type | string | conceito / formula / reacao\_quimica / nomenclatura / mecanismo / erro\_recorrente | ✅ |

| origin | string | ia\_gerada / manual | ✅ |

| ankiNoteId | number | — | — |

| ankiDeck | string | — | ✅ |

| synced | boolean | — (default false) | — |



\*\*Idempotência:\*\* `hash = djb2(front + back + ankiDeck)` — não criar se hash já existe.



---



\### Exam



| Campo | Tipo TS | Enum/Notes | Required |

|---|---|---|---|

| name | string | — | ✅ |

| board | string | AFA / IME\_1fase / IME\_2fase / ITA\_1fase / ITA\_2fase / FUVEST / UNICAMP / OBMEP / OBF / OBQ | ✅ |

| year | number | — | ✅ |

| \*\*recommendedPeriodStartYear\*\* | number | Calculado: `percentCorrect < 50%` → 1985, `50–70%` → 2000, `>70%` → 2009 | — |

| dateReal | string (date) | — | — |

| timeAvailableMin | number | — | — |

| timeUsedMin | number | — | — |

| percentTime | number | (timeUsed/timeAvailable)×100 | — |

| score | number | — | — |

| scoreMax | number | — | — |

| percentCorrect | number | (score/scoreMax)×100 | — |

| status | string | planejada / realizada | — |

| notes | string | — | — |



---



\### FeynmanSession



| Campo | Tipo | Required |

|---|---|---|

| topicId | FK→Topic | — |

| topicName | string | ✅ |

| explanation | string | ✅ |

| iaScore | number (0–10) | — |

| iaFeedback | string (Markdown) | — |

| approved | boolean (default false) | — |

| attemptNumber | number (default 1) | — |

| date | string (date) | — |



---



\### StudySession



| Campo | Tipo | Enum | Required |

|---|---|---|---|

| topicId | FK→Topic | — | — |

| topicName | string | — | ✅ |

| bookId | FK→Book | — | — |

| date | string (date) | — | — |

| durationMinutes | number | — | ✅ |

| pomodoroCount | number | — (default 0) | — |

| type | string | teoria / exercicios / revisao / prova / olimpiada | — |

| notes | string | — | — |

| quality | number | 1 / 2 / 3 / 4 / 5 | — |



---



\### Olympiad



| Campo | Tipo | Enum | Required |

|---|---|---|---|

| name | string | — | ✅ |

| type | string | OBMEP / OBF / OBQ / OBM / OBI / OBFEP / outra | ✅ |

| year | number | — | ✅ |

| phase | string | 1fase / 2fase / 3fase / final | — |

| date | string (date) | — | — |

| score | number | — | — |

| scoreMax | number | — | — |

| medal | string | nenhuma / honra\_ao\_merito / bronze / prata / ouro | — |

| status | string | inscrito / realizada / resultado | — |

| notes | string | — | — |



---



\### AppSettings (singleton)



| Campo | Tipo | Default |

|---|---|---|

| theme | light / dark | dark |

| pomodoroWork | number | 25 |

| pomodoroBreak | number | 5 |

| pomodoroLongBreak | number | 15 |

| pomodoroSetsBeforeLong | number | 4 |

| ollamaUrl | string | http://localhost:11434 |

| ollamaModel | string | qwen2.5:14b |

| ankiConnectUrl | string | http://localhost:8765 |

| seeded | boolean | false |





---



\# 5. Seed Completo — Algoritmo e Dados





\### Algoritmo de Seed Idempotente



```

FUNÇÃO checkAndSeed():

&nbsp; PASSO 1: settings = AppSettings.list()

&nbsp;          SE settings\[0].seeded == true → RETURN (já concluído)



&nbsp; PASSO 2: existingBooks = Book.list()

&nbsp;          SE existingBooks.length > 0:

&nbsp;            AppSettings.update({ seeded: true })

&nbsp;            RETURN (dados existem, marcar como seeded)



&nbsp; PASSO 3: setSeeding(true)



&nbsp; PASSO 4: FOR i=0 TO 41 STEP 10:   // batches de 10

&nbsp;            Book.bulkCreate(SEED\_BOOKS\[i..i+10])



&nbsp; PASSO 5: FOR i=0 TO 81 STEP 15:   // batches de 15

&nbsp;            Topic.bulkCreate(SEED\_TOPICS\[i..i+15])



&nbsp; PASSO 6: AppSettings.create({ seeded: true, theme: "dark" })



&nbsp; PASSO 7: setSeeding(false), setSeeded(true)



ORDEM DE INSERÇÃO: Books primeiro (pré-requisito para FKs dos Topics)

ROLLBACK: Sem transação atômica. Falha → re-execução detecta books

&nbsp;         existentes no PASSO 2 e marca seeded (aceita seed parcial).

```



\*\*Logs esperados no console:\*\*

```

\[useSeed] Checking seed status...

\[useSeed] No books found. Starting seed...

\[useSeed] Seeding books batch 1/5 (10 books)

\[useSeed] Seeding books batch 2/5 (10 books)

\[useSeed] Seeding books batch 3/5 (10 books)

\[useSeed] Seeding books batch 4/5 (10 books)

\[useSeed] Seeding books batch 5/5 (1 book)

\[useSeed] Seeding topics batch 1/6 (15 topics)

...

\[useSeed] Seed complete. 41 books, 81 topics inserted.

```



---



\### Distribuição do Seed



| Matéria | Livros | Fase Base | Fase Aprofundamento | Tópicos |

|---|---|---|---|---|

| Matemática | 14 | 9 | 5 | 35 |

| Física | 10 | 7 | 3 | 23 |

| Química | 7 | 4 | 3 | 18 |

| Cálculo | 4 | 3 | 1 | 5 |

| Geral | 6 | 4 | 2 | — |

| \*\*Total\*\* | \*\*41\*\* | \*\*27\*\* | \*\*14\*\* | \*\*81\*\* |



---



\### Lista de Livros (41)



\*\*Matemática — Base (9):\*\* FME Vol. 1-7, 9, 10 (Gelson Iezzi)



\*\*Matemática — Aprofundamento (5):\*\* Geometria Euclidiana Plana (Barbosa), Curso de Análise Vol.1 (Elon), Problemas Selecionados (IMPA/Moreira), Números e Funções Reais (Elon), Resolução IME/ITA (Tábuas do IME)



\*\*Física — Base (7):\*\* Tópicos de Física Vol.1-3 (Gualter), Fundamentos de Física Vol.1-4 (Halliday)



\*\*Física — Aprofundamento (3):\*\* Irodov (2x), Berkeley Physics (Kittel)



\*\*Química — Base (4):\*\* Feltre Vol.1-3, Atkins (Princípios de Química)



\*\*Química — Aprofundamento (3):\*\* Shriver \& Atkins, Clayden (Organic Chemistry), Listas ITA/IME



\*\*Cálculo — Base (3):\*\* Stewart Vol.1, Leithold Vol.1, Guidorizzi Vol.1



\*\*Cálculo — Aprofundamento (1):\*\* Stewart Vol.2



\*\*Geral — Base (4):\*\* Redação Militar, Inglês Instrumental, Português, Resolução AFA



\*\*Geral — Aprofundamento (2):\*\* Resolução Provas ITA (1990–2024), Resolução Provas IME (2000–2024)



---



\### Tópicos por Área — Matemática (35)



Conjuntos e Lógica (2) · Funções (5) · Trigonometria (4) · Sequências (3) · Análise Combinatória (3) · Probabilidade (2) · Números Complexos (2) · Polinômios (2) · Geometria Analítica (3) · Geometria Plana (4) · Geometria Espacial (3) · Matrizes e Sistemas (2)



\### Tópicos por Área — Física (23)



Mecânica (8) · Termologia (3) · Ondas (2) · Óptica (2) · Eletricidade (3) · Eletromagnetismo (2) · Física Moderna (3)



\### Tópicos por Área — Química (18)



Química Geral (5) · Físico-Química (6) · Química Orgânica (5) · Química Inorgânica (3)



\### Tópicos por Área — Cálculo (5)



Cálculo Diferencial (2) · Cálculo Integral (2) · Séries (1)





---



\# 6. Inventário Completo de Componentes React





\### pages/Dashboard.jsx



| Aspecto | Detalhe |

|---|---|

| Responsabilidade | Painel principal com estatísticas e acesso rápido |

| Props | nenhuma |

| Hooks | `useSeed()`, `useQuery` ×6 |

| Entidades | Book, Topic, ConceptualError, StudySession, Flashcard, Exam |

| Estado local | nenhum (tudo via queries) |

| Gráfico | BarChart recharts — total vs dominado por matéria |

| Condicional | Se `seeding=true` → mostra spinner centralizado |



---



\### pages/TopicMap.jsx



| Aspecto | Detalhe |

|---|---|

| Props | nenhuma |

| State | search, subjectFilter, yearFilter, priorityFilter, view, dialogOpen, editingTopic |

| Mutations | updateMutation, createMutation |

| Funções | advanceStatus(topic), handleOpenEdit(topic), handleOpenNew(), handleSave(form) |

| Views | table (TopicRow em `<table>`) / kanban (TopicKanban) |

| Regra Cálculo | Avançar `nao\_iniciado→em\_andamento` requer Matemática yearPlan ≥ `base\_concluida` |



---



\### components/topics/TopicRow.jsx



| Prop | Tipo | Descrição |

|---|---|---|

| topic | Topic | Dados do tópico |

| onAdvance | () => void | Chamar ao clicar em avançar |

| onEdit | () => void | Chamar ao clicar em editar |



\*\*Comportamento:\*\* Botão Editar \*\*sempre visível\*\* (todos os status). Botão Avançar oculto apenas quando `status === "dominado"`.



---



\### components/topics/TopicKanban.jsx



| Prop | Tipo | Descrição |

|---|---|---|

| topics | Topic\[] | Lista de tópicos filtrados |

| onAdvance | (topic) => void | Handler de avanço |

| onEdit | (topic) => void | Handler de edição |

| statusLabels? | Record<string,string> | Labels opcionais |



\*\*Colunas:\*\* nao\_iniciado · em\_andamento · base\_concluida · aprofundando · dominado  

\*\*Hover:\*\* botões aparecem com `group-hover:opacity-100`



---



\### components/topics/TopicFormDialog.jsx



| Prop | Tipo | Descrição |

|---|---|---|

| open | boolean | Controla visibilidade |

| onOpenChange | (v: boolean) => void | Toggle |

| topic | Topic | null | null = novo, Topic = edição |

| onSave | (form) => void | Callback de save |



\*\*Effect:\*\* `useEffect(\[topic, open])` → reseta form com dados do tópico ou EMPTY  

\*\*Campos:\*\* subject, yearPlan, area, topic, subtopic, status, priorityIta, ankiDeck, notes  

\*\*⚠️ Nenhum status bloqueia edição — `allStatusesEditable = true`\*\*



---



\### components/seed/useSeed.js



| Retorno | Tipo | Descrição |

|---|---|---|

| seeding | boolean | true durante o processo de seed |

| seeded | boolean | null | null=não checou, false=falhou, true=ok |



\*\*Effect:\*\* Executa `checkAndSeed()` on mount via `useEffect(\[], \[])`



---



\### pages/SettingsPage.jsx



| Aspecto | Detalhe |

|---|---|

| State | form (theme, pomodoroWork/Break/LongBreak/SetsBeforeLong, ollamaUrl, ollamaModel, ankiConnectUrl) |

| Effect | `useEffect(\[settings.id])` → preenche form com dados salvos |

| Mutation | updateMutation → AppSettings.update ou create |

| handleExport | Promise.all de 8 entities → JSON download client-side |



---



\### components/shared/PageHeader.jsx



| Prop | Tipo | Obrigatório |

|---|---|---|

| title | string | ✅ |

| subtitle | string? | — |

| icon | LucideIcon? | — |

| actions | ReactNode? | — |

| breadcrumbs | string\[]? | — |



---



\### components/shared/StatCard.jsx



| Prop | Tipo | Valores |

|---|---|---|

| title | string | — |

| value | string | number | — |

| icon | LucideIcon? | — |

| color | string | blue / green / red / purple / amber / cyan |

| subtitle | string? | — |

| trend | number? | % positivo ou negativo |



---



\### components/layout/Sidebar.jsx



\*\*Nav Items:\*\*

Dashboard · Arsenal · Mapa de Tópicos · Diário de Erros · Flashcards · Provas · Feynman · Sessões · Olimpíadas · Configurações · Config JSON · Relatório Técnico



\*\*Comportamento:\*\* Mobile: overlay slide-out. Desktop: colapsável (72px / 260px).  

\*\*Props:\*\* collapsed, setCollapsed, mobileOpen, setMobileOpen





---



\# 7. Stubs IA — Ollama





\*\*Endpoint base:\*\* `POST http://localhost:11434/v1/completions`  

\*\*Headers:\*\* `Content-Type: application/json`



---



\### Wrapper callOllama



```typescript

// TODO: substituir por fetch Ollama real

async function callOllama(params) {

&nbsp; const controller = new AbortController();

&nbsp; const timeoutId = setTimeout(() => controller.abort(), 60\_000);

&nbsp; 

&nbsp; for (let attempt = 1; attempt <= 3; attempt++) {

&nbsp;   try {

&nbsp;     const res = await fetch("http://localhost:11434/v1/completions", {

&nbsp;       method: "POST",

&nbsp;       headers: { "Content-Type": "application/json" },

&nbsp;       signal: controller.signal,

&nbsp;       body: JSON.stringify({

&nbsp;         model: params.model,

&nbsp;         prompt: params.prompt,

&nbsp;         max\_tokens: params.maxTokens,

&nbsp;         temperature: params.temperature,

&nbsp;         stream: false,

&nbsp;       }),

&nbsp;     });

&nbsp;     clearTimeout(timeoutId);

&nbsp;     const data = await res.json();

&nbsp;     return data.choices?.\[0]?.text ?? data.response ?? "";

&nbsp;   } catch (err) {

&nbsp;     if (err.name === "AbortError") return fallback("ERR\_IA\_TIMEOUT");

&nbsp;     if (attempt === 3) return fallback("ERR\_IA\_OFFLINE");

&nbsp;     await sleep(2000 \* Math.pow(2, attempt - 1)); // 2s, 4s, 8s

&nbsp;   }

&nbsp; }

}

// Retry: 3x com backoff exponencial (2s → 4s → 8s)

// AbortError → ERR\_IA\_TIMEOUT (não retenta)

// fetch error → ERR\_IA\_OFFLINE

```



---



\### Use Case 1: ia\_error\_analysis



\*\*Modelo:\*\* qwen2.5:14b · \*\*Temperatura:\*\* 0.0 · \*\*max\_tokens:\*\* 1500



\*\*Prompt literal (copiar exatamente):\*\*

```

\[IA\_ANALYSIS — nível ITA]

Contexto: {{context}}

Descreva em Markdown com as seções:

1\) DIAGNÓSTICO: explique a lacuna e por que é perigosa no ITA.

2\) CONCEITO\_CORRETO: explicação técnica aprofundada.

3\) PLANO\_DE\_CORREÇÃO: 3 ações com referências exatas (bookId, capítulos/exercícios).

4\) ALERTA: se for problema de base indique livro e capítulo.

Formato: Markdown com títulos e bullet lists.

```



\*\*Request HTTP exato:\*\*

```json

{

&nbsp; "model": "qwen2.5:14b",

&nbsp; "prompt": "\[IA\_ANALYSIS — nível ITA]\\nContexto: <inserir context aqui>...",

&nbsp; "max\_tokens": 1500,

&nbsp; "temperature": 0.0,

&nbsp; "stream": false

}

```



\*\*Mock Response:\*\*

```markdown

\## DIAGNÓSTICO

\- Confusão entre força centrípeta e centrífuga

\- No ITA aparece em ~3 questões/prova de Física (MCU, gravitação, carros em curva)



\## CONCEITO\_CORRETO

F\_c = mv²/r — sempre aponta para o CENTRO.

Centrífuga é fictícia (referencial não-inercial) — não usar no ITA.



\## PLANO\_DE\_CORREÇÃO

1\. Halliday Vol.1 cap.6, exercícios 6.1–6.20

2\. Irodov seção 1.4 (5 problemas de dinâmica circular)

3\. Criar flashcard: "O que é força centrípeta?" → "Resultante real direcionada ao centro"



\## ALERTA

⚠️ Base deficiente em vetores. Revisar FME Vol.7 cap.3.

```



\*\*Fallback ERR\_IA\_OFFLINE:\*\*

```typescript

// TODO: substituir por fetch Ollama

return `## \[ERR\_IA\_OFFLINE] Análise indisponível\\n- Lacuna: "${descriptionGap}"\\n- Severidade: ${severity}\\n- Revisar manualmente.`;

```



---



\### Use Case 2: ia\_generate\_cards



\*\*Modelo:\*\* qwen2.5:7b · \*\*Temperatura:\*\* 0.2 · \*\*max\_tokens:\*\* 1000



\*\*Prompt literal (copiar exatamente):\*\*

```

\[IA\_CARDS — gerar flashcards nivel ITA]

Receba: {{text\_chunk}}; gere um JSON array de até N=8 cards com campos:

\[{ "type": "conceito|formula|mecanismo|erro\_recorrente", "front": "pergunta curta",

&nbsp;  "back": "resposta detalhada com condições de aplicabilidade e exemplo",

&nbsp;  "references":\[{bookId,pageRange}], "difficulty":"easy|medium|hard" }]

Output: JSON only.

```



\*\*Mock Response:\*\*

```json

\[

&nbsp; {

&nbsp;   "type": "formula",

&nbsp;   "front": "Fórmula da força centrípeta no MCU?",

&nbsp;   "back": "F\_c = mv²/r\\nm=massa, v=vel. tangencial, r=raio.\\nNão é força independente — é resultante das forças reais.",

&nbsp;   "references": \[{"bookId": "halliday-v1", "pageRange": "134-142"}],

&nbsp;   "difficulty": "medium"

&nbsp; },

&nbsp; {

&nbsp;   "type": "conceito",

&nbsp;   "front": "Diferença entre força centrípeta e centrífuga?",

&nbsp;   "back": "Centrípeta: real, aponta para o CENTRO.\\nCentrífuga: fictícia, referencial não-inercial.\\nITA: usar apenas centrípeta.",

&nbsp;   "references": \[{"bookId": "halliday-v1", "pageRange": "138-140"}],

&nbsp;   "difficulty": "medium"

&nbsp; }

]

```



\*\*Idempotência:\*\*

```typescript

const hash = djb2Hash(card.front + card.back + deckName);

const isDuplicate = existing.some(f => djb2Hash(f.front + f.back + f.ankiDeck) === hash);

if (isDuplicate) continue; // pular duplicata

```



---



\### Use Case 3: ia\_feynman\_eval



\*\*Modelo:\*\* qwen2.5:14b · \*\*Temperatura:\*\* 0.1 · \*\*max\_tokens:\*\* 1200



\*\*Prompt literal (copiar exatamente):\*\*

```

\[IA\_FEYNMAN — avaliar explicação]

Receba: explicação do aluno sobre {{topic}}. Retorne em Markdown:

1\) ACERTOS

2\) ERROS\_CONCEITUAIS (corrija)

3\) LACUNAS

4\) EXPLICAÇÃO\_CORRETA completa

5\) NOTA: 0-10 com justificativa técnica.

```



\*\*Mock Response:\*\*

```markdown

\## ACERTOS

\- ✅ Enuncia corretamente a 1ª Lei de Newton

\- ✅ Cita F=ma (2ª Lei)



\## ERROS\_CONCEITUAIS

\- ❌ "A velocidade dobra quando a força dobra" — ERRADO.

&nbsp; ✅ A ACELERAÇÃO dobra. A velocidade depende do tempo de aplicação.



\## LACUNAS

\- Não mencionou que F=ma aplica-se à FORÇA RESULTANTE

\- Faltou distinguir massa inercial de gravitacional



\## EXPLICAÇÃO\_CORRETA

1ª Lei: objeto mantém estado na ausência de ΣF=0.

2ª Lei: ΣF = m·a (soma vetorial).

3ª Lei: pares ação-reação em CORPOS DIFERENTES — não se cancelam.



\## NOTA: 6.5/10

Domina a estrutura mas confunde grandezas derivadas. Lacuna crítica para o ITA.

```



---



\### Use Case 4: ia\_chapter\_summary



\*\*Modelo:\*\* qwen2.5:7b · \*\*max\_tokens:\*\* 800



\*\*Prompt literal:\*\*

```

\[IA\_SUMMARY — resumo de capítulo]

Texto: {{chapter\_text}}

Gere um resumo estruturado em Markdown com:

1\) CONCEITOS\_PRINCIPAIS: bullet list dos 5-10 conceitos mais importantes

2\) FORMULAS: lista com cada fórmula, variáveis e unidades

3\) ARMADILHAS\_ITA: erros comuns que o ITA explora neste tema

4\) EXERCICIOS\_MODELO: 2 exercícios representativos com solução

Output: Markdown.

```



---



\### Use Case 5: ia\_extract\_toc



\*\*Modelo:\*\* qwen2.5:7b · \*\*Temperatura:\*\* 0.0 · \*\*max\_tokens:\*\* 500



\*\*Prompt literal:\*\*

```

\[IA\_TOC — extrair índice]

Texto do índice do livro: {{toc\_text}}

Extraia a estrutura em JSON:

{ "chapters": \[{ "number": 1, "title": "...",

&nbsp; "sections": \[{ "number": "1.1", "title": "..." }] }] }

Output: JSON only.

```



---



\### Modelos Recomendados



| Use Case | Modelo | RAM | Razão |

|---|---|---|---|

| ia\_error\_analysis | qwen2.5:14b | ~10GB | Alta precisão técnica |

| ia\_feynman\_eval | qwen2.5:14b | ~10GB | Avaliação rigorosa |

| ia\_generate\_cards | qwen2.5:7b | ~5GB | Velocidade suficiente |

| ia\_chapter\_summary | qwen2.5:7b | ~5GB | Resumo não exige máxima precisão |

| ia\_extract\_toc | qwen2.5:7b | ~5GB | Extração estruturada simples |



\*\*Instalação:\*\*

```bash

ollama pull qwen2.5:14b  # ~9.0 GB

ollama pull qwen2.5:7b   # ~4.7 GB

ollama serve             # porta 11434

```





---



\# 8. Stubs AnkiConnect — Payloads Exatos





\*\*Endpoint:\*\* `POST http://localhost:8765`  

\*\*Headers:\*\* `Content-Type: application/json`  

\*\*AnkiConnect API Version:\*\* 6



---



\### 1. version — Verificar conexão



\*\*Request:\*\*

```json

{ "action": "version", "version": 6 }

```

\*\*Response:\*\*

```json

{ "result": 6, "error": null }

```



---



\### 2. createDeck — Criar deck (idempotente)



\*\*Request:\*\*

```json

{

&nbsp; "action": "createDeck",

&nbsp; "version": 6,

&nbsp; "params": { "deck": "ITA::Física::Mecânica" }

}

```

\*\*Response:\*\*

```json

{ "result": 1679072460843, "error": null }

```



\*\*Hierarquia sugerida:\*\*

```

ITA::Matemática::Funções

ITA::Matemática::Trigonometria

ITA::Física::Mecânica

ITA::Física::Eletromagnetismo

ITA::Química::FísicoQuímica

ITA::Química::Orgânica

ITA::Cálculo::Diferencial

```



---



\### 3. addNote — Payload exato



\*\*Request:\*\*

```json

{

&nbsp; "action": "addNote",

&nbsp; "version": 6,

&nbsp; "params": {

&nbsp;   "note": {

&nbsp;     "deckName": "ITA::Física::Mecânica",

&nbsp;     "modelName": "Basic",

&nbsp;     "fields": {

&nbsp;       "Front": "Qual é a fórmula da força centrípeta?",

&nbsp;       "Back": "F\_c = mv²/r\\nDireção: sempre para o CENTRO.\\nNão é força independente — é resultante das forças reais."

&nbsp;     },

&nbsp;     "options": {

&nbsp;       "allowDuplicate": false,

&nbsp;       "duplicateScope": "deck"

&nbsp;     },

&nbsp;     "tags": \["ita-prep", "fisica", "mecanica", "formula"],

&nbsp;     "audio": \[], "video": \[], "picture": \[]

&nbsp;   }

&nbsp; }

}

```



\*\*Response (sucesso):\*\*

```json

{ "result": 1496198395707, "error": null }

```



\*\*Response (duplicata):\*\*

```json

{ "result": null, "error": "cannot create note because it is a duplicate" }

```



\*\*GUID (idempotência):\*\*

```typescript

// TODO: substituir por fetch AnkiConnect

function computeGuid(front, back, deck) {

&nbsp; let hash = 5381;

&nbsp; for (const c of front + back + deck) hash = ((hash << 5) + hash) + c.charCodeAt(0);

&nbsp; return Math.abs(hash).toString(16);

}

```



---



\### 4. addNotes — Bulk



\*\*Request:\*\*

```json

{

&nbsp; "action": "addNotes",

&nbsp; "version": 6,

&nbsp; "params": {

&nbsp;   "notes": \[

&nbsp;     {

&nbsp;       "deckName": "ITA::Química::FísicoQuímica",

&nbsp;       "modelName": "Basic",

&nbsp;       "fields": {

&nbsp;         "Front": "Equação de Henderson-Hasselbalch",

&nbsp;         "Back": "pH = pKa + log(\[A⁻]/\[HA])\\nUso: soluções tampão com ácido fraco + base conjugada."

&nbsp;       },

&nbsp;       "options": { "allowDuplicate": false },

&nbsp;       "tags": \["ita-prep", "quimica", "formula"]

&nbsp;     }

&nbsp;   ]

&nbsp; }

}

```

\*\*Response:\*\* `{ "result": \[1496198395707], "error": null }` \*(null para duplicatas)\*



---



\### 5. sync



```json

{ "action": "sync", "version": 6 }

```

\*\*Response:\*\* `{ "result": null, "error": null }`



---



\### Fila Offline — Política Completa



```typescript

// TODO: substituir por fetch AnkiConnect

function enqueueOffline(action, params) {

&nbsp; const queue = JSON.parse(localStorage.getItem("anki-offline-queue") ?? "\[]");

&nbsp; queue.push({ action, params, timestamp: Date.now(), retryCount: 0 });

&nbsp; localStorage.setItem("anki-offline-queue", JSON.stringify(queue));

}



// Flush automático a cada 30s ao detectar Anki disponível

setInterval(async () => {

&nbsp; const isOnline = await checkAnkiConnection();

&nbsp; if (isOnline) await flushOfflineQueue();

}, 30\_000);



// Max retries por item: 3

// TTL: 7 dias

// Max tamanho: 500 items

```



---



\### Códigos de Erro



| Código | Causa | Ação |

|---|---|---|

| ERR\_ANKI\_OFFLINE | fetch falhou — Anki fechado | Enfileirar + avisar usuário |

| ERR\_ANKI\_TIMEOUT | AbortController > 10s | Enfileirar + avisar usuário |

| ERR\_ANKI\_DUPLICATE | Card já existe | Logar e continuar (não fatal) |

| ERR\_ANKI\_API | data.error != null | Logar e lançar exceção |



---



\### Instalação do AnkiConnect



```

1\. Abrir Anki Desktop → Ferramentas → Complementos

2\. "Obter complementos" → Código: 2055492159

3\. Reiniciar Anki

4\. Verificar: POST http://localhost:8765 → { "action":"version","version":6 }

&nbsp;  Resposta esperada: { "result": 6, "error": null }

```





---



\# 9. Pseudocódigo — Algoritmos Críticos





\### 9.1 Fila de Prioridade do Dashboard



```

CONSTANTES:

&nbsp; W\_ERROR\_GRAVE=10, W\_ERROR\_MOD=5, W\_ERROR\_LEVE=2

&nbsp; W\_OLYMPIAD\_WEEK=15 (< 7 dias), W\_OLYMPIAD\_MONTH=8 (7-30 dias)

&nbsp; W\_TOPIC\_CRITICA=5, W\_TOPIC\_ALTA=3

&nbsp; W\_EXAM\_WEEK=12, W\_EXAM\_MONTH=6



FUNÇÃO generatePriorityQueue(errors, olympiads, topics, exams, currentYear, today):

&nbsp; items = \[]



&nbsp; PARA error EM errors WHERE resolved==false:

&nbsp;   score = { grave:10, moderada:5, leve:2 }\[error.severity]

&nbsp;   items.push({ type:"error", score, label: error.descriptionGap\[:60] })



&nbsp; PARA olympiad EM olympiads WHERE status=="inscrito":

&nbsp;   daysLeft = diff(olympiad.date, today)

&nbsp;   SE daysLeft < 0 OU daysLeft > 30: SKIP

&nbsp;   score = daysLeft < 7 ? 15 : 8

&nbsp;   items.push({ type:"olympiad", score, label: olympiad.name + " — " + daysLeft + "d" })



&nbsp; PARA topic EM topics WHERE yearPlan==currentYear AND status=="nao\_iniciado"

&nbsp;                        AND priorityIta IN \["critica","alta"]:

&nbsp;   score = topic.priorityIta=="critica" ? 5 : 3

&nbsp;   items.push({ type:"topic", score, label: topic.topic })



&nbsp; PARA exam EM exams WHERE status=="planejada":

&nbsp;   daysLeft = diff(exam.dateReal, today)

&nbsp;   SE daysLeft < 0 OU daysLeft > 60: SKIP

&nbsp;   score = daysLeft < 7 ? 12 : 6

&nbsp;   items.push({ type:"exam", score, label: exam.name + " — " + daysLeft + "d" })



&nbsp; RETORNAR items.sort((a,b) => b.score-a.score).slice(0,5)



EXEMPLO NUMÉRICO:

&nbsp; errors: \[{ severity:"grave", gap:"Henderson-Hasselbalch" }] → score=10

&nbsp; olympiads: \[{ name:"OBMEP", date:"2026-03-10", status:"inscrito" }] → 5 dias → score=15

&nbsp; topics: \[{ topic:"Séries Numéricas", priorityIta:"critica", yearPlan:2 }] → score=5



&nbsp; OUTPUT: \[OBMEP(15), Erro grave(10), Séries(5)]

```



---



\### 9.2 Avanço em Cascata de Tópicos



```

STATUS\_ORDER = \[nao\_iniciado, em\_andamento, base\_concluida, aprofundando, dominado]

PREREQ\_OK = \[base\_concluida, aprofundando, dominado]



FUNÇÃO advanceTopicStatus(topic, allTopics, today):

&nbsp; idx = STATUS\_ORDER.indexOf(topic.status)

&nbsp; SE idx >= 4: RETORNAR { success:false, reason:"ALREADY\_DOMINADO" }

&nbsp; nextStatus = STATUS\_ORDER\[idx+1]



&nbsp; SE topic.subject=="calculo" AND nextStatus=="em\_andamento":

&nbsp;   mathTopics = allTopics.filter(t => t.subject=="matematica" AND t.yearPlan<=topic.yearPlan)

&nbsp;   SE NOT mathTopics.every(t => PREREQ\_OK.includes(t.status)):

&nbsp;     RETORNAR { success:false, reason:"PREREQUISITE\_NOT\_MET" }



&nbsp; updates = { status: nextStatus }

&nbsp; SE nextStatus=="em\_andamento" AND NOT topic.startDate:

&nbsp;   updates.startDate = today

&nbsp; SE nextStatus != "nao\_iniciado":

&nbsp;   updates.lastReviewedAt = today



&nbsp; RETORNAR { success:true, updates }



NOTA: Edição direta via TopicFormDialog NÃO aplica efeitos colaterais automáticos.

&nbsp;     Apenas o botão "Avançar" aplica as regras acima (allStatusesEditable=true).

```



---



\### 9.3 Régua de Desbloqueio de Provas



```

FUNÇÃO getRecommendedExamPeriod(exams):

&nbsp; realizadas = exams.filter(e => e.status=="realizada" AND e.percentCorrect!=null)

&nbsp; SE realizadas.length==0: RETORNAR { startYear:1990, label:"Iniciante" }

&nbsp; avg = media(realizadas.map(e => e.percentCorrect))



&nbsp; SE avg < 50: RETORNAR { startYear:1985, label:"Iniciante — 1985-1999" }

&nbsp; SE avg < 70: RETORNAR { startYear:2000, label:"Intermediário — 2000-2008" }

&nbsp; RETORNAR { startYear:2009, label:"Avançado — 2009-2024" }



SQL equivalente:

&nbsp; SELECT CASE

&nbsp;   WHEN avg\_pct < 50 THEN 1985

&nbsp;   WHEN avg\_pct < 70 THEN 2000

&nbsp;   ELSE 2009

&nbsp; END FROM (SELECT AVG(percent\_correct) as avg\_pct FROM exams WHERE status='realizada') t;



EXEMPLO: notas = \[45%, 52%, 61%] → avg=52.7% → startYear=2000

```



---



\### 9.4 Seed Idempotente (detalhado)



```

ORDEM DE INSERÇÃO:

&nbsp; 1. Books (pré-requisito para FKs de Topics)

&nbsp; 2. Topics (podem referenciar books)

&nbsp; 3. AppSettings { seeded:true } (confirma conclusão)



VERIFICAÇÕES:

&nbsp; - Passo 1: AppSettings.seeded==true → sair sem inserir nada

&nbsp; - Passo 2: Book.list().length > 0 → aceitar seed parcial, marcar seeded



BATCH SIZES:

&nbsp; Books: 10 por batch (41 livros = 5 batches, último com 1)

&nbsp; Topics: 15 por batch (81 tópicos = 6 batches)



ROLLBACK MANUAL (se seed corrompido):

&nbsp; 1. AppSettings.update({ seeded: false })

&nbsp; 2. Deletar todos os Books e Topics manualmente

&nbsp; 3. Recarregar a página → seed reinicia

```



---



\### 9.5 Geração e Deduplicação de Flashcards



```

FUNÇÃO generateFlashcardsForError(error, aiCards):

&nbsp; existing = Flashcard.filter({ topicId: error.topicId })

&nbsp; created = \[], skipped = \[]



&nbsp; PARA card EM aiCards:

&nbsp;   hash = djb2(card.front + card.back + error.ankiDeck)

&nbsp;   isDup = existing.some(f => djb2(f.front+f.back+f.ankiDeck)==hash)

&nbsp;   SE isDup: skipped.push(card); CONTINUAR



&nbsp;   await Flashcard.create({

&nbsp;     topicId: error.topicId, errorId: error.id,

&nbsp;     front: card.front, back: card.back,

&nbsp;     type: card.type, origin: "ia\_gerada",

&nbsp;     ankiDeck: error.ankiDeck ?? "ITA::" + error.subject,

&nbsp;     synced: false

&nbsp;   })

&nbsp;   created.push(card)



&nbsp; SE created.length > 0:

&nbsp;   ConceptualError.update(error.id, { cardsGenerated: true })



&nbsp; RETORNAR { created: created.length, skipped: skipped.length }

```



---



\### 9.6 Avaliação Feynman com IA



```

FUNÇÃO evaluateFeynman(topicName, explanation, previousAttempts):

&nbsp; attemptNum = previousAttempts.length + 1

&nbsp; contextPrefix = attemptNum > 1

&nbsp;   ? "Tentativa " + attemptNum + ". Anteriores: " + previousAttempts.map(a => "Nota "+a.iaScore).join(", ") + ". "

&nbsp;   : ""



&nbsp; prompt = contextPrefix + buildFeynmanPrompt(topicName, explanation)

&nbsp; iaFeedback = await callOllama({ model:"qwen2.5:14b", prompt, maxTokens:1200, temperature:0.1 })



&nbsp; match = iaFeedback.match(/NOTA:s\*(d+(?:.d+)?)s\*/s\*10/i)

&nbsp; iaScore = match ? parseFloat(match\[1]) : 5.0

&nbsp; approved = iaScore >= 7.0



&nbsp; session = await FeynmanSession.create({

&nbsp;   topicId, topicName, explanation, iaScore, iaFeedback,

&nbsp;   approved, attemptNumber: attemptNum, date: today()

&nbsp; })



&nbsp; SE approved AND topic.status NOT IN \["aprofundando","dominado"]:

&nbsp;   advanceTopicStatus(topic, allTopics, today())



&nbsp; RETORNAR session

```



---



\### 9.7 Histórico de Mudanças 2026-03-05



```

allStatusesEditable = true implementado em:

&nbsp; - TopicMap.jsx: handleOpenEdit, handleOpenNew, handleSave, createMutation

&nbsp; - TopicRow.jsx: botão Editar sempre visível

&nbsp; - TopicKanban.jsx: botão Editar em todos os cards (hover)

&nbsp; - TopicFormDialog.jsx: campos sem restrição por status

&nbsp; - ProjectConfigPage.jsx: editingRules documentado no JSON



Botão "Novo" adicionado ao header do TopicMap

Sidebar atualizada com "Relatório Técnico" → ReportPage

```





---



\# 10. CI/CD e Testes





\### .github/workflows/ci.yml — Jobs



```yaml

on: push (main, develop, phase/\*), pull\_request (main), release



jobs:

&nbsp; lint-and-build:

&nbsp;   - checkout

&nbsp;   - node 20.x

&nbsp;   - npm ci

&nbsp;   - npm run lint (ESLint)

&nbsp;   - npm run type-check (tsc --noEmit)

&nbsp;   - npm run build

&nbsp;   - upload artifact: dist/



&nbsp; test:

&nbsp;   needs: lint-and-build

&nbsp;   - npm run test -- --coverage --coverageReporters=lcov,text

&nbsp;   - verificar cobertura mínima 70% (lógica crítica: 80%)

&nbsp;   - upload coverage report



&nbsp; export-zip:

&nbsp;   if: release

&nbsp;   - npm run build

&nbsp;   - ./scripts/export\_project.sh

&nbsp;   - unzip -t dist/project-export.zip (verificação)

&nbsp;   - upload para GitHub Release como ita-prep-vX.Y.Z.zip



&nbsp; docker-verify:

&nbsp;   if: release

&nbsp;   - verificar integridade do ZIP em container isolado

```



---



\### Comandos de Teste



```bash

\# Rodar todos os testes

npm run test



\# Com coverage (relatório em coverage/lcov-report/index.html)

npm run test -- --coverage



\# Teste específico

npm run test -- useSeed.test

npm run test -- topicAdvance.test

```



---



\### Exemplos de Testes (Jest + RTL)



```typescript

// useSeed.test.ts

describe("useSeed — idempotência", () => {

&nbsp; it("não insere se seeded=true", async () => {

&nbsp;   mockAppSettings(\[{ seeded: true }]);

&nbsp;   const { result } = renderHook(() => useSeed());

&nbsp;   await waitFor(() => expect(result.current.seeded).toBe(true));

&nbsp;   expect(mockBulkCreate).not.toHaveBeenCalled();

&nbsp; });



&nbsp; it("insere 41 livros em 5 batches se banco vazio", async () => {

&nbsp;   mockAppSettings(\[]);

&nbsp;   mockBookList(\[]);

&nbsp;   const { result } = renderHook(() => useSeed());

&nbsp;   await waitFor(() => expect(result.current.seeded).toBe(true));

&nbsp;   expect(mockBulkCreate).toHaveBeenCalledTimes(5); // books

&nbsp;   // + 6 calls para topics

&nbsp; });

});



// topicAdvance.test.ts

describe("advanceTopicStatus", () => {

&nbsp; it("bloqueia Cálculo se Matemática incompleta", () => {

&nbsp;   const topic = { subject:"calculo", yearPlan:2, status:"nao\_iniciado" };

&nbsp;   const math  = { subject:"matematica", yearPlan:2, status:"nao\_iniciado" };

&nbsp;   const result = advanceTopicStatus(topic, \[topic, math], "2026-03-05");

&nbsp;   expect(result.success).toBe(false);

&nbsp;   expect(result.reason).toBe("PREREQUISITE\_NOT\_MET");

&nbsp; });



&nbsp; it("seta startDate ao avançar para em\_andamento", () => {

&nbsp;   const topic = { subject:"fisica", status:"nao\_iniciado", startDate: null };

&nbsp;   const result = advanceTopicStatus(topic, \[topic], "2026-03-05");

&nbsp;   expect(result.updates.startDate).toBe("2026-03-05");

&nbsp; });



&nbsp; it("não bloqueia se status=dominado (já no máximo)", () => {

&nbsp;   const topic = { subject:"fisica", status:"dominado" };

&nbsp;   const result = advanceTopicStatus(topic, \[topic], "2026-03-05");

&nbsp;   expect(result.success).toBe(false);

&nbsp;   expect(result.reason).toBe("ALREADY\_DOMINADO");

&nbsp; });

});



// flashcardDedup.test.ts

describe("deduplicação de flashcards", () => {

&nbsp; it("pula card com mesmo hash", async () => {

&nbsp;   const existing = \[{ front:"Q", back:"A", ankiDeck:"ITA" }];

&nbsp;   const aiCards  = \[{ front:"Q", back:"A", type:"conceito" }];

&nbsp;   const result = await generateFlashcardsForError({ ankiDeck:"ITA" }, aiCards, existing);

&nbsp;   expect(result.created).toBe(0);

&nbsp;   expect(result.skipped).toBe(1);

&nbsp; });

});

```



---



\### Cobertura Mínima



| Módulo | Mínimo |

|---|---|

| components/seed/useSeed.js | 80% |

| Lógica de advanceTopicStatus | 80% |

| Geração/deduplicação de flashcards | 80% |

| callOllama (retry/fallback) | 75% |

| Demais módulos | 70% |





---



\# 11. Infraestrutura, Segurança e Env





\### Requisitos de Infraestrutura Local



| Requisito | Mínimo | Recomendado |

|---|---|---|

| Node.js | 18.x | 20.x LTS |

| RAM | 8 GB | 16 GB |

| CPU | 4 cores | 8+ cores |

| GPU (Ollama) | opcional | NVIDIA 8GB VRAM |

| Disk | 20 GB | 40 GB (+ 14GB Ollama) |



\### Comandos de Setup



```bash

git clone <repo-url> ita-prep

cd ita-prep

npm ci



\# Instalar modelos Ollama

ollama pull qwen2.5:14b    # ~9.0 GB — análise de erros e Feynman

ollama pull qwen2.5:7b     # ~4.7 GB — geração de flashcards

ollama serve               # porta 11434



\# AnkiConnect: plugin 2055492159 no Anki Desktop



npm run dev    # http://localhost:5173

```



---



\### .env.example



```bash

\# Ollama (LLM local)

VITE\_OLLAMA\_URL=http://localhost:11434

VITE\_OLLAMA\_MODEL=qwen2.5:14b



\# AnkiConnect

VITE\_ANKI\_URL=http://localhost:8765



\# Base44 (gerado automaticamente pelo platform)

VITE\_BASE44\_APP\_ID=your-app-id



\# Ambiente

VITE\_APP\_ENV=development

```



---



\### CSP / CORS Defaults



```

Content-Security-Policy:

&nbsp; default-src 'self';

&nbsp; script-src 'self' 'unsafe-inline';

&nbsp; connect-src 'self' http://localhost:11434 http://localhost:8765;

&nbsp; img-src 'self' data: https:;

&nbsp; style-src 'self' 'unsafe-inline';

```



---



\### package.json — Dependências Principais



```json

{

&nbsp; "dependencies": {

&nbsp;   "@base44/sdk": "^0.8.18",

&nbsp;   "@hello-pangea/dnd": "^17.0.0",

&nbsp;   "@tanstack/react-query": "^5.84.1",

&nbsp;   "date-fns": "^3.6.0",

&nbsp;   "framer-motion": "^11.16.4",

&nbsp;   "lodash": "^4.17.21",

&nbsp;   "lucide-react": "^0.475.0",

&nbsp;   "react": "^18.2.0",

&nbsp;   "react-dom": "^18.2.0",

&nbsp;   "react-hook-form": "^7.54.2",

&nbsp;   "react-markdown": "^9.0.1",

&nbsp;   "react-quill": "^2.0.0",

&nbsp;   "react-router-dom": "^6.26.0",

&nbsp;   "recharts": "^2.15.4",

&nbsp;   "sonner": "^2.0.1",

&nbsp;   "tailwind-merge": "^3.0.2",

&nbsp;   "zod": "^3.24.2"

&nbsp; },

&nbsp; "devDependencies": {

&nbsp;   "@base44/vite-plugin": "^0.2.29",

&nbsp;   "tailwindcss-animate": "^1.0.7"

&nbsp; }

}

```



---



\### tsconfig.json Recomendado



```json

{

&nbsp; "compilerOptions": {

&nbsp;   "target": "ES2020",

&nbsp;   "lib": \["ES2020", "DOM", "DOM.Iterable"],

&nbsp;   "module": "ESNext",

&nbsp;   "moduleResolution": "bundler",

&nbsp;   "strict": true,

&nbsp;   "noUnusedLocals": true,

&nbsp;   "noUnusedParameters": true,

&nbsp;   "noFallthroughCasesInSwitch": true,

&nbsp;   "jsx": "react-jsx",

&nbsp;   "paths": { "@/\*": \["./src/\*"] }

&nbsp; },

&nbsp; "include": \["src", "pages", "components", "lib", "entities"]

}

```





---



\# 12. Impedimentos (IMPEDIMENTS.md)





\### IMP-001: dist/project-export.zip não gerado automaticamente



\*\*Status:\*\* ABERTO  

\*\*Causa:\*\* O ambiente Base44 é frontend-only. O script `export\_project.sh` não pode ser executado no servidor — não há acesso ao filesystem.



\*\*Solução implementada:\*\* O botão \*\*"Exportar Backup (JSON)"\*\* em Configurações faz download de todos os dados das entidades (books, topics, errors, flashcards, exams, feynman, sessions, olympiads) como JSON.



\*\*Para ZIP completo do código-fonte:\*\*

```bash

git clone <url> ita-prep \&\& cd ita-prep

chmod +x scripts/export\_project.sh

./scripts/export\_project.sh

\# Output: ./dist/project-export.zip

sha256sum dist/project-export.zip

```



---



\### IMP-002: tsconfig.json não aplicado no Base44



\*\*Status:\*\* INFORMATIVO  

\*\*Causa:\*\* Vite/TypeScript gerenciado internamente pelo Base44.  

\*\*Ação:\*\* Ao fazer checkout local, usar o tsconfig da seção 11 deste relatório.



---



\### IMP-003: CI/CD não ativo no Base44



\*\*Status:\*\* INFORMATIVO  

\*\*Causa:\*\* GitHub Actions requer runner externo.  

\*\*Ação:\*\* Habilitar \*\*GitHub Sync\*\* no painel Base44 → o arquivo `.github/workflows/ci.yml` (documentado na seção 10) será ativado automaticamente.



---



\### IMP-004: services/ai e services/anki são stubs



\*\*Status:\*\* INFORMATIVO  

\*\*Causa:\*\* Backend functions requerem Base44 \*\*Builder+\*\* subscription para fazer fetch a serviços externos sem restrições de CORS.



\*\*Ação:\*\*

1\. Upgrade para Builder+

2\. Mover stubs (seções 7 e 8) para backend functions

3\. Substituir todos os comentários `// TODO: substituir por fetch Ollama` pelo fetch real



---



\### IMP-005: docs/ e scripts/ fora da estrutura Base44



\*\*Status:\*\* INFORMATIVO  

\*\*Causa:\*\* O Base44 só permite arquivos em `pages/`, `components/`, `entities/`, `agents/`, `lib/`, `globals.css`, `layout.js`.  

\*\*Solução:\*\* Toda a documentação está disponível nesta página (`ReportPage`). O download `.md` via botão "Baixar .md" gera o `REPORT\_FULL.md` localmente.



---



\### Histórico de Mudanças — 2026-03-05



| Mudança | Arquivo(s) Afetados |

|---|---|

| `allStatusesEditable = true` — status nunca bloqueia edição | TopicMap, TopicRow, TopicKanban, TopicFormDialog |

| Botão "Novo" adicionado ao header do TopicMap | TopicMap.jsx |

| `handleOpenEdit`, `handleOpenNew`, `handleSave` implementados | TopicMap.jsx |

| `createMutation` adicionado ao TopicMap | TopicMap.jsx |

| Prop `onEdit` adicionada a TopicRow e TopicKanban | TopicRow.jsx, TopicKanban.jsx |

| `editingRules` documentado no ProjectConfig | ProjectConfigPage.jsx |

| ReportPage criada com navegação por seções e download .md | ReportPage.jsx |

| Item "Relatório Técnico" adicionado à Sidebar | Sidebar.jsx |








CONFIG JSON
===

{

&nbsp; "meta": {

&nbsp;   "name": "ITA Prep",

&nbsp;   "version": "1.0.0",

&nbsp;   "description": "Sistema de preparação 3 anos para ITA/IME/AFA",

&nbsp;   "exportedAt": "2026-03-05T19:17:05.238Z",

&nbsp;   "stack": {

&nbsp;     "framework": "React 18.2.0",

&nbsp;     "build": "Vite + @base44/vite-plugin",

&nbsp;     "css": "Tailwind CSS + tailwindcss-animate",

&nbsp;     "ui": "shadcn/ui (Radix UI)",

&nbsp;     "routing": "react-router-dom ^6.26.0",

&nbsp;     "dataFetching": "@tanstack/react-query ^5.84.1",

&nbsp;     "charts": "recharts ^2.15.4",

&nbsp;     "icons": "lucide-react ^0.475.0",

&nbsp;     "animations": "framer-motion ^11.16.4",

&nbsp;     "markdown": "react-markdown ^9.0.1",

&nbsp;     "dates": "date-fns ^3.6.0",

&nbsp;     "toast": "sonner ^2.0.1",

&nbsp;     "backend": "@base44/sdk ^0.8.18"

&nbsp;   }

&nbsp; },

&nbsp; "theme": {

&nbsp;   "defaultTheme": "dark",

&nbsp;   "storageKey": "ita-theme",

&nbsp;   "toggleMechanism": "document.documentElement.classList.toggle('dark')",

&nbsp;   "cssVariables": {

&nbsp;     "light": {

&nbsp;       "--background": "0 0% 100%",

&nbsp;       "--foreground": "222.2 84% 4.9%",

&nbsp;       "--card": "0 0% 100%",

&nbsp;       "--card-foreground": "222.2 84% 4.9%",

&nbsp;       "--primary": "187 92% 41%",

&nbsp;       "--primary-foreground": "210 40% 98%",

&nbsp;       "--secondary": "210 40% 96.1%",

&nbsp;       "--secondary-foreground": "222.2 47.4% 11.2%",

&nbsp;       "--muted": "210 40% 96.1%",

&nbsp;       "--muted-foreground": "215.4 16.3% 46.9%",

&nbsp;       "--accent": "210 40% 96.1%",

&nbsp;       "--accent-foreground": "222.2 47.4% 11.2%",

&nbsp;       "--destructive": "0 84.2% 60.2%",

&nbsp;       "--border": "214.3 31.8% 91.4%",

&nbsp;       "--input": "214.3 31.8% 91.4%",

&nbsp;       "--ring": "187 92% 41%",

&nbsp;       "--radius": "0.75rem"

&nbsp;     },

&nbsp;     "dark": {

&nbsp;       "--background": "222.2 84% 4.9%",

&nbsp;       "--foreground": "210 40% 98%",

&nbsp;       "--card": "217.2 32.6% 7.5%",

&nbsp;       "--card-foreground": "210 40% 98%",

&nbsp;       "--primary": "187 92% 41%",

&nbsp;       "--primary-foreground": "222.2 84% 4.9%",

&nbsp;       "--secondary": "217.2 32.6% 17.5%",

&nbsp;       "--secondary-foreground": "210 40% 98%",

&nbsp;       "--muted": "217.2 32.6% 17.5%",

&nbsp;       "--muted-foreground": "215 20.2% 65.1%",

&nbsp;       "--accent": "217.2 32.6% 17.5%",

&nbsp;       "--accent-foreground": "210 40% 98%",

&nbsp;       "--destructive": "0 62.8% 30.6%",

&nbsp;       "--border": "217.2 32.6% 17.5%",

&nbsp;       "--input": "217.2 32.6% 17.5%",

&nbsp;       "--ring": "187 92% 41%"

&nbsp;     },

&nbsp;     "customVars": {

&nbsp;       "--color-primary": "#06b6d4",

&nbsp;       "--color-primary-hover": "#0891b2",

&nbsp;       "--color-accent": "#3b82f6",

&nbsp;       "--color-success": "#10b981",

&nbsp;       "--color-warning": "#f59e0b",

&nbsp;       "--color-danger": "#ef4444",

&nbsp;       "--sidebar-width": "260px",

&nbsp;       "--sidebar-collapsed": "72px",

&nbsp;       "--header-height": "64px"

&nbsp;     }

&nbsp;   }

&nbsp; },

&nbsp; "navigation": {

&nbsp;   "sidebarItems": \[

&nbsp;     {

&nbsp;       "name": "Dashboard",

&nbsp;       "page": "Dashboard",

&nbsp;       "icon": "LayoutDashboard"

&nbsp;     },

&nbsp;     {

&nbsp;       "name": "Arsenal",

&nbsp;       "page": "Arsenal",

&nbsp;       "icon": "BookOpen"

&nbsp;     },

&nbsp;     {

&nbsp;       "name": "Mapa de Tópicos",

&nbsp;       "page": "TopicMap",

&nbsp;       "icon": "Map"

&nbsp;     },

&nbsp;     {

&nbsp;       "name": "Diário de Erros",

&nbsp;       "page": "ErrorDiary",

&nbsp;       "icon": "AlertTriangle"

&nbsp;     },

&nbsp;     {

&nbsp;       "name": "Flashcards",

&nbsp;       "page": "Flashcards",

&nbsp;       "icon": "Layers"

&nbsp;     },

&nbsp;     {

&nbsp;       "name": "Provas",

&nbsp;       "page": "Exams",

&nbsp;       "icon": "FileText"

&nbsp;     },

&nbsp;     {

&nbsp;       "name": "Feynman",

&nbsp;       "page": "Feynman",

&nbsp;       "icon": "Brain"

&nbsp;     },

&nbsp;     {

&nbsp;       "name": "Sessões",

&nbsp;       "page": "StudySessions",

&nbsp;       "icon": "Timer"

&nbsp;     },

&nbsp;     {

&nbsp;       "name": "Olimpíadas",

&nbsp;       "page": "Olympiads",

&nbsp;       "icon": "Trophy"

&nbsp;     },

&nbsp;     {

&nbsp;       "name": "Configurações",

&nbsp;       "page": "SettingsPage",

&nbsp;       "icon": "Settings"

&nbsp;     }

&nbsp;   ],

&nbsp;   "sidebarBehavior": {

&nbsp;     "defaultCollapsed": false,

&nbsp;     "expandedWidth": "260px",

&nbsp;     "collapsedWidth": "72px",

&nbsp;     "mobileBreakpoint": "lg",

&nbsp;     "activeDetection": "location.pathname.includes(page)"

&nbsp;   }

&nbsp; },

&nbsp; "entities": {

&nbsp;   "Book": {

&nbsp;     "fields": {

&nbsp;       "title": {

&nbsp;         "type": "string",

&nbsp;         "required": true

&nbsp;       },

&nbsp;       "author": {

&nbsp;         "type": "string",

&nbsp;         "required": true

&nbsp;       },

&nbsp;       "subject": {

&nbsp;         "type": "enum",

&nbsp;         "values": \[

&nbsp;           "matematica",

&nbsp;           "fisica",

&nbsp;           "quimica",

&nbsp;           "calculo",

&nbsp;           "geral"

&nbsp;         ],

&nbsp;         "default": "geral"

&nbsp;       },

&nbsp;       "phase": {

&nbsp;         "type": "enum",

&nbsp;         "values": \[

&nbsp;           "base",

&nbsp;           "aprofundamento"

&nbsp;         ],

&nbsp;         "required": true

&nbsp;       },

&nbsp;       "priority": {

&nbsp;         "type": "enum",

&nbsp;         "values": \[

&nbsp;           "essencial",

&nbsp;           "recomendado",

&nbsp;           "opcional"

&nbsp;         ],

&nbsp;         "default": "recomendado"

&nbsp;       },

&nbsp;       "status": {

&nbsp;         "type": "enum",

&nbsp;         "values": \[

&nbsp;           "nao\_iniciado",

&nbsp;           "em\_andamento",

&nbsp;           "concluido"

&nbsp;         ],

&nbsp;         "default": "nao\_iniciado"

&nbsp;       },

&nbsp;       "progressPercent": {

&nbsp;         "type": "number",

&nbsp;         "default": 0,

&nbsp;         "range": \[

&nbsp;           0,

&nbsp;           100

&nbsp;         ]

&nbsp;       },

&nbsp;       "notes": {

&nbsp;         "type": "string"

&nbsp;       },

&nbsp;       "defaultAnkiDeck": {

&nbsp;         "type": "string"

&nbsp;       },

&nbsp;       "recommendedOrder": {

&nbsp;         "type": "string"

&nbsp;       }

&nbsp;     }

&nbsp;   },

&nbsp;   "Topic": {

&nbsp;     "fields": {

&nbsp;       "subject": {

&nbsp;         "type": "enum",

&nbsp;         "values": \[

&nbsp;           "matematica",

&nbsp;           "fisica",

&nbsp;           "quimica",

&nbsp;           "calculo",

&nbsp;           "geral"

&nbsp;         ],

&nbsp;         "required": true

&nbsp;       },

&nbsp;       "area": {

&nbsp;         "type": "string",

&nbsp;         "required": true

&nbsp;       },

&nbsp;       "topic": {

&nbsp;         "type": "string",

&nbsp;         "required": true

&nbsp;       },

&nbsp;       "subtopic": {

&nbsp;         "type": "string"

&nbsp;       },

&nbsp;       "bookBaseId": {

&nbsp;         "type": "string",

&nbsp;         "fk": "Book"

&nbsp;       },

&nbsp;       "bookAdvancedId": {

&nbsp;         "type": "string",

&nbsp;         "fk": "Book"

&nbsp;       },

&nbsp;       "status": {

&nbsp;         "type": "enum",

&nbsp;         "values": \[

&nbsp;           "nao\_iniciado",

&nbsp;           "em\_andamento",

&nbsp;           "base\_concluida",

&nbsp;           "aprofundando",

&nbsp;           "dominado"

&nbsp;         ],

&nbsp;         "default": "nao\_iniciado"

&nbsp;       },

&nbsp;       "statusOrder": \[

&nbsp;         "nao\_iniciado",

&nbsp;         "em\_andamento",

&nbsp;         "base\_concluida",

&nbsp;         "aprofundando",

&nbsp;         "dominado"

&nbsp;       ],

&nbsp;       "yearPlan": {

&nbsp;         "type": "enum",

&nbsp;         "values": \[

&nbsp;           1,

&nbsp;           2,

&nbsp;           3

&nbsp;         ],

&nbsp;         "default": 1

&nbsp;       },

&nbsp;       "priorityIta": {

&nbsp;         "type": "enum",

&nbsp;         "values": \[

&nbsp;           "baixa",

&nbsp;           "media",

&nbsp;           "alta",

&nbsp;           "critica"

&nbsp;         ],

&nbsp;         "default": "media"

&nbsp;       },

&nbsp;       "startDate": {

&nbsp;         "type": "date"

&nbsp;       },

&nbsp;       "lastReviewedAt": {

&nbsp;         "type": "date"

&nbsp;       },

&nbsp;       "totalStudyMinutes": {

&nbsp;         "type": "number",

&nbsp;         "default": 0

&nbsp;       },

&nbsp;       "forOlympiad": {

&nbsp;         "type": "boolean",

&nbsp;         "default": false

&nbsp;       },

&nbsp;       "ankiDeck": {

&nbsp;         "type": "string"

&nbsp;       },

&nbsp;       "notes": {

&nbsp;         "type": "string"

&nbsp;       },

&nbsp;       "prerequisites": {

&nbsp;         "type": "string",

&nbsp;         "description": "Comma-separated Topic IDs"

&nbsp;       }

&nbsp;     },

&nbsp;     "cascadeRule": {

&nbsp;       "description": "Tópicos de Cálculo só podem iniciar (nao\_iniciado→em\_andamento) se TODOS os tópicos de Matemática do mesmo yearPlan tiverem status em \[base\_concluida, aprofundando, dominado]",

&nbsp;       "subjects": \[

&nbsp;         "calculo"

&nbsp;       ],

&nbsp;       "prerequisiteSubject": "matematica",

&nbsp;       "blockedTransition": {

&nbsp;         "from": "nao\_iniciado",

&nbsp;         "to": "em\_andamento"

&nbsp;       }

&nbsp;     },

&nbsp;     "advanceRules": {

&nbsp;       "setsStartDate": "When advancing to em\_andamento and startDate is empty",

&nbsp;       "setsLastReviewedAt": "On every advance except reverting to nao\_iniciado"

&nbsp;     },

&nbsp;     "editingRules": {

&nbsp;       "allStatusesEditable": true,

&nbsp;       "note": "Status nunca bloqueia edição. Qualquer tópico em qualquer status pode ser editado via TopicFormDialog.",

&nbsp;       "formFields": \[

&nbsp;         "subject",

&nbsp;         "area",

&nbsp;         "topic",

&nbsp;         "subtopic",

&nbsp;         "status",

&nbsp;         "yearPlan",

&nbsp;         "priorityIta",

&nbsp;         "ankiDeck",

&nbsp;         "notes",

&nbsp;         "forOlympiad"

&nbsp;       ]

&nbsp;     }

&nbsp;   },

&nbsp;   "ConceptualError": {

&nbsp;     "fields": {

&nbsp;       "date": {

&nbsp;         "type": "date"

&nbsp;       },

&nbsp;       "topicId": {

&nbsp;         "type": "string",

&nbsp;         "fk": "Topic"

&nbsp;       },

&nbsp;       "bookId": {

&nbsp;         "type": "string",

&nbsp;         "fk": "Book"

&nbsp;       },

&nbsp;       "descriptionGap": {

&nbsp;         "type": "string",

&nbsp;         "required": true

&nbsp;       },

&nbsp;       "context": {

&nbsp;         "type": "string",

&nbsp;         "required": true

&nbsp;       },

&nbsp;       "source": {

&nbsp;         "type": "enum",

&nbsp;         "values": \[

&nbsp;           "livro\_exercicio",

&nbsp;           "prova\_afa",

&nbsp;           "prova\_ime",

&nbsp;           "prova\_ita",

&nbsp;           "simulado",

&nbsp;           "olimpiada"

&nbsp;         ],

&nbsp;         "required": true

&nbsp;       },

&nbsp;       "gapType": {

&nbsp;         "type": "enum",

&nbsp;         "values": \[

&nbsp;           "conceito\_errado",

&nbsp;           "formula\_esquecida",

&nbsp;           "mecanismo\_nao\_visto",

&nbsp;           "conta\_incorreta",

&nbsp;           "aplicacao\_incompleta",

&nbsp;           "outro"

&nbsp;         ],

&nbsp;         "required": true

&nbsp;       },

&nbsp;       "severity": {

&nbsp;         "type": "enum",

&nbsp;         "values": \[

&nbsp;           "leve",

&nbsp;           "moderada",

&nbsp;           "grave"

&nbsp;         ],

&nbsp;         "required": true

&nbsp;       },

&nbsp;       "resolved": {

&nbsp;         "type": "boolean",

&nbsp;         "default": false

&nbsp;       },

&nbsp;       "iaAnalysis": {

&nbsp;         "type": "string",

&nbsp;         "description": "Markdown from AI analysis stub"

&nbsp;       },

&nbsp;       "cardsGenerated": {

&nbsp;         "type": "boolean",

&nbsp;         "default": false

&nbsp;       }

&nbsp;     }

&nbsp;   },

&nbsp;   "Flashcard": {

&nbsp;     "fields": {

&nbsp;       "topicId": {

&nbsp;         "type": "string",

&nbsp;         "fk": "Topic"

&nbsp;       },

&nbsp;       "bookId": {

&nbsp;         "type": "string",

&nbsp;         "fk": "Book"

&nbsp;       },

&nbsp;       "errorId": {

&nbsp;         "type": "string",

&nbsp;         "fk": "ConceptualError"

&nbsp;       },

&nbsp;       "front": {

&nbsp;         "type": "string",

&nbsp;         "required": true

&nbsp;       },

&nbsp;       "back": {

&nbsp;         "type": "string",

&nbsp;         "required": true

&nbsp;       },

&nbsp;       "type": {

&nbsp;         "type": "enum",

&nbsp;         "values": \[

&nbsp;           "conceito",

&nbsp;           "formula",

&nbsp;           "reacao\_quimica",

&nbsp;           "nomenclatura",

&nbsp;           "mecanismo",

&nbsp;           "erro\_recorrente"

&nbsp;         ],

&nbsp;         "required": true

&nbsp;       },

&nbsp;       "origin": {

&nbsp;         "type": "enum",

&nbsp;         "values": \[

&nbsp;           "ia\_gerada",

&nbsp;           "manual"

&nbsp;         ],

&nbsp;         "required": true

&nbsp;       },

&nbsp;       "ankiNoteId": {

&nbsp;         "type": "number",

&nbsp;         "description": "Anki note ID after sync"

&nbsp;       },

&nbsp;       "ankiDeck": {

&nbsp;         "type": "string",

&nbsp;         "required": true,

&nbsp;         "default": "ITA::Geral"

&nbsp;       },

&nbsp;       "synced": {

&nbsp;         "type": "boolean",

&nbsp;         "default": false

&nbsp;       }

&nbsp;     },

&nbsp;     "ankiSync": {

&nbsp;       "mockBehavior": "Sets synced=true and ankiNoteId=random(0,999999), delay 100ms per card",

&nbsp;       "realAction": "POST http://localhost:8765 { action: 'addNote', version: 6, params: { note: { deckName, modelName: 'Basic', fields: { Front, Back }, tags: \[type, 'ita-prep'] } } }",

&nbsp;       "verifyConnection": "POST http://localhost:8765 { action: 'version', version: 6 } → result >= 6"

&nbsp;     }

&nbsp;   },

&nbsp;   "Exam": {

&nbsp;     "fields": {

&nbsp;       "name": {

&nbsp;         "type": "string",

&nbsp;         "required": true

&nbsp;       },

&nbsp;       "board": {

&nbsp;         "type": "enum",

&nbsp;         "values": \[

&nbsp;           "AFA",

&nbsp;           "IME\_1fase",

&nbsp;           "IME\_2fase",

&nbsp;           "ITA\_1fase",

&nbsp;           "ITA\_2fase",

&nbsp;           "FUVEST",

&nbsp;           "UNICAMP",

&nbsp;           "OBMEP",

&nbsp;           "OBF",

&nbsp;           "OBQ"

&nbsp;         ],

&nbsp;         "required": true

&nbsp;       },

&nbsp;       "year": {

&nbsp;         "type": "number",

&nbsp;         "required": true

&nbsp;       },

&nbsp;       "dateReal": {

&nbsp;         "type": "date"

&nbsp;       },

&nbsp;       "timeAvailableMin": {

&nbsp;         "type": "number"

&nbsp;       },

&nbsp;       "timeUsedMin": {

&nbsp;         "type": "number"

&nbsp;       },

&nbsp;       "percentTime": {

&nbsp;         "type": "number",

&nbsp;         "computed": "Math.round((timeUsedMin / timeAvailableMin) \* 10000) / 100"

&nbsp;       },

&nbsp;       "score": {

&nbsp;         "type": "number"

&nbsp;       },

&nbsp;       "scoreMax": {

&nbsp;         "type": "number"

&nbsp;       },

&nbsp;       "percentCorrect": {

&nbsp;         "type": "number",

&nbsp;         "computed": "Math.round((score / scoreMax) \* 10000) / 100"

&nbsp;       },

&nbsp;       "status": {

&nbsp;         "type": "enum",

&nbsp;         "values": \[

&nbsp;           "planejada",

&nbsp;           "realizada"

&nbsp;         ],

&nbsp;         "default": "planejada"

&nbsp;       },

&nbsp;       "notes": {

&nbsp;         "type": "string"

&nbsp;       }

&nbsp;     }

&nbsp;   },

&nbsp;   "StudySession": {

&nbsp;     "fields": {

&nbsp;       "topicId": {

&nbsp;         "type": "string",

&nbsp;         "fk": "Topic"

&nbsp;       },

&nbsp;       "topicName": {

&nbsp;         "type": "string",

&nbsp;         "required": true,

&nbsp;         "note": "Denormalized for display"

&nbsp;       },

&nbsp;       "bookId": {

&nbsp;         "type": "string",

&nbsp;         "fk": "Book"

&nbsp;       },

&nbsp;       "date": {

&nbsp;         "type": "date",

&nbsp;         "autoSet": "new Date().toISOString().split('T')\[0] on create"

&nbsp;       },

&nbsp;       "durationMinutes": {

&nbsp;         "type": "number",

&nbsp;         "required": true

&nbsp;       },

&nbsp;       "pomodoroCount": {

&nbsp;         "type": "number",

&nbsp;         "default": 0,

&nbsp;         "note": "Captured from live timer at submit"

&nbsp;       },

&nbsp;       "type": {

&nbsp;         "type": "enum",

&nbsp;         "values": \[

&nbsp;           "teoria",

&nbsp;           "exercicios",

&nbsp;           "revisao",

&nbsp;           "prova",

&nbsp;           "olimpiada"

&nbsp;         ],

&nbsp;         "default": "teoria"

&nbsp;       },

&nbsp;       "notes": {

&nbsp;         "type": "string"

&nbsp;       },

&nbsp;       "quality": {

&nbsp;         "type": "enum",

&nbsp;         "values": \[

&nbsp;           1,

&nbsp;           2,

&nbsp;           3,

&nbsp;           4,

&nbsp;           5

&nbsp;         ]

&nbsp;       }

&nbsp;     },

&nbsp;     "pomodoro": {

&nbsp;       "defaultWork": 25,

&nbsp;       "defaultBreak": 5,

&nbsp;       "cycle": "work → break → work → ... → longBreak every N sets",

&nbsp;       "timerImplementation": "useEffect + setInterval decrementing seconds, useRef to store intervalId",

&nbsp;       "stateVars": \[

&nbsp;         "pomodoroActive",

&nbsp;         "pomodoroTime",

&nbsp;         "isBreak",

&nbsp;         "pomodoroCount"

&nbsp;       ]

&nbsp;     }

&nbsp;   },

&nbsp;   "Olympiad": {

&nbsp;     "fields": {

&nbsp;       "name": {

&nbsp;         "type": "string",

&nbsp;         "required": true

&nbsp;       },

&nbsp;       "type": {

&nbsp;         "type": "enum",

&nbsp;         "values": \[

&nbsp;           "OBMEP",

&nbsp;           "OBF",

&nbsp;           "OBQ",

&nbsp;           "OBM",

&nbsp;           "OBI",

&nbsp;           "OBFEP",

&nbsp;           "outra"

&nbsp;         ],

&nbsp;         "required": true

&nbsp;       },

&nbsp;       "year": {

&nbsp;         "type": "number",

&nbsp;         "required": true

&nbsp;       },

&nbsp;       "phase": {

&nbsp;         "type": "enum",

&nbsp;         "values": \[

&nbsp;           "1fase",

&nbsp;           "2fase",

&nbsp;           "3fase",

&nbsp;           "final"

&nbsp;         ]

&nbsp;       },

&nbsp;       "date": {

&nbsp;         "type": "date"

&nbsp;       },

&nbsp;       "score": {

&nbsp;         "type": "number"

&nbsp;       },

&nbsp;       "scoreMax": {

&nbsp;         "type": "number"

&nbsp;       },

&nbsp;       "medal": {

&nbsp;         "type": "enum",

&nbsp;         "values": \[

&nbsp;           "nenhuma",

&nbsp;           "honra\_ao\_merito",

&nbsp;           "bronze",

&nbsp;           "prata",

&nbsp;           "ouro"

&nbsp;         ],

&nbsp;         "default": "nenhuma"

&nbsp;       },

&nbsp;       "status": {

&nbsp;         "type": "enum",

&nbsp;         "values": \[

&nbsp;           "inscrito",

&nbsp;           "realizada",

&nbsp;           "resultado"

&nbsp;         ],

&nbsp;         "default": "inscrito"

&nbsp;       },

&nbsp;       "notes": {

&nbsp;         "type": "string"

&nbsp;       }

&nbsp;     }

&nbsp;   },

&nbsp;   "FeynmanSession": {

&nbsp;     "fields": {

&nbsp;       "topicId": {

&nbsp;         "type": "string",

&nbsp;         "fk": "Topic"

&nbsp;       },

&nbsp;       "topicName": {

&nbsp;         "type": "string",

&nbsp;         "required": true

&nbsp;       },

&nbsp;       "explanation": {

&nbsp;         "type": "string",

&nbsp;         "required": true

&nbsp;       },

&nbsp;       "iaScore": {

&nbsp;         "type": "number",

&nbsp;         "range": \[

&nbsp;           0,

&nbsp;           10

&nbsp;         ]

&nbsp;       },

&nbsp;       "iaFeedback": {

&nbsp;         "type": "string",

&nbsp;         "description": "Markdown from AI evaluation"

&nbsp;       },

&nbsp;       "approved": {

&nbsp;         "type": "boolean",

&nbsp;         "default": false,

&nbsp;         "rule": "score >= 8"

&nbsp;       },

&nbsp;       "attemptNumber": {

&nbsp;         "type": "number",

&nbsp;         "default": 1

&nbsp;       },

&nbsp;       "date": {

&nbsp;         "type": "date"

&nbsp;       }

&nbsp;     },

&nbsp;     "aiStub": {

&nbsp;       "scoreGeneration": "Math.floor(Math.random() \* 4) + 6  // 6..9",

&nbsp;       "approvalThreshold": 8,

&nbsp;       "feedbackTemplate": "## Avaliação\\n\*\*Nota: {score}/10\*\*\\n### Pontos Fortes\\n...\\n### Melhorias\\n...\\n### Sugestão\\n...",

&nbsp;       "realOllamaPrompt": "Você é um tutor Feynman avaliando se um estudante de vestibular ITA realmente entendeu um conceito. Avalie de 0-10 e retorne JSON: { score, approved, feedback\_markdown }"

&nbsp;     }

&nbsp;   },

&nbsp;   "AppSettings": {

&nbsp;     "fields": {

&nbsp;       "theme": {

&nbsp;         "type": "enum",

&nbsp;         "values": \[

&nbsp;           "light",

&nbsp;           "dark"

&nbsp;         ],

&nbsp;         "default": "dark"

&nbsp;       },

&nbsp;       "pomodoroWork": {

&nbsp;         "type": "number",

&nbsp;         "default": 25

&nbsp;       },

&nbsp;       "pomodoroBreak": {

&nbsp;         "type": "number",

&nbsp;         "default": 5

&nbsp;       },

&nbsp;       "pomodoroLongBreak": {

&nbsp;         "type": "number",

&nbsp;         "default": 15

&nbsp;       },

&nbsp;       "pomodoroSetsBeforeLong": {

&nbsp;         "type": "number",

&nbsp;         "default": 4

&nbsp;       },

&nbsp;       "ollamaUrl": {

&nbsp;         "type": "string",

&nbsp;         "default": "http://localhost:11434"

&nbsp;       },

&nbsp;       "ollamaModel": {

&nbsp;         "type": "string",

&nbsp;         "default": "qwen2.5:14b"

&nbsp;       },

&nbsp;       "ankiConnectUrl": {

&nbsp;         "type": "string",

&nbsp;         "default": "http://localhost:8765"

&nbsp;       },

&nbsp;       "seeded": {

&nbsp;         "type": "boolean",

&nbsp;         "default": false

&nbsp;       }

&nbsp;     },

&nbsp;     "singleton": true,

&nbsp;     "note": "Only one record expected. Settings page does update-or-create."

&nbsp;   }

&nbsp; },

&nbsp; "seed": {

&nbsp;   "mechanism": "useSeed hook (components/seed/useSeed.js) runs on Dashboard mount",

&nbsp;   "detection": \[

&nbsp;     "1. Query AppSettings.list() — if exists and settings\[0].seeded===true → skip",

&nbsp;     "2. Else query Book.list() — if books already exist → mark seeded and skip",

&nbsp;     "3. Else run full seed"

&nbsp;   ],

&nbsp;   "booksBatchSize": 10,

&nbsp;   "topicsBatchSize": 15,

&nbsp;   "order": \[

&nbsp;     "Books (bulkCreate in batches of 10)",

&nbsp;     "Topics (bulkCreate in batches of 15)",

&nbsp;     "AppSettings.create({ seeded: true, theme: 'dark' })"

&nbsp;   ],

&nbsp;   "books": \[

&nbsp;     {

&nbsp;       "title": "Fundamentos de Matemática Elementar Vol. 1 — Conjuntos e Funções",

&nbsp;       "author": "Gelson Iezzi",

&nbsp;       "subject": "matematica",

&nbsp;       "phase": "base",

&nbsp;       "priority": "essencial",

&nbsp;       "notes": "Base absoluta. Cobrir cap. 1-10."

&nbsp;     },

&nbsp;     {

&nbsp;       "title": "Fundamentos de Matemática Elementar Vol. 2 — Logaritmos",

&nbsp;       "author": "Gelson Iezzi",

&nbsp;       "subject": "matematica",

&nbsp;       "phase": "base",

&nbsp;       "priority": "essencial"

&nbsp;     },

&nbsp;     {

&nbsp;       "title": "Fundamentos de Matemática Elementar Vol. 3 — Trigonometria",

&nbsp;       "author": "Gelson Iezzi",

&nbsp;       "subject": "matematica",

&nbsp;       "phase": "base",

&nbsp;       "priority": "essencial"

&nbsp;     },

&nbsp;     {

&nbsp;       "title": "Fundamentos de Matemática Elementar Vol. 4 — Sequências e Séries",

&nbsp;       "author": "Gelson Iezzi",

&nbsp;       "subject": "matematica",

&nbsp;       "phase": "base",

&nbsp;       "priority": "essencial"

&nbsp;     },

&nbsp;     {

&nbsp;       "title": "Fundamentos de Matemática Elementar Vol. 5 — Combinatória e Probabilidade",

&nbsp;       "author": "Gelson Iezzi",

&nbsp;       "subject": "matematica",

&nbsp;       "phase": "base",

&nbsp;       "priority": "essencial"

&nbsp;     },

&nbsp;     {

&nbsp;       "title": "Fundamentos de Matemática Elementar Vol. 6 — Complexos e Polinômios",

&nbsp;       "author": "Gelson Iezzi",

&nbsp;       "subject": "matematica",

&nbsp;       "phase": "base",

&nbsp;       "priority": "essencial"

&nbsp;     },

&nbsp;     {

&nbsp;       "title": "Fundamentos de Matemática Elementar Vol. 7 — Geometria Analítica",

&nbsp;       "author": "Gelson Iezzi",

&nbsp;       "subject": "matematica",

&nbsp;       "phase": "base",

&nbsp;       "priority": "essencial"

&nbsp;     },

&nbsp;     {

&nbsp;       "title": "Fundamentos de Matemática Elementar Vol. 9 — Geometria Plana",

&nbsp;       "author": "Gelson Iezzi",

&nbsp;       "subject": "matematica",

&nbsp;       "phase": "base",

&nbsp;       "priority": "essencial"

&nbsp;     },

&nbsp;     {

&nbsp;       "title": "Fundamentos de Matemática Elementar Vol. 10 — Geometria Espacial",

&nbsp;       "author": "Gelson Iezzi",

&nbsp;       "subject": "matematica",

&nbsp;       "phase": "base",

&nbsp;       "priority": "essencial"

&nbsp;     },

&nbsp;     {

&nbsp;       "title": "Geometria Euclidiana Plana",

&nbsp;       "author": "João Lucas Marques Barbosa",

&nbsp;       "subject": "matematica",

&nbsp;       "phase": "aprofundamento",

&nbsp;       "priority": "essencial",

&nbsp;       "notes": "Demonstrações rigorosas. Nível IME/ITA."

&nbsp;     },

&nbsp;     {

&nbsp;       "title": "Curso de Análise Vol. 1",

&nbsp;       "author": "Elon Lages Lima",

&nbsp;       "subject": "matematica",

&nbsp;       "phase": "aprofundamento",

&nbsp;       "priority": "recomendado",

&nbsp;       "notes": "Para quem quer ir além. Fundamento teórico."

&nbsp;     },

&nbsp;     {

&nbsp;       "title": "Problemas Selecionados de Matemática",

&nbsp;       "author": "IMPA / Carlos Moreira",

&nbsp;       "subject": "matematica",

&nbsp;       "phase": "aprofundamento",

&nbsp;       "priority": "essencial",

&nbsp;       "notes": "Olimpíada + vestibular ITA."

&nbsp;     },

&nbsp;     {

&nbsp;       "title": "Números e Funções Reais",

&nbsp;       "author": "Elon Lages Lima",

&nbsp;       "subject": "matematica",

&nbsp;       "phase": "aprofundamento",

&nbsp;       "priority": "recomendado"

&nbsp;     },

&nbsp;     {

&nbsp;       "title": "Matemática para os Curiosos (Resolução IME/ITA)",

&nbsp;       "author": "Tábuas do IME",

&nbsp;       "subject": "matematica",

&nbsp;       "phase": "aprofundamento",

&nbsp;       "priority": "recomendado",

&nbsp;       "notes": "Listas resolvidas."

&nbsp;     },

&nbsp;     {

&nbsp;       "title": "Tópicos de Física Vol. 1 — Mecânica",

&nbsp;       "author": "Gualter, Helou, Newton",

&nbsp;       "subject": "fisica",

&nbsp;       "phase": "base",

&nbsp;       "priority": "essencial"

&nbsp;     },

&nbsp;     {

&nbsp;       "title": "Tópicos de Física Vol. 2 — Termologia, Ondas, Óptica",

&nbsp;       "author": "Gualter, Helou, Newton",

&nbsp;       "subject": "fisica",

&nbsp;       "phase": "base",

&nbsp;       "priority": "essencial"

&nbsp;     },

&nbsp;     {

&nbsp;       "title": "Tópicos de Física Vol. 3 — Eletricidade e Física Moderna",

&nbsp;       "author": "Gualter, Helou, Newton",

&nbsp;       "subject": "fisica",

&nbsp;       "phase": "base",

&nbsp;       "priority": "essencial"

&nbsp;     },

&nbsp;     {

&nbsp;       "title": "Fundamentos de Física Vol. 1 — Mecânica",

&nbsp;       "author": "Halliday, Resnick, Walker",

&nbsp;       "subject": "fisica",

&nbsp;       "phase": "base",

&nbsp;       "priority": "essencial",

&nbsp;       "notes": "Referência clássica universitária."

&nbsp;     },

&nbsp;     {

&nbsp;       "title": "Fundamentos de Física Vol. 2 — Gravitação, Ondas, Termodinâmica",

&nbsp;       "author": "Halliday, Resnick, Walker",

&nbsp;       "subject": "fisica",

&nbsp;       "phase": "base",

&nbsp;       "priority": "essencial"

&nbsp;     },

&nbsp;     {

&nbsp;       "title": "Fundamentos de Física Vol. 3 — Eletromagnetismo",

&nbsp;       "author": "Halliday, Resnick, Walker",

&nbsp;       "subject": "fisica",

&nbsp;       "phase": "base",

&nbsp;       "priority": "essencial"

&nbsp;     },

&nbsp;     {

&nbsp;       "title": "Fundamentos de Física Vol. 4 — Óptica e Física Moderna",

&nbsp;       "author": "Halliday, Resnick, Walker",

&nbsp;       "subject": "fisica",

&nbsp;       "phase": "base",

&nbsp;       "priority": "recomendado"

&nbsp;     },

&nbsp;     {

&nbsp;       "title": "Problemas de Física — Saraeva",

&nbsp;       "author": "I. E. Irodov (adaptação)",

&nbsp;       "subject": "fisica",

&nbsp;       "phase": "aprofundamento",

&nbsp;       "priority": "essencial",

&nbsp;       "notes": "Nível olímpico / ITA 2ª fase."

&nbsp;     },

&nbsp;     {

&nbsp;       "title": "Mecânica — Berkeley Physics",

&nbsp;       "author": "Charles Kittel",

&nbsp;       "subject": "fisica",

&nbsp;       "phase": "aprofundamento",

&nbsp;       "priority": "recomendado"

&nbsp;     },

&nbsp;     {

&nbsp;       "title": "Problemas Selecionados de Física — Saraeva/Irodov",

&nbsp;       "author": "Irodov",

&nbsp;       "subject": "fisica",

&nbsp;       "phase": "aprofundamento",

&nbsp;       "priority": "essencial",

&nbsp;       "notes": "Dificuldade extrema. Ideal para 3o ano."

&nbsp;     },

&nbsp;     {

&nbsp;       "title": "Química — Feltre Vol. 1 — Geral",

&nbsp;       "author": "Ricardo Feltre",

&nbsp;       "subject": "quimica",

&nbsp;       "phase": "base",

&nbsp;       "priority": "essencial"

&nbsp;     },

&nbsp;     {

&nbsp;       "title": "Química — Feltre Vol. 2 — Físico-Química",

&nbsp;       "author": "Ricardo Feltre",

&nbsp;       "subject": "quimica",

&nbsp;       "phase": "base",

&nbsp;       "priority": "essencial"

&nbsp;     },

&nbsp;     {

&nbsp;       "title": "Química — Feltre Vol. 3 — Orgânica",

&nbsp;       "author": "Ricardo Feltre",

&nbsp;       "subject": "quimica",

&nbsp;       "phase": "base",

&nbsp;       "priority": "essencial"

&nbsp;     },

&nbsp;     {

&nbsp;       "title": "Princípios de Química — Atkins",

&nbsp;       "author": "Peter Atkins, Loretta Jones",

&nbsp;       "subject": "quimica",

&nbsp;       "phase": "base",

&nbsp;       "priority": "recomendado",

&nbsp;       "notes": "Referência universitária. Usar para dúvidas pontuais."

&nbsp;     },

&nbsp;     {

&nbsp;       "title": "Química Inorgânica — Shriver \& Atkins",

&nbsp;       "author": "Shriver \& Atkins",

&nbsp;       "subject": "quimica",

&nbsp;       "phase": "aprofundamento",

&nbsp;       "priority": "recomendado",

&nbsp;       "notes": "Aprofundamento em inorgânica para ITA."

&nbsp;     },

&nbsp;     {

&nbsp;       "title": "Organic Chemistry — Clayden",

&nbsp;       "author": "Jonathan Clayden",

&nbsp;       "subject": "quimica",

&nbsp;       "phase": "aprofundamento",

&nbsp;       "priority": "recomendado",

&nbsp;       "notes": "Orgânica avançada. Mecanismos detalhados."

&nbsp;     },

&nbsp;     {

&nbsp;       "title": "Problemas de Química para ITA/IME",

&nbsp;       "author": "Dorival / Renato Carvalho",

&nbsp;       "subject": "quimica",

&nbsp;       "phase": "aprofundamento",

&nbsp;       "priority": "essencial",

&nbsp;       "notes": "Listas focadas."

&nbsp;     },

&nbsp;     {

&nbsp;       "title": "Cálculo Vol. 1",

&nbsp;       "author": "James Stewart",

&nbsp;       "subject": "calculo",

&nbsp;       "phase": "base",

&nbsp;       "priority": "essencial",

&nbsp;       "notes": "Limites, derivadas, integrais. Obrigatório."

&nbsp;     },

&nbsp;     {

&nbsp;       "title": "Cálculo Vol. 2",

&nbsp;       "author": "James Stewart",

&nbsp;       "subject": "calculo",

&nbsp;       "phase": "aprofundamento",

&nbsp;       "priority": "recomendado",

&nbsp;       "notes": "Séries e funções de várias variáveis."

&nbsp;     },

&nbsp;     {

&nbsp;       "title": "Cálculo com Geometria Analítica Vol. 1",

&nbsp;       "author": "Louis Leithold",

&nbsp;       "subject": "calculo",

&nbsp;       "phase": "base",

&nbsp;       "priority": "recomendado"

&nbsp;     },

&nbsp;     {

&nbsp;       "title": "Um Curso de Cálculo Vol. 1",

&nbsp;       "author": "Hamilton Luiz Guidorizzi",

&nbsp;       "subject": "calculo",

&nbsp;       "phase": "base",

&nbsp;       "priority": "recomendado",

&nbsp;       "notes": "Mais teórico. Bom complemento."

&nbsp;     },

&nbsp;     {

&nbsp;       "title": "Redação para Vestibulares Militares",

&nbsp;       "author": "Vários",

&nbsp;       "subject": "geral",

&nbsp;       "phase": "base",

&nbsp;       "priority": "recomendado",

&nbsp;       "notes": "Redação é eliminatória em AFA e IME."

&nbsp;     },

&nbsp;     {

&nbsp;       "title": "Inglês Instrumental para Provas Militares",

&nbsp;       "author": "Vários",

&nbsp;       "subject": "geral",

&nbsp;       "phase": "base",

&nbsp;       "priority": "opcional",

&nbsp;       "notes": "ITA cobra inglês. Revisar vocabulário técnico."

&nbsp;     },

&nbsp;     {

&nbsp;       "title": "Português para Concursos e Vestibulares",

&nbsp;       "author": "Vários",

&nbsp;       "subject": "geral",

&nbsp;       "phase": "base",

&nbsp;       "priority": "recomendado"

&nbsp;     },

&nbsp;     {

&nbsp;       "title": "Resolução de Provas ITA (1990-2024)",

&nbsp;       "author": "Poliedro / Objetivo",

&nbsp;       "subject": "geral",

&nbsp;       "phase": "aprofundamento",

&nbsp;       "priority": "essencial",

&nbsp;       "notes": "Resolver TODAS. A prova do ITA é o melhor material."

&nbsp;     },

&nbsp;     {

&nbsp;       "title": "Resolução de Provas IME (2000-2024)",

&nbsp;       "author": "Poliedro / Anglo",

&nbsp;       "subject": "geral",

&nbsp;       "phase": "aprofundamento",

&nbsp;       "priority": "essencial"

&nbsp;     },

&nbsp;     {

&nbsp;       "title": "Resolução de Provas AFA (2010-2024)",

&nbsp;       "author": "Vários",

&nbsp;       "subject": "geral",

&nbsp;       "phase": "base",

&nbsp;       "priority": "essencial",

&nbsp;       "notes": "AFA é objetivo intermediário de treino."

&nbsp;     }

&nbsp;   ],

&nbsp;   "topics": \[

&nbsp;     {

&nbsp;       "subject": "matematica",

&nbsp;       "area": "Conjuntos e Lógica",

&nbsp;       "topic": "Teoria de Conjuntos",

&nbsp;       "yearPlan": 1,

&nbsp;       "priorityIta": "alta"

&nbsp;     },

&nbsp;     {

&nbsp;       "subject": "matematica",

&nbsp;       "area": "Conjuntos e Lógica",

&nbsp;       "topic": "Lógica Proposicional",

&nbsp;       "yearPlan": 1,

&nbsp;       "priorityIta": "media"

&nbsp;     },

&nbsp;     {

&nbsp;       "subject": "matematica",

&nbsp;       "area": "Funções",

&nbsp;       "topic": "Funções do 1º e 2º Grau",

&nbsp;       "yearPlan": 1,

&nbsp;       "priorityIta": "critica"

&nbsp;     },

&nbsp;     {

&nbsp;       "subject": "matematica",

&nbsp;       "area": "Funções",

&nbsp;       "topic": "Função Exponencial",

&nbsp;       "yearPlan": 1,

&nbsp;       "priorityIta": "critica"

&nbsp;     },

&nbsp;     {

&nbsp;       "subject": "matematica",

&nbsp;       "area": "Funções",

&nbsp;       "topic": "Função Logarítmica",

&nbsp;       "yearPlan": 1,

&nbsp;       "priorityIta": "critica"

&nbsp;     },

&nbsp;     {

&nbsp;       "subject": "matematica",

&nbsp;       "area": "Funções",

&nbsp;       "topic": "Função Modular",

&nbsp;       "yearPlan": 1,

&nbsp;       "priorityIta": "alta"

&nbsp;     },

&nbsp;     {

&nbsp;       "subject": "matematica",

&nbsp;       "area": "Funções",

&nbsp;       "topic": "Composição e Inversas",

&nbsp;       "yearPlan": 1,

&nbsp;       "priorityIta": "alta"

&nbsp;     },

&nbsp;     {

&nbsp;       "subject": "matematica",

&nbsp;       "area": "Trigonometria",

&nbsp;       "topic": "Razões Trigonométricas",

&nbsp;       "yearPlan": 1,

&nbsp;       "priorityIta": "critica"

&nbsp;     },

&nbsp;     {

&nbsp;       "subject": "matematica",

&nbsp;       "area": "Trigonometria",

&nbsp;       "topic": "Funções Trigonométricas",

&nbsp;       "yearPlan": 1,

&nbsp;       "priorityIta": "critica"

&nbsp;     },

&nbsp;     {

&nbsp;       "subject": "matematica",

&nbsp;       "area": "Trigonometria",

&nbsp;       "topic": "Equações e Inequações Trigonométricas",

&nbsp;       "yearPlan": 1,

&nbsp;       "priorityIta": "critica"

&nbsp;     },

&nbsp;     {

&nbsp;       "subject": "matematica",

&nbsp;       "area": "Trigonometria",

&nbsp;       "topic": "Identidades e Transformações",

&nbsp;       "yearPlan": 1,

&nbsp;       "priorityIta": "alta"

&nbsp;     },

&nbsp;     {

&nbsp;       "subject": "matematica",

&nbsp;       "area": "Sequências",

&nbsp;       "topic": "Progressão Aritmética (PA)",

&nbsp;       "yearPlan": 1,

&nbsp;       "priorityIta": "alta"

&nbsp;     },

&nbsp;     {

&nbsp;       "subject": "matematica",

&nbsp;       "area": "Sequências",

&nbsp;       "topic": "Progressão Geométrica (PG)",

&nbsp;       "yearPlan": 1,

&nbsp;       "priorityIta": "alta"

&nbsp;     },

&nbsp;     {

&nbsp;       "subject": "matematica",

&nbsp;       "area": "Sequências",

&nbsp;       "topic": "Séries e Somatórios",

&nbsp;       "yearPlan": 2,

&nbsp;       "priorityIta": "critica"

&nbsp;     },

&nbsp;     {

&nbsp;       "subject": "matematica",

&nbsp;       "area": "Análise Combinatória",

&nbsp;       "topic": "Princípio Fundamental da Contagem",

&nbsp;       "yearPlan": 1,

&nbsp;       "priorityIta": "critica"

&nbsp;     },

&nbsp;     {

&nbsp;       "subject": "matematica",

&nbsp;       "area": "Análise Combinatória",

&nbsp;       "topic": "Permutações e Combinações",

&nbsp;       "yearPlan": 1,

&nbsp;       "priorityIta": "critica"

&nbsp;     },

&nbsp;     {

&nbsp;       "subject": "matematica",

&nbsp;       "area": "Análise Combinatória",

&nbsp;       "topic": "Binômio de Newton",

&nbsp;       "yearPlan": 2,

&nbsp;       "priorityIta": "critica"

&nbsp;     },

&nbsp;     {

&nbsp;       "subject": "matematica",

&nbsp;       "area": "Probabilidade",

&nbsp;       "topic": "Probabilidade Clássica e Condicional",

&nbsp;       "yearPlan": 2,

&nbsp;       "priorityIta": "critica"

&nbsp;     },

&nbsp;     {

&nbsp;       "subject": "matematica",

&nbsp;       "area": "Probabilidade",

&nbsp;       "topic": "Distribuição Binomial",

&nbsp;       "yearPlan": 2,

&nbsp;       "priorityIta": "alta"

&nbsp;     },

&nbsp;     {

&nbsp;       "subject": "matematica",

&nbsp;       "area": "Números Complexos",

&nbsp;       "topic": "Forma Algébrica e Trigonométrica",

&nbsp;       "yearPlan": 2,

&nbsp;       "priorityIta": "critica"

&nbsp;     },

&nbsp;     {

&nbsp;       "subject": "matematica",

&nbsp;       "area": "Números Complexos",

&nbsp;       "topic": "Fórmula de De Moivre e Raízes",

&nbsp;       "yearPlan": 2,

&nbsp;       "priorityIta": "critica"

&nbsp;     },

&nbsp;     {

&nbsp;       "subject": "matematica",

&nbsp;       "area": "Polinômios",

&nbsp;       "topic": "Operações com Polinômios",

&nbsp;       "yearPlan": 2,

&nbsp;       "priorityIta": "alta"

&nbsp;     },

&nbsp;     {

&nbsp;       "subject": "matematica",

&nbsp;       "area": "Polinômios",

&nbsp;       "topic": "Equações Polinomiais e Relações de Girard",

&nbsp;       "yearPlan": 2,

&nbsp;       "priorityIta": "critica"

&nbsp;     },

&nbsp;     {

&nbsp;       "subject": "matematica",

&nbsp;       "area": "Geometria Analítica",

&nbsp;       "topic": "Ponto e Reta",

&nbsp;       "yearPlan": 1,

&nbsp;       "priorityIta": "critica"

&nbsp;     },

&nbsp;     {

&nbsp;       "subject": "matematica",

&nbsp;       "area": "Geometria Analítica",

&nbsp;       "topic": "Circunferência",

&nbsp;       "yearPlan": 1,

&nbsp;       "priorityIta": "critica"

&nbsp;     },

&nbsp;     {

&nbsp;       "subject": "matematica",

&nbsp;       "area": "Geometria Analítica",

&nbsp;       "topic": "Cônicas: Elipse, Hipérbole, Parábola",

&nbsp;       "yearPlan": 2,

&nbsp;       "priorityIta": "critica"

&nbsp;     },

&nbsp;     {

&nbsp;       "subject": "matematica",

&nbsp;       "area": "Geometria Plana",

&nbsp;       "topic": "Triângulos e Congruência",

&nbsp;       "yearPlan": 1,

&nbsp;       "priorityIta": "critica"

&nbsp;     },

&nbsp;     {

&nbsp;       "subject": "matematica",

&nbsp;       "area": "Geometria Plana",

&nbsp;       "topic": "Semelhança e Teorema de Tales",

&nbsp;       "yearPlan": 1,

&nbsp;       "priorityIta": "alta"

&nbsp;     },

&nbsp;     {

&nbsp;       "subject": "matematica",

&nbsp;       "area": "Geometria Plana",

&nbsp;       "topic": "Circunferência e Polígonos Inscritos",

&nbsp;       "yearPlan": 2,

&nbsp;       "priorityIta": "critica"

&nbsp;     },

&nbsp;     {

&nbsp;       "subject": "matematica",

&nbsp;       "area": "Geometria Plana",

&nbsp;       "topic": "Áreas de Figuras Planas",

&nbsp;       "yearPlan": 1,

&nbsp;       "priorityIta": "alta"

&nbsp;     },

&nbsp;     {

&nbsp;       "subject": "matematica",

&nbsp;       "area": "Geometria Espacial",

&nbsp;       "topic": "Prismas e Pirâmides",

&nbsp;       "yearPlan": 2,

&nbsp;       "priorityIta": "alta"

&nbsp;     },

&nbsp;     {

&nbsp;       "subject": "matematica",

&nbsp;       "area": "Geometria Espacial",

&nbsp;       "topic": "Cilindros, Cones e Esferas",

&nbsp;       "yearPlan": 2,

&nbsp;       "priorityIta": "alta"

&nbsp;     },

&nbsp;     {

&nbsp;       "subject": "matematica",

&nbsp;       "area": "Geometria Espacial",

&nbsp;       "topic": "Posições Relativas e Projeções",

&nbsp;       "yearPlan": 2,

&nbsp;       "priorityIta": "alta"

&nbsp;     },

&nbsp;     {

&nbsp;       "subject": "matematica",

&nbsp;       "area": "Matrizes e Sistemas",

&nbsp;       "topic": "Matrizes e Determinantes",

&nbsp;       "yearPlan": 1,

&nbsp;       "priorityIta": "critica"

&nbsp;     },

&nbsp;     {

&nbsp;       "subject": "matematica",

&nbsp;       "area": "Matrizes e Sistemas",

&nbsp;       "topic": "Sistemas Lineares",

&nbsp;       "yearPlan": 1,

&nbsp;       "priorityIta": "critica"

&nbsp;     },

&nbsp;     {

&nbsp;       "subject": "fisica",

&nbsp;       "area": "Mecânica",

&nbsp;       "topic": "Cinemática Escalar e Vetorial",

&nbsp;       "yearPlan": 1,

&nbsp;       "priorityIta": "critica"

&nbsp;     },

&nbsp;     {

&nbsp;       "subject": "fisica",

&nbsp;       "area": "Mecânica",

&nbsp;       "topic": "Leis de Newton",

&nbsp;       "yearPlan": 1,

&nbsp;       "priorityIta": "critica"

&nbsp;     },

&nbsp;     {

&nbsp;       "subject": "fisica",

&nbsp;       "area": "Mecânica",

&nbsp;       "topic": "Trabalho e Energia",

&nbsp;       "yearPlan": 1,

&nbsp;       "priorityIta": "critica"

&nbsp;     },

&nbsp;     {

&nbsp;       "subject": "fisica",

&nbsp;       "area": "Mecânica",

&nbsp;       "topic": "Impulso e Quantidade de Movimento",

&nbsp;       "yearPlan": 1,

&nbsp;       "priorityIta": "critica"

&nbsp;     },

&nbsp;     {

&nbsp;       "subject": "fisica",

&nbsp;       "area": "Mecânica",

&nbsp;       "topic": "Gravitação Universal",

&nbsp;       "yearPlan": 2,

&nbsp;       "priorityIta": "alta"

&nbsp;     },

&nbsp;     {

&nbsp;       "subject": "fisica",

&nbsp;       "area": "Mecânica",

&nbsp;       "topic": "Estática e Torque",

&nbsp;       "yearPlan": 1,

&nbsp;       "priorityIta": "alta"

&nbsp;     },

&nbsp;     {

&nbsp;       "subject": "fisica",

&nbsp;       "area": "Mecânica",

&nbsp;       "topic": "Hidrostática",

&nbsp;       "yearPlan": 1,

&nbsp;       "priorityIta": "alta"

&nbsp;     },

&nbsp;     {

&nbsp;       "subject": "fisica",

&nbsp;       "area": "Mecânica",

&nbsp;       "topic": "Movimento Circular",

&nbsp;       "yearPlan": 1,

&nbsp;       "priorityIta": "critica"

&nbsp;     },

&nbsp;     {

&nbsp;       "subject": "fisica",

&nbsp;       "area": "Termologia",

&nbsp;       "topic": "Temperatura e Dilatação",

&nbsp;       "yearPlan": 1,

&nbsp;       "priorityIta": "media"

&nbsp;     },

&nbsp;     {

&nbsp;       "subject": "fisica",

&nbsp;       "area": "Termologia",

&nbsp;       "topic": "Calorimetria e Mudança de Fase",

&nbsp;       "yearPlan": 1,

&nbsp;       "priorityIta": "alta"

&nbsp;     },

&nbsp;     {

&nbsp;       "subject": "fisica",

&nbsp;       "area": "Termologia",

&nbsp;       "topic": "Gases Ideais e Termodinâmica",

&nbsp;       "yearPlan": 2,

&nbsp;       "priorityIta": "critica"

&nbsp;     },

&nbsp;     {

&nbsp;       "subject": "fisica",

&nbsp;       "area": "Ondas",

&nbsp;       "topic": "MHS e Ondas Mecânicas",

&nbsp;       "yearPlan": 2,

&nbsp;       "priorityIta": "critica"

&nbsp;     },

&nbsp;     {

&nbsp;       "subject": "fisica",

&nbsp;       "area": "Ondas",

&nbsp;       "topic": "Acústica",

&nbsp;       "yearPlan": 2,

&nbsp;       "priorityIta": "media"

&nbsp;     },

&nbsp;     {

&nbsp;       "subject": "fisica",

&nbsp;       "area": "Óptica",

&nbsp;       "topic": "Óptica Geométrica",

&nbsp;       "yearPlan": 2,

&nbsp;       "priorityIta": "alta"

&nbsp;     },

&nbsp;     {

&nbsp;       "subject": "fisica",

&nbsp;       "area": "Óptica",

&nbsp;       "topic": "Óptica Física (interferência, difração)",

&nbsp;       "yearPlan": 3,

&nbsp;       "priorityIta": "alta"

&nbsp;     },

&nbsp;     {

&nbsp;       "subject": "fisica",

&nbsp;       "area": "Eletricidade",

&nbsp;       "topic": "Eletrostática",

&nbsp;       "yearPlan": 2,

&nbsp;       "priorityIta": "critica"

&nbsp;     },

&nbsp;     {

&nbsp;       "subject": "fisica",

&nbsp;       "area": "Eletricidade",

&nbsp;       "topic": "Circuitos Elétricos (CC)",

&nbsp;       "yearPlan": 2,

&nbsp;       "priorityIta": "critica"

&nbsp;     },

&nbsp;     {

&nbsp;       "subject": "fisica",

&nbsp;       "area": "Eletricidade",

&nbsp;       "topic": "Capacitores",

&nbsp;       "yearPlan": 2,

&nbsp;       "priorityIta": "alta"

&nbsp;     },

&nbsp;     {

&nbsp;       "subject": "fisica",

&nbsp;       "area": "Eletromagnetismo",

&nbsp;       "topic": "Campo Magnético e Força de Lorentz",

&nbsp;       "yearPlan": 2,

&nbsp;       "priorityIta": "critica"

&nbsp;     },

&nbsp;     {

&nbsp;       "subject": "fisica",

&nbsp;       "area": "Eletromagnetismo",

&nbsp;       "topic": "Indução Eletromagnética e Lei de Faraday",

&nbsp;       "yearPlan": 3,

&nbsp;       "priorityIta": "critica"

&nbsp;     },

&nbsp;     {

&nbsp;       "subject": "fisica",

&nbsp;       "area": "Física Moderna",

&nbsp;       "topic": "Relatividade Restrita",

&nbsp;       "yearPlan": 3,

&nbsp;       "priorityIta": "alta"

&nbsp;     },

&nbsp;     {

&nbsp;       "subject": "fisica",

&nbsp;       "area": "Física Moderna",

&nbsp;       "topic": "Efeito Fotoelétrico e Dualidade Onda-Partícula",

&nbsp;       "yearPlan": 3,

&nbsp;       "priorityIta": "alta"

&nbsp;     },

&nbsp;     {

&nbsp;       "subject": "fisica",

&nbsp;       "area": "Física Moderna",

&nbsp;       "topic": "Física Nuclear e Radioatividade",

&nbsp;       "yearPlan": 3,

&nbsp;       "priorityIta": "media"

&nbsp;     },

&nbsp;     {

&nbsp;       "subject": "quimica",

&nbsp;       "area": "Química Geral",

&nbsp;       "topic": "Estrutura Atômica e Tabela Periódica",

&nbsp;       "yearPlan": 1,

&nbsp;       "priorityIta": "critica"

&nbsp;     },

&nbsp;     {

&nbsp;       "subject": "quimica",

&nbsp;       "area": "Química Geral",

&nbsp;       "topic": "Ligações Químicas",

&nbsp;       "yearPlan": 1,

&nbsp;       "priorityIta": "critica"

&nbsp;     },

&nbsp;     {

&nbsp;       "subject": "quimica",

&nbsp;       "area": "Química Geral",

&nbsp;       "topic": "Geometria Molecular e Polaridade",

&nbsp;       "yearPlan": 1,

&nbsp;       "priorityIta": "alta"

&nbsp;     },

&nbsp;     {

&nbsp;       "subject": "quimica",

&nbsp;       "area": "Química Geral",

&nbsp;       "topic": "Estequiometria",

&nbsp;       "yearPlan": 1,

&nbsp;       "priorityIta": "critica"

&nbsp;     },

&nbsp;     {

&nbsp;       "subject": "quimica",

&nbsp;       "area": "Química Geral",

&nbsp;       "topic": "Soluções e Concentrações",

&nbsp;       "yearPlan": 1,

&nbsp;       "priorityIta": "critica"

&nbsp;     },

&nbsp;     {

&nbsp;       "subject": "quimica",

&nbsp;       "area": "Físico-Química",

&nbsp;       "topic": "Termoquímica",

&nbsp;       "yearPlan": 1,

&nbsp;       "priorityIta": "critica"

&nbsp;     },

&nbsp;     {

&nbsp;       "subject": "quimica",

&nbsp;       "area": "Físico-Química",

&nbsp;       "topic": "Cinética Química",

&nbsp;       "yearPlan": 2,

&nbsp;       "priorityIta": "critica"

&nbsp;     },

&nbsp;     {

&nbsp;       "subject": "quimica",

&nbsp;       "area": "Físico-Química",

&nbsp;       "topic": "Equilíbrio Químico",

&nbsp;       "yearPlan": 2,

&nbsp;       "priorityIta": "critica"

&nbsp;     },

&nbsp;     {

&nbsp;       "subject": "quimica",

&nbsp;       "area": "Físico-Química",

&nbsp;       "topic": "Equilíbrio Iônico e pH",

&nbsp;       "yearPlan": 2,

&nbsp;       "priorityIta": "critica"

&nbsp;     },

&nbsp;     {

&nbsp;       "subject": "quimica",

&nbsp;       "area": "Físico-Química",

&nbsp;       "topic": "Eletroquímica",

&nbsp;       "yearPlan": 2,

&nbsp;       "priorityIta": "critica"

&nbsp;     },

&nbsp;     {

&nbsp;       "subject": "quimica",

&nbsp;       "area": "Físico-Química",

&nbsp;       "topic": "Propriedades Coligativas",

&nbsp;       "yearPlan": 2,

&nbsp;       "priorityIta": "alta"

&nbsp;     },

&nbsp;     {

&nbsp;       "subject": "quimica",

&nbsp;       "area": "Química Orgânica",

&nbsp;       "topic": "Nomenclatura e Cadeias Carbônicas",

&nbsp;       "yearPlan": 1,

&nbsp;       "priorityIta": "critica"

&nbsp;     },

&nbsp;     {

&nbsp;       "subject": "quimica",

&nbsp;       "area": "Química Orgânica",

&nbsp;       "topic": "Funções Orgânicas",

&nbsp;       "yearPlan": 2,

&nbsp;       "priorityIta": "critica"

&nbsp;     },

&nbsp;     {

&nbsp;       "subject": "quimica",

&nbsp;       "area": "Química Orgânica",

&nbsp;       "topic": "Isomeria",

&nbsp;       "yearPlan": 2,

&nbsp;       "priorityIta": "critica"

&nbsp;     },

&nbsp;     {

&nbsp;       "subject": "quimica",

&nbsp;       "area": "Química Orgânica",

&nbsp;       "topic": "Reações Orgânicas e Mecanismos",

&nbsp;       "yearPlan": 3,

&nbsp;       "priorityIta": "critica"

&nbsp;     },

&nbsp;     {

&nbsp;       "subject": "quimica",

&nbsp;       "area": "Química Orgânica",

&nbsp;       "topic": "Polímeros e Bioquímica",

&nbsp;       "yearPlan": 3,

&nbsp;       "priorityIta": "media"

&nbsp;     },

&nbsp;     {

&nbsp;       "subject": "quimica",

&nbsp;       "area": "Química Inorgânica",

&nbsp;       "topic": "Reações Inorgânicas e Classificação",

&nbsp;       "yearPlan": 1,

&nbsp;       "priorityIta": "alta"

&nbsp;     },

&nbsp;     {

&nbsp;       "subject": "quimica",

&nbsp;       "area": "Química Inorgânica",

&nbsp;       "topic": "Óxidos, Ácidos, Bases e Sais",

&nbsp;       "yearPlan": 1,

&nbsp;       "priorityIta": "critica"

&nbsp;     },

&nbsp;     {

&nbsp;       "subject": "quimica",

&nbsp;       "area": "Química Inorgânica",

&nbsp;       "topic": "Química Descritiva dos Elementos",

&nbsp;       "yearPlan": 3,

&nbsp;       "priorityIta": "alta"

&nbsp;     },

&nbsp;     {

&nbsp;       "subject": "calculo",

&nbsp;       "area": "Cálculo Diferencial",

&nbsp;       "topic": "Limites e Continuidade",

&nbsp;       "yearPlan": 2,

&nbsp;       "priorityIta": "critica"

&nbsp;     },

&nbsp;     {

&nbsp;       "subject": "calculo",

&nbsp;       "area": "Cálculo Diferencial",

&nbsp;       "topic": "Derivadas e Aplicações",

&nbsp;       "yearPlan": 2,

&nbsp;       "priorityIta": "critica"

&nbsp;     },

&nbsp;     {

&nbsp;       "subject": "calculo",

&nbsp;       "area": "Cálculo Integral",

&nbsp;       "topic": "Integrais Definidas e Indefinidas",

&nbsp;       "yearPlan": 3,

&nbsp;       "priorityIta": "critica"

&nbsp;     },

&nbsp;     {

&nbsp;       "subject": "calculo",

&nbsp;       "area": "Cálculo Integral",

&nbsp;       "topic": "Técnicas de Integração",

&nbsp;       "yearPlan": 3,

&nbsp;       "priorityIta": "alta"

&nbsp;     },

&nbsp;     {

&nbsp;       "subject": "calculo",

&nbsp;       "area": "Séries",

&nbsp;       "topic": "Séries Numéricas e de Potências",

&nbsp;       "yearPlan": 3,

&nbsp;       "priorityIta": "alta"

&nbsp;     }

&nbsp;   ],

&nbsp;   "defaultSettings": {

&nbsp;     "seeded": true,

&nbsp;     "theme": "dark",

&nbsp;     "pomodoroWork": 25,

&nbsp;     "pomodoroBreak": 5,

&nbsp;     "pomodoroLongBreak": 15,

&nbsp;     "pomodoroSetsBeforeLong": 4,

&nbsp;     "ollamaUrl": "http://localhost:11434",

&nbsp;     "ollamaModel": "qwen2.5:14b",

&nbsp;     "ankiConnectUrl": "http://localhost:8765"

&nbsp;   }

&nbsp; },

&nbsp; "colorMappings": {

&nbsp;   "subjects": {

&nbsp;     "matematica": {

&nbsp;       "dot": "bg-blue-500",

&nbsp;       "badge": "bg-blue-500/10 text-blue-500 border-blue-500/20",

&nbsp;       "kanban": "border-blue-500"

&nbsp;     },

&nbsp;     "fisica": {

&nbsp;       "dot": "bg-emerald-500",

&nbsp;       "badge": "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",

&nbsp;       "kanban": "border-emerald-500"

&nbsp;     },

&nbsp;     "quimica": {

&nbsp;       "dot": "bg-purple-500",

&nbsp;       "badge": "bg-purple-500/10 text-purple-500 border-purple-500/20",

&nbsp;       "kanban": "border-purple-500"

&nbsp;     },

&nbsp;     "calculo": {

&nbsp;       "dot": "bg-amber-500",

&nbsp;       "badge": "bg-amber-500/10 text-amber-500 border-amber-500/20",

&nbsp;       "kanban": "border-amber-500"

&nbsp;     },

&nbsp;     "geral": {

&nbsp;       "dot": "bg-slate-500",

&nbsp;       "badge": "bg-slate-500/10 text-slate-500 border-slate-500/20"

&nbsp;     }

&nbsp;   },

&nbsp;   "topicStatus": {

&nbsp;     "nao\_iniciado": "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400",

&nbsp;     "em\_andamento": "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400",

&nbsp;     "base\_concluida": "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400",

&nbsp;     "aprofundando": "bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400",

&nbsp;     "dominado": "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400"

&nbsp;   },

&nbsp;   "topicPriority": {

&nbsp;     "critica": "text-red-500",

&nbsp;     "alta": "text-amber-500",

&nbsp;     "media": "text-slate-400",

&nbsp;     "baixa": "text-slate-300"

&nbsp;   },

&nbsp;   "bookPriority": {

&nbsp;     "essencial": "bg-red-500/10 text-red-400 border-red-500/20",

&nbsp;     "recomendado": "bg-amber-500/10 text-amber-400 border-amber-500/20",

&nbsp;     "opcional": "bg-slate-500/10 text-slate-400 border-slate-500/20"

&nbsp;   },

&nbsp;   "errorSeverity": {

&nbsp;     "leve": "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",

&nbsp;     "moderada": "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",

&nbsp;     "grave": "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"

&nbsp;   },

&nbsp;   "flashcardType": {

&nbsp;     "conceito": "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400",

&nbsp;     "formula": "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400",

&nbsp;     "reacao\_quimica": "bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400",

&nbsp;     "nomenclatura": "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400",

&nbsp;     "mecanismo": "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400",

&nbsp;     "erro\_recorrente": "bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400"

&nbsp;   },

&nbsp;   "examBoard": {

&nbsp;     "ITA\_1fase": "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400",

&nbsp;     "ITA\_2fase": "bg-cyan-200 text-cyan-800 dark:bg-cyan-800/30 dark:text-cyan-300",

&nbsp;     "IME\_1fase": "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",

&nbsp;     "IME\_2fase": "bg-blue-200 text-blue-800 dark:bg-blue-800/30 dark:text-blue-300",

&nbsp;     "AFA": "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",

&nbsp;     "FUVEST": "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",

&nbsp;     "UNICAMP": "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",

&nbsp;     "OBMEP": "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",

&nbsp;     "OBF": "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",

&nbsp;     "OBQ": "bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400"

&nbsp;   },

&nbsp;   "olympiadMedal": {

&nbsp;     "ouro": "bg-yellow-100 text-yellow-700",

&nbsp;     "prata": "bg-slate-200 text-slate-700",

&nbsp;     "bronze": "bg-orange-100 text-orange-700",

&nbsp;     "honra\_ao\_merito": "bg-blue-100 text-blue-700",

&nbsp;     "nenhuma": "bg-slate-100 text-slate-500"

&nbsp;   },

&nbsp;   "statCardColors": {

&nbsp;     "cyan": "from-cyan-400/20 to-cyan-600/20 border-cyan-500/20 text-cyan-500",

&nbsp;     "blue": "from-blue-400/20 to-blue-600/20 border-blue-500/20 text-blue-500",

&nbsp;     "green": "from-emerald-400/20 to-emerald-600/20 border-emerald-500/20 text-emerald-500",

&nbsp;     "amber": "from-amber-400/20 to-amber-600/20 border-amber-500/20 text-amber-500",

&nbsp;     "red": "from-red-400/20 to-red-600/20 border-red-500/20 text-red-500",

&nbsp;     "purple": "from-purple-400/20 to-purple-600/20 border-purple-500/20 text-purple-500"

&nbsp;   }

&nbsp; },

&nbsp; "businessLogic": {

&nbsp;   "bookProgressCascade": "progressPercent >= 100 → status='concluido'; > 0 → 'em\_andamento'; 0 → 'nao\_iniciado'",

&nbsp;   "examPercentFormulas": {

&nbsp;     "percentTime": "Math.round((timeUsedMin / timeAvailableMin) \* 10000) / 100",

&nbsp;     "percentCorrect": "Math.round((score / scoreMax) \* 10000) / 100"

&nbsp;   },

&nbsp;   "topicStatusOrder": \[

&nbsp;     "nao\_iniciado",

&nbsp;     "em\_andamento",

&nbsp;     "base\_concluida",

&nbsp;     "aprofundando",

&nbsp;     "dominado"

&nbsp;   ],

&nbsp;   "feynmanApproval": "iaScore >= 8",

&nbsp;   "dashboardStats": \[

&nbsp;     "booksCompleted = books.filter(b => b.status === 'concluido').length",

&nbsp;     "topicsDominated = topics.filter(t => t.status === 'dominado').length",

&nbsp;     "totalStudyHours = Math.round(sessions.reduce((s,ss) => s + (ss.durationMinutes||0), 0) / 60)",

&nbsp;     "unresolvedErrors = errors.filter(e => !e.resolved).length"

&nbsp;   ],

&nbsp;   "subjectProgressChart": "For each of \[matematica,fisica,quimica,calculo]: { name, total, dominado, percent }"

&nbsp; },

&nbsp; "integrations": {

&nbsp;   "ollama": {

&nbsp;     "status": "STUB",

&nbsp;     "defaultUrl": "http://localhost:11434",

&nbsp;     "defaultModel": "qwen2.5:14b",

&nbsp;     "endpoints": {

&nbsp;       "generate": "POST /api/generate { model, prompt, stream: false }",

&nbsp;       "chat": "POST /api/chat { model, messages }"

&nbsp;     },

&nbsp;     "useCases": \[

&nbsp;       {

&nbsp;         "feature": "Análise de Erro Conceitual",

&nbsp;         "file": "pages/ErrorDiary.jsx",

&nbsp;         "currentBehavior": "Returns hardcoded markdown template with error fields interpolated"

&nbsp;       },

&nbsp;       {

&nbsp;         "feature": "Avaliação Feynman",

&nbsp;         "file": "pages/Feynman.jsx",

&nbsp;         "currentBehavior": "Returns random score 6-9, hardcoded markdown feedback"

&nbsp;       }

&nbsp;     ]

&nbsp;   },

&nbsp;   "ankiConnect": {

&nbsp;     "status": "STUB",

&nbsp;     "defaultUrl": "http://localhost:8765",

&nbsp;     "apiVersion": 6,

&nbsp;     "currentBehavior": "Sets synced=true and ankiNoteId=random(0,999999) locally, no HTTP call",

&nbsp;     "realActions": {

&nbsp;       "version": {

&nbsp;         "action": "version"

&nbsp;       },

&nbsp;       "addNote": {

&nbsp;         "action": "addNote",

&nbsp;         "params": {

&nbsp;           "note": {

&nbsp;             "deckName": "<ankiDeck>",

&nbsp;             "modelName": "Basic",

&nbsp;             "fields": {

&nbsp;               "Front": "<front>",

&nbsp;               "Back": "<back>"

&nbsp;             },

&nbsp;             "tags": \[

&nbsp;               "ita-prep"

&nbsp;             ]

&nbsp;           }

&nbsp;         }

&nbsp;       },

&nbsp;       "createDeck": {

&nbsp;         "action": "createDeck",

&nbsp;         "params": {

&nbsp;           "deck": "<deckName>"

&nbsp;         }

&nbsp;       },

&nbsp;       "deleteNotes": {

&nbsp;         "action": "deleteNotes",

&nbsp;         "params": {

&nbsp;           "notes": \[

&nbsp;             "<noteId>"

&nbsp;           ]

&nbsp;         }

&nbsp;       },

&nbsp;       "updateNoteFields": {

&nbsp;         "action": "updateNoteFields",

&nbsp;         "params": {

&nbsp;           "note": {

&nbsp;             "id": "<noteId>",

&nbsp;             "fields": {

&nbsp;               "Front": "<front>",

&nbsp;               "Back": "<back>"

&nbsp;             }

&nbsp;           }

&nbsp;         }

&nbsp;       },

&nbsp;       "sync": {

&nbsp;         "action": "sync"

&nbsp;       }

&nbsp;     }

&nbsp;   }

&nbsp; },

&nbsp; "userDataAtRuntime": {

&nbsp;   "books": \[

&nbsp;     {

&nbsp;       "phase": "base",

&nbsp;       "notes": "AFA é objetivo intermediário de treino.",

&nbsp;       "defaultAnkiDeck": null,

&nbsp;       "author": "Vários",

&nbsp;       "subject": "geral",

&nbsp;       "progressPercent": 35,

&nbsp;       "title": "Resolução de Provas AFA (2010-2024)",

&nbsp;       "priority": "essencial",

&nbsp;       "recommendedOrder": null,

&nbsp;       "status": "em\_andamento",

&nbsp;       "id": "69a9c3890531137ae9016253",

&nbsp;       "created\_date": "2026-03-05T17:55:21.215000",

&nbsp;       "updated\_date": "2026-03-05T18:09:26.059000",

&nbsp;       "created\_by\_id": "69a9c23eaab756b4746f1b94",

&nbsp;       "created\_by": "0f0e3b1644e61970936995bed75481f8@firemail.com.br",

&nbsp;       "is\_sample": false

&nbsp;     },

&nbsp;     {

&nbsp;       "phase": "aprofundamento",

&nbsp;       "notes": "Listas focadas.",

&nbsp;       "defaultAnkiDeck": null,

&nbsp;       "author": "Dorival / Renato Carvalho",

&nbsp;       "subject": "quimica",

&nbsp;       "progressPercent": 0,

&nbsp;       "title": "Problemas de Química para ITA/IME",

&nbsp;       "priority": "essencial",

&nbsp;       "recommendedOrder": null,

&nbsp;       "status": "nao\_iniciado",

&nbsp;       "id": "69a9c388c86ba0ff86593341",

&nbsp;       "created\_date": "2026-03-05T17:55:20.855000",

&nbsp;       "updated\_date": "2026-03-05T17:55:20.855000",

&nbsp;       "created\_by\_id": "69a9c23eaab756b4746f1b94",

&nbsp;       "created\_by": "0f0e3b1644e61970936995bed75481f8@firemail.com.br",

&nbsp;       "is\_sample": false

&nbsp;     },

&nbsp;     {

&nbsp;       "phase": "base",

&nbsp;       "notes": "Limites, derivadas, integrais. Obrigatório.",

&nbsp;       "defaultAnkiDeck": null,

&nbsp;       "author": "James Stewart",

&nbsp;       "subject": "calculo",

&nbsp;       "progressPercent": 0,

&nbsp;       "title": "Cálculo Vol. 1",

&nbsp;       "priority": "essencial",

&nbsp;       "recommendedOrder": null,

&nbsp;       "status": "nao\_iniciado",

&nbsp;       "id": "69a9c388c86ba0ff86593342",

&nbsp;       "created\_date": "2026-03-05T17:55:20.855000",

&nbsp;       "updated\_date": "2026-03-05T17:55:20.855000",

&nbsp;       "created\_by\_id": "69a9c23eaab756b4746f1b94",

&nbsp;       "created\_by": "0f0e3b1644e61970936995bed75481f8@firemail.com.br",

&nbsp;       "is\_sample": false

&nbsp;     },

&nbsp;     {

&nbsp;       "phase": "aprofundamento",

&nbsp;       "notes": "Séries e funções de várias variáveis.",

&nbsp;       "defaultAnkiDeck": null,

&nbsp;       "author": "James Stewart",

&nbsp;       "subject": "calculo",

&nbsp;       "progressPercent": 45,

&nbsp;       "title": "Cálculo Vol. 2",

&nbsp;       "priority": "recomendado",

&nbsp;       "recommendedOrder": null,

&nbsp;       "status": "em\_andamento",

&nbsp;       "id": "69a9c388c86ba0ff86593343",

&nbsp;       "created\_date": "2026-03-05T17:55:20.855000",

&nbsp;       "updated\_date": "2026-03-05T18:09:28.664000",

&nbsp;       "created\_by\_id": "69a9c23eaab756b4746f1b94",

&nbsp;       "created\_by": "0f0e3b1644e61970936995bed75481f8@firemail.com.br",

&nbsp;       "is\_sample": false

&nbsp;     },

&nbsp;     {

&nbsp;       "phase": "base",

&nbsp;       "notes": null,

&nbsp;       "defaultAnkiDeck": null,

&nbsp;       "author": "Louis Leithold",

&nbsp;       "subject": "calculo",

&nbsp;       "progressPercent": 0,

&nbsp;       "title": "Cálculo com Geometria Analítica Vol. 1",

&nbsp;       "priority": "recomendado",

&nbsp;       "recommendedOrder": null,

&nbsp;       "status": "nao\_iniciado",

&nbsp;       "id": "69a9c388c86ba0ff86593344",

&nbsp;       "created\_date": "2026-03-05T17:55:20.855000",

&nbsp;       "updated\_date": "2026-03-05T17:55:20.855000",

&nbsp;       "created\_by\_id": "69a9c23eaab756b4746f1b94",

&nbsp;       "created\_by": "0f0e3b1644e61970936995bed75481f8@firemail.com.br",

&nbsp;       "is\_sample": false

&nbsp;     },

&nbsp;     {

&nbsp;       "phase": "base",

&nbsp;       "notes": "Mais teórico. Bom complemento.",

&nbsp;       "defaultAnkiDeck": null,

&nbsp;       "author": "Hamilton Luiz Guidorizzi",

&nbsp;       "subject": "calculo",

&nbsp;       "progressPercent": 0,

&nbsp;       "title": "Um Curso de Cálculo Vol. 1",

&nbsp;       "priority": "recomendado",

&nbsp;       "recommendedOrder": null,

&nbsp;       "status": "nao\_iniciado",

&nbsp;       "id": "69a9c388c86ba0ff86593345",

&nbsp;       "created\_date": "2026-03-05T17:55:20.855000",

&nbsp;       "updated\_date": "2026-03-05T17:55:20.855000",

&nbsp;       "created\_by\_id": "69a9c23eaab756b4746f1b94",

&nbsp;       "created\_by": "0f0e3b1644e61970936995bed75481f8@firemail.com.br",

&nbsp;       "is\_sample": false

&nbsp;     },

&nbsp;     {

&nbsp;       "phase": "base",

&nbsp;       "notes": "Redação é eliminatória em AFA e IME.",

&nbsp;       "defaultAnkiDeck": null,

&nbsp;       "author": "Vários",

&nbsp;       "subject": "geral",

&nbsp;       "progressPercent": 0,

&nbsp;       "title": "Redação para Vestibulares Militares",

&nbsp;       "priority": "recomendado",

&nbsp;       "recommendedOrder": null,

&nbsp;       "status": "nao\_iniciado",

&nbsp;       "id": "69a9c388c86ba0ff86593346",

&nbsp;       "created\_date": "2026-03-05T17:55:20.855000",

&nbsp;       "updated\_date": "2026-03-05T17:55:20.855000",

&nbsp;       "created\_by\_id": "69a9c23eaab756b4746f1b94",

&nbsp;       "created\_by": "0f0e3b1644e61970936995bed75481f8@firemail.com.br",

&nbsp;       "is\_sample": false

&nbsp;     },

&nbsp;     {

&nbsp;       "phase": "base",

&nbsp;       "notes": "ITA cobra inglês. Revisar vocabulário técnico.",

&nbsp;       "defaultAnkiDeck": null,

&nbsp;       "author": "Vários",

&nbsp;       "subject": "geral",

&nbsp;       "progressPercent": 0,

&nbsp;       "title": "Inglês Instrumental para Provas Militares",

&nbsp;       "priority": "opcional",

&nbsp;       "recommendedOrder": null,

&nbsp;       "status": "nao\_iniciado",

&nbsp;       "id": "69a9c388c86ba0ff86593347",

&nbsp;       "created\_date": "2026-03-05T17:55:20.855000",

&nbsp;       "updated\_date": "2026-03-05T17:55:20.855000",

&nbsp;       "created\_by\_id": "69a9c23eaab756b4746f1b94",

&nbsp;       "created\_by": "0f0e3b1644e61970936995bed75481f8@firemail.com.br",

&nbsp;       "is\_sample": false

&nbsp;     },

&nbsp;     {

&nbsp;       "phase": "base",

&nbsp;       "notes": null,

&nbsp;       "defaultAnkiDeck": null,

&nbsp;       "author": "Vários",

&nbsp;       "subject": "geral",

&nbsp;       "progressPercent": 0,

&nbsp;       "title": "Português para Concursos e Vestibulares",

&nbsp;       "priority": "recomendado",

&nbsp;       "recommendedOrder": null,

&nbsp;       "status": "nao\_iniciado",

&nbsp;       "id": "69a9c388c86ba0ff86593348",

&nbsp;       "created\_date": "2026-03-05T17:55:20.855000",

&nbsp;       "updated\_date": "2026-03-05T17:55:20.855000",

&nbsp;       "created\_by\_id": "69a9c23eaab756b4746f1b94",

&nbsp;       "created\_by": "0f0e3b1644e61970936995bed75481f8@firemail.com.br",

&nbsp;       "is\_sample": false

&nbsp;     },

&nbsp;     {

&nbsp;       "phase": "aprofundamento",

&nbsp;       "notes": "Resolver TODAS. A prova do ITA é o melhor material.",

&nbsp;       "defaultAnkiDeck": null,

&nbsp;       "author": "Poliedro / Objetivo",

&nbsp;       "subject": "geral",

&nbsp;       "progressPercent": 0,

&nbsp;       "title": "Resolução de Provas ITA (1990-2024)",

&nbsp;       "priority": "essencial",

&nbsp;       "recommendedOrder": null,

&nbsp;       "status": "nao\_iniciado",

&nbsp;       "id": "69a9c388c86ba0ff86593349",

&nbsp;       "created\_date": "2026-03-05T17:55:20.855000",

&nbsp;       "updated\_date": "2026-03-05T17:55:20.855000",

&nbsp;       "created\_by\_id": "69a9c23eaab756b4746f1b94",

&nbsp;       "created\_by": "0f0e3b1644e61970936995bed75481f8@firemail.com.br",

&nbsp;       "is\_sample": false

&nbsp;     },

&nbsp;     {

&nbsp;       "phase": "aprofundamento",

&nbsp;       "notes": null,

&nbsp;       "defaultAnkiDeck": null,

&nbsp;       "author": "Poliedro / Anglo",

&nbsp;       "subject": "geral",

&nbsp;       "progressPercent": 0,

&nbsp;       "title": "Resolução de Provas IME (2000-2024)",

&nbsp;       "priority": "essencial",

&nbsp;       "recommendedOrder": null,

&nbsp;       "status": "nao\_iniciado",

&nbsp;       "id": "69a9c388c86ba0ff8659334a",

&nbsp;       "created\_date": "2026-03-05T17:55:20.855000",

&nbsp;       "updated\_date": "2026-03-05T17:55:20.855000",

&nbsp;       "created\_by\_id": "69a9c23eaab756b4746f1b94",

&nbsp;       "created\_by": "0f0e3b1644e61970936995bed75481f8@firemail.com.br",

&nbsp;       "is\_sample": false

&nbsp;     },

&nbsp;     {

&nbsp;       "phase": "base",

&nbsp;       "notes": null,

&nbsp;       "defaultAnkiDeck": null,

&nbsp;       "author": "Halliday, Resnick, Walker",

&nbsp;       "subject": "fisica",

&nbsp;       "progressPercent": 0,

&nbsp;       "title": "Fundamentos de Física Vol. 4 — Óptica e Física Moderna",

&nbsp;       "priority": "recomendado",

&nbsp;       "recommendedOrder": null,

&nbsp;       "status": "nao\_iniciado",

&nbsp;       "id": "69a9c388dd0e03a362a30ddb",

&nbsp;       "created\_date": "2026-03-05T17:55:20.454000",

&nbsp;       "updated\_date": "2026-03-05T17:55:20.454000",

&nbsp;       "created\_by\_id": "69a9c23eaab756b4746f1b94",

&nbsp;       "created\_by": "0f0e3b1644e61970936995bed75481f8@firemail.com.br",

&nbsp;       "is\_sample": false

&nbsp;     },

&nbsp;     {

&nbsp;       "phase": "aprofundamento",

&nbsp;       "notes": "Nível olímpico / ITA 2ª fase.",

&nbsp;       "defaultAnkiDeck": null,

&nbsp;       "author": "I. E. Irodov (adaptação)",

&nbsp;       "subject": "fisica",

&nbsp;       "progressPercent": 0,

&nbsp;       "title": "Problemas de Física — Saraeva",

&nbsp;       "priority": "essencial",

&nbsp;       "recommendedOrder": null,

&nbsp;       "status": "nao\_iniciado",

&nbsp;       "id": "69a9c388dd0e03a362a30ddc",

&nbsp;       "created\_date": "2026-03-05T17:55:20.454000",

&nbsp;       "updated\_date": "2026-03-05T17:55:20.454000",

&nbsp;       "created\_by\_id": "69a9c23eaab756b4746f1b94",

&nbsp;       "created\_by": "0f0e3b1644e61970936995bed75481f8@firemail.com.br",

&nbsp;       "is\_sample": false

&nbsp;     },

&nbsp;     {

&nbsp;       "phase": "aprofundamento",

&nbsp;       "notes": null,

&nbsp;       "defaultAnkiDeck": null,

&nbsp;       "author": "Charles Kittel",

&nbsp;       "subject": "fisica",

&nbsp;       "progressPercent": 0,

&nbsp;       "title": "Mecânica — Berkeley Physics",

&nbsp;       "priority": "recomendado",

&nbsp;       "recommendedOrder": null,

&nbsp;       "status": "nao\_iniciado",

&nbsp;       "id": "69a9c388dd0e03a362a30ddd",

&nbsp;       "created\_date": "2026-03-05T17:55:20.454000",

&nbsp;       "updated\_date": "2026-03-05T17:55:20.454000",

&nbsp;       "created\_by\_id": "69a9c23eaab756b4746f1b94",

&nbsp;       "created\_by": "0f0e3b1644e61970936995bed75481f8@firemail.com.br",

&nbsp;       "is\_sample": false

&nbsp;     },

&nbsp;     {

&nbsp;       "phase": "aprofundamento",

&nbsp;       "notes": "Dificuldade extrema. Ideal para 3o ano.",

&nbsp;       "defaultAnkiDeck": null,

&nbsp;       "author": "Irodov",

&nbsp;       "subject": "fisica",

&nbsp;       "progressPercent": 0,

&nbsp;       "title": "Problemas Selecionados de Física — Saraeva/Irodov",

&nbsp;       "priority": "essencial",

&nbsp;       "recommendedOrder": null,

&nbsp;       "status": "nao\_iniciado",

&nbsp;       "id": "69a9c388dd0e03a362a30dde",

&nbsp;       "created\_date": "2026-03-05T17:55:20.454000",

&nbsp;       "updated\_date": "2026-03-05T17:55:20.454000",

&nbsp;       "created\_by\_id": "69a9c23eaab756b4746f1b94",

&nbsp;       "created\_by": "0f0e3b1644e61970936995bed75481f8@firemail.com.br",

&nbsp;       "is\_sample": false

&nbsp;     },

&nbsp;     {

&nbsp;       "phase": "base",

&nbsp;       "notes": null,

&nbsp;       "defaultAnkiDeck": null,

&nbsp;       "author": "Ricardo Feltre",

&nbsp;       "subject": "quimica",

&nbsp;       "progressPercent": 0,

&nbsp;       "title": "Química — Feltre Vol. 1 — Geral",

&nbsp;       "priority": "essencial",

&nbsp;       "recommendedOrder": null,

&nbsp;       "status": "nao\_iniciado",

&nbsp;       "id": "69a9c388dd0e03a362a30ddf",

&nbsp;       "created\_date": "2026-03-05T17:55:20.454000",

&nbsp;       "updated\_date": "2026-03-05T17:55:20.454000",

&nbsp;       "created\_by\_id": "69a9c23eaab756b4746f1b94",

&nbsp;       "created\_by": "0f0e3b1644e61970936995bed75481f8@firemail.com.br",

&nbsp;       "is\_sample": false

&nbsp;     },

&nbsp;     {

&nbsp;       "phase": "base",

&nbsp;       "notes": null,

&nbsp;       "defaultAnkiDeck": null,

&nbsp;       "author": "Ricardo Feltre",

&nbsp;       "subject": "quimica",

&nbsp;       "progressPercent": 0,

&nbsp;       "title": "Química — Feltre Vol. 2 — Físico-Química",

&nbsp;       "priority": "essencial",

&nbsp;       "recommendedOrder": null,

&nbsp;       "status": "nao\_iniciado",

&nbsp;       "id": "69a9c388dd0e03a362a30de0",

&nbsp;       "created\_date": "2026-03-05T17:55:20.454000",

&nbsp;       "updated\_date": "2026-03-05T17:55:20.454000",

&nbsp;       "created\_by\_id": "69a9c23eaab756b4746f1b94",

&nbsp;       "created\_by": "0f0e3b1644e61970936995bed75481f8@firemail.com.br",

&nbsp;       "is\_sample": false

&nbsp;     },

&nbsp;     {

&nbsp;       "phase": "base",

&nbsp;       "notes": null,

&nbsp;       "defaultAnkiDeck": null,

&nbsp;       "author": "Ricardo Feltre",

&nbsp;       "subject": "quimica",

&nbsp;       "progressPercent": 0,

&nbsp;       "title": "Química — Feltre Vol. 3 — Orgânica",

&nbsp;       "priority": "essencial",

&nbsp;       "recommendedOrder": null,

&nbsp;       "status": "nao\_iniciado",

&nbsp;       "id": "69a9c388dd0e03a362a30de1",

&nbsp;       "created\_date": "2026-03-05T17:55:20.454000",

&nbsp;       "updated\_date": "2026-03-05T17:55:20.454000",

&nbsp;       "created\_by\_id": "69a9c23eaab756b4746f1b94",

&nbsp;       "created\_by": "0f0e3b1644e61970936995bed75481f8@firemail.com.br",

&nbsp;       "is\_sample": false

&nbsp;     },

&nbsp;     {

&nbsp;       "phase": "base",

&nbsp;       "notes": "Referência universitária. Usar para dúvidas pontuais.",

&nbsp;       "defaultAnkiDeck": null,

&nbsp;       "author": "Peter Atkins, Loretta Jones",

&nbsp;       "subject": "quimica",

&nbsp;       "progressPercent": 0,

&nbsp;       "title": "Princípios de Química — Atkins",

&nbsp;       "priority": "recomendado",

&nbsp;       "recommendedOrder": null,

&nbsp;       "status": "nao\_iniciado",

&nbsp;       "id": "69a9c388dd0e03a362a30de2",

&nbsp;       "created\_date": "2026-03-05T17:55:20.454000",

&nbsp;       "updated\_date": "2026-03-05T17:55:20.454000",

&nbsp;       "created\_by\_id": "69a9c23eaab756b4746f1b94",

&nbsp;       "created\_by": "0f0e3b1644e61970936995bed75481f8@firemail.com.br",

&nbsp;       "is\_sample": false

&nbsp;     },

&nbsp;     {

&nbsp;       "phase": "aprofundamento",

&nbsp;       "notes": "Aprofundamento em inorgânica para ITA.",

&nbsp;       "defaultAnkiDeck": null,

&nbsp;       "author": "Shriver \& Atkins",

&nbsp;       "subject": "quimica",

&nbsp;       "progressPercent": 0,

&nbsp;       "title": "Química Inorgânica — Shriver \& Atkins",

&nbsp;       "priority": "recomendado",

&nbsp;       "recommendedOrder": null,

&nbsp;       "status": "nao\_iniciado",

&nbsp;       "id": "69a9c388dd0e03a362a30de3",

&nbsp;       "created\_date": "2026-03-05T17:55:20.454000",

&nbsp;       "updated\_date": "2026-03-05T17:55:20.454000",

&nbsp;       "created\_by\_id": "69a9c23eaab756b4746f1b94",

&nbsp;       "created\_by": "0f0e3b1644e61970936995bed75481f8@firemail.com.br",

&nbsp;       "is\_sample": false

&nbsp;     },

&nbsp;     {

&nbsp;       "phase": "aprofundamento",

&nbsp;       "notes": "Orgânica avançada. Mecanismos detalhados.",

&nbsp;       "defaultAnkiDeck": null,

&nbsp;       "author": "Jonathan Clayden",

&nbsp;       "subject": "quimica",

&nbsp;       "progressPercent": 0,

&nbsp;       "title": "Organic Chemistry — Clayden",

&nbsp;       "priority": "recomendado",

&nbsp;       "recommendedOrder": null,

&nbsp;       "status": "nao\_iniciado",

&nbsp;       "id": "69a9c388dd0e03a362a30de4",

&nbsp;       "created\_date": "2026-03-05T17:55:20.454000",

&nbsp;       "updated\_date": "2026-03-05T17:55:20.454000",

&nbsp;       "created\_by\_id": "69a9c23eaab756b4746f1b94",

&nbsp;       "created\_by": "0f0e3b1644e61970936995bed75481f8@firemail.com.br",

&nbsp;       "is\_sample": false

&nbsp;     },

&nbsp;     {

&nbsp;       "phase": "aprofundamento",

&nbsp;       "notes": "Para quem quer ir além. Fundamento teórico.",

&nbsp;       "defaultAnkiDeck": null,

&nbsp;       "author": "Elon Lages Lima",

&nbsp;       "subject": "matematica",

&nbsp;       "progressPercent": 0,

&nbsp;       "title": "Curso de Análise Vol. 1",

&nbsp;       "priority": "recomendado",

&nbsp;       "recommendedOrder": null,

&nbsp;       "status": "nao\_iniciado",

&nbsp;       "id": "69a9c3888a1a6f3a8731ba75",

&nbsp;       "created\_date": "2026-03-05T17:55:20.063000",

&nbsp;       "updated\_date": "2026-03-05T17:55:20.063000",

&nbsp;       "created\_by\_id": "69a9c23eaab756b4746f1b94",

&nbsp;       "created\_by": "0f0e3b1644e61970936995bed75481f8@firemail.com.br",

&nbsp;       "is\_sample": false

&nbsp;     },

&nbsp;     {

&nbsp;       "phase": "aprofundamento",

&nbsp;       "notes": "Olimpíada + vestibular ITA.",

&nbsp;       "defaultAnkiDeck": null,

&nbsp;       "author": "IMPA / Carlos Moreira",

&nbsp;       "subject": "matematica",

&nbsp;       "progressPercent": 0,

&nbsp;       "title": "Problemas Selecionados de Matemática",

&nbsp;       "priority": "essencial",

&nbsp;       "recommendedOrder": null,

&nbsp;       "status": "nao\_iniciado",

&nbsp;       "id": "69a9c3888a1a6f3a8731ba76",

&nbsp;       "created\_date": "2026-03-05T17:55:20.063000",

&nbsp;       "updated\_date": "2026-03-05T17:55:20.063000",

&nbsp;       "created\_by\_id": "69a9c23eaab756b4746f1b94",

&nbsp;       "created\_by": "0f0e3b1644e61970936995bed75481f8@firemail.com.br",

&nbsp;       "is\_sample": false

&nbsp;     },

&nbsp;     {

&nbsp;       "phase": "aprofundamento",

&nbsp;       "notes": null,

&nbsp;       "defaultAnkiDeck": null,

&nbsp;       "author": "Elon Lages Lima",

&nbsp;       "subject": "matematica",

&nbsp;       "progressPercent": 0,

&nbsp;       "title": "Números e Funções Reais",

&nbsp;       "priority": "recomendado",

&nbsp;       "recommendedOrder": null,

&nbsp;       "status": "nao\_iniciado",

&nbsp;       "id": "69a9c3888a1a6f3a8731ba77",

&nbsp;       "created\_date": "2026-03-05T17:55:20.063000",

&nbsp;       "updated\_date": "2026-03-05T17:55:20.063000",

&nbsp;       "created\_by\_id": "69a9c23eaab756b4746f1b94",

&nbsp;       "created\_by": "0f0e3b1644e61970936995bed75481f8@firemail.com.br",

&nbsp;       "is\_sample": false

&nbsp;     },

&nbsp;     {

&nbsp;       "phase": "aprofundamento",

&nbsp;       "notes": "Listas resolvidas.",

&nbsp;       "defaultAnkiDeck": null,

&nbsp;       "author": "Tábuas do IME",

&nbsp;       "subject": "matematica",

&nbsp;       "progressPercent": 0,

&nbsp;       "title": "Matemática para os Curiosos (Resolução IME/ITA)",

&nbsp;       "priority": "recomendado",

&nbsp;       "recommendedOrder": null,

&nbsp;       "status": "nao\_iniciado",

&nbsp;       "id": "69a9c3888a1a6f3a8731ba78",

&nbsp;       "created\_date": "2026-03-05T17:55:20.063000",

&nbsp;       "updated\_date": "2026-03-05T17:55:20.063000",

&nbsp;       "created\_by\_id": "69a9c23eaab756b4746f1b94",

&nbsp;       "created\_by": "0f0e3b1644e61970936995bed75481f8@firemail.com.br",

&nbsp;       "is\_sample": false

&nbsp;     },

&nbsp;     {

&nbsp;       "phase": "base",

&nbsp;       "notes": null,

&nbsp;       "defaultAnkiDeck": null,

&nbsp;       "author": "Gualter, Helou, Newton",

&nbsp;       "subject": "fisica",

&nbsp;       "progressPercent": 0,

&nbsp;       "title": "Tópicos de Física Vol. 1 — Mecânica",

&nbsp;       "priority": "essencial",

&nbsp;       "recommendedOrder": null,

&nbsp;       "status": "nao\_iniciado",

&nbsp;       "id": "69a9c3888a1a6f3a8731ba79",

&nbsp;       "created\_date": "2026-03-05T17:55:20.063000",

&nbsp;       "updated\_date": "2026-03-05T17:55:20.063000",

&nbsp;       "created\_by\_id": "69a9c23eaab756b4746f1b94",

&nbsp;       "created\_by": "0f0e3b1644e61970936995bed75481f8@firemail.com.br",

&nbsp;       "is\_sample": false

&nbsp;     },

&nbsp;     {

&nbsp;       "phase": "base",

&nbsp;       "notes": null,

&nbsp;       "defaultAnkiDeck": null,

&nbsp;       "author": "Gualter, Helou, Newton",

&nbsp;       "subject": "fisica",

&nbsp;       "progressPercent": 0,

&nbsp;       "title": "Tópicos de Física Vol. 2 — Termologia, Ondas, Óptica",

&nbsp;       "priority": "essencial",

&nbsp;       "recommendedOrder": null,

&nbsp;       "status": "nao\_iniciado",

&nbsp;       "id": "69a9c3888a1a6f3a8731ba7a",

&nbsp;       "created\_date": "2026-03-05T17:55:20.063000",

&nbsp;       "updated\_date": "2026-03-05T17:55:20.063000",

&nbsp;       "created\_by\_id": "69a9c23eaab756b4746f1b94",

&nbsp;       "created\_by": "0f0e3b1644e61970936995bed75481f8@firemail.com.br",

&nbsp;       "is\_sample": false

&nbsp;     },

&nbsp;     {

&nbsp;       "phase": "base",

&nbsp;       "notes": null,

&nbsp;       "defaultAnkiDeck": null,

&nbsp;       "author": "Gualter, Helou, Newton",

&nbsp;       "subject": "fisica",

&nbsp;       "progressPercent": 0,

&nbsp;       "title": "Tópicos de Física Vol. 3 — Eletricidade e Física Moderna",

&nbsp;       "priority": "essencial",

&nbsp;       "recommendedOrder": null,

&nbsp;       "status": "nao\_iniciado",

&nbsp;       "id": "69a9c3888a1a6f3a8731ba7b",

&nbsp;       "created\_date": "2026-03-05T17:55:20.063000",

&nbsp;       "updated\_date": "2026-03-05T17:55:20.063000",

&nbsp;       "created\_by\_id": "69a9c23eaab756b4746f1b94",

&nbsp;       "created\_by": "0f0e3b1644e61970936995bed75481f8@firemail.com.br",

&nbsp;       "is\_sample": false

&nbsp;     },

&nbsp;     {

&nbsp;       "phase": "base",

&nbsp;       "notes": "Referência clássica universitária.",

&nbsp;       "defaultAnkiDeck": null,

&nbsp;       "author": "Halliday, Resnick, Walker",

&nbsp;       "subject": "fisica",

&nbsp;       "progressPercent": 0,

&nbsp;       "title": "Fundamentos de Física Vol. 1 — Mecânica",

&nbsp;       "priority": "essencial",

&nbsp;       "recommendedOrder": null,

&nbsp;       "status": "nao\_iniciado",

&nbsp;       "id": "69a9c3888a1a6f3a8731ba7c",

&nbsp;       "created\_date": "2026-03-05T17:55:20.063000",

&nbsp;       "updated\_date": "2026-03-05T17:55:20.063000",

&nbsp;       "created\_by\_id": "69a9c23eaab756b4746f1b94",

&nbsp;       "created\_by": "0f0e3b1644e61970936995bed75481f8@firemail.com.br",

&nbsp;       "is\_sample": false

&nbsp;     },

&nbsp;     {

&nbsp;       "phase": "base",

&nbsp;       "notes": null,

&nbsp;       "defaultAnkiDeck": null,

&nbsp;       "author": "Halliday, Resnick, Walker",

&nbsp;       "subject": "fisica",

&nbsp;       "progressPercent": 0,

&nbsp;       "title": "Fundamentos de Física Vol. 2 — Gravitação, Ondas, Termodinâmica",

&nbsp;       "priority": "essencial",

&nbsp;       "recommendedOrder": null,

&nbsp;       "status": "nao\_iniciado",

&nbsp;       "id": "69a9c3888a1a6f3a8731ba7d",

&nbsp;       "created\_date": "2026-03-05T17:55:20.063000",

&nbsp;       "updated\_date": "2026-03-05T17:55:20.063000",

&nbsp;       "created\_by\_id": "69a9c23eaab756b4746f1b94",

&nbsp;       "created\_by": "0f0e3b1644e61970936995bed75481f8@firemail.com.br",

&nbsp;       "is\_sample": false

&nbsp;     },

&nbsp;     {

&nbsp;       "phase": "base",

&nbsp;       "notes": null,

&nbsp;       "defaultAnkiDeck": null,

&nbsp;       "author": "Halliday, Resnick, Walker",

&nbsp;       "subject": "fisica",

&nbsp;       "progressPercent": 0,

&nbsp;       "title": "Fundamentos de Física Vol. 3 — Eletromagnetismo",

&nbsp;       "priority": "essencial",

&nbsp;       "recommendedOrder": null,

&nbsp;       "status": "nao\_iniciado",

&nbsp;       "id": "69a9c3888a1a6f3a8731ba7e",

&nbsp;       "created\_date": "2026-03-05T17:55:20.063000",

&nbsp;       "updated\_date": "2026-03-05T17:55:20.063000",

&nbsp;       "created\_by\_id": "69a9c23eaab756b4746f1b94",

&nbsp;       "created\_by": "0f0e3b1644e61970936995bed75481f8@firemail.com.br",

&nbsp;       "is\_sample": false

&nbsp;     },

&nbsp;     {

&nbsp;       "phase": "base",

&nbsp;       "notes": "Base absoluta. Cobrir cap. 1-10.",

&nbsp;       "defaultAnkiDeck": null,

&nbsp;       "author": "Gelson Iezzi",

&nbsp;       "subject": "matematica",

&nbsp;       "progressPercent": 0,

&nbsp;       "title": "Fundamentos de Matemática Elementar Vol. 1 — Conjuntos e Funções",

&nbsp;       "priority": "essencial",

&nbsp;       "recommendedOrder": null,

&nbsp;       "status": "nao\_iniciado",

&nbsp;       "id": "69a9c3877ade230e47b06b0b",

&nbsp;       "created\_date": "2026-03-05T17:55:19.673000",

&nbsp;       "updated\_date": "2026-03-05T17:55:19.673000",

&nbsp;       "created\_by\_id": "69a9c23eaab756b4746f1b94",

&nbsp;       "created\_by": "0f0e3b1644e61970936995bed75481f8@firemail.com.br",

&nbsp;       "is\_sample": false

&nbsp;     },

&nbsp;     {

&nbsp;       "phase": "base",

&nbsp;       "notes": null,

&nbsp;       "defaultAnkiDeck": null,

&nbsp;       "author": "Gelson Iezzi",

&nbsp;       "subject": "matematica",

&nbsp;       "progressPercent": 0,

&nbsp;       "title": "Fundamentos de Matemática Elementar Vol. 2 — Logaritmos",

&nbsp;       "priority": "essencial",

&nbsp;       "recommendedOrder": null,

&nbsp;       "status": "nao\_iniciado",

&nbsp;       "id": "69a9c3877ade230e47b06b0c",

&nbsp;       "created\_date": "2026-03-05T17:55:19.673000",

&nbsp;       "updated\_date": "2026-03-05T17:55:19.673000",

&nbsp;       "created\_by\_id": "69a9c23eaab756b4746f1b94",

&nbsp;       "created\_by": "0f0e3b1644e61970936995bed75481f8@firemail.com.br",

&nbsp;       "is\_sample": false

&nbsp;     },

&nbsp;     {

&nbsp;       "phase": "base",

&nbsp;       "notes": null,

&nbsp;       "defaultAnkiDeck": null,

&nbsp;       "author": "Gelson Iezzi",

&nbsp;       "subject": "matematica",

&nbsp;       "progressPercent": 0,

&nbsp;       "title": "Fundamentos de Matemática Elementar Vol. 3 — Trigonometria",

&nbsp;       "priority": "essencial",

&nbsp;       "recommendedOrder": null,

&nbsp;       "status": "nao\_iniciado",

&nbsp;       "id": "69a9c3877ade230e47b06b0d",

&nbsp;       "created\_date": "2026-03-05T17:55:19.673000",

&nbsp;       "updated\_date": "2026-03-05T17:55:19.673000",

&nbsp;       "created\_by\_id": "69a9c23eaab756b4746f1b94",

&nbsp;       "created\_by": "0f0e3b1644e61970936995bed75481f8@firemail.com.br",

&nbsp;       "is\_sample": false

&nbsp;     },

&nbsp;     {

&nbsp;       "phase": "base",

&nbsp;       "notes": null,

&nbsp;       "defaultAnkiDeck": null,

&nbsp;       "author": "Gelson Iezzi",

&nbsp;       "subject": "matematica",

&nbsp;       "progressPercent": 0,

&nbsp;       "title": "Fundamentos de Matemática Elementar Vol. 4 — Sequências e Séries",

&nbsp;       "priority": "essencial",

&nbsp;       "recommendedOrder": null,

&nbsp;       "status": "nao\_iniciado",

&nbsp;       "id": "69a9c3877ade230e47b06b0e",

&nbsp;       "created\_date": "2026-03-05T17:55:19.673000",

&nbsp;       "updated\_date": "2026-03-05T17:55:19.673000",

&nbsp;       "created\_by\_id": "69a9c23eaab756b4746f1b94",

&nbsp;       "created\_by": "0f0e3b1644e61970936995bed75481f8@firemail.com.br",

&nbsp;       "is\_sample": false

&nbsp;     },

&nbsp;     {

&nbsp;       "phase": "base",

&nbsp;       "notes": null,

&nbsp;       "defaultAnkiDeck": null,

&nbsp;       "author": "Gelson Iezzi",

&nbsp;       "subject": "matematica",

&nbsp;       "progressPercent": 0,

&nbsp;       "title": "Fundamentos de Matemática Elementar Vol. 5 — Combinatória e Probabilidade",

&nbsp;       "priority": "essencial",

&nbsp;       "recommendedOrder": null,

&nbsp;       "status": "nao\_iniciado",

&nbsp;       "id": "69a9c3877ade230e47b06b0f",

&nbsp;       "created\_date": "2026-03-05T17:55:19.673000",

&nbsp;       "updated\_date": "2026-03-05T17:55:19.673000",

&nbsp;       "created\_by\_id": "69a9c23eaab756b4746f1b94",

&nbsp;       "created\_by": "0f0e3b1644e61970936995bed75481f8@firemail.com.br",

&nbsp;       "is\_sample": false

&nbsp;     },

&nbsp;     {

&nbsp;       "phase": "base",

&nbsp;       "notes": null,

&nbsp;       "defaultAnkiDeck": null,

&nbsp;       "author": "Gelson Iezzi",

&nbsp;       "subject": "matematica",

&nbsp;       "progressPercent": 0,

&nbsp;       "title": "Fundamentos de Matemática Elementar Vol. 6 — Complexos e Polinômios",

&nbsp;       "priority": "essencial",

&nbsp;       "recommendedOrder": null,

&nbsp;       "status": "nao\_iniciado",

&nbsp;       "id": "69a9c3877ade230e47b06b10",

&nbsp;       "created\_date": "2026-03-05T17:55:19.673000",

&nbsp;       "updated\_date": "2026-03-05T17:55:19.673000",

&nbsp;       "created\_by\_id": "69a9c23eaab756b4746f1b94",

&nbsp;       "created\_by": "0f0e3b1644e61970936995bed75481f8@firemail.com.br",

&nbsp;       "is\_sample": false

&nbsp;     },

&nbsp;     {

&nbsp;       "phase": "base",

&nbsp;       "notes": null,

&nbsp;       "defaultAnkiDeck": null,

&nbsp;       "author": "Gelson Iezzi",

&nbsp;       "subject": "matematica",

&nbsp;       "progressPercent": 0,

&nbsp;       "title": "Fundamentos de Matemática Elementar Vol. 7 — Geometria Analítica",

&nbsp;       "priority": "essencial",

&nbsp;       "recommendedOrder": null,

&nbsp;       "status": "nao\_iniciado",

&nbsp;       "id": "69a9c3877ade230e47b06b11",

&nbsp;       "created\_date": "2026-03-05T17:55:19.673000",

&nbsp;       "updated\_date": "2026-03-05T17:55:19.673000",

&nbsp;       "created\_by\_id": "69a9c23eaab756b4746f1b94",

&nbsp;       "created\_by": "0f0e3b1644e61970936995bed75481f8@firemail.com.br",

&nbsp;       "is\_sample": false

&nbsp;     },

&nbsp;     {

&nbsp;       "phase": "base",

&nbsp;       "notes": null,

&nbsp;       "defaultAnkiDeck": null,

&nbsp;       "author": "Gelson Iezzi",

&nbsp;       "subject": "matematica",

&nbsp;       "progressPercent": 0,

&nbsp;       "title": "Fundamentos de Matemática Elementar Vol. 9 — Geometria Plana",

&nbsp;       "priority": "essencial",

&nbsp;       "recommendedOrder": null,

&nbsp;       "status": "nao\_iniciado",

&nbsp;       "id": "69a9c3877ade230e47b06b12",

&nbsp;       "created\_date": "2026-03-05T17:55:19.673000",

&nbsp;       "updated\_date": "2026-03-05T17:55:19.673000",

&nbsp;       "created\_by\_id": "69a9c23eaab756b4746f1b94",

&nbsp;       "created\_by": "0f0e3b1644e61970936995bed75481f8@firemail.com.br",

&nbsp;       "is\_sample": false

&nbsp;     },

&nbsp;     {

&nbsp;       "phase": "base",

&nbsp;       "notes": null,

&nbsp;       "defaultAnkiDeck": null,

&nbsp;       "author": "Gelson Iezzi",

&nbsp;       "subject": "matematica",

&nbsp;       "progressPercent": 0,

&nbsp;       "title": "Fundamentos de Matemática Elementar Vol. 10 — Geometria Espacial",

&nbsp;       "priority": "essencial",

&nbsp;       "recommendedOrder": null,

&nbsp;       "status": "nao\_iniciado",

&nbsp;       "id": "69a9c3877ade230e47b06b13",

&nbsp;       "created\_date": "2026-03-05T17:55:19.673000",

&nbsp;       "updated\_date": "2026-03-05T17:55:19.673000",

&nbsp;       "created\_by\_id": "69a9c23eaab756b4746f1b94",

&nbsp;       "created\_by": "0f0e3b1644e61970936995bed75481f8@firemail.com.br",

&nbsp;       "is\_sample": false

&nbsp;     },

&nbsp;     {

&nbsp;       "phase": "aprofundamento",

&nbsp;       "notes": "Demonstrações rigorosas. Nível IME/ITA.",

&nbsp;       "defaultAnkiDeck": null,

&nbsp;       "author": "João Lucas Marques Barbosa",

&nbsp;       "subject": "matematica",

&nbsp;       "progressPercent": 0,

&nbsp;       "title": "Geometria Euclidiana Plana",

&nbsp;       "priority": "essencial",

&nbsp;       "recommendedOrder": null,

&nbsp;       "status": "nao\_iniciado",

&nbsp;       "id": "69a9c3877ade230e47b06b14",

&nbsp;       "created\_date": "2026-03-05T17:55:19.673000",

&nbsp;       "updated\_date": "2026-03-05T17:55:19.673000",

&nbsp;       "created\_by\_id": "69a9c23eaab756b4746f1b94",

&nbsp;       "created\_by": "0f0e3b1644e61970936995bed75481f8@firemail.com.br",

&nbsp;       "is\_sample": false

&nbsp;     }

&nbsp;   ],

&nbsp;   "topics": \[

&nbsp;     {

&nbsp;       "area": "Química Inorgânica",

&nbsp;       "totalStudyMinutes": 0,

&nbsp;       "notes": null,

&nbsp;       "subject": "quimica",

&nbsp;       "bookBaseId": null,

&nbsp;       "ankiDeck": null,

&nbsp;       "forOlympiad": false,

&nbsp;       "yearPlan": 1,

&nbsp;       "prerequisites": null,

&nbsp;       "bookAdvancedId": null,

&nbsp;       "priorityIta": "critica",

&nbsp;       "topic": "Óxidos, Ácidos, Bases e Sais",

&nbsp;       "lastReviewedAt": "2026-03-05",

&nbsp;       "subtopic": null,

&nbsp;       "startDate": "2026-03-05",

&nbsp;       "status": "dominado",

&nbsp;       "id": "69a9c38b1564e3defa2dc918",

&nbsp;       "created\_date": "2026-03-05T17:55:23.575000",

&nbsp;       "updated\_date": "2026-03-05T18:08:25.164000",

&nbsp;       "created\_by\_id": "69a9c23eaab756b4746f1b94",

&nbsp;       "created\_by": "0f0e3b1644e61970936995bed75481f8@firemail.com.br",

&nbsp;       "is\_sample": false

&nbsp;     },

&nbsp;     {

&nbsp;       "area": "Química Inorgânica",

&nbsp;       "totalStudyMinutes": 0,

&nbsp;       "notes": null,

&nbsp;       "subject": "quimica",

&nbsp;       "bookBaseId": null,

&nbsp;       "ankiDeck": null,

&nbsp;       "forOlympiad": false,

&nbsp;       "yearPlan": 3,

&nbsp;       "prerequisites": null,

&nbsp;       "bookAdvancedId": null,

&nbsp;       "priorityIta": "alta",

&nbsp;       "topic": "Química Descritiva dos Elementos",

&nbsp;       "lastReviewedAt": "2026-03-05",

&nbsp;       "subtopic": null,

&nbsp;       "startDate": "2026-03-05",

&nbsp;       "status": "dominado",

&nbsp;       "id": "69a9c38b1564e3defa2dc919",

&nbsp;       "created\_date": "2026-03-05T17:55:23.575000",

&nbsp;       "updated\_date": "2026-03-05T18:19:31.181000",

&nbsp;       "created\_by\_id": "69a9c23eaab756b4746f1b94",

&nbsp;       "created\_by": "0f0e3b1644e61970936995bed75481f8@firemail.com.br",

&nbsp;       "is\_sample": false

&nbsp;     },

&nbsp;     {

&nbsp;       "area": "Cálculo Diferencial",

&nbsp;       "totalStudyMinutes": 0,

&nbsp;       "notes": null,

&nbsp;       "subject": "calculo",

&nbsp;       "bookBaseId": null,

&nbsp;       "ankiDeck": null,

&nbsp;       "forOlympiad": false,

&nbsp;       "yearPlan": 2,

&nbsp;       "prerequisites": null,

&nbsp;       "bookAdvancedId": null,

&nbsp;       "priorityIta": "critica",

&nbsp;       "topic": "Limites e Continuidade",

&nbsp;       "lastReviewedAt": null,

&nbsp;       "subtopic": null,

&nbsp;       "startDate": null,

&nbsp;       "status": "nao\_iniciado",

&nbsp;       "id": "69a9c38b1564e3defa2dc91a",

&nbsp;       "created\_date": "2026-03-05T17:55:23.575000",

&nbsp;       "updated\_date": "2026-03-05T17:55:23.575000",

&nbsp;       "created\_by\_id": "69a9c23eaab756b4746f1b94",

&nbsp;       "created\_by": "0f0e3b1644e61970936995bed75481f8@firemail.com.br",

&nbsp;       "is\_sample": false

&nbsp;     },

&nbsp;     {

&nbsp;       "area": "Cálculo Diferencial",

&nbsp;       "totalStudyMinutes": 0,

&nbsp;       "notes": null,

&nbsp;       "subject": "calculo",

&nbsp;       "bookBaseId": null,

&nbsp;       "ankiDeck": null,

&nbsp;       "forOlympiad": false,

&nbsp;       "yearPlan": 2,

&nbsp;       "prerequisites": null,

&nbsp;       "bookAdvancedId": null,

&nbsp;       "priorityIta": "critica",

&nbsp;       "topic": "Derivadas e Aplicações",

&nbsp;       "lastReviewedAt": null,

&nbsp;       "subtopic": null,

&nbsp;       "startDate": null,

&nbsp;       "status": "nao\_iniciado",

&nbsp;       "id": "69a9c38b1564e3defa2dc91b",

&nbsp;       "created\_date": "2026-03-05T17:55:23.575000",

&nbsp;       "updated\_date": "2026-03-05T17:55:23.575000",

&nbsp;       "created\_by\_id": "69a9c23eaab756b4746f1b94",

&nbsp;       "created\_by": "0f0e3b1644e61970936995bed75481f8@firemail.com.br",

&nbsp;       "is\_sample": false

&nbsp;     },

&nbsp;     {

&nbsp;       "area": "Cálculo Integral",

&nbsp;       "totalStudyMinutes": 0,

&nbsp;       "notes": null,

&nbsp;       "subject": "calculo",

&nbsp;       "bookBaseId": null,

&nbsp;       "ankiDeck": null,

&nbsp;       "forOlympiad": false,

&nbsp;       "yearPlan": 3,

&nbsp;       "prerequisites": null,

&nbsp;       "bookAdvancedId": null,

&nbsp;       "priorityIta": "critica",

&nbsp;       "topic": "Integrais Definidas e Indefinidas",

&nbsp;       "lastReviewedAt": null,

&nbsp;       "subtopic": null,

&nbsp;       "startDate": null,

&nbsp;       "status": "nao\_iniciado",

&nbsp;       "id": "69a9c38b1564e3defa2dc91c",

&nbsp;       "created\_date": "2026-03-05T17:55:23.575000",

&nbsp;       "updated\_date": "2026-03-05T17:55:23.575000",

&nbsp;       "created\_by\_id": "69a9c23eaab756b4746f1b94",

&nbsp;       "created\_by": "0f0e3b1644e61970936995bed75481f8@firemail.com.br",

&nbsp;       "is\_sample": false

&nbsp;     },

&nbsp;     {

&nbsp;       "area": "Cálculo Integral",

&nbsp;       "totalStudyMinutes": 0,

&nbsp;       "notes": null,

&nbsp;       "subject": "calculo",

&nbsp;       "bookBaseId": null,

&nbsp;       "ankiDeck": null,

&nbsp;       "forOlympiad": false,

&nbsp;       "yearPlan": 3,

&nbsp;       "prerequisites": null,

&nbsp;       "bookAdvancedId": null,

&nbsp;       "priorityIta": "alta",

&nbsp;       "topic": "Técnicas de Integração",

&nbsp;       "lastReviewedAt": null,

&nbsp;       "subtopic": null,

&nbsp;       "startDate": null,

&nbsp;       "status": "nao\_iniciado",

&nbsp;       "id": "69a9c38b1564e3defa2dc91d",

&nbsp;       "created\_date": "2026-03-05T17:55:23.575000",

&nbsp;       "updated\_date": "2026-03-05T17:55:23.575000",

&nbsp;       "created\_by\_id": "69a9c23eaab756b4746f1b94",

&nbsp;       "created\_by": "0f0e3b1644e61970936995bed75481f8@firemail.com.br",

&nbsp;       "is\_sample": false

&nbsp;     },

&nbsp;     {

&nbsp;       "area": "Séries",

&nbsp;       "totalStudyMinutes": 0,

&nbsp;       "notes": null,

&nbsp;       "subject": "calculo",

&nbsp;       "bookBaseId": null,

&nbsp;       "ankiDeck": null,

&nbsp;       "forOlympiad": false,

&nbsp;       "yearPlan": 3,

&nbsp;       "prerequisites": null,

&nbsp;       "bookAdvancedId": null,

&nbsp;       "priorityIta": "alta",

&nbsp;       "topic": "Séries Numéricas e de Potências",

&nbsp;       "lastReviewedAt": null,

&nbsp;       "subtopic": null,

&nbsp;       "startDate": null,

&nbsp;       "status": "nao\_iniciado",

&nbsp;       "id": "69a9c38b1564e3defa2dc91e",

&nbsp;       "created\_date": "2026-03-05T17:55:23.575000",

&nbsp;       "updated\_date": "2026-03-05T17:55:23.575000",

&nbsp;       "created\_by\_id": "69a9c23eaab756b4746f1b94",

&nbsp;       "created\_by": "0f0e3b1644e61970936995bed75481f8@firemail.com.br",

&nbsp;       "is\_sample": false

&nbsp;     },

&nbsp;     {

&nbsp;       "area": "Química Geral",

&nbsp;       "totalStudyMinutes": 0,

&nbsp;       "notes": null,

&nbsp;       "subject": "quimica",

&nbsp;       "bookBaseId": null,

&nbsp;       "ankiDeck": null,

&nbsp;       "forOlympiad": false,

&nbsp;       "yearPlan": 1,

&nbsp;       "prerequisites": null,

&nbsp;       "bookAdvancedId": null,

&nbsp;       "priorityIta": "alta",

&nbsp;       "topic": "Geometria Molecular e Polaridade",

&nbsp;       "lastReviewedAt": null,

&nbsp;       "subtopic": null,

&nbsp;       "startDate": null,

&nbsp;       "status": "nao\_iniciado",

&nbsp;       "id": "69a9c38b7dca0cc058f18cfd",

&nbsp;       "created\_date": "2026-03-05T17:55:23.177000",

&nbsp;       "updated\_date": "2026-03-05T17:55:23.177000",

&nbsp;       "created\_by\_id": "69a9c23eaab756b4746f1b94",

&nbsp;       "created\_by": "0f0e3b1644e61970936995bed75481f8@firemail.com.br",

&nbsp;       "is\_sample": false

&nbsp;     },

&nbsp;     {

&nbsp;       "area": "Química Geral",

&nbsp;       "totalStudyMinutes": 0,

&nbsp;       "notes": null,

&nbsp;       "subject": "quimica",

&nbsp;       "bookBaseId": null,

&nbsp;       "ankiDeck": null,

&nbsp;       "forOlympiad": false,

&nbsp;       "yearPlan": 1,

&nbsp;       "prerequisites": null,

&nbsp;       "bookAdvancedId": null,

&nbsp;       "priorityIta": "critica",

&nbsp;       "topic": "Estequiometria",

&nbsp;       "lastReviewedAt": null,

&nbsp;       "subtopic": null,

&nbsp;       "startDate": null,

&nbsp;       "status": "nao\_iniciado",

&nbsp;       "id": "69a9c38b7dca0cc058f18cfe",

&nbsp;       "created\_date": "2026-03-05T17:55:23.177000",

&nbsp;       "updated\_date": "2026-03-05T17:55:23.177000",

&nbsp;       "created\_by\_id": "69a9c23eaab756b4746f1b94",

&nbsp;       "created\_by": "0f0e3b1644e61970936995bed75481f8@firemail.com.br",

&nbsp;       "is\_sample": false

&nbsp;     },

&nbsp;     {

&nbsp;       "area": "Química Geral",

&nbsp;       "totalStudyMinutes": 0,

&nbsp;       "notes": null,

&nbsp;       "subject": "quimica",

&nbsp;       "bookBaseId": null,

&nbsp;       "ankiDeck": null,

&nbsp;       "forOlympiad": false,

&nbsp;       "yearPlan": 1,

&nbsp;       "prerequisites": null,

&nbsp;       "bookAdvancedId": null,

&nbsp;       "priorityIta": "critica",

&nbsp;       "topic": "Soluções e Concentrações",

&nbsp;       "lastReviewedAt": null,

&nbsp;       "subtopic": null,

&nbsp;       "startDate": null,

&nbsp;       "status": "nao\_iniciado",

&nbsp;       "id": "69a9c38b7dca0cc058f18cff",

&nbsp;       "created\_date": "2026-03-05T17:55:23.177000",

&nbsp;       "updated\_date": "2026-03-05T17:55:23.177000",

&nbsp;       "created\_by\_id": "69a9c23eaab756b4746f1b94",

&nbsp;       "created\_by": "0f0e3b1644e61970936995bed75481f8@firemail.com.br",

&nbsp;       "is\_sample": false

&nbsp;     },

&nbsp;     {

&nbsp;       "area": "Físico-Química",

&nbsp;       "totalStudyMinutes": 0,

&nbsp;       "notes": null,

&nbsp;       "subject": "quimica",

&nbsp;       "bookBaseId": null,

&nbsp;       "ankiDeck": null,

&nbsp;       "forOlympiad": false,

&nbsp;       "yearPlan": 1,

&nbsp;       "prerequisites": null,

&nbsp;       "bookAdvancedId": null,

&nbsp;       "priorityIta": "critica",

&nbsp;       "topic": "Termoquímica",

&nbsp;       "lastReviewedAt": null,

&nbsp;       "subtopic": null,

&nbsp;       "startDate": null,

&nbsp;       "status": "nao\_iniciado",

&nbsp;       "id": "69a9c38b7dca0cc058f18d00",

&nbsp;       "created\_date": "2026-03-05T17:55:23.177000",

&nbsp;       "updated\_date": "2026-03-05T17:55:23.177000",

&nbsp;       "created\_by\_id": "69a9c23eaab756b4746f1b94",

&nbsp;       "created\_by": "0f0e3b1644e61970936995bed75481f8@firemail.com.br",

&nbsp;       "is\_sample": false

&nbsp;     },

&nbsp;     {

&nbsp;       "area": "Físico-Química",

&nbsp;       "totalStudyMinutes": 0,

&nbsp;       "notes": null,

&nbsp;       "subject": "quimica",

&nbsp;       "bookBaseId": null,

&nbsp;       "ankiDeck": null,

&nbsp;       "forOlympiad": false,

&nbsp;       "yearPlan": 2,

&nbsp;       "prerequisites": null,

&nbsp;       "bookAdvancedId": null,

&nbsp;       "priorityIta": "critica",

&nbsp;       "topic": "Cinética Química",

&nbsp;       "lastReviewedAt": null,

&nbsp;       "subtopic": null,

&nbsp;       "startDate": null,

&nbsp;       "status": "nao\_iniciado",

&nbsp;       "id": "69a9c38b7dca0cc058f18d01",

&nbsp;       "created\_date": "2026-03-05T17:55:23.177000",

&nbsp;       "updated\_date": "2026-03-05T17:55:23.177000",

&nbsp;       "created\_by\_id": "69a9c23eaab756b4746f1b94",

&nbsp;       "created\_by": "0f0e3b1644e61970936995bed75481f8@firemail.com.br",

&nbsp;       "is\_sample": false

&nbsp;     },

&nbsp;     {

&nbsp;       "area": "Físico-Química",

&nbsp;       "totalStudyMinutes": 0,

&nbsp;       "notes": null,

&nbsp;       "subject": "quimica",

&nbsp;       "bookBaseId": null,

&nbsp;       "ankiDeck": null,

&nbsp;       "forOlympiad": false,

&nbsp;       "yearPlan": 2,

&nbsp;       "prerequisites": null,

&nbsp;       "bookAdvancedId": null,

&nbsp;       "priorityIta": "critica",

&nbsp;       "topic": "Equilíbrio Químico",

&nbsp;       "lastReviewedAt": null,

&nbsp;       "subtopic": null,

&nbsp;       "startDate": null,

&nbsp;       "status": "nao\_iniciado",

&nbsp;       "id": "69a9c38b7dca0cc058f18d02",

&nbsp;       "created\_date": "2026-03-05T17:55:23.177000",

&nbsp;       "updated\_date": "2026-03-05T17:55:23.177000",

&nbsp;       "created\_by\_id": "69a9c23eaab756b4746f1b94",

&nbsp;       "created\_by": "0f0e3b1644e61970936995bed75481f8@firemail.com.br",

&nbsp;       "is\_sample": false

&nbsp;     },

&nbsp;     {

&nbsp;       "area": "Físico-Química",

&nbsp;       "totalStudyMinutes": 0,

&nbsp;       "notes": null,

&nbsp;       "subject": "quimica",

&nbsp;       "bookBaseId": null,

&nbsp;       "ankiDeck": null,

&nbsp;       "forOlympiad": false,

&nbsp;       "yearPlan": 2,

&nbsp;       "prerequisites": null,

&nbsp;       "bookAdvancedId": null,

&nbsp;       "priorityIta": "critica",

&nbsp;       "topic": "Equilíbrio Iônico e pH",

&nbsp;       "lastReviewedAt": null,

&nbsp;       "subtopic": null,

&nbsp;       "startDate": null,

&nbsp;       "status": "nao\_iniciado",

&nbsp;       "id": "69a9c38b7dca0cc058f18d03",

&nbsp;       "created\_date": "2026-03-05T17:55:23.177000",

&nbsp;       "updated\_date": "2026-03-05T17:55:23.177000",

&nbsp;       "created\_by\_id": "69a9c23eaab756b4746f1b94",

&nbsp;       "created\_by": "0f0e3b1644e61970936995bed75481f8@firemail.com.br",

&nbsp;       "is\_sample": false

&nbsp;     },

&nbsp;     {

&nbsp;       "area": "Físico-Química",

&nbsp;       "totalStudyMinutes": 0,

&nbsp;       "notes": null,

&nbsp;       "subject": "quimica",

&nbsp;       "bookBaseId": null,

&nbsp;       "ankiDeck": null,

&nbsp;       "forOlympiad": false,

&nbsp;       "yearPlan": 2,

&nbsp;       "prerequisites": null,

&nbsp;       "bookAdvancedId": null,

&nbsp;       "priorityIta": "critica",

&nbsp;       "topic": "Eletroquímica",

&nbsp;       "lastReviewedAt": null,

&nbsp;       "subtopic": null,

&nbsp;       "startDate": null,

&nbsp;       "status": "nao\_iniciado",

&nbsp;       "id": "69a9c38b7dca0cc058f18d04",

&nbsp;       "created\_date": "2026-03-05T17:55:23.177000",

&nbsp;       "updated\_date": "2026-03-05T17:55:23.177000",

&nbsp;       "created\_by\_id": "69a9c23eaab756b4746f1b94",

&nbsp;       "created\_by": "0f0e3b1644e61970936995bed75481f8@firemail.com.br",

&nbsp;       "is\_sample": false

&nbsp;     },

&nbsp;     {

&nbsp;       "area": "Físico-Química",

&nbsp;       "totalStudyMinutes": 0,

&nbsp;       "notes": null,

&nbsp;       "subject": "quimica",

&nbsp;       "bookBaseId": null,

&nbsp;       "ankiDeck": null,

&nbsp;       "forOlympiad": false,

&nbsp;       "yearPlan": 2,

&nbsp;       "prerequisites": null,

&nbsp;       "bookAdvancedId": null,

&nbsp;       "priorityIta": "alta",

&nbsp;       "topic": "Propriedades Coligativas",

&nbsp;       "lastReviewedAt": null,

&nbsp;       "subtopic": null,

&nbsp;       "startDate": null,

&nbsp;       "status": "nao\_iniciado",

&nbsp;       "id": "69a9c38b7dca0cc058f18d05",

&nbsp;       "created\_date": "2026-03-05T17:55:23.177000",

&nbsp;       "updated\_date": "2026-03-05T17:55:23.177000",

&nbsp;       "created\_by\_id": "69a9c23eaab756b4746f1b94",

&nbsp;       "created\_by": "0f0e3b1644e61970936995bed75481f8@firemail.com.br",

&nbsp;       "is\_sample": false

&nbsp;     },

&nbsp;     {

&nbsp;       "area": "Química Orgânica",

&nbsp;       "totalStudyMinutes": 0,

&nbsp;       "notes": null,

&nbsp;       "subject": "quimica",

&nbsp;       "bookBaseId": null,

&nbsp;       "ankiDeck": null,

&nbsp;       "forOlympiad": false,

&nbsp;       "yearPlan": 1,

&nbsp;       "prerequisites": null,

&nbsp;       "bookAdvancedId": null,

&nbsp;       "priorityIta": "critica",

&nbsp;       "topic": "Nomenclatura e Cadeias Carbônicas",

&nbsp;       "lastReviewedAt": null,

&nbsp;       "subtopic": null,

&nbsp;       "startDate": null,

&nbsp;       "status": "nao\_iniciado",

&nbsp;       "id": "69a9c38b7dca0cc058f18d06",

&nbsp;       "created\_date": "2026-03-05T17:55:23.177000",

&nbsp;       "updated\_date": "2026-03-05T17:55:23.177000",

&nbsp;       "created\_by\_id": "69a9c23eaab756b4746f1b94",

&nbsp;       "created\_by": "0f0e3b1644e61970936995bed75481f8@firemail.com.br",

&nbsp;       "is\_sample": false

&nbsp;     },

&nbsp;     {

&nbsp;       "area": "Química Orgânica",

&nbsp;       "totalStudyMinutes": 0,

&nbsp;       "notes": null,

&nbsp;       "subject": "quimica",

&nbsp;       "bookBaseId": null,

&nbsp;       "ankiDeck": null,

&nbsp;       "forOlympiad": false,

&nbsp;       "yearPlan": 2,

&nbsp;       "prerequisites": null,

&nbsp;       "bookAdvancedId": null,

&nbsp;       "priorityIta": "critica",

&nbsp;       "topic": "Funções Orgânicas",

&nbsp;       "lastReviewedAt": null,

&nbsp;       "subtopic": null,

&nbsp;       "startDate": null,

&nbsp;       "status": "nao\_iniciado",

&nbsp;       "id": "69a9c38b7dca0cc058f18d07",

&nbsp;       "created\_date": "2026-03-05T17:55:23.177000",

&nbsp;       "updated\_date": "2026-03-05T17:55:23.177000",

&nbsp;       "created\_by\_id": "69a9c23eaab756b4746f1b94",

&nbsp;       "created\_by": "0f0e3b1644e61970936995bed75481f8@firemail.com.br",

&nbsp;       "is\_sample": false

&nbsp;     },

&nbsp;     {

&nbsp;       "area": "Química Orgânica",

&nbsp;       "totalStudyMinutes": 0,

&nbsp;       "notes": null,

&nbsp;       "subject": "quimica",

&nbsp;       "bookBaseId": null,

&nbsp;       "ankiDeck": null,

&nbsp;       "forOlympiad": false,

&nbsp;       "yearPlan": 2,

&nbsp;       "prerequisites": null,

&nbsp;       "bookAdvancedId": null,

&nbsp;       "priorityIta": "critica",

&nbsp;       "topic": "Isomeria",

&nbsp;       "lastReviewedAt": null,

&nbsp;       "subtopic": null,

&nbsp;       "startDate": null,

&nbsp;       "status": "nao\_iniciado",

&nbsp;       "id": "69a9c38b7dca0cc058f18d08",

&nbsp;       "created\_date": "2026-03-05T17:55:23.177000",

&nbsp;       "updated\_date": "2026-03-05T17:55:23.177000",

&nbsp;       "created\_by\_id": "69a9c23eaab756b4746f1b94",

&nbsp;       "created\_by": "0f0e3b1644e61970936995bed75481f8@firemail.com.br",

&nbsp;       "is\_sample": false

&nbsp;     },

&nbsp;     {

&nbsp;       "area": "Química Orgânica",

&nbsp;       "totalStudyMinutes": 0,

&nbsp;       "notes": null,

&nbsp;       "subject": "quimica",

&nbsp;       "bookBaseId": null,

&nbsp;       "ankiDeck": null,

&nbsp;       "forOlympiad": false,

&nbsp;       "yearPlan": 3,

&nbsp;       "prerequisites": null,

&nbsp;       "bookAdvancedId": null,

&nbsp;       "priorityIta": "critica",

&nbsp;       "topic": "Reações Orgânicas e Mecanismos",

&nbsp;       "lastReviewedAt": null,

&nbsp;       "subtopic": null,

&nbsp;       "startDate": null,

&nbsp;       "status": "nao\_iniciado",

&nbsp;       "id": "69a9c38b7dca0cc058f18d09",

&nbsp;       "created\_date": "2026-03-05T17:55:23.177000",

&nbsp;       "updated\_date": "2026-03-05T17:55:23.177000",

&nbsp;       "created\_by\_id": "69a9c23eaab756b4746f1b94",

&nbsp;       "created\_by": "0f0e3b1644e61970936995bed75481f8@firemail.com.br",

&nbsp;       "is\_sample": false

&nbsp;     },

&nbsp;     {

&nbsp;       "area": "Química Orgânica",

&nbsp;       "totalStudyMinutes": 0,

&nbsp;       "notes": null,

&nbsp;       "subject": "quimica",

&nbsp;       "bookBaseId": null,

&nbsp;       "ankiDeck": null,

&nbsp;       "forOlympiad": false,

&nbsp;       "yearPlan": 3,

&nbsp;       "prerequisites": null,

&nbsp;       "bookAdvancedId": null,

&nbsp;       "priorityIta": "media",

&nbsp;       "topic": "Polímeros e Bioquímica",

&nbsp;       "lastReviewedAt": null,

&nbsp;       "subtopic": null,

&nbsp;       "startDate": null,

&nbsp;       "status": "nao\_iniciado",

&nbsp;       "id": "69a9c38b7dca0cc058f18d0a",

&nbsp;       "created\_date": "2026-03-05T17:55:23.177000",

&nbsp;       "updated\_date": "2026-03-05T17:55:23.177000",

&nbsp;       "created\_by\_id": "69a9c23eaab756b4746f1b94",

&nbsp;       "created\_by": "0f0e3b1644e61970936995bed75481f8@firemail.com.br",

&nbsp;       "is\_sample": false

&nbsp;     },

&nbsp;     {

&nbsp;       "area": "Química Inorgânica",

&nbsp;       "totalStudyMinutes": 0,

&nbsp;       "notes": null,

&nbsp;       "subject": "quimica",

&nbsp;       "bookBaseId": null,

&nbsp;       "ankiDeck": null,

&nbsp;       "forOlympiad": false,

&nbsp;       "yearPlan": 1,

&nbsp;       "prerequisites": null,

&nbsp;       "bookAdvancedId": null,

&nbsp;       "priorityIta": "alta",

&nbsp;       "topic": "Reações Inorgânicas e Classificação",

&nbsp;       "lastReviewedAt": null,

&nbsp;       "subtopic": null,

&nbsp;       "startDate": null,

&nbsp;       "status": "nao\_iniciado",

&nbsp;       "id": "69a9c38b7dca0cc058f18d0b",

&nbsp;       "created\_date": "2026-03-05T17:55:23.177000",

&nbsp;       "updated\_date": "2026-03-05T17:55:23.177000",

&nbsp;       "created\_by\_id": "69a9c23eaab756b4746f1b94",

&nbsp;       "created\_by": "0f0e3b1644e61970936995bed75481f8@firemail.com.br",

&nbsp;       "is\_sample": false

&nbsp;     },

&nbsp;     {

&nbsp;       "area": "Termologia",

&nbsp;       "totalStudyMinutes": 0,

&nbsp;       "notes": null,

&nbsp;       "subject": "fisica",

&nbsp;       "bookBaseId": null,

&nbsp;       "ankiDeck": null,

&nbsp;       "forOlympiad": false,

&nbsp;       "yearPlan": 2,

&nbsp;       "prerequisites": null,

&nbsp;       "bookAdvancedId": null,

&nbsp;       "priorityIta": "critica",

&nbsp;       "topic": "Gases Ideais e Termodinâmica",

&nbsp;       "lastReviewedAt": null,

&nbsp;       "subtopic": null,

&nbsp;       "startDate": null,

&nbsp;       "status": "nao\_iniciado",

&nbsp;       "id": "69a9c38a022dc08ab28ce913",

&nbsp;       "created\_date": "2026-03-05T17:55:22.780000",

&nbsp;       "updated\_date": "2026-03-05T17:55:22.780000",

&nbsp;       "created\_by\_id": "69a9c23eaab756b4746f1b94",

&nbsp;       "created\_by": "0f0e3b1644e61970936995bed75481f8@firemail.com.br",

&nbsp;       "is\_sample": false

&nbsp;     },

&nbsp;     {

&nbsp;       "area": "Ondas",

&nbsp;       "totalStudyMinutes": 0,

&nbsp;       "notes": null,

&nbsp;       "subject": "fisica",

&nbsp;       "bookBaseId": null,

&nbsp;       "ankiDeck": null,

&nbsp;       "forOlympiad": false,

&nbsp;       "yearPlan": 2,

&nbsp;       "prerequisites": null,

&nbsp;       "bookAdvancedId": null,

&nbsp;       "priorityIta": "critica",

&nbsp;       "topic": "MHS e Ondas Mecânicas",

&nbsp;       "lastReviewedAt": null,

&nbsp;       "subtopic": null,

&nbsp;       "startDate": null,

&nbsp;       "status": "nao\_iniciado",

&nbsp;       "id": "69a9c38a022dc08ab28ce914",

&nbsp;       "created\_date": "2026-03-05T17:55:22.780000",

&nbsp;       "updated\_date": "2026-03-05T17:55:22.780000",

&nbsp;       "created\_by\_id": "69a9c23eaab756b4746f1b94",

&nbsp;       "created\_by": "0f0e3b1644e61970936995bed75481f8@firemail.com.br",

&nbsp;       "is\_sample": false

&nbsp;     },

&nbsp;     {

&nbsp;       "area": "Ondas",

&nbsp;       "totalStudyMinutes": 0,

&nbsp;       "notes": null,

&nbsp;       "subject": "fisica",

&nbsp;       "bookBaseId": null,

&nbsp;       "ankiDeck": null,

&nbsp;       "forOlympiad": false,

&nbsp;       "yearPlan": 2,

&nbsp;       "prerequisites": null,

&nbsp;       "bookAdvancedId": null,

&nbsp;       "priorityIta": "media",

&nbsp;       "topic": "Acústica",

&nbsp;       "lastReviewedAt": null,

&nbsp;       "subtopic": null,

&nbsp;       "startDate": null,

&nbsp;       "status": "nao\_iniciado",

&nbsp;       "id": "69a9c38a022dc08ab28ce915",

&nbsp;       "created\_date": "2026-03-05T17:55:22.780000",

&nbsp;       "updated\_date": "2026-03-05T17:55:22.780000",

&nbsp;       "created\_by\_id": "69a9c23eaab756b4746f1b94",

&nbsp;       "created\_by": "0f0e3b1644e61970936995bed75481f8@firemail.com.br",

&nbsp;       "is\_sample": false

&nbsp;     },

&nbsp;     {

&nbsp;       "area": "Óptica",

&nbsp;       "totalStudyMinutes": 0,

&nbsp;       "notes": null,

&nbsp;       "subject": "fisica",

&nbsp;       "bookBaseId": null,

&nbsp;       "ankiDeck": null,

&nbsp;       "forOlympiad": false,

&nbsp;       "yearPlan": 2,

&nbsp;       "prerequisites": null,

&nbsp;       "bookAdvancedId": null,

&nbsp;       "priorityIta": "alta",

&nbsp;       "topic": "Óptica Geométrica",

&nbsp;       "lastReviewedAt": null,

&nbsp;       "subtopic": null,

&nbsp;       "startDate": null,

&nbsp;       "status": "nao\_iniciado",

&nbsp;       "id": "69a9c38a022dc08ab28ce916",

&nbsp;       "created\_date": "2026-03-05T17:55:22.780000",

&nbsp;       "updated\_date": "2026-03-05T17:55:22.780000",

&nbsp;       "created\_by\_id": "69a9c23eaab756b4746f1b94",

&nbsp;       "created\_by": "0f0e3b1644e61970936995bed75481f8@firemail.com.br",

&nbsp;       "is\_sample": false

&nbsp;     },

&nbsp;     {

&nbsp;       "area": "Óptica",

&nbsp;       "totalStudyMinutes": 0,

&nbsp;       "notes": null,

&nbsp;       "subject": "fisica",

&nbsp;       "bookBaseId": null,

&nbsp;       "ankiDeck": null,

&nbsp;       "forOlympiad": false,

&nbsp;       "yearPlan": 3,

&nbsp;       "prerequisites": null,

&nbsp;       "bookAdvancedId": null,

&nbsp;       "priorityIta": "alta",

&nbsp;       "topic": "Óptica Física (interferência, difração)",

&nbsp;       "lastReviewedAt": null,

&nbsp;       "subtopic": null,

&nbsp;       "startDate": null,

&nbsp;       "status": "nao\_iniciado",

&nbsp;       "id": "69a9c38a022dc08ab28ce917",

&nbsp;       "created\_date": "2026-03-05T17:55:22.780000",

&nbsp;       "updated\_date": "2026-03-05T17:55:22.780000",

&nbsp;       "created\_by\_id": "69a9c23eaab756b4746f1b94",

&nbsp;       "created\_by": "0f0e3b1644e61970936995bed75481f8@firemail.com.br",

&nbsp;       "is\_sample": false

&nbsp;     },

&nbsp;     {

&nbsp;       "area": "Eletricidade",

&nbsp;       "totalStudyMinutes": 0,

&nbsp;       "notes": null,

&nbsp;       "subject": "fisica",

&nbsp;       "bookBaseId": null,

&nbsp;       "ankiDeck": null,

&nbsp;       "forOlympiad": false,

&nbsp;       "yearPlan": 2,

&nbsp;       "prerequisites": null,

&nbsp;       "bookAdvancedId": null,

&nbsp;       "priorityIta": "critica",

&nbsp;       "topic": "Eletrostática",

&nbsp;       "lastReviewedAt": null,

&nbsp;       "subtopic": null,

&nbsp;       "startDate": null,

&nbsp;       "status": "nao\_iniciado",

&nbsp;       "id": "69a9c38a022dc08ab28ce918",

&nbsp;       "created\_date": "2026-03-05T17:55:22.780000",

&nbsp;       "updated\_date": "2026-03-05T17:55:22.780000",

&nbsp;       "created\_by\_id": "69a9c23eaab756b4746f1b94",

&nbsp;       "created\_by": "0f0e3b1644e61970936995bed75481f8@firemail.com.br",

&nbsp;       "is\_sample": false

&nbsp;     },

&nbsp;     {

&nbsp;       "area": "Eletricidade",

&nbsp;       "totalStudyMinutes": 0,

&nbsp;       "notes": null,

&nbsp;       "subject": "fisica",

&nbsp;       "bookBaseId": null,

&nbsp;       "ankiDeck": null,

&nbsp;       "forOlympiad": false,

&nbsp;       "yearPlan": 2,

&nbsp;       "prerequisites": null,

&nbsp;       "bookAdvancedId": null,

&nbsp;       "priorityIta": "critica",

&nbsp;       "topic": "Circuitos Elétricos (CC)",

&nbsp;       "lastReviewedAt": null,

&nbsp;       "subtopic": null,

&nbsp;       "startDate": null,

&nbsp;       "status": "nao\_iniciado",

&nbsp;       "id": "69a9c38a022dc08ab28ce919",

&nbsp;       "created\_date": "2026-03-05T17:55:22.780000",

&nbsp;       "updated\_date": "2026-03-05T17:55:22.780000",

&nbsp;       "created\_by\_id": "69a9c23eaab756b4746f1b94",

&nbsp;       "created\_by": "0f0e3b1644e61970936995bed75481f8@firemail.com.br",

&nbsp;       "is\_sample": false

&nbsp;     },

&nbsp;     {

&nbsp;       "area": "Eletricidade",

&nbsp;       "totalStudyMinutes": 0,

&nbsp;       "notes": null,

&nbsp;       "subject": "fisica",

&nbsp;       "bookBaseId": null,

&nbsp;       "ankiDeck": null,

&nbsp;       "forOlympiad": false,

&nbsp;       "yearPlan": 2,

&nbsp;       "prerequisites": null,

&nbsp;       "bookAdvancedId": null,

&nbsp;       "priorityIta": "alta",

&nbsp;       "topic": "Capacitores",

&nbsp;       "lastReviewedAt": null,

&nbsp;       "subtopic": null,

&nbsp;       "startDate": null,

&nbsp;       "status": "nao\_iniciado",

&nbsp;       "id": "69a9c38a022dc08ab28ce91a",

&nbsp;       "created\_date": "2026-03-05T17:55:22.780000",

&nbsp;       "updated\_date": "2026-03-05T17:55:22.780000",

&nbsp;       "created\_by\_id": "69a9c23eaab756b4746f1b94",

&nbsp;       "created\_by": "0f0e3b1644e61970936995bed75481f8@firemail.com.br",

&nbsp;       "is\_sample": false

&nbsp;     },

&nbsp;     {

&nbsp;       "area": "Eletromagnetismo",

&nbsp;       "totalStudyMinutes": 0,

&nbsp;       "notes": null,

&nbsp;       "subject": "fisica",

&nbsp;       "bookBaseId": null,

&nbsp;       "ankiDeck": null,

&nbsp;       "forOlympiad": false,

&nbsp;       "yearPlan": 2,

&nbsp;       "prerequisites": null,

&nbsp;       "bookAdvancedId": null,

&nbsp;       "priorityIta": "critica",

&nbsp;       "topic": "Campo Magnético e Força de Lorentz",

&nbsp;       "lastReviewedAt": null,

&nbsp;       "subtopic": null,

&nbsp;       "startDate": null,

&nbsp;       "status": "nao\_iniciado",

&nbsp;       "id": "69a9c38a022dc08ab28ce91b",

&nbsp;       "created\_date": "2026-03-05T17:55:22.780000",

&nbsp;       "updated\_date": "2026-03-05T17:55:22.780000",

&nbsp;       "created\_by\_id": "69a9c23eaab756b4746f1b94",

&nbsp;       "created\_by": "0f0e3b1644e61970936995bed75481f8@firemail.com.br",

&nbsp;       "is\_sample": false

&nbsp;     },

&nbsp;     {

&nbsp;       "area": "Eletromagnetismo",

&nbsp;       "totalStudyMinutes": 0,

&nbsp;       "notes": null,

&nbsp;       "subject": "fisica",

&nbsp;       "bookBaseId": null,

&nbsp;       "ankiDeck": null,

&nbsp;       "forOlympiad": false,

&nbsp;       "yearPlan": 3,

&nbsp;       "prerequisites": null,

&nbsp;       "bookAdvancedId": null,

&nbsp;       "priorityIta": "critica",

&nbsp;       "topic": "Indução Eletromagnética e Lei de Faraday",

&nbsp;       "lastReviewedAt": null,

&nbsp;       "subtopic": null,

&nbsp;       "startDate": null,

&nbsp;       "status": "nao\_iniciado",

&nbsp;       "id": "69a9c38a022dc08ab28ce91c",

&nbsp;       "created\_date": "2026-03-05T17:55:22.780000",

&nbsp;       "updated\_date": "2026-03-05T17:55:22.780000",

&nbsp;       "created\_by\_id": "69a9c23eaab756b4746f1b94",

&nbsp;       "created\_by": "0f0e3b1644e61970936995bed75481f8@firemail.com.br",

&nbsp;       "is\_sample": false

&nbsp;     },

&nbsp;     {

&nbsp;       "area": "Física Moderna",

&nbsp;       "totalStudyMinutes": 0,

&nbsp;       "notes": null,

&nbsp;       "subject": "fisica",

&nbsp;       "bookBaseId": null,

&nbsp;       "ankiDeck": null,

&nbsp;       "forOlympiad": false,

&nbsp;       "yearPlan": 3,

&nbsp;       "prerequisites": null,

&nbsp;       "bookAdvancedId": null,

&nbsp;       "priorityIta": "alta",

&nbsp;       "topic": "Relatividade Restrita",

&nbsp;       "lastReviewedAt": null,

&nbsp;       "subtopic": null,

&nbsp;       "startDate": null,

&nbsp;       "status": "nao\_iniciado",

&nbsp;       "id": "69a9c38a022dc08ab28ce91d",

&nbsp;       "created\_date": "2026-03-05T17:55:22.780000",

&nbsp;       "updated\_date": "2026-03-05T17:55:22.780000",

&nbsp;       "created\_by\_id": "69a9c23eaab756b4746f1b94",

&nbsp;       "created\_by": "0f0e3b1644e61970936995bed75481f8@firemail.com.br",

&nbsp;       "is\_sample": false

&nbsp;     },

&nbsp;     {

&nbsp;       "area": "Física Moderna",

&nbsp;       "totalStudyMinutes": 0,

&nbsp;       "notes": null,

&nbsp;       "subject": "fisica",

&nbsp;       "bookBaseId": null,

&nbsp;       "ankiDeck": null,

&nbsp;       "forOlympiad": false,

&nbsp;       "yearPlan": 3,

&nbsp;       "prerequisites": null,

&nbsp;       "bookAdvancedId": null,

&nbsp;       "priorityIta": "alta",

&nbsp;       "topic": "Efeito Fotoelétrico e Dualidade Onda-Partícula",

&nbsp;       "lastReviewedAt": null,

&nbsp;       "subtopic": null,

&nbsp;       "startDate": null,

&nbsp;       "status": "nao\_iniciado",

&nbsp;       "id": "69a9c38a022dc08ab28ce91e",

&nbsp;       "created\_date": "2026-03-05T17:55:22.780000",

&nbsp;       "updated\_date": "2026-03-05T17:55:22.780000",

&nbsp;       "created\_by\_id": "69a9c23eaab756b4746f1b94",

&nbsp;       "created\_by": "0f0e3b1644e61970936995bed75481f8@firemail.com.br",

&nbsp;       "is\_sample": false

&nbsp;     },

&nbsp;     {

&nbsp;       "area": "Física Moderna",

&nbsp;       "totalStudyMinutes": 0,

&nbsp;       "notes": null,

&nbsp;       "subject": "fisica",

&nbsp;       "bookBaseId": null,

&nbsp;       "ankiDeck": null,

&nbsp;       "forOlympiad": false,

&nbsp;       "yearPlan": 3,

&nbsp;       "prerequisites": null,

&nbsp;       "bookAdvancedId": null,

&nbsp;       "priorityIta": "media",

&nbsp;       "topic": "Física Nuclear e Radioatividade",

&nbsp;       "lastReviewedAt": null,

&nbsp;       "subtopic": null,

&nbsp;       "startDate": null,

&nbsp;       "status": "nao\_iniciado",

&nbsp;       "id": "69a9c38a022dc08ab28ce91f",

&nbsp;       "created\_date": "2026-03-05T17:55:22.780000",

&nbsp;       "updated\_date": "2026-03-05T17:55:22.780000",

&nbsp;       "created\_by\_id": "69a9c23eaab756b4746f1b94",

&nbsp;       "created\_by": "0f0e3b1644e61970936995bed75481f8@firemail.com.br",

&nbsp;       "is\_sample": false

&nbsp;     },

&nbsp;     {

&nbsp;       "area": "Química Geral",

&nbsp;       "totalStudyMinutes": 0,

&nbsp;       "notes": null,

&nbsp;       "subject": "quimica",

&nbsp;       "bookBaseId": null,

&nbsp;       "ankiDeck": null,

&nbsp;       "forOlympiad": false,

&nbsp;       "yearPlan": 1,

&nbsp;       "prerequisites": null,

&nbsp;       "bookAdvancedId": null,

&nbsp;       "priorityIta": "critica",

&nbsp;       "topic": "Estrutura Atômica e Tabela Periódica",

&nbsp;       "lastReviewedAt": null,

&nbsp;       "subtopic": null,

&nbsp;       "startDate": null,

&nbsp;       "status": "nao\_iniciado",

&nbsp;       "id": "69a9c38a022dc08ab28ce920",

&nbsp;       "created\_date": "2026-03-05T17:55:22.780000",

&nbsp;       "updated\_date": "2026-03-05T17:55:22.780000",

&nbsp;       "created\_by\_id": "69a9c23eaab756b4746f1b94",

&nbsp;       "created\_by": "0f0e3b1644e61970936995bed75481f8@firemail.com.br",

&nbsp;       "is\_sample": false

&nbsp;     },

&nbsp;     {

&nbsp;       "area": "Química Geral",

&nbsp;       "totalStudyMinutes": 0,

&nbsp;       "notes": null,

&nbsp;       "subject": "quimica",

&nbsp;       "bookBaseId": null,

&nbsp;       "ankiDeck": null,

&nbsp;       "forOlympiad": false,

&nbsp;       "yearPlan": 1,

&nbsp;       "prerequisites": null,

&nbsp;       "bookAdvancedId": null,

&nbsp;       "priorityIta": "critica",

&nbsp;       "topic": "Ligações Químicas",

&nbsp;       "lastReviewedAt": null,

&nbsp;       "subtopic": null,

&nbsp;       "startDate": null,

&nbsp;       "status": "nao\_iniciado",

&nbsp;       "id": "69a9c38a022dc08ab28ce921",

&nbsp;       "created\_date": "2026-03-05T17:55:22.780000",

&nbsp;       "updated\_date": "2026-03-05T17:55:22.780000",

&nbsp;       "created\_by\_id": "69a9c23eaab756b4746f1b94",

&nbsp;       "created\_by": "0f0e3b1644e61970936995bed75481f8@firemail.com.br",

&nbsp;       "is\_sample": false

&nbsp;     },

&nbsp;     {

&nbsp;       "area": "Geometria Espacial",

&nbsp;       "totalStudyMinutes": 0,

&nbsp;       "notes": null,

&nbsp;       "subject": "matematica",

&nbsp;       "bookBaseId": null,

&nbsp;       "ankiDeck": null,

&nbsp;       "forOlympiad": false,

&nbsp;       "yearPlan": 2,

&nbsp;       "prerequisites": null,

&nbsp;       "bookAdvancedId": null,

&nbsp;       "priorityIta": "alta",

&nbsp;       "topic": "Prismas e Pirâmides",

&nbsp;       "lastReviewedAt": null,

&nbsp;       "subtopic": null,

&nbsp;       "startDate": null,

&nbsp;       "status": "nao\_iniciado",

&nbsp;       "id": "69a9c38ab63fd9b50d308620",

&nbsp;       "created\_date": "2026-03-05T17:55:22.342000",

&nbsp;       "updated\_date": "2026-03-05T17:55:22.342000",

&nbsp;       "created\_by\_id": "69a9c23eaab756b4746f1b94",

&nbsp;       "created\_by": "0f0e3b1644e61970936995bed75481f8@firemail.com.br",

&nbsp;       "is\_sample": false

&nbsp;     },

&nbsp;     {

&nbsp;       "area": "Geometria Espacial",

&nbsp;       "totalStudyMinutes": 0,

&nbsp;       "notes": null,

&nbsp;       "subject": "matematica",

&nbsp;       "bookBaseId": null,

&nbsp;       "ankiDeck": null,

&nbsp;       "forOlympiad": false,

&nbsp;       "yearPlan": 2,

&nbsp;       "prerequisites": null,

&nbsp;       "bookAdvancedId": null,

&nbsp;       "priorityIta": "alta",

&nbsp;       "topic": "Cilindros, Cones e Esferas",

&nbsp;       "lastReviewedAt": null,

&nbsp;       "subtopic": null,

&nbsp;       "startDate": null,

&nbsp;       "status": "nao\_iniciado",

&nbsp;       "id": "69a9c38ab63fd9b50d308621",

&nbsp;       "created\_date": "2026-03-05T17:55:22.342000",

&nbsp;       "updated\_date": "2026-03-05T17:55:22.342000",

&nbsp;       "created\_by\_id": "69a9c23eaab756b4746f1b94",

&nbsp;       "created\_by": "0f0e3b1644e61970936995bed75481f8@firemail.com.br",

&nbsp;       "is\_sample": false

&nbsp;     },

&nbsp;     {

&nbsp;       "area": "Geometria Espacial",

&nbsp;       "totalStudyMinutes": 0,

&nbsp;       "notes": null,

&nbsp;       "subject": "matematica",

&nbsp;       "bookBaseId": null,

&nbsp;       "ankiDeck": null,

&nbsp;       "forOlympiad": false,

&nbsp;       "yearPlan": 2,

&nbsp;       "prerequisites": null,

&nbsp;       "bookAdvancedId": null,

&nbsp;       "priorityIta": "alta",

&nbsp;       "topic": "Posições Relativas e Projeções",

&nbsp;       "lastReviewedAt": null,

&nbsp;       "subtopic": null,

&nbsp;       "startDate": null,

&nbsp;       "status": "nao\_iniciado",

&nbsp;       "id": "69a9c38ab63fd9b50d308622",

&nbsp;       "created\_date": "2026-03-05T17:55:22.342000",

&nbsp;       "updated\_date": "2026-03-05T17:55:22.342000",

&nbsp;       "created\_by\_id": "69a9c23eaab756b4746f1b94",

&nbsp;       "created\_by": "0f0e3b1644e61970936995bed75481f8@firemail.com.br",

&nbsp;       "is\_sample": false

&nbsp;     },

&nbsp;     {

&nbsp;       "area": "Matrizes e Sistemas",

&nbsp;       "totalStudyMinutes": 0,

&nbsp;       "notes": null,

&nbsp;       "subject": "matematica",

&nbsp;       "bookBaseId": null,

&nbsp;       "ankiDeck": null,

&nbsp;       "forOlympiad": false,

&nbsp;       "yearPlan": 1,

&nbsp;       "prerequisites": null,

&nbsp;       "bookAdvancedId": null,

&nbsp;       "priorityIta": "critica",

&nbsp;       "topic": "Matrizes e Determinantes",

&nbsp;       "lastReviewedAt": null,

&nbsp;       "subtopic": null,

&nbsp;       "startDate": null,

&nbsp;       "status": "nao\_iniciado",

&nbsp;       "id": "69a9c38ab63fd9b50d308623",

&nbsp;       "created\_date": "2026-03-05T17:55:22.342000",

&nbsp;       "updated\_date": "2026-03-05T17:55:22.342000",

&nbsp;       "created\_by\_id": "69a9c23eaab756b4746f1b94",

&nbsp;       "created\_by": "0f0e3b1644e61970936995bed75481f8@firemail.com.br",

&nbsp;       "is\_sample": false

&nbsp;     },

&nbsp;     {

&nbsp;       "area": "Matrizes e Sistemas",

&nbsp;       "totalStudyMinutes": 0,

&nbsp;       "notes": null,

&nbsp;       "subject": "matematica",

&nbsp;       "bookBaseId": null,

&nbsp;       "ankiDeck": null,

&nbsp;       "forOlympiad": false,

&nbsp;       "yearPlan": 1,

&nbsp;       "prerequisites": null,

&nbsp;       "bookAdvancedId": null,

&nbsp;       "priorityIta": "critica",

&nbsp;       "topic": "Sistemas Lineares",

&nbsp;       "lastReviewedAt": null,

&nbsp;       "subtopic": null,

&nbsp;       "startDate": null,

&nbsp;       "status": "nao\_iniciado",

&nbsp;       "id": "69a9c38ab63fd9b50d308624",

&nbsp;       "created\_date": "2026-03-05T17:55:22.342000",

&nbsp;       "updated\_date": "2026-03-05T17:55:22.342000",

&nbsp;       "created\_by\_id": "69a9c23eaab756b4746f1b94",

&nbsp;       "created\_by": "0f0e3b1644e61970936995bed75481f8@firemail.com.br",

&nbsp;       "is\_sample": false

&nbsp;     },

&nbsp;     {

&nbsp;       "area": "Mecânica",

&nbsp;       "totalStudyMinutes": 0,

&nbsp;       "notes": null,

&nbsp;       "subject": "fisica",

&nbsp;       "bookBaseId": null,

&nbsp;       "ankiDeck": null,

&nbsp;       "forOlympiad": false,

&nbsp;       "yearPlan": 1,

&nbsp;       "prerequisites": null,

&nbsp;       "bookAdvancedId": null,

&nbsp;       "priorityIta": "critica",

&nbsp;       "topic": "Cinemática Escalar e Vetorial",

&nbsp;       "lastReviewedAt": null,

&nbsp;       "subtopic": null,

&nbsp;       "startDate": null,

&nbsp;       "status": "nao\_iniciado",

&nbsp;       "id": "69a9c38ab63fd9b50d308625",

&nbsp;       "created\_date": "2026-03-05T17:55:22.342000",

&nbsp;       "updated\_date": "2026-03-05T17:55:22.342000",

&nbsp;       "created\_by\_id": "69a9c23eaab756b4746f1b94",

&nbsp;       "created\_by": "0f0e3b1644e61970936995bed75481f8@firemail.com.br",

&nbsp;       "is\_sample": false

&nbsp;     },

&nbsp;     {

&nbsp;       "area": "Mecânica",

&nbsp;       "totalStudyMinutes": 0,

&nbsp;       "notes": null,

&nbsp;       "subject": "fisica",

&nbsp;       "bookBaseId": null,

&nbsp;       "ankiDeck": null,

&nbsp;       "forOlympiad": false,

&nbsp;       "yearPlan": 1,

&nbsp;       "prerequisites": null,

&nbsp;       "bookAdvancedId": null,

&nbsp;       "priorityIta": "critica",

&nbsp;       "topic": "Leis de Newton",

&nbsp;       "lastReviewedAt": null,

&nbsp;       "subtopic": null,

&nbsp;       "startDate": null,

&nbsp;       "status": "nao\_iniciado",

&nbsp;       "id": "69a9c38ab63fd9b50d308626",

&nbsp;       "created\_date": "2026-03-05T17:55:22.342000",

&nbsp;       "updated\_date": "2026-03-05T17:55:22.342000",

&nbsp;       "created\_by\_id": "69a9c23eaab756b4746f1b94",

&nbsp;       "created\_by": "0f0e3b1644e61970936995bed75481f8@firemail.com.br",

&nbsp;       "is\_sample": false

&nbsp;     },

&nbsp;     {

&nbsp;       "area": "Mecânica",

&nbsp;       "totalStudyMinutes": 0,

&nbsp;       "notes": null,

&nbsp;       "subject": "fisica",

&nbsp;       "bookBaseId": null,

&nbsp;       "ankiDeck": null,

&nbsp;       "forOlympiad": false,

&nbsp;       "yearPlan": 1,

&nbsp;       "prerequisites": null,

&nbsp;       "bookAdvancedId": null,

&nbsp;       "priorityIta": "critica",

&nbsp;       "topic": "Trabalho e Energia",

&nbsp;       "lastReviewedAt": null,

&nbsp;       "subtopic": null,

&nbsp;       "startDate": null,

&nbsp;       "status": "nao\_iniciado",

&nbsp;       "id": "69a9c38ab63fd9b50d308627",

&nbsp;       "created\_date": "2026-03-05T17:55:22.342000",

&nbsp;       "updated\_date": "2026-03-05T17:55:22.342000",

&nbsp;       "created\_by\_id": "69a9c23eaab756b4746f1b94",

&nbsp;       "created\_by": "0f0e3b1644e61970936995bed75481f8@firemail.com.br",

&nbsp;       "is\_sample": false

&nbsp;     },

&nbsp;     {

&nbsp;       "area": "Mecânica",

&nbsp;       "totalStudyMinutes": 0,

&nbsp;       "notes": null,

&nbsp;       "subject": "fisica",

&nbsp;       "bookBaseId": null,

&nbsp;       "ankiDeck": null,

&nbsp;       "forOlympiad": false,

&nbsp;       "yearPlan": 1,

&nbsp;       "prerequisites": null,

&nbsp;       "bookAdvancedId": null,

&nbsp;       "priorityIta": "critica",

&nbsp;       "topic": "Impulso e Quantidade de Movimento",

&nbsp;       "lastReviewedAt": null,

&nbsp;       "subtopic": null,

&nbsp;       "startDate": null,

&nbsp;       "status": "nao\_iniciado",

&nbsp;       "id": "69a9c38ab63fd9b50d308628",

&nbsp;       "created\_date": "2026-03-05T17:55:22.342000",

&nbsp;       "updated\_date": "2026-03-05T17:55:22.342000",

&nbsp;       "created\_by\_id": "69a9c23eaab756b4746f1b94",

&nbsp;       "created\_by": "0f0e3b1644e61970936995bed75481f8@firemail.com.br",

&nbsp;       "is\_sample": false

&nbsp;     },

&nbsp;     {

&nbsp;       "area": "Mecânica",

&nbsp;       "totalStudyMinutes": 0,

&nbsp;       "notes": null,

&nbsp;       "subject": "fisica",

&nbsp;       "bookBaseId": null,

&nbsp;       "ankiDeck": null,

&nbsp;       "forOlympiad": false,

&nbsp;       "yearPlan": 2,

&nbsp;       "prerequisites": null,

&nbsp;       "bookAdvancedId": null,

&nbsp;       "priorityIta": "alta",

&nbsp;       "topic": "Gravitação Universal",

&nbsp;       "lastReviewedAt": null,

&nbsp;       "subtopic": null,

&nbsp;       "startDate": null,

&nbsp;       "status": "nao\_iniciado",

&nbsp;       "id": "69a9c38ab63fd9b50d308629",

&nbsp;       "created\_date": "2026-03-05T17:55:22.342000",

&nbsp;       "updated\_date": "2026-03-05T17:55:22.342000",

&nbsp;       "created\_by\_id": "69a9c23eaab756b4746f1b94",

&nbsp;       "created\_by": "0f0e3b1644e61970936995bed75481f8@firemail.com.br",

&nbsp;       "is\_sample": false

&nbsp;     },

&nbsp;     {

&nbsp;       "area": "Mecânica",

&nbsp;       "totalStudyMinutes": 0,

&nbsp;       "notes": null,

&nbsp;       "subject": "fisica",

&nbsp;       "bookBaseId": null,

&nbsp;       "ankiDeck": null,

&nbsp;       "forOlympiad": false,

&nbsp;       "yearPlan": 1,

&nbsp;       "prerequisites": null,

&nbsp;       "bookAdvancedId": null,

&nbsp;       "priorityIta": "alta",

&nbsp;       "topic": "Estática e Torque",

&nbsp;       "lastReviewedAt": null,

&nbsp;       "subtopic": null,

&nbsp;       "startDate": null,

&nbsp;       "status": "nao\_iniciado",

&nbsp;       "id": "69a9c38ab63fd9b50d30862a",

&nbsp;       "created\_date": "2026-03-05T17:55:22.342000",

&nbsp;       "updated\_date": "2026-03-05T17:55:22.342000",

&nbsp;       "created\_by\_id": "69a9c23eaab756b4746f1b94",

&nbsp;       "created\_by": "0f0e3b1644e61970936995bed75481f8@firemail.com.br",

&nbsp;       "is\_sample": false

&nbsp;     },

&nbsp;     {

&nbsp;       "area": "Mecânica",

&nbsp;       "totalStudyMinutes": 0,

&nbsp;       "notes": null,

&nbsp;       "subject": "fisica",

&nbsp;       "bookBaseId": null,

&nbsp;       "ankiDeck": null,

&nbsp;       "forOlympiad": false,

&nbsp;       "yearPlan": 1,

&nbsp;       "prerequisites": null,

&nbsp;       "bookAdvancedId": null,

&nbsp;       "priorityIta": "alta",

&nbsp;       "topic": "Hidrostática",

&nbsp;       "lastReviewedAt": null,

&nbsp;       "subtopic": null,

&nbsp;       "startDate": null,

&nbsp;       "status": "nao\_iniciado",

&nbsp;       "id": "69a9c38ab63fd9b50d30862b",

&nbsp;       "created\_date": "2026-03-05T17:55:22.342000",

&nbsp;       "updated\_date": "2026-03-05T17:55:22.342000",

&nbsp;       "created\_by\_id": "69a9c23eaab756b4746f1b94",

&nbsp;       "created\_by": "0f0e3b1644e61970936995bed75481f8@firemail.com.br",

&nbsp;       "is\_sample": false

&nbsp;     },

&nbsp;     {

&nbsp;       "area": "Mecânica",

&nbsp;       "totalStudyMinutes": 0,

&nbsp;       "notes": null,

&nbsp;       "subject": "fisica",

&nbsp;       "bookBaseId": null,

&nbsp;       "ankiDeck": null,

&nbsp;       "forOlympiad": false,

&nbsp;       "yearPlan": 1,

&nbsp;       "prerequisites": null,

&nbsp;       "bookAdvancedId": null,

&nbsp;       "priorityIta": "critica",

&nbsp;       "topic": "Movimento Circular",

&nbsp;       "lastReviewedAt": null,

&nbsp;       "subtopic": null,

&nbsp;       "startDate": null,

&nbsp;       "status": "nao\_iniciado",

&nbsp;       "id": "69a9c38ab63fd9b50d30862c",

&nbsp;       "created\_date": "2026-03-05T17:55:22.342000",

&nbsp;       "updated\_date": "2026-03-05T17:55:22.342000",

&nbsp;       "created\_by\_id": "69a9c23eaab756b4746f1b94",

&nbsp;       "created\_by": "0f0e3b1644e61970936995bed75481f8@firemail.com.br",

&nbsp;       "is\_sample": false

&nbsp;     },

&nbsp;     {

&nbsp;       "area": "Termologia",

&nbsp;       "totalStudyMinutes": 0,

&nbsp;       "notes": null,

&nbsp;       "subject": "fisica",

&nbsp;       "bookBaseId": null,

&nbsp;       "ankiDeck": null,

&nbsp;       "forOlympiad": false,

&nbsp;       "yearPlan": 1,

&nbsp;       "prerequisites": null,

&nbsp;       "bookAdvancedId": null,

&nbsp;       "priorityIta": "media",

&nbsp;       "topic": "Temperatura e Dilatação",

&nbsp;       "lastReviewedAt": null,

&nbsp;       "subtopic": null,

&nbsp;       "startDate": null,

&nbsp;       "status": "nao\_iniciado",

&nbsp;       "id": "69a9c38ab63fd9b50d30862d",

&nbsp;       "created\_date": "2026-03-05T17:55:22.342000",

&nbsp;       "updated\_date": "2026-03-05T17:55:22.342000",

&nbsp;       "created\_by\_id": "69a9c23eaab756b4746f1b94",

&nbsp;       "created\_by": "0f0e3b1644e61970936995bed75481f8@firemail.com.br",

&nbsp;       "is\_sample": false

&nbsp;     },

&nbsp;     {

&nbsp;       "area": "Termologia",

&nbsp;       "totalStudyMinutes": 0,

&nbsp;       "notes": null,

&nbsp;       "subject": "fisica",

&nbsp;       "bookBaseId": null,

&nbsp;       "ankiDeck": null,

&nbsp;       "forOlympiad": false,

&nbsp;       "yearPlan": 1,

&nbsp;       "prerequisites": null,

&nbsp;       "bookAdvancedId": null,

&nbsp;       "priorityIta": "alta",

&nbsp;       "topic": "Calorimetria e Mudança de Fase",

&nbsp;       "lastReviewedAt": null,

&nbsp;       "subtopic": null,

&nbsp;       "startDate": null,

&nbsp;       "status": "nao\_iniciado",

&nbsp;       "id": "69a9c38ab63fd9b50d30862e",

&nbsp;       "created\_date": "2026-03-05T17:55:22.342000",

&nbsp;       "updated\_date": "2026-03-05T17:55:22.342000",

&nbsp;       "created\_by\_id": "69a9c23eaab756b4746f1b94",

&nbsp;       "created\_by": "0f0e3b1644e61970936995bed75481f8@firemail.com.br",

&nbsp;       "is\_sample": false

&nbsp;     },

&nbsp;     {

&nbsp;       "area": "Análise Combinatória",

&nbsp;       "totalStudyMinutes": 0,

&nbsp;       "notes": null,

&nbsp;       "subject": "matematica",

&nbsp;       "bookBaseId": null,

&nbsp;       "ankiDeck": null,

&nbsp;       "forOlympiad": false,

&nbsp;       "yearPlan": 1,

&nbsp;       "prerequisites": null,

&nbsp;       "bookAdvancedId": null,

&nbsp;       "priorityIta": "critica",

&nbsp;       "topic": "Permutações e Combinações",

&nbsp;       "lastReviewedAt": null,

&nbsp;       "subtopic": null,

&nbsp;       "startDate": null,

&nbsp;       "status": "nao\_iniciado",

&nbsp;       "id": "69a9c3897374279d04fad3e3",

&nbsp;       "created\_date": "2026-03-05T17:55:21.953000",

&nbsp;       "updated\_date": "2026-03-05T17:55:21.953000",

&nbsp;       "created\_by\_id": "69a9c23eaab756b4746f1b94",

&nbsp;       "created\_by": "0f0e3b1644e61970936995bed75481f8@firemail.com.br",

&nbsp;       "is\_sample": false

&nbsp;     },

&nbsp;     {

&nbsp;       "area": "Análise Combinatória",

&nbsp;       "totalStudyMinutes": 0,

&nbsp;       "notes": null,

&nbsp;       "subject": "matematica",

&nbsp;       "bookBaseId": null,

&nbsp;       "ankiDeck": null,

&nbsp;       "forOlympiad": false,

&nbsp;       "yearPlan": 2,

&nbsp;       "prerequisites": null,

&nbsp;       "bookAdvancedId": null,

&nbsp;       "priorityIta": "critica",

&nbsp;       "topic": "Binômio de Newton",

&nbsp;       "lastReviewedAt": null,

&nbsp;       "subtopic": null,

&nbsp;       "startDate": null,

&nbsp;       "status": "nao\_iniciado",

&nbsp;       "id": "69a9c3897374279d04fad3e4",

&nbsp;       "created\_date": "2026-03-05T17:55:21.953000",

&nbsp;       "updated\_date": "2026-03-05T17:55:21.953000",

&nbsp;       "created\_by\_id": "69a9c23eaab756b4746f1b94",

&nbsp;       "created\_by": "0f0e3b1644e61970936995bed75481f8@firemail.com.br",

&nbsp;       "is\_sample": false

&nbsp;     },

&nbsp;     {

&nbsp;       "area": "Probabilidade",

&nbsp;       "totalStudyMinutes": 0,

&nbsp;       "notes": null,

&nbsp;       "subject": "matematica",

&nbsp;       "bookBaseId": null,

&nbsp;       "ankiDeck": null,

&nbsp;       "forOlympiad": false,

&nbsp;       "yearPlan": 2,

&nbsp;       "prerequisites": null,

&nbsp;       "bookAdvancedId": null,

&nbsp;       "priorityIta": "critica",

&nbsp;       "topic": "Probabilidade Clássica e Condicional",

&nbsp;       "lastReviewedAt": null,

&nbsp;       "subtopic": null,

&nbsp;       "startDate": null,

&nbsp;       "status": "nao\_iniciado",

&nbsp;       "id": "69a9c3897374279d04fad3e5",

&nbsp;       "created\_date": "2026-03-05T17:55:21.953000",

&nbsp;       "updated\_date": "2026-03-05T17:55:21.953000",

&nbsp;       "created\_by\_id": "69a9c23eaab756b4746f1b94",

&nbsp;       "created\_by": "0f0e3b1644e61970936995bed75481f8@firemail.com.br",

&nbsp;       "is\_sample": false

&nbsp;     },

&nbsp;     {

&nbsp;       "area": "Probabilidade",

&nbsp;       "totalStudyMinutes": 0,

&nbsp;       "notes": null,

&nbsp;       "subject": "matematica",

&nbsp;       "bookBaseId": null,

&nbsp;       "ankiDeck": null,

&nbsp;       "forOlympiad": false,

&nbsp;       "yearPlan": 2,

&nbsp;       "prerequisites": null,

&nbsp;       "bookAdvancedId": null,

&nbsp;       "priorityIta": "alta",

&nbsp;       "topic": "Distribuição Binomial",

&nbsp;       "lastReviewedAt": null,

&nbsp;       "subtopic": null,

&nbsp;       "startDate": null,

&nbsp;       "status": "nao\_iniciado",

&nbsp;       "id": "69a9c3897374279d04fad3e6",

&nbsp;       "created\_date": "2026-03-05T17:55:21.953000",

&nbsp;       "updated\_date": "2026-03-05T17:55:21.953000",

&nbsp;       "created\_by\_id": "69a9c23eaab756b4746f1b94",

&nbsp;       "created\_by": "0f0e3b1644e61970936995bed75481f8@firemail.com.br",

&nbsp;       "is\_sample": false

&nbsp;     },

&nbsp;     {

&nbsp;       "area": "Números Complexos",

&nbsp;       "totalStudyMinutes": 0,

&nbsp;       "notes": null,

&nbsp;       "subject": "matematica",

&nbsp;       "bookBaseId": null,

&nbsp;       "ankiDeck": null,

&nbsp;       "forOlympiad": false,

&nbsp;       "yearPlan": 2,

&nbsp;       "prerequisites": null,

&nbsp;       "bookAdvancedId": null,

&nbsp;       "priorityIta": "critica",

&nbsp;       "topic": "Forma Algébrica e Trigonométrica",

&nbsp;       "lastReviewedAt": null,

&nbsp;       "subtopic": null,

&nbsp;       "startDate": null,

&nbsp;       "status": "nao\_iniciado",

&nbsp;       "id": "69a9c3897374279d04fad3e7",

&nbsp;       "created\_date": "2026-03-05T17:55:21.953000",

&nbsp;       "updated\_date": "2026-03-05T17:55:21.953000",

&nbsp;       "created\_by\_id": "69a9c23eaab756b4746f1b94",

&nbsp;       "created\_by": "0f0e3b1644e61970936995bed75481f8@firemail.com.br",

&nbsp;       "is\_sample": false

&nbsp;     },

&nbsp;     {

&nbsp;       "area": "Números Complexos",

&nbsp;       "totalStudyMinutes": 0,

&nbsp;       "notes": null,

&nbsp;       "subject": "matematica",

&nbsp;       "bookBaseId": null,

&nbsp;       "ankiDeck": null,

&nbsp;       "forOlympiad": false,

&nbsp;       "yearPlan": 2,

&nbsp;       "prerequisites": null,

&nbsp;       "bookAdvancedId": null,

&nbsp;       "priorityIta": "critica",

&nbsp;       "topic": "Fórmula de De Moivre e Raízes",

&nbsp;       "lastReviewedAt": null,

&nbsp;       "subtopic": null,

&nbsp;       "startDate": null,

&nbsp;       "status": "nao\_iniciado",

&nbsp;       "id": "69a9c3897374279d04fad3e8",

&nbsp;       "created\_date": "2026-03-05T17:55:21.953000",

&nbsp;       "updated\_date": "2026-03-05T17:55:21.953000",

&nbsp;       "created\_by\_id": "69a9c23eaab756b4746f1b94",

&nbsp;       "created\_by": "0f0e3b1644e61970936995bed75481f8@firemail.com.br",

&nbsp;       "is\_sample": false

&nbsp;     },

&nbsp;     {

&nbsp;       "area": "Polinômios",

&nbsp;       "totalStudyMinutes": 0,

&nbsp;       "notes": null,

&nbsp;       "subject": "matematica",

&nbsp;       "bookBaseId": null,

&nbsp;       "ankiDeck": null,

&nbsp;       "forOlympiad": false,

&nbsp;       "yearPlan": 2,

&nbsp;       "prerequisites": null,

&nbsp;       "bookAdvancedId": null,

&nbsp;       "priorityIta": "alta",

&nbsp;       "topic": "Operações com Polinômios",

&nbsp;       "lastReviewedAt": null,

&nbsp;       "subtopic": null,

&nbsp;       "startDate": null,

&nbsp;       "status": "nao\_iniciado",

&nbsp;       "id": "69a9c3897374279d04fad3e9",

&nbsp;       "created\_date": "2026-03-05T17:55:21.953000",

&nbsp;       "updated\_date": "2026-03-05T17:55:21.953000",

&nbsp;       "created\_by\_id": "69a9c23eaab756b4746f1b94",

&nbsp;       "created\_by": "0f0e3b1644e61970936995bed75481f8@firemail.com.br",

&nbsp;       "is\_sample": false

&nbsp;     },

&nbsp;     {

&nbsp;       "area": "Polinômios",

&nbsp;       "totalStudyMinutes": 0,

&nbsp;       "notes": null,

&nbsp;       "subject": "matematica",

&nbsp;       "bookBaseId": null,

&nbsp;       "ankiDeck": null,

&nbsp;       "forOlympiad": false,

&nbsp;       "yearPlan": 2,

&nbsp;       "prerequisites": null,

&nbsp;       "bookAdvancedId": null,

&nbsp;       "priorityIta": "critica",

&nbsp;       "topic": "Equações Polinomiais e Relações de Girard",

&nbsp;       "lastReviewedAt": null,

&nbsp;       "subtopic": null,

&nbsp;       "startDate": null,

&nbsp;       "status": "nao\_iniciado",

&nbsp;       "id": "69a9c3897374279d04fad3ea",

&nbsp;       "created\_date": "2026-03-05T17:55:21.953000",

&nbsp;       "updated\_date": "2026-03-05T17:55:21.953000",

&nbsp;       "created\_by\_id": "69a9c23eaab756b4746f1b94",

&nbsp;       "created\_by": "0f0e3b1644e61970936995bed75481f8@firemail.com.br",

&nbsp;       "is\_sample": false

&nbsp;     },

&nbsp;     {

&nbsp;       "area": "Geometria Analítica",

&nbsp;       "totalStudyMinutes": 0,

&nbsp;       "notes": null,

&nbsp;       "subject": "matematica",

&nbsp;       "bookBaseId": null,

&nbsp;       "ankiDeck": null,

&nbsp;       "forOlympiad": false,

&nbsp;       "yearPlan": 1,

&nbsp;       "prerequisites": null,

&nbsp;       "bookAdvancedId": null,

&nbsp;       "priorityIta": "critica",

&nbsp;       "topic": "Ponto e Reta",

&nbsp;       "lastReviewedAt": null,

&nbsp;       "subtopic": null,

&nbsp;       "startDate": null,

&nbsp;       "status": "nao\_iniciado",

&nbsp;       "id": "69a9c3897374279d04fad3eb",

&nbsp;       "created\_date": "2026-03-05T17:55:21.953000",

&nbsp;       "updated\_date": "2026-03-05T17:55:21.953000",

&nbsp;       "created\_by\_id": "69a9c23eaab756b4746f1b94",

&nbsp;       "created\_by": "0f0e3b1644e61970936995bed75481f8@firemail.com.br",

&nbsp;       "is\_sample": false

&nbsp;     },

&nbsp;     {

&nbsp;       "area": "Geometria Analítica",

&nbsp;       "totalStudyMinutes": 0,

&nbsp;       "notes": null,

&nbsp;       "subject": "matematica",

&nbsp;       "bookBaseId": null,

&nbsp;       "ankiDeck": null,

&nbsp;       "forOlympiad": false,

&nbsp;       "yearPlan": 1,

&nbsp;       "prerequisites": null,

&nbsp;       "bookAdvancedId": null,

&nbsp;       "priorityIta": "critica",

&nbsp;       "topic": "Circunferência",

&nbsp;       "lastReviewedAt": null,

&nbsp;       "subtopic": null,

&nbsp;       "startDate": null,

&nbsp;       "status": "nao\_iniciado",

&nbsp;       "id": "69a9c3897374279d04fad3ec",

&nbsp;       "created\_date": "2026-03-05T17:55:21.953000",

&nbsp;       "updated\_date": "2026-03-05T17:55:21.953000",

&nbsp;       "created\_by\_id": "69a9c23eaab756b4746f1b94",

&nbsp;       "created\_by": "0f0e3b1644e61970936995bed75481f8@firemail.com.br",

&nbsp;       "is\_sample": false

&nbsp;     },

&nbsp;     {

&nbsp;       "area": "Geometria Analítica",

&nbsp;       "totalStudyMinutes": 0,

&nbsp;       "notes": null,

&nbsp;       "subject": "matematica",

&nbsp;       "bookBaseId": null,

&nbsp;       "ankiDeck": null,

&nbsp;       "forOlympiad": false,

&nbsp;       "yearPlan": 2,

&nbsp;       "prerequisites": null,

&nbsp;       "bookAdvancedId": null,

&nbsp;       "priorityIta": "critica",

&nbsp;       "topic": "Cônicas: Elipse, Hipérbole, Parábola",

&nbsp;       "lastReviewedAt": null,

&nbsp;       "subtopic": null,

&nbsp;       "startDate": null,

&nbsp;       "status": "nao\_iniciado",

&nbsp;       "id": "69a9c3897374279d04fad3ed",

&nbsp;       "created\_date": "2026-03-05T17:55:21.953000",

&nbsp;       "updated\_date": "2026-03-05T17:55:21.953000",

&nbsp;       "created\_by\_id": "69a9c23eaab756b4746f1b94",

&nbsp;       "created\_by": "0f0e3b1644e61970936995bed75481f8@firemail.com.br",

&nbsp;       "is\_sample": false

&nbsp;     },

&nbsp;     {

&nbsp;       "area": "Geometria Plana",

&nbsp;       "totalStudyMinutes": 0,

&nbsp;       "notes": null,

&nbsp;       "subject": "matematica",

&nbsp;       "bookBaseId": null,

&nbsp;       "ankiDeck": null,

&nbsp;       "forOlympiad": false,

&nbsp;       "yearPlan": 1,

&nbsp;       "prerequisites": null,

&nbsp;       "bookAdvancedId": null,

&nbsp;       "priorityIta": "critica",

&nbsp;       "topic": "Triângulos e Congruência",

&nbsp;       "lastReviewedAt": null,

&nbsp;       "subtopic": null,

&nbsp;       "startDate": null,

&nbsp;       "status": "nao\_iniciado",

&nbsp;       "id": "69a9c3897374279d04fad3ee",

&nbsp;       "created\_date": "2026-03-05T17:55:21.953000",

&nbsp;       "updated\_date": "2026-03-05T17:55:21.953000",

&nbsp;       "created\_by\_id": "69a9c23eaab756b4746f1b94",

&nbsp;       "created\_by": "0f0e3b1644e61970936995bed75481f8@firemail.com.br",

&nbsp;       "is\_sample": false

&nbsp;     },

&nbsp;     {

&nbsp;       "area": "Geometria Plana",

&nbsp;       "totalStudyMinutes": 0,

&nbsp;       "notes": null,

&nbsp;       "subject": "matematica",

&nbsp;       "bookBaseId": null,

&nbsp;       "ankiDeck": null,

&nbsp;       "forOlympiad": false,

&nbsp;       "yearPlan": 1,

&nbsp;       "prerequisites": null,

&nbsp;       "bookAdvancedId": null,

&nbsp;       "priorityIta": "alta",

&nbsp;       "topic": "Semelhança e Teorema de Tales",

&nbsp;       "lastReviewedAt": null,

&nbsp;       "subtopic": null,

&nbsp;       "startDate": null,

&nbsp;       "status": "nao\_iniciado",

&nbsp;       "id": "69a9c3897374279d04fad3ef",

&nbsp;       "created\_date": "2026-03-05T17:55:21.953000",

&nbsp;       "updated\_date": "2026-03-05T17:55:21.953000",

&nbsp;       "created\_by\_id": "69a9c23eaab756b4746f1b94",

&nbsp;       "created\_by": "0f0e3b1644e61970936995bed75481f8@firemail.com.br",

&nbsp;       "is\_sample": false

&nbsp;     },

&nbsp;     {

&nbsp;       "area": "Geometria Plana",

&nbsp;       "totalStudyMinutes": 0,

&nbsp;       "notes": null,

&nbsp;       "subject": "matematica",

&nbsp;       "bookBaseId": null,

&nbsp;       "ankiDeck": null,

&nbsp;       "forOlympiad": false,

&nbsp;       "yearPlan": 2,

&nbsp;       "prerequisites": null,

&nbsp;       "bookAdvancedId": null,

&nbsp;       "priorityIta": "critica",

&nbsp;       "topic": "Circunferência e Polígonos Inscritos",

&nbsp;       "lastReviewedAt": null,

&nbsp;       "subtopic": null,

&nbsp;       "startDate": null,

&nbsp;       "status": "nao\_iniciado",

&nbsp;       "id": "69a9c3897374279d04fad3f0",

&nbsp;       "created\_date": "2026-03-05T17:55:21.953000",

&nbsp;       "updated\_date": "2026-03-05T17:55:21.953000",

&nbsp;       "created\_by\_id": "69a9c23eaab756b4746f1b94",

&nbsp;       "created\_by": "0f0e3b1644e61970936995bed75481f8@firemail.com.br",

&nbsp;       "is\_sample": false

&nbsp;     },

&nbsp;     {

&nbsp;       "area": "Geometria Plana",

&nbsp;       "totalStudyMinutes": 0,

&nbsp;       "notes": null,

&nbsp;       "subject": "matematica",

&nbsp;       "bookBaseId": null,

&nbsp;       "ankiDeck": null,

&nbsp;       "forOlympiad": false,

&nbsp;       "yearPlan": 1,

&nbsp;       "prerequisites": null,

&nbsp;       "bookAdvancedId": null,

&nbsp;       "priorityIta": "alta",

&nbsp;       "topic": "Áreas de Figuras Planas",

&nbsp;       "lastReviewedAt": null,

&nbsp;       "subtopic": null,

&nbsp;       "startDate": null,

&nbsp;       "status": "nao\_iniciado",

&nbsp;       "id": "69a9c3897374279d04fad3f1",

&nbsp;       "created\_date": "2026-03-05T17:55:21.953000",

&nbsp;       "updated\_date": "2026-03-05T17:55:21.953000",

&nbsp;       "created\_by\_id": "69a9c23eaab756b4746f1b94",

&nbsp;       "created\_by": "0f0e3b1644e61970936995bed75481f8@firemail.com.br",

&nbsp;       "is\_sample": false

&nbsp;     },

&nbsp;     {

&nbsp;       "area": "Conjuntos e Lógica",

&nbsp;       "totalStudyMinutes": 0,

&nbsp;       "notes": null,

&nbsp;       "subject": "matematica",

&nbsp;       "bookBaseId": null,

&nbsp;       "ankiDeck": null,

&nbsp;       "forOlympiad": false,

&nbsp;       "yearPlan": 1,

&nbsp;       "prerequisites": null,

&nbsp;       "bookAdvancedId": null,

&nbsp;       "priorityIta": "alta",

&nbsp;       "topic": "Teoria de Conjuntos",

&nbsp;       "lastReviewedAt": null,

&nbsp;       "subtopic": null,

&nbsp;       "startDate": null,

&nbsp;       "status": "nao\_iniciado",

&nbsp;       "id": "69a9c3899d6076028a7de73f",

&nbsp;       "created\_date": "2026-03-05T17:55:21.544000",

&nbsp;       "updated\_date": "2026-03-05T17:55:21.544000",

&nbsp;       "created\_by\_id": "69a9c23eaab756b4746f1b94",

&nbsp;       "created\_by": "0f0e3b1644e61970936995bed75481f8@firemail.com.br",

&nbsp;       "is\_sample": false

&nbsp;     },

&nbsp;     {

&nbsp;       "area": "Conjuntos e Lógica",

&nbsp;       "totalStudyMinutes": 0,

&nbsp;       "notes": null,

&nbsp;       "subject": "matematica",

&nbsp;       "bookBaseId": null,

&nbsp;       "ankiDeck": null,

&nbsp;       "forOlympiad": false,

&nbsp;       "yearPlan": 1,

&nbsp;       "prerequisites": null,

&nbsp;       "bookAdvancedId": null,

&nbsp;       "priorityIta": "media",

&nbsp;       "topic": "Lógica Proposicional",

&nbsp;       "lastReviewedAt": null,

&nbsp;       "subtopic": null,

&nbsp;       "startDate": null,

&nbsp;       "status": "nao\_iniciado",

&nbsp;       "id": "69a9c3899d6076028a7de740",

&nbsp;       "created\_date": "2026-03-05T17:55:21.544000",

&nbsp;       "updated\_date": "2026-03-05T17:55:21.544000",

&nbsp;       "created\_by\_id": "69a9c23eaab756b4746f1b94",

&nbsp;       "created\_by": "0f0e3b1644e61970936995bed75481f8@firemail.com.br",

&nbsp;       "is\_sample": false

&nbsp;     },

&nbsp;     {

&nbsp;       "area": "Funções",

&nbsp;       "totalStudyMinutes": 0,

&nbsp;       "notes": null,

&nbsp;       "subject": "matematica",

&nbsp;       "bookBaseId": null,

&nbsp;       "ankiDeck": null,

&nbsp;       "forOlympiad": false,

&nbsp;       "yearPlan": 1,

&nbsp;       "prerequisites": null,

&nbsp;       "bookAdvancedId": null,

&nbsp;       "priorityIta": "critica",

&nbsp;       "topic": "Funções do 1º e 2º Grau",

&nbsp;       "lastReviewedAt": null,

&nbsp;       "subtopic": null,

&nbsp;       "startDate": null,

&nbsp;       "status": "nao\_iniciado",

&nbsp;       "id": "69a9c3899d6076028a7de741",

&nbsp;       "created\_date": "2026-03-05T17:55:21.544000",

&nbsp;       "updated\_date": "2026-03-05T17:55:21.544000",

&nbsp;       "created\_by\_id": "69a9c23eaab756b4746f1b94",

&nbsp;       "created\_by": "0f0e3b1644e61970936995bed75481f8@firemail.com.br",

&nbsp;       "is\_sample": false

&nbsp;     },

&nbsp;     {

&nbsp;       "area": "Funções",

&nbsp;       "totalStudyMinutes": 0,

&nbsp;       "notes": null,

&nbsp;       "subject": "matematica",

&nbsp;       "bookBaseId": null,

&nbsp;       "ankiDeck": null,

&nbsp;       "forOlympiad": false,

&nbsp;       "yearPlan": 1,

&nbsp;       "prerequisites": null,

&nbsp;       "bookAdvancedId": null,

&nbsp;       "priorityIta": "critica",

&nbsp;       "topic": "Função Exponencial",

&nbsp;       "lastReviewedAt": null,

&nbsp;       "subtopic": null,

&nbsp;       "startDate": null,

&nbsp;       "status": "nao\_iniciado",

&nbsp;       "id": "69a9c3899d6076028a7de742",

&nbsp;       "created\_date": "2026-03-05T17:55:21.544000",

&nbsp;       "updated\_date": "2026-03-05T17:55:21.544000",

&nbsp;       "created\_by\_id": "69a9c23eaab756b4746f1b94",

&nbsp;       "created\_by": "0f0e3b1644e61970936995bed75481f8@firemail.com.br",

&nbsp;       "is\_sample": false

&nbsp;     },

&nbsp;     {

&nbsp;       "area": "Funções",

&nbsp;       "totalStudyMinutes": 0,

&nbsp;       "notes": null,

&nbsp;       "subject": "matematica",

&nbsp;       "bookBaseId": null,

&nbsp;       "ankiDeck": null,

&nbsp;       "forOlympiad": false,

&nbsp;       "yearPlan": 1,

&nbsp;       "prerequisites": null,

&nbsp;       "bookAdvancedId": null,

&nbsp;       "priorityIta": "critica",

&nbsp;       "topic": "Função Logarítmica",

&nbsp;       "lastReviewedAt": null,

&nbsp;       "subtopic": null,

&nbsp;       "startDate": null,

&nbsp;       "status": "nao\_iniciado",

&nbsp;       "id": "69a9c3899d6076028a7de743",

&nbsp;       "created\_date": "2026-03-05T17:55:21.544000",

&nbsp;       "updated\_date": "2026-03-05T17:55:21.544000",

&nbsp;       "created\_by\_id": "69a9c23eaab756b4746f1b94",

&nbsp;       "created\_by": "0f0e3b1644e61970936995bed75481f8@firemail.com.br",

&nbsp;       "is\_sample": false

&nbsp;     },

&nbsp;     {

&nbsp;       "area": "Funções",

&nbsp;       "totalStudyMinutes": 0,

&nbsp;       "notes": null,

&nbsp;       "subject": "matematica",

&nbsp;       "bookBaseId": null,

&nbsp;       "ankiDeck": null,

&nbsp;       "forOlympiad": false,

&nbsp;       "yearPlan": 1,

&nbsp;       "prerequisites": null,

&nbsp;       "bookAdvancedId": null,

&nbsp;       "priorityIta": "alta",

&nbsp;       "topic": "Função Modular",

&nbsp;       "lastReviewedAt": null,

&nbsp;       "subtopic": null,

&nbsp;       "startDate": null,

&nbsp;       "status": "nao\_iniciado",

&nbsp;       "id": "69a9c3899d6076028a7de744",

&nbsp;       "created\_date": "2026-03-05T17:55:21.544000",

&nbsp;       "updated\_date": "2026-03-05T17:55:21.544000",

&nbsp;       "created\_by\_id": "69a9c23eaab756b4746f1b94",

&nbsp;       "created\_by": "0f0e3b1644e61970936995bed75481f8@firemail.com.br",

&nbsp;       "is\_sample": false

&nbsp;     },

&nbsp;     {

&nbsp;       "area": "Funções",

&nbsp;       "totalStudyMinutes": 0,

&nbsp;       "notes": null,

&nbsp;       "subject": "matematica",

&nbsp;       "bookBaseId": null,

&nbsp;       "ankiDeck": null,

&nbsp;       "forOlympiad": false,

&nbsp;       "yearPlan": 1,

&nbsp;       "prerequisites": null,

&nbsp;       "bookAdvancedId": null,

&nbsp;       "priorityIta": "alta",

&nbsp;       "topic": "Composição e Inversas",

&nbsp;       "lastReviewedAt": null,

&nbsp;       "subtopic": null,

&nbsp;       "startDate": null,

&nbsp;       "status": "nao\_iniciado",

&nbsp;       "id": "69a9c3899d6076028a7de745",

&nbsp;       "created\_date": "2026-03-05T17:55:21.544000",

&nbsp;       "updated\_date": "2026-03-05T17:55:21.544000",

&nbsp;       "created\_by\_id": "69a9c23eaab756b4746f1b94",

&nbsp;       "created\_by": "0f0e3b1644e61970936995bed75481f8@firemail.com.br",

&nbsp;       "is\_sample": false

&nbsp;     },

&nbsp;     {

&nbsp;       "area": "Trigonometria",

&nbsp;       "totalStudyMinutes": 0,

&nbsp;       "notes": null,

&nbsp;       "subject": "matematica",

&nbsp;       "bookBaseId": null,

&nbsp;       "ankiDeck": null,

&nbsp;       "forOlympiad": false,

&nbsp;       "yearPlan": 1,

&nbsp;       "prerequisites": null,

&nbsp;       "bookAdvancedId": null,

&nbsp;       "priorityIta": "critica",

&nbsp;       "topic": "Razões Trigonométricas",

&nbsp;       "lastReviewedAt": null,

&nbsp;       "subtopic": null,

&nbsp;       "startDate": null,

&nbsp;       "status": "nao\_iniciado",

&nbsp;       "id": "69a9c3899d6076028a7de746",

&nbsp;       "created\_date": "2026-03-05T17:55:21.544000",

&nbsp;       "updated\_date": "2026-03-05T17:55:21.544000",

&nbsp;       "created\_by\_id": "69a9c23eaab756b4746f1b94",

&nbsp;       "created\_by": "0f0e3b1644e61970936995bed75481f8@firemail.com.br",

&nbsp;       "is\_sample": false

&nbsp;     },

&nbsp;     {

&nbsp;       "area": "Trigonometria",

&nbsp;       "totalStudyMinutes": 0,

&nbsp;       "notes": null,

&nbsp;       "subject": "matematica",

&nbsp;       "bookBaseId": null,

&nbsp;       "ankiDeck": null,

&nbsp;       "forOlympiad": false,

&nbsp;       "yearPlan": 1,

&nbsp;       "prerequisites": null,

&nbsp;       "bookAdvancedId": null,

&nbsp;       "priorityIta": "critica",

&nbsp;       "topic": "Funções Trigonométricas",

&nbsp;       "lastReviewedAt": null,

&nbsp;       "subtopic": null,

&nbsp;       "startDate": null,

&nbsp;       "status": "nao\_iniciado",

&nbsp;       "id": "69a9c3899d6076028a7de747",

&nbsp;       "created\_date": "2026-03-05T17:55:21.544000",

&nbsp;       "updated\_date": "2026-03-05T17:55:21.544000",

&nbsp;       "created\_by\_id": "69a9c23eaab756b4746f1b94",

&nbsp;       "created\_by": "0f0e3b1644e61970936995bed75481f8@firemail.com.br",

&nbsp;       "is\_sample": false

&nbsp;     },

&nbsp;     {

&nbsp;       "area": "Trigonometria",

&nbsp;       "totalStudyMinutes": 0,

&nbsp;       "notes": null,

&nbsp;       "subject": "matematica",

&nbsp;       "bookBaseId": null,

&nbsp;       "ankiDeck": null,

&nbsp;       "forOlympiad": false,

&nbsp;       "yearPlan": 1,

&nbsp;       "prerequisites": null,

&nbsp;       "bookAdvancedId": null,

&nbsp;       "priorityIta": "critica",

&nbsp;       "topic": "Equações e Inequações Trigonométricas",

&nbsp;       "lastReviewedAt": null,

&nbsp;       "subtopic": null,

&nbsp;       "startDate": null,

&nbsp;       "status": "nao\_iniciado",

&nbsp;       "id": "69a9c3899d6076028a7de748",

&nbsp;       "created\_date": "2026-03-05T17:55:21.544000",

&nbsp;       "updated\_date": "2026-03-05T17:55:21.544000",

&nbsp;       "created\_by\_id": "69a9c23eaab756b4746f1b94",

&nbsp;       "created\_by": "0f0e3b1644e61970936995bed75481f8@firemail.com.br",

&nbsp;       "is\_sample": false

&nbsp;     },

&nbsp;     {

&nbsp;       "area": "Trigonometria",

&nbsp;       "totalStudyMinutes": 0,

&nbsp;       "notes": null,

&nbsp;       "subject": "matematica",

&nbsp;       "bookBaseId": null,

&nbsp;       "ankiDeck": null,

&nbsp;       "forOlympiad": false,

&nbsp;       "yearPlan": 1,

&nbsp;       "prerequisites": null,

&nbsp;       "bookAdvancedId": null,

&nbsp;       "priorityIta": "alta",

&nbsp;       "topic": "Identidades e Transformações",

&nbsp;       "lastReviewedAt": null,

&nbsp;       "subtopic": null,

&nbsp;       "startDate": null,

&nbsp;       "status": "nao\_iniciado",

&nbsp;       "id": "69a9c3899d6076028a7de749",

&nbsp;       "created\_date": "2026-03-05T17:55:21.544000",

&nbsp;       "updated\_date": "2026-03-05T17:55:21.544000",

&nbsp;       "created\_by\_id": "69a9c23eaab756b4746f1b94",

&nbsp;       "created\_by": "0f0e3b1644e61970936995bed75481f8@firemail.com.br",

&nbsp;       "is\_sample": false

&nbsp;     },

&nbsp;     {

&nbsp;       "area": "Sequências",

&nbsp;       "totalStudyMinutes": 0,

&nbsp;       "notes": null,

&nbsp;       "subject": "matematica",

&nbsp;       "bookBaseId": null,

&nbsp;       "ankiDeck": null,

&nbsp;       "forOlympiad": false,

&nbsp;       "yearPlan": 1,

&nbsp;       "prerequisites": null,

&nbsp;       "bookAdvancedId": null,

&nbsp;       "priorityIta": "alta",

&nbsp;       "topic": "Progressão Aritmética (PA)",

&nbsp;       "lastReviewedAt": null,

&nbsp;       "subtopic": null,

&nbsp;       "startDate": null,

&nbsp;       "status": "nao\_iniciado",

&nbsp;       "id": "69a9c3899d6076028a7de74a",

&nbsp;       "created\_date": "2026-03-05T17:55:21.544000",

&nbsp;       "updated\_date": "2026-03-05T17:55:21.544000",

&nbsp;       "created\_by\_id": "69a9c23eaab756b4746f1b94",

&nbsp;       "created\_by": "0f0e3b1644e61970936995bed75481f8@firemail.com.br",

&nbsp;       "is\_sample": false

&nbsp;     },

&nbsp;     {

&nbsp;       "area": "Sequências",

&nbsp;       "totalStudyMinutes": 0,

&nbsp;       "notes": null,

&nbsp;       "subject": "matematica",

&nbsp;       "bookBaseId": null,

&nbsp;       "ankiDeck": null,

&nbsp;       "forOlympiad": false,

&nbsp;       "yearPlan": 1,

&nbsp;       "prerequisites": null,

&nbsp;       "bookAdvancedId": null,

&nbsp;       "priorityIta": "alta",

&nbsp;       "topic": "Progressão Geométrica (PG)",

&nbsp;       "lastReviewedAt": null,

&nbsp;       "subtopic": null,

&nbsp;       "startDate": null,

&nbsp;       "status": "nao\_iniciado",

&nbsp;       "id": "69a9c3899d6076028a7de74b",

&nbsp;       "created\_date": "2026-03-05T17:55:21.544000",

&nbsp;       "updated\_date": "2026-03-05T17:55:21.544000",

&nbsp;       "created\_by\_id": "69a9c23eaab756b4746f1b94",

&nbsp;       "created\_by": "0f0e3b1644e61970936995bed75481f8@firemail.com.br",

&nbsp;       "is\_sample": false

&nbsp;     },

&nbsp;     {

&nbsp;       "area": "Sequências",

&nbsp;       "totalStudyMinutes": 0,

&nbsp;       "notes": null,

&nbsp;       "subject": "matematica",

&nbsp;       "bookBaseId": null,

&nbsp;       "ankiDeck": null,

&nbsp;       "forOlympiad": false,

&nbsp;       "yearPlan": 2,

&nbsp;       "prerequisites": null,

&nbsp;       "bookAdvancedId": null,

&nbsp;       "priorityIta": "critica",

&nbsp;       "topic": "Séries e Somatórios",

&nbsp;       "lastReviewedAt": null,

&nbsp;       "subtopic": null,

&nbsp;       "startDate": null,

&nbsp;       "status": "nao\_iniciado",

&nbsp;       "id": "69a9c3899d6076028a7de74c",

&nbsp;       "created\_date": "2026-03-05T17:55:21.544000",

&nbsp;       "updated\_date": "2026-03-05T17:55:21.544000",

&nbsp;       "created\_by\_id": "69a9c23eaab756b4746f1b94",

&nbsp;       "created\_by": "0f0e3b1644e61970936995bed75481f8@firemail.com.br",

&nbsp;       "is\_sample": false

&nbsp;     },

&nbsp;     {

&nbsp;       "area": "Análise Combinatória",

&nbsp;       "totalStudyMinutes": 0,

&nbsp;       "notes": null,

&nbsp;       "subject": "matematica",

&nbsp;       "bookBaseId": null,

&nbsp;       "ankiDeck": null,

&nbsp;       "forOlympiad": false,

&nbsp;       "yearPlan": 1,

&nbsp;       "prerequisites": null,

&nbsp;       "bookAdvancedId": null,

&nbsp;       "priorityIta": "critica",

&nbsp;       "topic": "Princípio Fundamental da Contagem",

&nbsp;       "lastReviewedAt": null,

&nbsp;       "subtopic": null,

&nbsp;       "startDate": null,

&nbsp;       "status": "nao\_iniciado",

&nbsp;       "id": "69a9c3899d6076028a7de74d",

&nbsp;       "created\_date": "2026-03-05T17:55:21.544000",

&nbsp;       "updated\_date": "2026-03-05T17:55:21.544000",

&nbsp;       "created\_by\_id": "69a9c23eaab756b4746f1b94",

&nbsp;       "created\_by": "0f0e3b1644e61970936995bed75481f8@firemail.com.br",

&nbsp;       "is\_sample": false

&nbsp;     }

&nbsp;   ],

&nbsp;   "conceptualErrors": \[],

&nbsp;   "flashcards": \[],

&nbsp;   "exams": \[],

&nbsp;   "studySessions": \[],

&nbsp;   "feynmanSessions": \[

&nbsp;     {

&nbsp;       "iaFeedback": "## Avaliação\\n\\n\*\*Nota: 7/10\*\*\\n\\n### Pontos Fortes\\n- Boa tentativa de explicar \\"a\\" em termos simples\\n- Estrutura lógica presente\\n\\n### Melhorias\\n- Aprofundar a explicação com exemplos concretos\\n- Usar analogias do cotidiano\\n- Conectar com outros conceitos relacionados\\n\\n### Sugestão\\nTente explicar novamente usando uma analogia com algo do dia a dia.",

&nbsp;       "attemptNumber": 1,

&nbsp;       "date": "2026-03-05",

&nbsp;       "topicId": null,

&nbsp;       "approved": false,

&nbsp;       "topicName": "a",

&nbsp;       "explanation": "b",

&nbsp;       "iaScore": 7,

&nbsp;       "id": "69a9c58555e8efa7f7e1110a",

&nbsp;       "created\_date": "2026-03-05T18:03:49.560000",

&nbsp;       "updated\_date": "2026-03-05T18:03:49.560000",

&nbsp;       "created\_by\_id": "69a9c23eaab756b4746f1b94",

&nbsp;       "created\_by": "0f0e3b1644e61970936995bed75481f8@firemail.com.br",

&nbsp;       "is\_sample": false

&nbsp;     }

&nbsp;   ],

&nbsp;   "olympiads": \[],

&nbsp;   "appSettings": {

&nbsp;     "pomodoroWork": 25,

&nbsp;     "pomodoroBreak": 5,

&nbsp;     "pomodoroSetsBeforeLong": 4,

&nbsp;     "ollamaUrl": "http://localhost:11434",

&nbsp;     "ollamaModel": "qwen2.5:14b",

&nbsp;     "ankiConnectUrl": "http://localhost:8765",

&nbsp;     "theme": "dark",

&nbsp;     "seeded": true,

&nbsp;     "pomodoroLongBreak": 15,

&nbsp;     "id": "69a9c38b44caed3057679a44",

&nbsp;     "created\_date": "2026-03-05T17:55:23.977000",

&nbsp;     "updated\_date": "2026-03-05T18:08:14.029000",

&nbsp;     "created\_by\_id": "69a9c23eaab756b4746f1b94",

&nbsp;     "created\_by": "0f0e3b1644e61970936995bed75481f8@firemail.com.br",

&nbsp;     "is\_sample": false

&nbsp;   }

&nbsp; }

}

