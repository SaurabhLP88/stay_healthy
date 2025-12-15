import { render, screen, waitFor } from "@testing-library/react";
import Reviews from "./Reviews";

global.fetch = jest.fn();

describe("Reviews", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    sessionStorage.clear();
  });

  test("shows public reviews when user is not logged in", async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      json: async () => ({
        reviews: [
          {
            doctorName: "Dr. Smith",
            speciality: "Cardiology",
            title: "Great doctor",
            review: "Very helpful",
            rating: 4,
          },
        ],
      }),
    });

    render(<Reviews />);

    expect(await screen.findByText(/Dr. Smith/i)).toBeInTheDocument();
    expect(screen.getByText(/Cardiology/i)).toBeInTheDocument();
    expect(screen.getByText(/Great doctor/i)).toBeInTheDocument();
  });

  test("shows patient reviews when patient is logged in", async () => {
    sessionStorage.setItem("role", "patient");
    sessionStorage.setItem("userId", "user123");

    (fetch as jest.Mock).mockResolvedValueOnce({
      json: async () => ({
        reviews: [
          {
            doctorName: "Dr. Adams",
            speciality: "Dermatology",
            title: "Nice consultation",
            review: "Explained everything well",
            rating: 5,
          },
        ],
      }),
    });

    render(<Reviews />);

    expect(await screen.findByText(/Dr. Adams/i)).toBeInTheDocument();
    expect(screen.getByText(/Dermatology/i)).toBeInTheDocument();
  });

  test("shows doctor reviews when doctor is logged in", async () => {
    sessionStorage.setItem("role", "doctor");
    sessionStorage.setItem("doctorId", "doc123");

    (fetch as jest.Mock).mockResolvedValueOnce({
      json: async () => ({
        reviews: [
          {
            patientName: "John Doe",
            phone: "9999999999",
            title: "Very kind",
            review: "Doctor was patient and clear",
            rating: 5,
          },
        ],
      }),
    });

    render(<Reviews />);

    expect(await screen.findByText(/John Doe/i)).toBeInTheDocument();
    expect(screen.getByText(/Very kind/i)).toBeInTheDocument();
  });

  test("shows empty state when no reviews exist", async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      json: async () => ({ reviews: [] }),
    });

    render(<Reviews />);

    expect(
      await screen.findByText(/No reviews available/i)
    ).toBeInTheDocument();
  });
});
