import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import LandingPage from "./LandingPage";

const mockNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

describe("LandingPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    sessionStorage.clear();
  });

  test("renders hero section for non-doctor user", () => {
    render(
      <MemoryRouter>
        <LandingPage />
      </MemoryRouter>
    );    

    expect(
        screen.getByRole("button", { name: /Get Started/i })
    ).toBeInTheDocument();
  });

  test("shows services section after clicking Get Started", () => {
    render(
      <MemoryRouter>
        <LandingPage />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText(/Get Started/i));

    expect(
      screen.getByText(/Best Services/i)
    ).toBeInTheDocument();

    expect(
      screen.getByText(/Instant Consultation/i)
    ).toBeInTheDocument();
  });

  test("redirects to login when clicking service while logged out", () => {
    render(
      <MemoryRouter>
        <LandingPage />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText(/Get Started/i));
    fireEvent.click(screen.getByText(/Instant Consultation/i));

    expect(mockNavigate).toHaveBeenCalledWith("/login");
  });

  test("navigates to service when user is logged in", () => {
    sessionStorage.setItem("isLoggedIn", "true");

    render(
      <MemoryRouter>
        <LandingPage />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText(/Get Started/i));
    fireEvent.click(screen.getByText(/Instant Consultation/i));

    expect(mockNavigate).toHaveBeenCalledWith("/instant-consultation");
  });
});
