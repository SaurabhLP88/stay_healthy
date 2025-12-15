import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Appointments from "./Appointments";

// ---- MOCK useNavigate ----
const mockNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
  Link: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

// ---- MOCK fetch ----
global.fetch = jest.fn();

describe("Appointments Page", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    sessionStorage.removeItem("auth-token");
    sessionStorage.removeItem("email");
    sessionStorage.removeItem("role");
    });

test("redirects to login if user is not authenticated", async () => {
  render(
    <MemoryRouter>
      <Appointments />
    </MemoryRouter>
  );

  await waitFor(() => {
    expect(mockNavigate).toHaveBeenCalled();
  });

  expect(mockNavigate).toHaveBeenCalledWith("/login");
});


  test("shows loading text initially when authenticated", async () => {
    sessionStorage.setItem("auth-token", "fake-token");
    sessionStorage.setItem("email", "test@example.com");
    sessionStorage.setItem("role", "patient");

    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => [],
    });

    render(
      <MemoryRouter>
        <Appointments />
      </MemoryRouter>
    );

    expect(
      screen.getByText(/Loading appointments/i)
    ).toBeInTheDocument();
  });

  test("shows empty state when no appointments exist", async () => {
    sessionStorage.setItem("auth-token", "fake-token");
    sessionStorage.setItem("email", "test@example.com");
    sessionStorage.setItem("role", "patient");

    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => [],
    });

    render(
      <MemoryRouter>
        <Appointments />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(
        screen.getByText(/You don’t have any appointments yet/i)
      ).toBeInTheDocument();
    });
  });

  test("renders appointments table when data is returned", async () => {
    sessionStorage.setItem("auth-token", "fake-token");
    sessionStorage.setItem("email", "test@example.com");
    sessionStorage.setItem("role", "patient");

    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => [
        {
          _id: "1",
          patientName: "John Doe",
          phoneNumber: "9999999999",
          bookingType: "scheduled",
          doctorName: "Dr. Smith",
          doctorSpeciality: "Cardiology",
          appointmentDate: "2024-10-10",
          appointmentTime: "10:00",
          status: "completed",
        },
      ],
    });

    render(
      <MemoryRouter>
        <Appointments />
      </MemoryRouter>
    );

    // 👇 wait for ONE async element
    expect(await screen.findByText("John Doe")).toBeInTheDocument();

    // 👇 normal assertions after render is settled
    expect(screen.getByText("Dr. Smith")).toBeInTheDocument();
    expect(screen.getByText("Cardiology")).toBeInTheDocument();

  });
});
