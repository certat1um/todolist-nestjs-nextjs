# Backend

## Stack

- [NestJS](https://nestjs.com/) — Node.js framework for building scalable server-side applications
- [TypeScript](https://www.typescriptlang.org/) — type-safe JavaScript
- [Prisma](https://www.prisma.io/) — type-safe ORM with auto-generated query builder
- SQLite — lightweight file-based relational database
- [Zod](https://zod.dev/) — schema declaration and runtime validation
- [Swagger](https://swagger.io/) — API documentation via OpenAPI specification

## File structure

```
backend
├── prisma
│   ├── migrations
│   ├── schema.prisma
│   └── seed.ts
└── src
    ├── common
    │   ├── factories
    │   ├── filters
    │   ├── interceptors
    │   └── types
    ├── libs
    │   └── prisma
    ├── modules/
    │   ├── category
    │   ├── config
    │   └── todo
    ├── app.controller.ts
    ├── app.module.ts
    └── main.ts
```

## API Docs

Interactive API documentation is available via Swagger UI at:

```
http://localhost:{PORT}/api/docs
```

## How to run

Install packages:

```bash
pnpm install
```

Generate Prisma Client:

```bash
pnpm prisma generate
```

Fill up env:

```bash
# APP
PORT=3000
DATABASE_URL=file:./dev.db

# CLIENT
CLIENT_URL=
```

Run migrations:

```bash
pnpm prisma migrate deploy
```

Seed the database:

```bash
pnpm prisma db seed
```

Start the server:

```bash
pnpm run start:dev
```
