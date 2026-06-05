import { api } from "@/src/lib";
import { GetCategoriesResponse } from "../types";
import { CATEGORIES_ROUTE } from "@/src/types/constants";

export const getCategories = async (): Promise<GetCategoriesResponse> => {
  const res = await api.get(CATEGORIES_ROUTE);
  return res.data;
};
