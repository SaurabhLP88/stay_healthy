import { render, screen, fireEvent } from "@testing-library/react";
import Notification from "./Notification";

// Mock react-icons (recommended for clean tests)
jest.mock("react-icons/fa", () => ({
  FaBell: () => <span data-testid="bell-icon">Bell</span>,
  FaTimes: () => <span data-testid="close-icon">Close</span>,
}));

describe("Notification component", () => {
  test("renders bell button initially", () => {
    render(
      <Notification
        title="Test Title"
        message="Test Message"
      />
    );

    expect(screen.getByTestId("bell-icon")).toBeInTheDocument();
  });

  test("opens notification when bell is clicked", () => {
    render(
      <Notification
        title="Test Title"
        message="<p>Test Message</p>"
      />
    );

    fireEvent.click(screen.getByTestId("bell-icon"));

    expect(screen.getByText("Test Title")).toBeInTheDocument();
    expect(screen.getByText("Test Message")).toBeInTheDocument();
    expect(screen.getByTestId("close-icon")).toBeInTheDocument();
  });

  test("closes notification and calls onClose", () => {
    const onClose = jest.fn();

    render(
      <Notification
        title="Test Title"
        message="<p>Test Message</p>"
        onClose={onClose}
      />
    );

    // Open notification
    fireEvent.click(screen.getByTestId("bell-icon"));

    // Close notification
    fireEvent.click(screen.getByTestId("close-icon"));

    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
