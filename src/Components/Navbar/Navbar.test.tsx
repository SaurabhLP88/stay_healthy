import { render, screen, fireEvent } from "@testing-library/react";
import Navbar from "./Navbar";

// ✅ Mock react-router-dom
const mockNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  Link: ({ children }: any) => <>{children}</>,
  useNavigate: () => mockNavigate,
}));

// ✅ Mock icons
jest.mock("react-icons/fa", () => ({
  FaBars: () => <span data-testid="bars-icon">Bars</span>,
  FaTimes: () => <span data-testid="times-icon">Times</span>,
}));

describe("Navbar component", () => {
  const setLoggedIn = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    sessionStorage.clear();
  });

  test("renders logo", () => {
    render(<Navbar loggedIn={false} setLoggedIn={setLoggedIn} />);

    const logo = screen.getByAltText(/stay healthy/i);
    expect(logo).toBeInTheDocument();
  });

  test("shows login and signup when not logged in", () => {
    render(<Navbar loggedIn={false} setLoggedIn={setLoggedIn} />);

    expect(screen.getByText(/login/i)).toBeInTheDocument();
    expect(screen.getByText(/sign up/i)).toBeInTheDocument();
  });

  test("shows username when logged in", () => {
    sessionStorage.setItem("name", "Saurabh");
    sessionStorage.setItem("isLoggedIn", "true");
    sessionStorage.setItem("role", "patient");

    render(
      <Navbar
        loggedIn={true}
        setLoggedIn={setLoggedIn}
        username="Saurabh"
      />
    );

    expect(screen.getByText(/welcome/i)).toBeInTheDocument();
    expect(screen.getByText(/saurabh/i)).toBeInTheDocument();
  });

  test("shows doctor prefix when role is doctor", () => {
    sessionStorage.setItem("name", "John");
    sessionStorage.setItem("isLoggedIn", "true");
    sessionStorage.setItem("role", "doctor");

    render(
      <Navbar
        loggedIn={true}
        setLoggedIn={setLoggedIn}
        username="John"
      />
    );

    expect(screen.getByText(/dr\.\s*john/i)).toBeInTheDocument();
  });

  test("toggles mobile menu", () => {
    render(<Navbar loggedIn={false} setLoggedIn={setLoggedIn} />);

    const menuButton = screen.getByTestId("bars-icon");
    fireEvent.click(menuButton);

    expect(screen.getByTestId("times-icon")).toBeInTheDocument();
  });

  test("logs out user correctly", () => {
    sessionStorage.setItem("isLoggedIn", "true");
    sessionStorage.setItem("name", "Saurabh");

    render(
      <Navbar
        loggedIn={true}
        setLoggedIn={setLoggedIn}
        username="Saurabh"
      />
    );

    fireEvent.click(screen.getByText(/logout/i));

    expect(setLoggedIn).toHaveBeenCalledWith(false);
    expect(mockNavigate).toHaveBeenCalledWith("/login");
    expect(sessionStorage.getItem("isLoggedIn")).toBeNull();
  });
});
