import { useCallback, useRef } from "react";
import { useAppDispatch, useAppSelector } from "./useAppDispatch";
import {
  setLoading,
  setError,
  updateTodo,
  removeTodo,
  restoreTodo,
  setTodos,
  addTodo,
} from "@/store/slices/todo";
import { Todo, CreateTodoFormData } from "@/types/todo";
import { toast } from "sonner";
import axios from "axios";
import {
  TASK_DELETION_COUNTDOWN,
  TASK_DELETION_COUNTDOWN_MS,
  TASK_LIMIT_BY_CATEGORY,
} from "@/types/constants";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export function useTodos() {
  const dispatch = useAppDispatch();
  const { items, isLoading, error } = useAppSelector((state) => state.todos);
  const { selectedCategory } = useAppSelector((state) => state.categories);

  // Store pending deletion timeouts
  const pendingDeletions = useRef<Map<string, NodeJS.Timeout>>(new Map());

  // Filter todos by selected category
  const filteredTodos = items.filter((todo) => {
    if (selectedCategory === "all") {
      return true;
    }

    return todo.category_id === selectedCategory;
  });

  // Count todos per category (only non-completed and not deleted)
  const getTodosCountByCategoryId = useCallback(
    (categoryId: string) => {
      const filtered = items.filter(
        (t) => t.category_id === categoryId && !t.is_done,
      );

      return filtered.length;
    },
    [items],
  );

  // Fetch all todos
  const fetchTodos = useCallback(
    async (categoryId?: string) => {
      dispatch(setLoading(true));
      dispatch(setError(null));

      try {
        const category = categoryId ?? selectedCategory;
        const queryParam =
          category && category !== "all" ? `?category_id=${category}` : "";

        const response = await axios.get(`${API_URL}/todos${queryParam}`);
        dispatch(setTodos(response.data));
      } catch (err) {
        const message =
          axios.isAxiosError(err) && err.response?.data?.message
            ? err.response.data.message
            : "Failed to fetch todos";
        dispatch(setError(message));
        toast.error(message);
      } finally {
        dispatch(setLoading(false));
      }
    },
    [dispatch, selectedCategory],
  );

  // Create new todo
  const createTodo = useCallback(
    async (data: CreateTodoFormData) => {
      // Check tasks limit
      const currentCount = getTodosCountByCategoryId(data.category_id);

      if (currentCount >= TASK_LIMIT_BY_CATEGORY) {
        const errorMsg = `Category already has ${TASK_LIMIT_BY_CATEGORY} tasks. Cannot add more.`;

        toast.error(errorMsg);
        throw new Error(errorMsg);
      }

      dispatch(setLoading(true));
      dispatch(setError(null));

      try {
        const response = await axios.post(`${API_URL}/todos`, data);
        dispatch(addTodo(response.data));

        toast.success("Task created successfully");
      } catch (err) {
        const message =
          axios.isAxiosError(err) && err.response?.data?.message
            ? err.response.data.message
            : "Failed to create todo";
        dispatch(setError(message));
        toast.error(message);
        throw err;
      } finally {
        dispatch(setLoading(false));
      }
    },
    [dispatch, getTodosCountByCategoryId],
  );

  // Toggle todo completion
  const toggleComplete = useCallback(
    async (todo: Todo) => {
      const isUltimatelyDone = !todo.is_done;

      dispatch(updateTodo({ ...todo, is_done: isUltimatelyDone }));

      await axios.patch(`${API_URL}/todos/${todo.id}`, {
        is_done: isUltimatelyDone,
        mark_as_deleted: isUltimatelyDone,
      });

      if (isUltimatelyDone) {
        // start countdown
        const timeoutId = setTimeout(async () => {
          dispatch(removeTodo(todo.id));
          pendingDeletions.current.delete(todo.id);
        }, TASK_DELETION_COUNTDOWN_MS);

        pendingDeletions.current.set(todo.id, timeoutId);

        // `Undo` toast
        toast.success(
          `Task completed! It will be removed in ${TASK_DELETION_COUNTDOWN} seconds.`,
          {
            duration: TASK_DELETION_COUNTDOWN_MS,
            action: {
              label: "Undo",
              onClick: async () => {
                // Cancel timeout
                const timeout = pendingDeletions.current.get(todo.id);
                if (timeout) {
                  clearTimeout(timeout);
                  pendingDeletions.current.delete(todo.id);
                }

                await axios.patch(`${API_URL}/todos/${todo.id}`, {
                  is_done: false,
                });

                // Restore task
                dispatch(updateTodo({ ...todo, is_done: false }));
                toast.info("Task restored");
              },
            },
          },
        );
      } else {
        // Task marked as not completed - cancel pending deletion if any
        const timeout = pendingDeletions.current.get(todo.id);
        if (timeout) {
          clearTimeout(timeout);
          pendingDeletions.current.delete(todo.id);
        }
      }
    },
    [dispatch],
  );

  // Delete todo
  const deleteTodo = useCallback(
    async (todo: Todo) => {
      // Store todo
      const deletedTodo = { ...todo };
      const originalIndex = items.findIndex((t) => t.id === todo.id);

      dispatch(removeTodo(todo.id));

      await axios.patch(`${API_URL}/todos/${todo.id}`, {
        mark_as_deleted: true,
      });

      // start countdown
      const timeoutId = setTimeout(async () => {
        await axios.delete(`${API_URL}/todos/${todo.id}`);

        dispatch(removeTodo(todo.id));
        pendingDeletions.current.delete(todo.id);
      }, TASK_DELETION_COUNTDOWN_MS);

      // `Undo` toast
      toast.success("Task deleted", {
        duration: TASK_DELETION_COUNTDOWN_MS,
        action: {
          label: "Undo",
          onClick: async () => {
            // cancel timeout
            const timeout = pendingDeletions.current.get(todo.id);
            if (timeout) {
              clearTimeout(timeout);
              pendingDeletions.current.delete(todo.id);
            }

            // restore task
            dispatch(restoreTodo({ todo: deletedTodo, index: originalIndex }));

            await axios.patch(`${API_URL}/todos/${todo.id}`, {
              mark_as_deleted: false,
            });
          },
        },
      });
    },
    [dispatch, items],
  );

  return {
    todos: filteredTodos,
    allTodos: items,
    selectedCategory,
    isLoading,
    error,
    fetchTodos,
    createTodo,
    toggleComplete,
    deleteTodo,
    getTodosCountByCategoryId,
  };
}
