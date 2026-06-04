import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import { CategoryType, PrismaClient } from '@prisma/client';
import * as dotenv from 'dotenv';
dotenv.config();

const adapter = new PrismaBetterSqlite3({
  url: process.env.DATABASE_URL ?? 'file:./dev.db',
});
const prisma = new PrismaClient({ adapter });

async function main() {
  for (const type of Object.values(CategoryType)) {
    await prisma.category.upsert({
      where: { type },
      update: {},
      create: { id: crypto.randomUUID(), type },
    });
  }
  console.log('Done');
}

main()
  .catch(() => {
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
