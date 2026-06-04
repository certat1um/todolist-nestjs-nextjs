"use client";

import { Todo } from "@/types/todo";
import { useTodos } from "@/hooks/useTodos";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

interface TodoItemProps {
  todo: Todo;
}

export function TodoItem({ todo }: TodoItemProps) {
  const { toggleComplete, deleteTodo, categories } = useTodos();

  const categoryType =
    categories.find((c) => c.id === todo.category_id)?.type || todo.category_id;

  return (
    <div
      className={`flex items-center justify-between gap-4 p-4 border border-border rounded-lg ${
        todo.is_done ? "opacity-50 bg-muted" : "bg-card"
      }`}
    >
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <Checkbox
          checked={todo.is_done}
          onCheckedChange={() => toggleComplete(todo)}
        />
        <div className="flex-1 min-w-0">
          <p
            className={`text-sm truncate ${
              todo.is_done ? "line-through text-muted-foreground" : ""
            }`}
          >
            {todo.title}
          </p>
          <span className="text-xs text-muted-foreground">{categoryType}</span>
        </div>
      </div>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => deleteTodo(todo)}
        className="shrink-0 text-muted-foreground hover:text-destructive"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
}
