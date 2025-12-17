import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import InstantConsultation from "./InstantConsultation";
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
        data-testid="instant-book-btn"
        onClick={() =>
          onBook({
            patientName: "Amit",
            phoneNumber: "9999999999",
            appointmentDate: "2025-01-01",
            appointmentTime: "10:30 AM",
          })
        }
      >
        Instant Book
      </button>
    </div>
  );
});

global.fetch = jest.fn();

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

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useSearchParams: () => [new URLSearchParams(""), jest.fn()],
}));

describe("InstantConsultation (stable integration tests)", () => {
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
        <InstantConsultation />
      </MemoryRouter>
    );

  it("renders doctors after fetch", async () => {
    renderPage();

    const doctors = await screen.findAllByTestId("doctor-name");
    expect(doctors).toHaveLength(2);
  });

  it("filters doctors by name", async () => {
    renderPage();

    await screen.findAllByTestId("doctor-name");

    fireEvent.change(screen.getByTestId("search-input"), {
      target: { value: "sharma" },
    });

    const doctors = await screen.findAllByTestId("doctor-name");
    expect(doctors).toHaveLength(1);
  });

  it("filters doctors by speciality", async () => {
    renderPage();

    await screen.findAllByTestId("doctor-name");

    fireEvent.change(screen.getByTestId("search-input"), {
      target: { value: "derma" },
    });

    const doctors = await screen.findAllByTestId("doctor-name");
    expect(doctors).toHaveLength(1);
  });

  it("shows no doctors when filter returns empty", async () => {
    renderPage();

    await screen.findAllByTestId("doctor-name");

    fireEvent.change(screen.getByTestId("search-input"), {
      target: { value: "orthopedic" },
    });

    await waitFor(() => {
      expect(screen.queryAllByTestId("doctor-name")).toHaveLength(0);
    });
  });

  it("calls sendNotification when instant booking", async () => {
    renderPage();

    // ensure token exists at runtime
    window.sessionStorage.getItem = jest.fn(() => "fake-token");

    const buttons = await screen.findAllByTestId("instant-book-btn");
    fireEvent.click(buttons[0]);

    await waitFor(() => {
      expect(sendNotification).toHaveBeenCalledTimes(1);
    });
  });
});
