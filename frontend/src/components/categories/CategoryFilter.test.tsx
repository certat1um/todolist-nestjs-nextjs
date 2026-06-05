import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CategoryFilter } from "@/src/components/categories/CategoryFilter";
import { useCategories } from "@/src/entities/category/hooks";

jest.mock("@/src/entities/category/hooks");

const mockUseCategories = useCategories as jest.MockedFunction<
  typeof useCategories
>;

const mockCategories = [
  { id: "1", type: "Work", created_at: "", updated_at: "" },
  { id: "2", type: "Personal", created_at: "", updated_at: "" },
];

describe("CategoryFilter", () => {
  beforeEach(() => {
    mockUseCategories.mockReturnValue({
      categories: mockCategories,
      selectedCategoryId: null,
      changeCategory: jest.fn(),
      isLoading: false,
      error: null,
      fetchCategories: jest.fn(),
    });
  });

  it("renders label and trigger", () => {
    render(<CategoryFilter />);
    expect(screen.getByText("Filter by Category")).toBeInTheDocument();
    expect(screen.getByRole("combobox")).toBeInTheDocument();
  });

  it('shows "Select category" when no category selected', () => {
    render(<CategoryFilter />);
    expect(screen.getByText("Select category")).toBeInTheDocument();
  });

  it("shows selected category name when one is selected", () => {
    mockUseCategories.mockReturnValue({
      categories: mockCategories,
      selectedCategoryId: "1",
      changeCategory: jest.fn(),
      isLoading: false,
      error: null,
      fetchCategories: jest.fn(),
    });

    render(<CategoryFilter />);
    expect(screen.getByText("Work")).toBeInTheDocument();
  });

  it("calls changeCategory when user selects a category", async () => {
    const changeCategory = jest.fn();
    mockUseCategories.mockReturnValue({
      categories: mockCategories,
      selectedCategoryId: null,
      changeCategory,
      isLoading: false,
      error: null,
      fetchCategories: jest.fn(),
    });

    render(<CategoryFilter />);

    await userEvent.click(screen.getByRole("combobox"));
    await userEvent.click(screen.getByText("Work"));

    // base-ui передаёт второй аргумент (event-объект) — проверяем только первый
    expect(changeCategory).toHaveBeenCalledWith("1", expect.anything());
  });

  it('renders "All Categories" option', async () => {
    render(<CategoryFilter />);
    await userEvent.click(screen.getByRole("combobox"));
    expect(screen.getByText("All Categories")).toBeInTheDocument();
  });

  it("renders all category options in dropdown", async () => {
    render(<CategoryFilter />);
    await userEvent.click(screen.getByRole("combobox"));

    expect(screen.getByText("Work")).toBeInTheDocument();
    expect(screen.getByText("Personal")).toBeInTheDocument();
  });
});
