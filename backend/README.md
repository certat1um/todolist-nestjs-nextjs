# Backend

## Stack

- [NestJS](https://nestjs.com/) — framework
- [Prisma](https://www.prisma.io/) — ORM
- SQLite — database
- [Zod](https://zod.dev/) — validation

## Installation

```bash
pnpm install
```

## Database

```bash
# Run migrations
pnpm prisma migrate deploy

# Seed the database
pnpm prisma db seed
```

## Running

```bash
pnpm run start:dev
```
