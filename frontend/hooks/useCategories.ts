import { useCallback, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "./useAppDispatch";
import {
  setLoading,
  setError,
  setSelectedCategory,
  setCategories,
} from "@/store/slices/category";
import { toast } from "sonner";
import axios from "axios";
import { toTitleCase } from "@/lib/utils";
import { Category } from "@/types/category";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

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
      const response = await axios.get(API_URL + "/categories");

      const mappedCategories = response.data.map((c: Category) => ({
        ...c,
        type: toTitleCase(c.type),
      }));

      dispatch(setCategories(mappedCategories));
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
