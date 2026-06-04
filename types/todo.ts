export interface Todo {
  id: string;
  title: string;
  is_done: boolean;

  category_id: string;

  updated_at: string;
  created_at: string;
}

export interface CreateTodoFormData extends Pick<
  Todo,
  "title" | "category_id"
> {
  title: string;
  category_id: string;
}
