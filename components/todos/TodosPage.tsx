"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CreateTodoForm } from "./CreateTodoForm";
import { CategoryFilter } from "./CategoryFilter";
import { TodoList } from "./TodoList";

export function TodosPage() {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-2xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold text-foreground">Todo App</h1>

        {/* Create Todo Form */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Create New Task</CardTitle>
          </CardHeader>
          <CardContent>
            <CreateTodoForm />
          </CardContent>
        </Card>

        {/* Filter Section */}
        {/* <Card>
          <CardContent className="pt-6">
            <CategoryFilter />
          </CardContent>
        </Card> */}

        {/* Todo List */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <CategoryFilter />
            <TodoList />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
