import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Todo } from "@/types/todo";

interface TodosState {
  items: Todo[];
  isLoading: boolean;
  error: string | null;
}

const initialState: TodosState = {
  items: [],
  isLoading: false,
  error: null,
};

const todosSlice = createSlice({
  name: "todos",
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setTodos: (state, action: PayloadAction<Todo[]>) => {
      state.items = action.payload;
    },
    addTodo: (state, action: PayloadAction<Todo>) => {
      state.items.push(action.payload);
    },
    updateTodo: (state, action: PayloadAction<Todo>) => {
      const index = state.items.findIndex((t) => t.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = action.payload;
      }
    },
    removeTodo: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((t) => t.id !== action.payload);
    },
    restoreTodo: (
      state,
      action: PayloadAction<{ todo: Todo; index: number }>,
    ) => {
      const { todo, index } = action.payload;

      // Insert at original position
      const safeIndex = Math.min(index, state.items.length);
      state.items.splice(safeIndex, 0, todo);
    },
  },
});

export const {
  setLoading,
  setError,
  setTodos,
  addTodo,
  updateTodo,
  removeTodo,
  restoreTodo,
} = todosSlice.actions;

export default todosSlice.reducer;
