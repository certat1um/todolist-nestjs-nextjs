"use client";

import { useForm } from "react-hook-form";
import { Input } from "@/src/components/ui/input";
import { Button } from "@/src/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";
import { Label } from "@/src/components/ui/label";
import { TASK_LIMIT_BY_CATEGORY } from "@/src/types/constants";
import { Loader2 } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTodos } from "@/src/entities/todo/hooks";
import {
  CreateTodoBody,
  createTodoBodySchema,
} from "@/src/entities/todo/types";
import { useCategories } from "@/src/entities/category/hooks";

export function CreateTodoForm() {
  const { create, getTodosCountByCategoryId, isLoading } = useTodos();
  const { categories } = useCategories();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<CreateTodoBody>({
    // FIX
    resolver: zodResolver(createTodoBodySchema as any),
    defaultValues: {
      title: "",
      category_id: "",
    },
  });

  const selectedCategoryId = watch("category_id");

  const onSubmit = async (data: CreateTodoBody) => {
    try {
      await create(data);
      reset();
    } catch (err) {
      // handled in useTodos
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="text">Task</Label>
        <Input
          id="text"
          placeholder="Enter task text..."
          {...register("title")}
        />
        {errors.title && (
          <p className="text-sm text-destructive">{errors.title.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="category">Category</Label>
        <Select
          value={selectedCategoryId}
          onValueChange={(value) =>
            setValue("category_id", value as string, { shouldValidate: true })
          }
        >
          <SelectTrigger id="category">
            <SelectValue>
              {categories.find((cat) => cat.id === selectedCategoryId)?.type ??
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
        <input type="hidden" {...register("category_id")} />
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
