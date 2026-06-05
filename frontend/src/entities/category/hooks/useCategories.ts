import { useCallback, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../../hooks/useAppDispatch";
import {
  setLoading,
  setError,
  setSelectedCategory,
  setCategories,
} from "@/src/store/slices/category";
import { toast } from "sonner";
import axios from "axios";
import { toTitleCase } from "@/src/common/helpers/toTitleCase";
import { getCategories } from "../api";

export function useCategories() {
  const dispatch = useAppDispatch();
  const { items, selectedCategoryId, isLoading, error } = useAppSelector(
    (state) => state.categories,
  );

  const fetchCategories = useCallback(async () => {
    dispatch(setLoading(true));
    dispatch(setError(null));

    try {
      const res = await getCategories();

      const mappedCategories = res.data.map((c) => ({
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
      dispatch(setSelectedCategory(categoryId === "all" ? null : categoryId));
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
    selectedCategoryId,
    isLoading,
    error,
    fetchCategories,
    changeCategory,
  };
}
