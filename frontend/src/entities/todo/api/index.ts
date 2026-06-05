import { api } from "@/src/lib";
import {
  BatchDeleteTodosBody,
  BatchDeleteTodosResponse,
  BatchUpdateTodosBody,
  BatchUpdateTodosResponse,
  CreateTodoBody,
  CreateTodoResponse,
  DeleteTodoParams,
  DeleteTodoResponse,
  GetTodosQuery,
  GetTodosResponse,
  UpdateTodoBody,
  UpdateTodoParams,
  UpdateTodoResponse,
} from "../types";
import { TODOS_ROUTE } from "@/src/types/constants";

export const todoApi = {
  getTodos: async (query: GetTodosQuery = {}): Promise<GetTodosResponse> => {
    const params = new URLSearchParams(
      Object.entries(query)
        .filter(([, value]) => value !== undefined)
        .map(([key, value]) => [key, String(value)]),
    );

    const res = await api.get(TODOS_ROUTE, { params });
    return res.data;
  },

  createTodo: async (body: CreateTodoBody): Promise<CreateTodoResponse> => {
    const res = await api.post(TODOS_ROUTE, body);
    return res.data;
  },

  updateTodo: async (
    params: UpdateTodoParams,
    body: UpdateTodoBody,
  ): Promise<UpdateTodoResponse> => {
    const res = await api.patch(`${TODOS_ROUTE}/${params.id}`, body);
    return res.data;
  },

  updateTodos: async (
    body: BatchUpdateTodosBody,
  ): Promise<BatchUpdateTodosResponse> => {
    const res = await api.patch(TODOS_ROUTE, body);
    return res.data;
  },

  deleteTodo: async (params: DeleteTodoParams): Promise<DeleteTodoResponse> => {
    const res = await api.delete(`${TODOS_ROUTE}/${params.id}`);
    return res.data;
  },

  deleteTodos: async (
    body: BatchDeleteTodosBody,
  ): Promise<BatchDeleteTodosResponse> => {
    const res = await api.patch(TODOS_ROUTE, body);
    return res.data;
  },
};
