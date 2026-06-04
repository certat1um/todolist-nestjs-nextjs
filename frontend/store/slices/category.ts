import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Category } from "@/types/todo";

interface CategoriesState {
  items: Category[];
  selectedCategory: string;
  isLoading: boolean;
  error: string | null;
}

const initialState: CategoriesState = {
  items: [],
  selectedCategory: "all",
  isLoading: false,
  error: null,
};

const categoriesSlice = createSlice({
  name: "categories",
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setCategories: (state, action: PayloadAction<Category[]>) => {
      state.items = action.payload;
    },
    setSelectedCategory: (state, action: PayloadAction<string>) => {
      state.selectedCategory = action.payload;
    },
  },
});

export const { setLoading, setError, setCategories, setSelectedCategory } =
  categoriesSlice.actions;

export default categoriesSlice.reducer;
