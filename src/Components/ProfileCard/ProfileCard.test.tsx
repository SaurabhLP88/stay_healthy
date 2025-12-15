import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import ProfileForm from "./ProfileCard";

const mockNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

global.fetch = jest.fn();

describe("ProfileCard", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    sessionStorage.clear();
  });

  test("redirects to login if not authenticated", async () => {
    render(
      <MemoryRouter>
        <ProfileForm />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/login");
    });
  });

  test("renders profile view when authenticated", async () => {
    sessionStorage.setItem("auth-token", "fake-token");
    sessionStorage.setItem("email", "test@example.com");
    sessionStorage.setItem("role", "Patient");

    (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
        name: "John Doe",
        email: "test@example.com",
        phone: "9999999999",
        }),
    });

    render(
        <MemoryRouter>
        <ProfileForm />
        </MemoryRouter>
    );

    // ✅ wait for component to exit loading & render view mode
    expect(
        await screen.findByRole("button", { name: /edit/i })
    ).toBeInTheDocument();
    });

  test("switches to edit mode when Edit button is clicked", async () => {
    sessionStorage.setItem("auth-token", "fake-token");
    sessionStorage.setItem("email", "test@example.com");
    sessionStorage.setItem("role", "Patient");

    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        name: "John Doe",
        email: "test@example.com",
        phone: "9999999999",
      }),
    });

    render(
      <MemoryRouter>
        <ProfileForm />
      </MemoryRouter>
    );

    fireEvent.click(await screen.findByText("Edit"));

    expect(screen.getByText("Save")).toBeInTheDocument();
    expect(screen.getByLabelText(/Name/i)).toBeInTheDocument();
  });
});
