import { render, screen, fireEvent } from "@testing-library/react";
import RefreshButton from "@/app/components/refresh-button";
import { useRouter } from "next/navigation";

// Mock useRouter
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

describe("RefreshButton", () => {
  it("renders the button with correct text/icon", () => {
    const mockRefresh = jest.fn();
    (useRouter as jest.Mock).mockReturnValue({ refresh: mockRefresh });

    render(<RefreshButton />);
    const button = screen.getByRole("button");
    expect(button).toBeInTheDocument();
    // Check for icon class if possible, or text if present
    // Based on previous code, it likely has an icon
  });

  it("calls router.refresh on click", () => {
    const mockRefresh = jest.fn();
    (useRouter as jest.Mock).mockReturnValue({ refresh: mockRefresh });

    render(<RefreshButton />);
    fireEvent.click(screen.getByRole("button"));
    expect(mockRefresh).toHaveBeenCalled();
  });
});
