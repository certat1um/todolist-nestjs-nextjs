"use client";

import { useForm } from "react-hook-form";
import { CreateTodoFormData } from "@/types/todo";
import { useTodos } from "@/hooks/useTodos";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { TASK_LIMIT_BY_CATEGORY } from "@/types/constants";
import { useCategories } from "@/hooks/useCategories";
import { Loader2 } from "lucide-react";

export function CreateTodoForm() {
  const { createTodo, getTodosCountByCategoryId, isLoading } = useTodos();
  const { categories } = useCategories();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<CreateTodoFormData>({
    defaultValues: {
      title: "",
      category_id: "",
    },
  });

  const selectedCategory = watch("category_id");

  const onSubmit = async (data: CreateTodoFormData) => {
    try {
      await createTodo(data);
      reset();
    } catch {
      // Error is handled in useTodos hook
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="text">Task</Label>
        <Input
          id="text"
          placeholder="Enter task text..."
          {...register("title", {
            required: "Task text is required",
            minLength: {
              value: 2,
              message: "Task must be at least 2 characters",
            },
          })}
        />
        {errors.title && (
          <p className="text-sm text-destructive">{errors.title.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="category">Category</Label>
        <Select
          value={selectedCategory}
          onValueChange={(value) => setValue("category_id", value as string)}
        >
          <SelectTrigger id="category">
            <SelectValue>
              {categories.find((cat) => cat.id === selectedCategory)?.type ??
                "Select category"}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {categories.map((cat) => {
              const count = getTodosCountByCategoryId(cat.id);
              const isFull = count >= TASK_LIMIT_BY_CATEGORY;

              return (
                <SelectItem
                  key={cat.id}
                  value={cat.id}
                  disabled={isFull}
                  className={isFull ? "opacity-50" : ""}
                >
                  {cat.type} ({count}/{TASK_LIMIT_BY_CATEGORY})
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
        <input
          type="hidden"
          {...register("category_id", { required: "Category is required" })}
        />
        {errors.category_id && (
          <p className="text-sm text-destructive">
            {errors.category_id.message}
          </p>
        )}
      </div>

      <Button type="submit" disabled={isLoading} className="w-full">
        {isLoading ? <Loader2 className="h-3 w-3 animate-spin" /> : "Add Task"}
      </Button>
    </form>
  );
}
