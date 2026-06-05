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
import { TodoService } from './todo.service';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import {
  GetTodosQuery,
  CreateTodoBody,
  UpdateTodoParams,
  UpdateTodoBody,
  BatchUpdateTodosBody,
  DeleteTodoParams,
  BatchDeleteTodosQuery,
  GetTodosResponse,
  CreateTodoResponse,
  UpdateTodoResponse,
  BatchUpdateTodosResponse,
  DeleteTodoResponse,
  BatchDeleteTodosResponse,
} from './schemas';

@ApiTags('todo')
@Controller('todos')
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @Get('/')
  @ApiOkResponse({ type: GetTodosResponse })
  public async findAll(@Query() query: GetTodosQuery) {
    return this.todoService.getAll(query);
  }

  @Post('/')
  @ApiCreatedResponse({ type: CreateTodoResponse })
  public async create(@Body() body: CreateTodoBody) {
    return this.todoService.create(body);
  }

  @Patch('/:id')
  @ApiOkResponse({ type: UpdateTodoResponse })
  public async updateById(
    @Param() params: UpdateTodoParams,
    @Body() body: UpdateTodoBody,
  ) {
    return this.todoService.updateById(params, body);
  }

  @Patch('/batch')
  @ApiOkResponse({ type: BatchUpdateTodosResponse })
  public async batchUpdate(@Body() body: BatchUpdateTodosBody) {
    return this.todoService.batchUpdate(body);
  }

  @Delete('/:id')
  @ApiOkResponse({ type: DeleteTodoResponse })
  public async deleteById(@Param() params: DeleteTodoParams) {
    return this.todoService.deleteById(params);
  }

  @Delete('/batch')
  @ApiOkResponse({ type: BatchDeleteTodosResponse })
  public async batchDelete(@Body() body: BatchDeleteTodosQuery) {
    return this.todoService.batchDelete(body);
  }
}
