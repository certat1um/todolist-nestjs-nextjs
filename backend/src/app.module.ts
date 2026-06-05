import { Module } from '@nestjs/common';
import { PrismaModule } from './libs/prisma/prisma.module';
import { TodoModule } from './modules/todo/todo.module';
import { CategoryModule } from './modules/category/category.module';
import { AppController } from './app.controller';
import { ZodValidationPipe } from 'nestjs-zod';
import { APP_PIPE } from '@nestjs/core';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [ScheduleModule.forRoot(), PrismaModule, TodoModule, CategoryModule],
  controllers: [AppController],
  providers: [
    {
      provide: APP_PIPE,
      useClass: ZodValidationPipe,
    },
  ],
})
export class AppModule {}
