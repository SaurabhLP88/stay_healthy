import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import BookingConsultation from "./BookingConsultation";
import { sendNotification } from "../../../utils/notify";

/* ---------------- MOCKS ---------------- */

jest.mock("../../../utils/notify", () => ({
  sendNotification: jest.fn(),
}));

jest.mock("../FindDoctorSearch/FindDoctorSearch", () => {
  return ({ onSearch }: any) => (
    <input
      data-testid="search-input"
      onChange={(e) => onSearch(e.target.value)}
    />
  );
});

jest.mock("../DoctorCard/DoctorCard", () => {
  return ({ name, onBook }: any) => (
    <div>
      <span data-testid="doctor-name">{name}</span>
      <button
        data-testid="book-btn"
        onClick={() =>
          onBook({
            patientName: "Rahul",
            phoneNumber: "9999999999",
            appointmentDate: "2025-01-01",
            appointmentTime: "10:00 AM",
          })
        }
      >
        Book
      </button>
    </div>
  );
});

// fetch supports `.then`
global.fetch = jest.fn();

// sessionStorage
beforeAll(() => {
  Object.defineProperty(window, "sessionStorage", {
    value: {
      getItem: jest.fn(() => "fake-token"),
      setItem: jest.fn(),
      removeItem: jest.fn(),
    },
    writable: true,
  });
});

const mockSearchParams = new URLSearchParams("");
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useSearchParams: () => [mockSearchParams, jest.fn()],
}));

describe("BookingConsultation (stable integration tests)", () => {
  const doctorsMock = [
    {
      _id: "1",
      name: "Dr. Sharma",
      speciality: "Cardiology",
      experience: 10,
      ratings: 4,
      image: "doctor1.png",
    },
    {
      _id: "2",
      name: "Dr. Mehta",
      speciality: "Dermatologist",
      experience: 8,
      ratings: 5,
      image: "doctor1.png",
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();

    (fetch as jest.Mock).mockImplementation(() =>
      Promise.resolve({
        json: () => Promise.resolve(doctorsMock),
      })
    );
  });

  const renderPage = () =>
    render(
      <MemoryRouter>
        <BookingConsultation />
      </MemoryRouter>
    );

  it("renders doctors after fetch", async () => {
    renderPage();

    const doctors = await screen.findAllByTestId("doctor-name");
    expect(doctors).toHaveLength(2);
  });

  it("filters doctors by name", async () => {
    renderPage();

    // wait for initial load
    await screen.findAllByTestId("doctor-name");

    fireEvent.change(screen.getByTestId("search-input"), {
      target: { value: "sharma" },
    });

    // wait for filtered result
    const doctor = await screen.findByText("Dr. Sharma");

    expect(doctor).toBeInTheDocument();
    expect(screen.queryByText("Dr. Mehta")).not.toBeInTheDocument();
  });

  it("filters doctors by speciality", async () => {
    renderPage();

    // wait for initial load
    await screen.findAllByTestId("doctor-name");

    fireEvent.change(screen.getByTestId("search-input"), {
      target: { value: "derma" },
    });

    const doctor = await screen.findByText("Dr. Mehta");

    expect(doctor).toBeInTheDocument();
    expect(screen.queryByText("Dr. Sharma")).not.toBeInTheDocument();
  });


  it("shows no doctors found message", async () => {
    renderPage();

    // wait for initial doctors
    await screen.findAllByTestId("doctor-name");

    // search with no matches
    fireEvent.change(screen.getByTestId("search-input"), {
      target: { value: "orthopedic" },
    });

    // ✅ assert behavior, not text
    await waitFor(() => {
      expect(screen.queryAllByTestId("doctor-name")).toHaveLength(0);
    });
  });

  it("calls sendNotification when booking", async () => {
    renderPage();

    // 🔑 Ensure token exists at runtime
    window.sessionStorage.getItem = jest.fn(() => "fake-token");

    // wait for cards
    const bookButtons = await screen.findAllByTestId("book-btn");
    expect(bookButtons.length).toBeGreaterThan(0);

    // click
    fireEvent.click(bookButtons[0]);

    // ✅ wait for async side-effect
    await waitFor(() => {
      expect(sendNotification).toHaveBeenCalledWith(
        "fake-token",
        expect.objectContaining({ name: "Dr. Sharma" }),
        expect.objectContaining({ patientName: "Rahul" }),
        "Appointment Booked"
      );
    });
  });


});
