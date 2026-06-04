import { useCallback, useRef } from "react";
import { useAppDispatch, useAppSelector } from "./useAppDispatch";
import {
  setLoading,
  setError,
  updateTodo,
  removeTodo,
  restoreTodo,
} from "@/store/slices/todo";
import { Todo, CreateTodoFormData } from "@/types/todo";
import { toast } from "sonner";
import axios from "axios";
import {
  TASK_DELETION_COUNTDOWN,
  TASK_DELETION_COUNTDOWN_MS,
  TASK_LIMIT_BY_CATEGORY,
} from "@/types/constants";

const API_BASE = "/api"; // FEAT: BE Integration

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
  const getTodosCountByCategory = useCallback(
    (categoryId: string) => {
      const filtered = items.filter(
        (t) => t.category_id === categoryId && !t.is_done,
      );

      return filtered.length;
    },
    [items],
  );

  // Fetch all todos
  const fetchTodos = useCallback(async () => {
    dispatch(setLoading(true));
    dispatch(setError(null));

    try {
      // FEAT: BE Integration
      console.log("GET /todos");

      // const todos = await ...;
      // dispatch(setTodos(todos));
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
  }, [dispatch]);

  // Create new todo
  const createTodo = useCallback(
    async (data: CreateTodoFormData) => {
      // Check tasks limit
      const currentCount = getTodosCountByCategory(data.category_id);

      if (currentCount >= TASK_LIMIT_BY_CATEGORY) {
        const errorMsg = `Category already has ${TASK_LIMIT_BY_CATEGORY} tasks. Cannot add more.`;

        toast.error(errorMsg);
        throw new Error(errorMsg);
      }

      dispatch(setLoading(true));
      dispatch(setError(null));

      try {
        // FEAT: BE Integration
        console.log("POST /todos", data);
        // const response = await axios.post(`${API_BASE}/todos`, data);
        // dispatch(addTodo(response.data));

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
    [dispatch, getTodosCountByCategory],
  );

  // Toggle todo completion
  const toggleComplete = useCallback(
    async (todo: Todo) => {
      const isUltimatelyDone = !todo.is_done;

      dispatch(updateTodo({ ...todo, is_done: isUltimatelyDone }));

      if (isUltimatelyDone) {
        // start countdown
        const timeoutId = setTimeout(() => {
          // FEAT: BE Integration (is_done: true)
          console.log("PATCH /todos/:id", todo.id);

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

                // FEAT: BE Integration (is_done: false)
                console.log("PATCH /todos/:id", todo.id);

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

        // FEAT: BE Integration (is_done: false)
        console.log("PATCH /todos/:id", todo.id);
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

      // `Undo` toast
      toast.success("Task deleted", {
        duration: TASK_DELETION_COUNTDOWN_MS,
        action: {
          label: "Undo",
          onClick: async () => {
            // Restore task
            dispatch(restoreTodo({ todo: deletedTodo, index: originalIndex }));

            // FEAT: BE Integration
            console.log("PATCH /todos/:id");
            toast.info("Task restored");
          },
        },
      });

      // Schedule deletion on BE
      setTimeout(() => {
        // FEAT: BE Integration
        console.log("DELETE /todos/:id", todo.id);
      }, TASK_DELETION_COUNTDOWN_MS);
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
    getTodosCountByCategory,
  };
}
