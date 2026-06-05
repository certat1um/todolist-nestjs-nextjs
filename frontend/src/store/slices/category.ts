import { ICategory } from "@/src/entities/category/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface CategoriesState {
  items: ICategory[];
  selectedCategoryId: string | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: CategoriesState = {
  items: [],
  selectedCategoryId: null,
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
    setCategories: (state, action: PayloadAction<ICategory[]>) => {
      state.items = action.payload;
    },
    setSelectedCategory: (state, action: PayloadAction<string | null>) => {
      state.selectedCategoryId = action.payload;
    },
  },
});

export const { setLoading, setError, setCategories, setSelectedCategory } =
  categoriesSlice.actions;

export default categoriesSlice.reducer;
