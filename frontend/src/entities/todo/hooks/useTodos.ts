import { useCallback, useRef } from "react";
import { useAppDispatch, useAppSelector } from "../../../hooks/useAppDispatch";
import {
  setLoading,
  setError,
  updateTodo,
  removeTodo,
  restoreTodo,
  setTodos,
  addTodo,
} from "@/src/store/slices/todo";
import { toast } from "sonner";
import {
  TASK_DELETION_COUNTDOWN_MS,
  TASK_LIMIT_BY_CATEGORY,
} from "@/src/types/constants";
import { todoApi } from "../api";
import { CreateTodoBody, ITodo } from "../types";

export function useTodos() {
  const dispatch = useAppDispatch();
  const { items, isLoading, error } = useAppSelector((state) => state.todos);
  const { selectedCategoryId } = useAppSelector((state) => state.categories);

  const pendingDeletions = useRef<Map<string, NodeJS.Timeout>>(new Map());

  const filteredTodos = items.filter((todo) => {
    if (selectedCategoryId === null) {
      return true;
    }

    return todo.category_id === selectedCategoryId;
  });

  const getTodosCountByCategoryId = useCallback(
    (categoryId: string) => {
      const filtered = items.filter(
        (t) => t.category_id === categoryId && !t.is_done,
      );

      return filtered.length;
    },
    [items],
  );

  const cancelPending = useCallback((todoId: string) => {
    const timeout = pendingDeletions.current.get(todoId);
    if (timeout) {
      clearTimeout(timeout);
      pendingDeletions.current.delete(todoId);
    }
  }, []);

  const fetchTodos = useCallback(async () => {
    dispatch(setLoading(true));
    dispatch(setError(null));

    try {
      const todos = await todoApi.getTodos({
        category_id: selectedCategoryId ?? undefined,
      });

      dispatch(setTodos(todos.data));
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch, selectedCategoryId]);

  const create = useCallback(
    async (body: CreateTodoBody) => {
      dispatch(setLoading(true));
      dispatch(setError(null));

      // Check tasks limit by category
      const currentCount = getTodosCountByCategoryId(body.category_id);

      if (currentCount >= TASK_LIMIT_BY_CATEGORY) {
        const message = `Category already has ${TASK_LIMIT_BY_CATEGORY} tasks. Cannot add more.`;
        toast.error(message);
        throw new Error(message);
      }

      try {
        const res = await todoApi.createTodo(body);
        dispatch(addTodo(res.data));
        toast.success(res.message);
      } catch (err) {
        toast.error((err as Error).message);
      } finally {
        dispatch(setLoading(false));
      }
    },
    [dispatch, getTodosCountByCategoryId],
  );

  const toggleComplete = useCallback(
    async (todo: ITodo) => {
      const isUltimatelyDone = !todo.is_done;

      dispatch(updateTodo({ ...todo, is_done: isUltimatelyDone }));

      const response = await todoApi.updateTodo(
        { id: todo.id },
        {
          is_done: isUltimatelyDone,
        },
      );

      if (isUltimatelyDone) {
        // start countdown
        const timeout = setTimeout(async () => {
          dispatch(removeTodo(todo.id));
          pendingDeletions.current.delete(todo.id);
        }, TASK_DELETION_COUNTDOWN_MS);

        pendingDeletions.current.set(todo.id, timeout);

        // `Undo` toast
        toast.success(response.message, {
          duration: TASK_DELETION_COUNTDOWN_MS,
          action: {
            label: "Undo",
            onClick: async () => {
              cancelPending(todo.id);

              try {
                await todoApi.updateTodo({ id: todo.id }, { is_done: false });
                dispatch(updateTodo({ ...todo, is_done: false }));
                toast.info("Task restored.");
              } catch (err) {
                toast.error((err as Error).message);
              }
            },
          },
        });
      } else {
        // cancel deletion
        const timeout = pendingDeletions.current.get(todo.id);
        if (timeout) {
          clearTimeout(timeout);
          pendingDeletions.current.delete(todo.id);
        }
      }
    },
    [dispatch],
  );

  const deleteTodo = useCallback(
    async (todo: ITodo) => {
      const deletedTodo = { ...todo };
      const originalIndex = items.findIndex((t) => t.id === todo.id);

      dispatch(removeTodo(todo.id));

      const response = await todoApi.updateTodo(
        { id: todo.id },
        { mark_as_deleted: true },
      );

      // start countdown
      const timeout = setTimeout(async () => {
        await todoApi.deleteTodo({ id: todo.id });
        dispatch(removeTodo(todo.id));
        pendingDeletions.current.delete(todo.id);
      }, TASK_DELETION_COUNTDOWN_MS);

      pendingDeletions.current.set(todo.id, timeout);

      // `Undo` toast
      toast.success(response.message, {
        duration: TASK_DELETION_COUNTDOWN_MS,
        action: {
          label: "Undo",
          onClick: async () => {
            // cancel timeout
            clearTimeout(timeout);
            pendingDeletions.current.delete(todo.id);

            try {
              await todoApi.updateTodo(
                { id: todo.id },
                { mark_as_deleted: false },
              );

              // restore task
              dispatch(
                restoreTodo({ todo: deletedTodo, index: originalIndex }),
              );
              toast.info("Task restored.");
            } catch (err) {
              toast.error((err as Error).message);
            }
          },
        },
      });
    },
    [dispatch, items],
  );

  return {
    todos: filteredTodos,
    allTodos: items,
    selectedCategoryId,
    isLoading,
    error,
    fetchTodos,
    create,
    toggleComplete,
    deleteTodo,
    getTodosCountByCategoryId,
  };
}
