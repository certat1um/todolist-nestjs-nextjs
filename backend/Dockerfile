FROM node:22

WORKDIR /app

COPY package*.json pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install

COPY . .

RUN pnpm prisma generate
RUN pnpm build

EXPOSE 3000

CMD ["sh", "-c", "pnpm prisma db push && pnpm prisma db seed && node dist/src/main.js"]