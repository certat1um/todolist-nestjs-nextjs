# Frontend

## Stack

- [Next.js](https://nextjs.org/) — framework (React)
- [React](https://react.dev/) — UI library
- [TypeScript](https://www.typescriptlang.org/) — type-safe JavaScript
- [React Hook Form](https://react-hook-form.com/) — form management
- [Zod](https://zod.dev/) — schema validation
- [Axios](https://axios-http.com/) — HTTP client
- [Redux](https://redux-toolkit.js.org/) — state management
- [Jest](https://jestjs.io/) — testing framework
- [shadcn/ui](https://ui.shadcn.com/) — component library
- [Tailwind CSS](https://tailwindcss.com/) — utility-first CSS

## How to run

Install packages:

```bash
pnpm install
```

Fill up env:

```bash
# APP
PORT=3000
DATABASE_URL=file:./dev.db

# CLIENT
CLIENT_URL=
```

```bash
pnpm run dev
```

## Testing

```bash
pnpm run test
```

```bash
pnpm run test:watch
```
