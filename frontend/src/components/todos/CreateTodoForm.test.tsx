import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CreateTodoForm } from "@/src/components/todos/CreateTodoForm";
import { useTodos } from "@/src/entities/todo/hooks";
import { useCategories } from "@/src/entities/category/hooks";
import { TASK_LIMIT_BY_CATEGORY } from "@/src/types/constants";

jest.mock("@/src/entities/todo/hooks");
jest.mock("@/src/entities/category/hooks");

const mockUseTodos = jest.mocked(useTodos);
const mockUseCategories = jest.mocked(useCategories);

const mockCategories = [
  { id: "cat-1", type: "Work", created_at: "", updated_at: "" },
  { id: "cat-2", type: "Personal", created_at: "", updated_at: "" },
];

describe("CreateTodoForm", () => {
  const mockCreate = jest.fn();
  const mockGetCount = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    mockCreate.mockResolvedValue(undefined);
    mockGetCount.mockReturnValue(0);

    mockUseTodos.mockReturnValue({
      todos: [],
      allTodos: [],
      selectedCategoryId: null,
      isLoading: false,
      error: null,
      fetchTodos: jest.fn(),
      create: mockCreate,
      toggleComplete: jest.fn(),
      deleteTodo: jest.fn(),
      getTodosCountByCategoryId: mockGetCount,
    });

    mockUseCategories.mockReturnValue({
      categories: mockCategories,
      selectedCategoryId: null,
      changeCategory: jest.fn(),
      isLoading: false,
      error: null,
      fetchCategories: jest.fn(),
    });
  });

  it("renders task input and submit button", () => {
    render(<CreateTodoForm />);
    expect(screen.getByLabelText("Task")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /add task/i }),
    ).toBeInTheDocument();
  });

  it("renders category select", () => {
    render(<CreateTodoForm />);
    expect(screen.getByLabelText("Category")).toBeInTheDocument();
  });

  it("shows validation error when submitting empty title", async () => {
    render(<CreateTodoForm />);
    await userEvent.click(screen.getByRole("button", { name: /add task/i }));
    await waitFor(() => {
      expect(
        screen.getByText("Task title must be at least 2 characters length."),
      ).toBeInTheDocument();
    });
  });

  it("shows validation error when no category selected", async () => {
    render(<CreateTodoForm />);
    await userEvent.type(screen.getByLabelText("Task"), "My task");
    await userEvent.click(screen.getByRole("button", { name: /add task/i }));
    await waitFor(() => {
      expect(screen.getByText("Category is required.")).toBeInTheDocument();
    });
  });

  it("calls create with correct data on valid submit", async () => {
    render(<CreateTodoForm />);

    await userEvent.type(screen.getByLabelText("Task"), "My new task");

    await userEvent.click(screen.getByRole("combobox"));

    const options = await screen.findAllByRole("option");
    await userEvent.click(options[0]);

    await userEvent.click(screen.getByRole("button", { name: /add task/i }));

    await waitFor(() => {
      expect(mockCreate).toHaveBeenCalledWith({
        title: "My new task",
        category_id: "cat-1",
      });
    });
  });

  it("resets form after successful submit", async () => {
    render(<CreateTodoForm />);

    const input = screen.getByLabelText("Task");
    await userEvent.type(input, "My new task");

    await userEvent.click(screen.getByRole("combobox"));
    const options = await screen.findAllByRole("option");
    await userEvent.click(options[0]);

    await userEvent.click(screen.getByRole("button", { name: /add task/i }));

    await waitFor(() => {
      expect(input).toHaveValue("");
    });
  });

  it("disables full categories in dropdown", async () => {
    mockGetCount.mockImplementation((id: string) =>
      id === "cat-1" ? TASK_LIMIT_BY_CATEGORY : 0,
    );

    render(<CreateTodoForm />);
    await userEvent.click(screen.getByRole("combobox"));

    const options = await screen.findAllByRole("option");
    expect(options[0]).toHaveAttribute("data-disabled");
  });

  it("shows spinner and disables button when loading", () => {
    mockUseTodos.mockReturnValue({
      todos: [],
      allTodos: [],
      selectedCategoryId: null,
      isLoading: true,
      error: null,
      fetchTodos: jest.fn(),
      create: mockCreate,
      toggleComplete: jest.fn(),
      deleteTodo: jest.fn(),
      getTodosCountByCategoryId: mockGetCount,
    });

    render(<CreateTodoForm />);
    expect(screen.queryByText("Add Task")).not.toBeInTheDocument();
    expect(screen.getByRole("button")).toBeDisabled();
  });
});
