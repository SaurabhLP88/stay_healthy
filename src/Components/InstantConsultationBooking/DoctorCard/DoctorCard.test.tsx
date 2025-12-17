import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import DoctorCard from "./DoctorCard";
import { API_URL } from "../../../config";

/* ------------------ MOCKS ------------------ */

// Mock reactjs-popup (render children immediately when open)
jest.mock("reactjs-popup", () => {
  return ({ trigger, children, open }: any) => (
    <div>
      {trigger}
      {open && typeof children === "function" && children(jest.fn())}
    </div>
  );
});

// Mock AppointmentForm (we only care that it renders & submits)
jest.mock("../AppointmentForm/AppointmentForm", () => {
  return ({ onSubmit }: any) => (
    <button onClick={() => onSubmit({ patientName: "Test", phoneNumber: "9999999999" })}>
      Mock AppointmentForm Submit
    </button>
  );
});

// Mock fetch
global.fetch = jest.fn();

// Mock sessionStorage
beforeAll(() => {
  Object.defineProperty(window, "sessionStorage", {
    value: {
      getItem: jest.fn(() => "fake-token"),
      setItem: jest.fn(),
      removeItem: jest.fn(),
    },
  });
});

describe("DoctorCard", () => {
  const baseProps = {
    doctorId: "doc123",
    image: "doctor.jpg",
    name: "Dr. Sharma",
    speciality: "Cardiology",
    experience: 10,
    ratings: 4,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders doctor details correctly", () => {
    render(<DoctorCard {...baseProps} />);

    expect(screen.getByText("Dr. Sharma")).toBeInTheDocument();
    expect(screen.getByText("Cardiology")).toBeInTheDocument();
    expect(screen.getByText("10 years experience")).toBeInTheDocument();
    expect(screen.getByText("⭐⭐⭐⭐")).toBeInTheDocument();
  });

  it("shows Book Appointment button when no appointment exists", async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      headers: { get: () => "application/json" },
      json: async () => [],
    });

    render(<DoctorCard {...baseProps} />);

    expect(
      await screen.findByText("Book Appointment")
    ).toBeInTheDocument();
  });

  it("opens popup and renders AppointmentForm when Book Appointment clicked", async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      headers: { get: () => "application/json" },
      json: async () => [],
    });

    render(<DoctorCard {...baseProps} />);

    fireEvent.click(await screen.findByText("Book Appointment"));

    expect(
      screen.getByText("Mock AppointmentForm Submit")
    ).toBeInTheDocument();
  });

  it("submits appointment and calls onBook callback", async () => {
    const onBook = jest.fn();

    // 🔑 ensure auth token exists at runtime
    window.sessionStorage.getItem = jest.fn(() => "fake-token");

    (fetch as jest.Mock)
      // initial appointments fetch
      .mockResolvedValueOnce({
        ok: true,
        headers: { get: () => "application/json" },
        json: async () => [],
      })
      // booking API
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          appointment: {
            _id: "appt123",
            patientName: "Test",
            phoneNumber: "9999999999",
            status: "booked",
          },
        }),
      });

    render(<DoctorCard {...baseProps} onBook={onBook} />);

    // 🔑 open popup (trigger)
    fireEvent.click(await screen.findByText("Book Appointment"));

    // 🔑 submit mocked form
    fireEvent.click(await screen.findByText("Mock AppointmentForm Submit"));

    // 🔑 wait for async state + callback
    await waitFor(() => {
      expect(onBook).toHaveBeenCalledTimes(1);
    });
  });


  it("shows Cancel Appointment button when appointment is booked", async () => {
    // 🔑 ensure token exists so fetch runs
    window.sessionStorage.getItem = jest.fn(() => "fake-token");

    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      headers: { get: () => "application/json" },
      json: async () => [
        {
          _id: "appt123",
          patientName: "Test",
          phoneNumber: "9999999999",
          appointmentDate: "2025-01-01",
          appointmentTime: "10:00 AM",
          status: "booked",
          doctorName: "Dr. Sharma",
          doctorSpeciality: "Cardiology",
        },
      ],
    });

    render(<DoctorCard {...baseProps} />);

    // ✅ wait for async state update + re-render
    await waitFor(() => {
      const buttons = screen.getAllByRole("button");
      const hasCancel = buttons.some((btn) =>
        btn.textContent?.includes("Cancel Appointment")
      );

      expect(hasCancel).toBe(true);
    });
  });


  it("calls cancel appointment API when Cancel Appointment clicked", async () => {
    // 🔑 ensure token exists AT RUNTIME
    window.sessionStorage.getItem = jest.fn(() => "fake-token");

    (fetch as jest.Mock)
      // load appointments
      .mockResolvedValueOnce({
        ok: true,
        headers: { get: () => "application/json" },
        json: async () => [
          {
            _id: "appt123",
            patientName: "Test",
            phoneNumber: "9999999999",
            appointmentDate: "2025-01-01",
            appointmentTime: "10:00 AM",
            status: "booked",
            doctorName: "Dr. Sharma",
            doctorSpeciality: "Cardiology",
          },
        ],
      })
      // cancel appointment
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({}),
      });

    render(<DoctorCard {...baseProps} />);

    // wait for trigger button (after fetch)
    const buttons = await screen.findAllByRole("button");

    // click trigger
    fireEvent.click(buttons[0]);

    // popup renders another button → cancel
    const popupButtons = await screen.findAllByRole("button");
    fireEvent.click(popupButtons[popupButtons.length - 1]);

    // ✅ assert DELETE call
    await waitFor(() => {
      expect(fetch).toHaveBeenLastCalledWith(
        `${API_URL}/api/appointments/cancel/appt123`,
        expect.objectContaining({
          method: "DELETE",
          headers: expect.any(Object),
        })
      );
    });
  });
});
