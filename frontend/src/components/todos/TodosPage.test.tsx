import { render, screen } from "@testing-library/react";
import { TodosPage } from "@/src/components/todos/TodosPage";

jest.mock("@/src/components/todos/CreateTodoForm", () => ({
  CreateTodoForm: () => <div data-testid="create-todo-form" />,
}));

jest.mock("@/src/components/categories/CategoryFilter", () => ({
  CategoryFilter: () => <div data-testid="category-filter" />,
}));

jest.mock("@/src/components/todos/TodoList", () => ({
  TodoList: () => <div data-testid="todo-list" />,
}));

describe("TodosPage", () => {
  it("renders page heading", () => {
    render(<TodosPage />);
    expect(screen.getByText("Todo App")).toBeInTheDocument();
  });

  it("renders CreateTodoForm", () => {
    render(<TodosPage />);
    expect(screen.getByTestId("create-todo-form")).toBeInTheDocument();
  });

  it("renders CategoryFilter", () => {
    render(<TodosPage />);
    expect(screen.getByTestId("category-filter")).toBeInTheDocument();
  });

  it("renders TodoList", () => {
    render(<TodosPage />);
    expect(screen.getByTestId("todo-list")).toBeInTheDocument();
  });

  it("renders section titles", () => {
    render(<TodosPage />);
    expect(screen.getByText("Create New Task")).toBeInTheDocument();
    expect(screen.getByText("Tasks")).toBeInTheDocument();
  });
});
