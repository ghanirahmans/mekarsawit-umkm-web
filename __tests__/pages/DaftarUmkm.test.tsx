import { render, screen } from "@testing-library/react";
import DaftarUmkmScreen from "@/app/daftar-umkm/daftar-umkm";
import { useRouter } from "next/navigation";

// Mock useRouter
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

// Mock fetch
global.fetch = jest.fn();

describe("DaftarUmkmScreen", () => {
  const mockPush = jest.fn();

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
    (global.fetch as jest.Mock).mockClear();
    window.alert = jest.fn();
  });

  it("renders correctly", () => {
    render(<DaftarUmkmScreen />);
    expect(screen.getByText("Langkah 1: Data Akun")).toBeInTheDocument();
    expect(screen.getByLabelText(/Kode Desa/i)).toBeInTheDocument();
  });
});
