import { render, screen } from "@testing-library/react";
import { TodoList } from "@/src/components/todos/TodoList";
import { useTodos } from "@/src/entities/todo/hooks";
import { ITodo } from "@/src/entities/todo/types";

jest.mock("@/src/entities/todo/hooks");
jest.mock("@/src/components/todos/TodoItem", () => ({
  TodoItem: ({ todo }: { todo: ITodo }) => (
    <div data-testid="todo-item">{todo.title}</div>
  ),
}));

const mockUseTodos = useTodos as jest.MockedFunction<typeof useTodos>;

const baseMock = {
  allTodos: [],
  selectedCategoryId: null,
  isLoading: false,
  error: null,
  create: jest.fn(),
  toggleComplete: jest.fn(),
  deleteTodo: jest.fn(),
  getTodosCountByCategoryId: jest.fn(),
};

const mockTodos: ITodo[] = [
  {
    id: "1",
    title: "Task One",
    is_done: false,
    category_id: "cat-1",
    completed_at: "",
    updated_at: "",
    created_at: "",
  },
  {
    id: "2",
    title: "Task Two",
    is_done: true,
    category_id: "cat-1",
    completed_at: "",
    updated_at: "",
    created_at: "",
  },
];

describe("TodoList", () => {
  beforeEach(() => jest.clearAllMocks());

  it("shows loading spinner when loading and no todos", () => {
    mockUseTodos.mockReturnValue({
      ...baseMock,
      todos: [],
      fetchTodos: jest.fn(),
      isLoading: true,
    });

    render(<TodoList />);
    expect(screen.getByText("Loading tasks...")).toBeInTheDocument();
  });

  it("shows error message when error and no todos", () => {
    mockUseTodos.mockReturnValue({
      ...baseMock,
      todos: [],
      fetchTodos: jest.fn(),
      error: "Network error",
    });

    render(<TodoList />);
    expect(screen.getByText("Network error")).toBeInTheDocument();
  });

  it("shows empty state when no todos", () => {
    mockUseTodos.mockReturnValue({
      ...baseMock,
      todos: [],
      fetchTodos: jest.fn(),
    });

    render(<TodoList />);
    expect(screen.getByText("No tasks")).toBeInTheDocument();
    expect(
      screen.getByText("Create your first task above"),
    ).toBeInTheDocument();
  });

  it("renders a TodoItem for each todo", () => {
    mockUseTodos.mockReturnValue({
      ...baseMock,
      todos: mockTodos,
      fetchTodos: jest.fn(),
    });

    render(<TodoList />);
    const items = screen.getAllByTestId("todo-item");
    expect(items).toHaveLength(2);
    expect(screen.getByText("Task One")).toBeInTheDocument();
    expect(screen.getByText("Task Two")).toBeInTheDocument();
  });

  it("calls fetchTodos on mount", () => {
    const fetchTodos = jest.fn();
    mockUseTodos.mockReturnValue({
      ...baseMock,
      todos: [],
      fetchTodos,
    });

    render(<TodoList />);
    expect(fetchTodos).toHaveBeenCalledTimes(1);
  });

  it("does not show spinner when loading but todos already exist", () => {
    mockUseTodos.mockReturnValue({
      ...baseMock,
      todos: mockTodos,
      fetchTodos: jest.fn(),
      isLoading: true,
    });

    render(<TodoList />);
    expect(screen.queryByText("Loading tasks...")).not.toBeInTheDocument();
    expect(screen.getAllByTestId("todo-item")).toHaveLength(2);
  });
});
