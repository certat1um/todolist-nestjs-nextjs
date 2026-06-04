import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import type {
  CreateTodoDto,
  GetTodosQueryDto,
  UpdateTodoDto,
} from './todo.schema';
import { TodoService } from './todo.service';

@Controller('todos')
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @Get()
  public async findAll(@Query() query: GetTodosQueryDto) {
    return this.todoService.getAll(query);
  }

  @Post()
  public async create(@Body() dto: CreateTodoDto) {
    return this.todoService.create(dto);
  }

  @Patch('/:id')
  public async updateById(@Param('id') id: string, @Body() dto: UpdateTodoDto) {
    return this.todoService.updateById(id, dto);
  }

  @Delete('/:id')
  public async deleteById(@Param('id') id: string) {
    return this.todoService.deleteById(id);
  }
}
