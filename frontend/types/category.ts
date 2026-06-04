export enum CategoryType {
  WORK = "Work",
  PERSONAL = "Personal",
  SHOPPING = "Shopping",
  HEALTH = "Health",
}

export interface Category {
  id: string;
  type: CategoryType;

  updated_at: string;
  created_at: string;
}
