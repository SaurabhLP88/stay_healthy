import { render, screen } from "@testing-library/react";
import About from "./About";

describe("About Page", () => {
  test("renders About StayHealthy heading", () => {
    render(<About />);

    expect(
      screen.getByRole("heading", { name: /About StayHealthy/i })
    ).toBeInTheDocument();
  });

  test("renders intro description", () => {
    render(<About />);

    expect(
      screen.getByText(/digital healthcare platform created to simplify/i)
    ).toBeInTheDocument();
  });

  test("renders 'How StayHealthy Works' section", () => {
    render(<About />);

    expect(
      screen.getByRole("heading", { name: /How StayHealthy Works/i })
    ).toBeInTheDocument();
  });

  test("renders usage steps correctly", () => {
    render(<About />);

    expect(screen.getByText("Create an Account")).toBeInTheDocument();
    expect(screen.getByText("Find & Book Doctors")).toBeInTheDocument();
    expect(screen.getByText("Manage Everything")).toBeInTheDocument();
  });

  test("renders 'What You Can Do' list", () => {
    render(<About />);

    expect(
      screen.getByRole("heading", { name: /What You Can Do on StayHealthy/i })
    ).toBeInTheDocument();

    expect(
      screen.getByText(/Discover doctors and healthcare services/i)
    ).toBeInTheDocument();

    expect(
      screen.getByText(/Receive timely updates and notifications/i)
    ).toBeInTheDocument();
  });

  test("renders vision section", () => {
    render(<About />);

    expect(
      screen.getByRole("heading", { name: /Our Vision/i })
    ).toBeInTheDocument();

    expect(
      screen.getByText(/make healthcare more accessible and organized/i)
    ).toBeInTheDocument();
  });
});
