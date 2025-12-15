import { render, screen, fireEvent } from "@testing-library/react";
import MethodCard from "./MethodCard";

describe("MethodCard", () => {
  const props = {
    title: "Heart Rate Check",
    image: "heart.svg",
    description: "Measure your pulse regularly to monitor heart health.",
  };

  test("renders title, image, and description", () => {
    render(<MethodCard {...props} />);

    expect(
      screen.getByRole("heading", { name: /Heart Rate Check/i })
    ).toBeInTheDocument();

    expect(
      screen.getByAltText(/Heart Rate Check/i)
    ).toBeInTheDocument();

    expect(
      screen.getByText(/Measure your pulse regularly/i)
    ).toBeInTheDocument();
  });

  test("shows Read More button by default", () => {
    render(<MethodCard {...props} />);

    expect(
      screen.getByRole("button", { name: /Read More/i })
    ).toBeInTheDocument();
  });

  test("expands description when Read More is clicked", () => {
    render(<MethodCard {...props} />);

    const button = screen.getByRole("button", { name: /Read More/i });
    fireEvent.click(button);

    expect(
      screen.getByRole("button", { name: /Read Less/i })
    ).toBeInTheDocument();
  });

  test("collapses description when Read Less is clicked", () => {
    render(<MethodCard {...props} />);

    const button = screen.getByRole("button", { name: /Read More/i });
    fireEvent.click(button); // expand
    fireEvent.click(screen.getByRole("button", { name: /Read Less/i })); // collapse

    expect(
      screen.getByRole("button", { name: /Read More/i })
    ).toBeInTheDocument();
  });
});
