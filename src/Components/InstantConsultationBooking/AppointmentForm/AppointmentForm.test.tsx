import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter, useLocation } from "react-router-dom";
import AppointmentForm from "./AppointmentForm";

/**
 * Mock useLocation to control route-based behavior
 */
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useLocation: jest.fn(),
}));

const mockUseLocation = useLocation as jest.Mock;

describe("AppointmentForm", () => {
  const baseProps = {
    doctorId: "doc123",
    doctorName: "Dr. Sharma",
    doctorSpeciality: "Cardiology",
  };

  const renderComponent = (pathname: string, onSubmit?: jest.Mock) => {
    mockUseLocation.mockReturnValue({ pathname });

    return render(
      <MemoryRouter>
        <AppointmentForm {...baseProps} onSubmit={onSubmit} />
      </MemoryRouter>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders common form fields", () => {
    renderComponent("/book-consultation");

    expect(screen.getByLabelText("Name:")).toBeInTheDocument();
    expect(screen.getByLabelText("Phone Number:")).toBeInTheDocument();
    expect(screen.getByText("Book Now")).toBeInTheDocument();
  });

  it("shows date and time fields for book consultation", () => {
    renderComponent("/book-consultation");

    expect(screen.getByLabelText("Appointment Date:")).toBeInTheDocument();
    expect(screen.getByLabelText("Time Slot:")).toBeInTheDocument();
  });

  it("does NOT show date and time fields for instant consultation", () => {
    renderComponent("/instant-consultation");

    expect(
      screen.queryByLabelText("Appointment Date:")
    ).not.toBeInTheDocument();

    expect(
      screen.queryByLabelText("Time Slot:")
    ).not.toBeInTheDocument();
  });

  it("shows validation errors when submitting empty booking form", () => {
    renderComponent("/book-consultation");

    fireEvent.click(screen.getByText("Book Now"));

    expect(
      screen.getByText("Full name is required.")
    ).toBeInTheDocument();

    expect(
      screen.getByText("Phone number is required.")
    ).toBeInTheDocument();

    expect(
      screen.getByText("Select an appointment date.")
    ).toBeInTheDocument();

    expect(
      screen.getByText("Select a time slot.")
    ).toBeInTheDocument();
  });

  it("shows validation errors for invalid name and phone number", async () => {
    renderComponent("/book-consultation"); // 🔑 NOT instant-consultation

    fireEvent.change(screen.getByLabelText("Name:"), {
      target: { value: "1234" },
    });

    fireEvent.change(screen.getByLabelText("Phone Number:"), {
      target: { value: "123" },
    });

    fireEvent.click(screen.getByText("Book Now"));

    expect(
      await screen.findByText("Name should contain only letters.")
    ).toBeInTheDocument();

    expect(
      await screen.findByText("Enter a valid 10-digit phone number.")
    ).toBeInTheDocument();
  });

  it("calls onSubmit with correct payload for booking consultation", () => {
    const onSubmit = jest.fn();
    renderComponent("/book-consultation", onSubmit);

    fireEvent.change(screen.getByLabelText("Name:"), {
      target: { value: "Rahul Kumar" },
    });

    fireEvent.change(screen.getByLabelText("Phone Number:"), {
      target: { value: "9999999999" },
    });

    fireEvent.change(screen.getByLabelText("Appointment Date:"), {
      target: { value: "2099-01-01" },
    });

    fireEvent.change(screen.getByLabelText("Time Slot:"), {
      target: { value: "10:00 AM - 10:30 AM" },
    });

    fireEvent.click(screen.getByText("Book Now"));

    expect(onSubmit).toHaveBeenCalledTimes(1);

    const submittedData = onSubmit.mock.calls[0][0];

    expect(submittedData).toMatchObject({
      doctorId: "doc123",
      doctorName: "Dr. Sharma",
      doctorSpeciality: "Cardiology",
      patientName: "Rahul Kumar",
      phoneNumber: "9999999999",
      appointmentDate: "2099-01-01",
      appointmentTime: "10:00 AM - 10:30 AM",
    });
  });

  it("resets form fields after successful submission", () => {
    const onSubmit = jest.fn();
    renderComponent("/book-consultation", onSubmit);

    fireEvent.change(screen.getByLabelText("Name:"), {
      target: { value: "Rahul Kumar" },
    });

    fireEvent.change(screen.getByLabelText("Phone Number:"), {
      target: { value: "9999999999" },
    });

    fireEvent.change(screen.getByLabelText("Appointment Date:"), {
      target: { value: "2099-01-01" },
    });

    fireEvent.change(screen.getByLabelText("Time Slot:"), {
      target: { value: "10:00 AM - 10:30 AM" },
    });

    fireEvent.click(screen.getByText("Book Now"));

    expect(screen.getByLabelText("Name:")).toHaveValue("");
    expect(screen.getByLabelText("Phone Number:")).toHaveValue("");
  });
});
