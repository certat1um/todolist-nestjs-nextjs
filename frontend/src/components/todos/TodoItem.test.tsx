import { render, screen, fireEvent } from "@testing-library/react";
import { TodoItem } from "@/src/components/todos/TodoItem";
import { useTodos } from "@/src/entities/todo/hooks";
import { useCategories } from "@/src/entities/category/hooks";
import { ITodo } from "@/src/entities/todo/types";

jest.mock("@/src/entities/todo/hooks");
jest.mock("@/src/entities/category/hooks");

const mockUseTodos = useTodos as jest.MockedFunction<typeof useTodos>;
const mockUseCategories = useCategories as jest.MockedFunction<
  typeof useCategories
>;

const mockToggleComplete = jest.fn();
const mockDeleteTodo = jest.fn();

const baseTodo: ITodo = {
  id: "todo-1",
  title: "Buy groceries",
  is_done: false,
  category_id: "cat-1",
  completed_at: "",
  updated_at: "",
  created_at: "",
};

describe("TodoItem", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    mockUseTodos.mockReturnValue({
      todos: [],
      allTodos: [],
      selectedCategoryId: null,
      isLoading: false,
      error: null,
      fetchTodos: jest.fn(),
      create: jest.fn(),
      toggleComplete: mockToggleComplete,
      deleteTodo: mockDeleteTodo,
      getTodosCountByCategoryId: jest.fn(),
    });

    mockUseCategories.mockReturnValue({
      categories: [
        { id: "cat-1", type: "Work", created_at: "", updated_at: "" },
      ],
      selectedCategoryId: null,
      changeCategory: jest.fn(),
      isLoading: false,
      error: null,
      fetchCategories: jest.fn(),
    });
  });

  it("renders todo title", () => {
    render(<TodoItem todo={baseTodo} />);
    expect(screen.getByText("Buy groceries")).toBeInTheDocument();
  });

  it("renders category type", () => {
    render(<TodoItem todo={baseTodo} />);
    expect(screen.getByText("Work")).toBeInTheDocument();
  });

  it("falls back to category_id if category not found", () => {
    mockUseCategories.mockReturnValue({
      categories: [],
      selectedCategoryId: null,
      changeCategory: jest.fn(),
      isLoading: false,
      error: null,
      fetchCategories: jest.fn(),
    });

    render(<TodoItem todo={baseTodo} />);
    expect(screen.getByText("cat-1")).toBeInTheDocument();
  });

  it("checkbox is unchecked for incomplete todo", () => {
    render(<TodoItem todo={baseTodo} />);
    expect(screen.getByRole("checkbox")).not.toBeChecked();
  });

  it("checkbox is checked for completed todo", () => {
    render(<TodoItem todo={{ ...baseTodo, is_done: true }} />);
    expect(screen.getByRole("checkbox")).toBeChecked();
  });

  it("applies muted style when todo is done", () => {
    render(<TodoItem todo={{ ...baseTodo, is_done: true }} />);
    const title = screen.getByText("Buy groceries");
    expect(title).toHaveClass("line-through");
  });

  it("calls toggleComplete when checkbox clicked", () => {
    render(<TodoItem todo={baseTodo} />);
    fireEvent.click(screen.getByRole("checkbox"));
    expect(mockToggleComplete).toHaveBeenCalledWith(baseTodo);
  });

  it("calls deleteTodo when delete button clicked", () => {
    render(<TodoItem todo={baseTodo} />);
    fireEvent.click(screen.getByRole("button"));
    expect(mockDeleteTodo).toHaveBeenCalledWith(baseTodo);
  });
});
