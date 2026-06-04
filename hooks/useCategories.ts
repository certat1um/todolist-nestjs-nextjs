import { useCallback, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "./useAppDispatch";
import {
  setLoading,
  setError,
  setCategories,
  setSelectedCategory,
} from "@/store/slices/category";
import { Category } from "@/types/todo";
import { toast } from "sonner";
import axios from "axios";

const API_BASE = "/api"; // FEAT: BE Integration

export function useCategories() {
  const dispatch = useAppDispatch();
  const { items, selectedCategory, isLoading, error } = useAppSelector(
    (state) => state.categories,
  );

  // Fetch categories from backend
  const fetchCategories = useCallback(async () => {
    dispatch(setLoading(true));
    dispatch(setError(null));

    try {
      // FEAT: BE Integration
      console.log("GET /categories");

      // const categories = await axios.get<Category[]>(`${API_BASE}/categories`);
      // dispatch(setCategories(response.data));

      // dispatch(setCategories(categories));
    } catch (err) {
      const message =
        axios.isAxiosError(err) && err.response?.data?.message
          ? err.response.data.message
          : "Failed to fetch categories";

      dispatch(setError(message));
      toast.error(message);
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch]);

  // Change selected category
  const changeCategory = useCallback(
    (categoryId: string | null) => {
      dispatch(setSelectedCategory(categoryId ?? "all"));
    },
    [dispatch],
  );

  // Load categories by default
  useEffect(() => {
    if (items.length === 0) {
      fetchCategories();
    }
  }, [fetchCategories, items.length]);

  return {
    categories: items,
    selectedCategory,
    isLoading,
    error,
    fetchCategories,
    changeCategory,
  };
}
