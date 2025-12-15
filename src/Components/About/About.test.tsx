import { render, screen } from "@testing-library/react";
import About from "./About";

describe("About Page", () => {
  test("renders About StayHealthy heading", () => {
    render(<About />);

    expect(
      screen.getByRole("heading", { name: /About StayHealthy/i })
    ).toBeInTheDocument();
  });

  test("renders key description text", () => {
    render(<About />);

    expect(
      screen.getByText(/Medical Appointment Booking System/i)
    ).toBeInTheDocument();
  });

  test("renders feature list items", () => {
    render(<About />);

    expect(screen.getByText(/Read health blogs/i)).toBeInTheDocument();
    expect(screen.getByText(/Search and book doctor appointments/i)).toBeInTheDocument();
  });

  test("renders usage steps", () => {
    render(<About />);

    expect(screen.getByText(/Register or login as a patient/i)).toBeInTheDocument();
    expect(screen.getByText(/Manage everything from your dashboard/i)).toBeInTheDocument();
  });
});
