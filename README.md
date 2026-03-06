# ITA Prep Local

Monorepo local para o ITA Prep, com frontend em React/Vite e backend em Fastify + Prisma + SQLite.

## Estrutura

- `apps/web`: interface web
- `apps/api`: API REST, regras de negocio, seed, export/import

## Comandos

```bash
npm install
npm run prisma:generate
npm run prisma:migrate
npm run dev:api
npm run dev:web
```

API: `http://localhost:3001`
Web: `http://localhost:5173`
