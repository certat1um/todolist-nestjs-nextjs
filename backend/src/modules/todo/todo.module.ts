import { Module } from '@nestjs/common';
import { TodoController } from './todo.controller';
import { TodoService } from './todo.service';
import { TodoCron } from './todo.cron';

@Module({
  controllers: [TodoController],
  providers: [TodoService, TodoCron],
})
export class TodoModule {}
