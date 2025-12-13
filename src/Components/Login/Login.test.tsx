import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Login from "./Login";

// ✅ Mock react-router-dom (safe with your setup)
jest.mock("react-router-dom", () => ({
  //...jest.requireActual("react-router-dom"),
  useNavigate: () => jest.fn(),
  Link: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

describe("Login Component", () => {
  const mockSetLoggedIn = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders login form fields", () => {
    render(<Login setLoggedIn={mockSetLoggedIn} />);
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();    
    expect(screen.getByRole("button", { name: /login/i })).toBeInTheDocument();
  });

  test("allows user to type email and password", () => {
    render(<Login setLoggedIn={mockSetLoggedIn} />);
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "test@example.com" },
    });

    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "password123" },
    });
    
    expect(screen.getByLabelText(/email/i)).toHaveValue("test@example.com");
    expect(screen.getByLabelText(/password/i)).toHaveValue("password123");
  });

  test("submits login form", async () => {
    // ✅ Mock fetch
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({
            authtoken: "fake-token",
            role: "Patient",
            id: "123",
            email: "test@example.com",
            forgotEmail: "test@example.com",
            name: "Test User",
        }),
      } as Response)
    );

    render(<Login setLoggedIn={mockSetLoggedIn} />);

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "test@example.com" },
    });

    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "password123" },
    });
    fireEvent.click(screen.getByLabelText(/patient/i));
    fireEvent.click(screen.getByRole("button", { name: /login/i }));

    await waitFor(() => {
      expect(mockSetLoggedIn).toHaveBeenCalledWith(true);
    });
  });
});
