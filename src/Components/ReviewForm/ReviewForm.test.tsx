import { render, screen, fireEvent } from "@testing-library/react";
import ReviewForm from "./ReviewForm";

describe("ReviewForm", () => {
  const baseProps = {
    doctorId: "doc123",
    appointmentId: { doctorName: "Dr. Smith" },
    userId: "user123",
    onSubmit: jest.fn(),
    onClose: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(window, "alert").mockImplementation(() => {});
  });

  test("renders review form with doctor name", () => {
    render(<ReviewForm {...baseProps} />);

    expect(
      screen.getByText(/Give Review for/i)
    ).toBeInTheDocument();

    expect(
      screen.getByText(/Dr. Smith/i)
    ).toBeInTheDocument();
  });

  test("shows warning when submitting empty form", () => {
    render(<ReviewForm {...baseProps} />);

    fireEvent.click(screen.getByText(/Submit Feedback/i));

    expect(
      screen.getByText(/Please fill out all fields/i)
    ).toBeInTheDocument();

    expect(baseProps.onSubmit).not.toHaveBeenCalled();
  });

  test("submits review when all fields are filled", () => {
    render(<ReviewForm {...baseProps} />);

    fireEvent.change(screen.getByPlaceholderText(/Enter your title/i), {
      target: { value: "Great consultation" },
    });

    fireEvent.change(screen.getByPlaceholderText(/Write your description/i), {
      target: { value: "Doctor was very helpful and polite." },
    });

    // Click rating star (3)
    fireEvent.click(screen.getAllByText("★")[2]);

    fireEvent.click(screen.getByText(/Submit Feedback/i));

    expect(baseProps.onSubmit).toHaveBeenCalledWith({
      title: "Great consultation",
      description: "Doctor was very helpful and polite.",
      rating: 3,
      appointmentId: baseProps.appointmentId,
      doctorId: baseProps.doctorId,
      userId: baseProps.userId,
    });
  });

  test("calls onClose when close button is clicked", () => {
    render(<ReviewForm {...baseProps} />);

    fireEvent.click(screen.getByText("×"));

    expect(baseProps.onClose).toHaveBeenCalled();
  });
});
