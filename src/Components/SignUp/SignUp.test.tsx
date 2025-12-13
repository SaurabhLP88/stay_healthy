import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import SignUp from "./SignUp";

// Mock react-router-dom
jest.mock("react-router-dom", () => ({
  useNavigate: () => jest.fn(),
  Link: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

test("renders signup form fields", () => {
  render(<SignUp />);

  expect(screen.getByText(/sign up/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/phone/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
  expect(screen.getByRole("button", { name: /submit/i })).toBeInTheDocument();
});

test("allows user to type into signup fields", () => {
  render(<SignUp />);

  fireEvent.change(screen.getByLabelText(/name/i), {
    target: { value: "John Doe" },
  });

  fireEvent.change(screen.getByLabelText(/phone/i), {
    target: { value: "9876543210" },
  });

  fireEvent.change(screen.getByLabelText(/email/i), {
    target: { value: "john@example.com" },
  });

  fireEvent.change(screen.getByLabelText(/password/i), {
    target: { value: "password123" },
  });

  expect(screen.getByLabelText(/name/i)).toHaveValue("John Doe");
  expect(screen.getByLabelText(/phone/i)).toHaveValue("9876543210");
  expect(screen.getByLabelText(/email/i)).toHaveValue("john@example.com");
});

test("shows doctor fields when Doctor role is selected", () => {
  render(<SignUp />);

  fireEvent.click(screen.getByLabelText(/doctor/i));

  expect(screen.getByLabelText(/speciality/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/experience/i)).toBeInTheDocument();
});

test("submits signup form successfully", async () => {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      ok: true,
      json: () =>
        Promise.resolve({
          authtoken: "fake-token",
        }),
    } as Response)
  );

  render(<SignUp />);

  fireEvent.click(screen.getByLabelText(/patient/i));

  fireEvent.change(screen.getByLabelText(/name/i), {
    target: { value: "John Doe" },
  });

  fireEvent.change(screen.getByLabelText(/phone/i), {
    target: { value: "9876543210" },
  });

  fireEvent.change(screen.getByLabelText(/email/i), {
    target: { value: "john@example.com" },
  });

  fireEvent.change(screen.getByLabelText(/password/i), {
    target: { value: "password123" },
  });

  fireEvent.click(screen.getByRole("button", { name: /submit/i }));

  await waitFor(() => {
    expect(global.fetch).toHaveBeenCalled();
  });
});
