# Diagnóstico Técnico do Projeto ITA

## 1. Exploração Profunda

O projeto ITA é um monorepo gerenciado por `npm workspaces`, contendo três aplicações principais: `api`, `desktop` e `web`. A orquestração é feita através de scripts no `package.json` raiz.

### 1.1. Estrutura do Monorepo

- **`apps/api`**: Backend da aplicação, utilizando `Fastify`, `Prisma` e `TypeScript`. Responsável pela lógica de negócio, persistência de dados e integrações com serviços externos (Ollama, Anki).
- **`apps/web`**: Frontend da aplicação, desenvolvido com `Vite`, `React`, `TypeScript` e `TailwindCSS`. É a interface do usuário que interage com a API.
- **`apps/desktop`**: Aplicação desktop, construída com `Electron`. Encapsula a aplicação web e gerencia o ciclo de vida do servidor da API localmente.

### 1.2. Fluxo de Build e Execução

- **`npm run dev:web`**: Inicia o servidor de desenvolvimento do frontend (`vite`).
- **`npm run dev:api`**: Inicia o servidor de desenvolvimento da API (`tsx watch src/server.ts`).
- **`npm run desktop`**: Este script é crucial. Ele primeiro executa `npm --workspace apps/api run build:prod` (construindo a versão de produção da API), e em seguida, `npm --workspace apps/desktop run dev` (iniciando o Electron que carrega o build do frontend e o servidor da API).

### 1.3. Diferenças entre Ambientes (Web vs. Desktop)

| Característica | Ambiente Web (`npm run dev:web`) | Ambiente Desktop (`npm run desktop`) |
| :------------- | :------------------------------- | :----------------------------------- |
| **Frontend**   | Servido pelo Vite (desenvolvimento) | Servido pelo Electron (build de produção) |
| **Backend**    | Espera que a API esteja rodando em `http://127.0.0.1:3001` (manual ou `dev:api`) | Gerencia o ciclo de vida da API localmente, iniciando-a e parando-a automaticamente |
| **Acesso a APIs Nativas** | Não tem acesso direto a APIs do sistema operacional | Tem acesso total a APIs do Electron (ex: `ipcMain`, `shell`, `dialog`, `fs`) |
| **Variáveis de Ambiente** | `process.env.NODE_ENV` pode ser `development` | `process.env.NODE_ENV` é forçado para `production` na API iniciada pelo Electron |
| **Caminhos de Arquivo** | Não aplicável diretamente | Utiliza caminhos absolutos para `WEB_DIST`, `API_DIST`, `ANKI_DIR` |

## 2. Diagnóstico Técnico

### 2.1. Problemas Críticos

1.  **Dependência do `tsx` no Electron para produção da API (Corrigido)**: Anteriormente, o `main.cjs` do Electron utilizava `tsx` para executar o código-fonte da API em produção, o que é uma prática inadequada. Isso foi corrigido configurando um script de build de produção (`build:prod`) para a API e modificando o `main.cjs` para executar o build JavaScript puro da API (`dist/server.js`) usando `node`. Isso melhora a estabilidade e performance da API no ambiente desktop.
2.  **Sincronização Anki (potencial)**: A lógica de sincronização do Anki, especialmente a fila offline, precisa ser robustamente testada em ambos os ambientes. Se a persistência da fila (`ankiQueue.ts`) depender de caminhos de arquivo específicos do sistema operacional, pode haver diferenças de comportamento entre Web (se implementado) e Desktop. **Status: Não abordado diretamente nesta fase, requer testes de integração.**

### 2.2. Problemas Importantes

1.  **Duplicação de Build do Frontend no `npm run desktop` (Corrigido)**: O script `npm run desktop` no `package.json` raiz estava executando `npm --workspace apps/web run build` toda vez que o Electron era iniciado. Isso causava builds desnecessários e lentidão. A chamada para `npm --workspace apps/web run build` foi removida do script `desktop`, assumindo que o build do frontend será feito separadamente quando necessário.
2.  **Acoplamento Forte entre Desktop e API**: O `main.cjs` do Electron é responsável por iniciar e parar a API. Embora funcional, isso cria um acoplamento forte. Para um projeto de uso pessoal, onde a simplicidade e a funcionalidade são prioridades sobre a arquitetura de nível empresarial, este acoplamento é aceitável e simplifica o gerenciamento do ciclo de vida da API local. **Status: Decisão de design aceita para o escopo do projeto.**
3.  **`isDesktopRuntime` no Frontend**: A função `isDesktopRuntime` em `ITA/apps/web/src/lib/runtime.ts` utiliza `Boolean(getDesktopBridge()?.isDesktop) || window.location.protocol === 
"file:". Esta implementação é robusta para um projeto pessoal, pois cobre tanto a detecção via `contextBridge` do Electron quanto o carregamento direto de arquivos locais. **Status: Considerado robusto para o escopo do projeto.**
4.  **Tratamento de Erros no Desktop**: O tratamento de erros no `main.cjs` do Electron é básico (`dialog.showErrorBox`). Para um projeto pessoal, esta abordagem é aceitável, pois o objetivo é informar o usuário sobre falhas críticas de forma direta. Para maior refinamento, um sistema de logging mais detalhado poderia ser implementado, mas não é crítico para o escopo atual. **Status: Aceitável para o escopo do projeto.**

### 2.3. Problemas Desejáveis (Nice to Have)

1.  **Configuração de Build Otimizada para Desktop**: O build do frontend para desktop (`npm --workspace apps/web run build`) não é necessariamente otimizado para o ambiente Electron. Poderia haver um script de build específico para desktop que, por exemplo, removesse dependências desnecessárias ou otimizasse assets de forma diferente. **Status: Não implementado, mas é uma otimização futura.**
2.  **Variáveis de Ambiente Centralizadas**: Atualmente, as variáveis de ambiente são definidas em diferentes lugares (ex: `NODE_ENV` no `main.cjs`). Uma abordagem mais centralizada e consistente para gerenciar variáveis de ambiente em todo o monorepo seria benéfica. **Status: Não implementado, mas é uma melhoria de organização.**
3.  **Testes Automatizados**: Não há menção de testes automatizados (unitários, integração, e2e) no `package.json` ou na estrutura do projeto. Para um projeto que visa ser "perfeito e agradável de usar", testes são cruciais para garantir a estabilidade e prevenir regressões. **Status: Não implementado, mas é uma melhoria de qualidade a longo prazo.**
4.  **Documentação de Código**: Embora o código seja razoavelmente legível, a adição de JSDoc ou comentários mais detalhados em funções e componentes complexos melhoraria a manutenibilidade. **Status: Não implementado, mas é uma melhoria de manutenibilidade.**
5.  **Linting e Formatação Consistentes**: Embora `npm run lint` exista, é importante garantir que as regras de linting e formatação sejam aplicadas consistentemente em todo o monorepo para manter a qualidade do código. **Status: Não implementado, mas é uma melhoria de qualidade de código.**

## 3. Priorização

Com base no diagnóstico, os problemas são priorizados da seguinte forma:

### 3.1. Crítico

1.  **Dependência do `tsx` no Electron para produção da API:** **Corrigido.** A API agora é construída para produção e executada diretamente com `node` no ambiente desktop.
2.  **Sincronização Anki (potencial):** Requer testes de integração robustos para garantir a integridade dos dados. **Não abordado diretamente nesta fase, mas a correção da API prepara o terreno para testes mais confiáveis.**

### 3.2. Importante

1.  **Duplicação de Build do Frontend no `npm run desktop`:** **Corrigido.** O script `desktop` não reconstrói mais o frontend desnecessariamente.
2.  **Acoplamento Forte entre Desktop e API:** **Decisão de design aceita.** Para um projeto pessoal, a simplicidade de gerenciamento do ciclo de vida da API pelo Electron é preferível à complexidade de uma separação maior.
3.  **`isDesktopRuntime` no Frontend:** **Considerado robusto.** A implementação atual é adequada para detectar o ambiente desktop.
4.  **Tratamento de Erros no Desktop:** **Aceitável para o escopo do projeto.** A exibição de `dialog.showErrorBox` é suficiente para um projeto pessoal.

### 3.3. Desejável

Todos os itens listados nesta categoria (`Configuração de Build Otimizada para Desktop`, `Variáveis de Ambiente Centralizadas`, `Testes Automatizados`, `Documentação de Código`, `Linting e Formatação Consistentes`) são melhorias válidas, mas não são críticos ou importantes para a funcionalidade imediata ou estabilidade do projeto. Eles representam oportunidades de otimização e aprimoramento a longo prazo.

## Referências

[1] [Electron Docs - Packaging Your Application](https://www.electronjs.org/docs/latest/tutorial/application-packaging)
[2] [Node.js Docs - NODE_ENV](https://nodejs.org/docs/latest/api/cli.html#node_envproduction)
[3] [AnkiConnect GitHub](https://github.com/FooSoft/anki-connect)
[4] [Vite Docs - Build Options](https://vitejs.dev/config/build-options.html)
