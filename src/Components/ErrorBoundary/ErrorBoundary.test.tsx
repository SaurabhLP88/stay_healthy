import { render, screen } from "@testing-library/react";
import ErrorBoundary from "./ErrorBoundary";

// ❌ Component that throws error
const ErrorThrower = () => {
  throw new Error("Test error");
};

describe("ErrorBoundary", () => {
  beforeEach(() => {
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    (console.error as jest.Mock).mockRestore();
  });

  test("renders children when there is no error", () => {
    render(
      <ErrorBoundary>
        <div>Normal Content</div>
      </ErrorBoundary>
    );

    expect(screen.getByText("Normal Content")).toBeInTheDocument();
  });

  test("renders fallback UI when child throws error", () => {
    render(
      <ErrorBoundary>
        <ErrorThrower />
      </ErrorBoundary>
    );

    expect(
      screen.getByText(/something went wrong/i)
    ).toBeInTheDocument();

    expect(
      screen.getByText(/please try again or refresh the page/i)
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: /refresh page/i })
    ).toBeInTheDocument();
  });
});
