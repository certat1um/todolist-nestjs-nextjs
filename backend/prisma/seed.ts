import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import { CategoryType, PrismaClient } from '@prisma/client';
import * as dotenv from 'dotenv';
import { ConfigService } from 'src/modules/config/config.service';
dotenv.config();

const config = new ConfigService();
const DATABASE_URL = config.get('DATABASE_URL');

const adapter = new PrismaBetterSqlite3({
  url: DATABASE_URL,
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
