"use client";

import { useEffect } from "react";
import { TodoItem } from "./TodoItem";
import { ClipboardList, Loader2, AlertCircle } from "lucide-react";
import { useTodos } from "@/src/entities/todo/hooks";

export function TodoList() {
  const { todos, isLoading, error, fetchTodos } = useTodos();

  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

  // Loading state
  if (isLoading && todos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
        <Loader2 className="h-8 w-8 animate-spin mb-2" />
        <p>Loading tasks...</p>
      </div>
    );
  }

  // Error state
  if (error && todos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-destructive">
        <AlertCircle className="h-8 w-8 mb-2" />
        <p>{error}</p>
      </div>
    );
  }

  // Empty state
  if (todos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
        <ClipboardList className="h-12 w-12 mb-2" />
        <p className="text-lg font-medium">No tasks</p>
        <p className="text-sm">Create your first task above</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {todos.map((todo) => (
        <TodoItem key={todo.id} todo={todo} />
      ))}
    </div>
  );
}
