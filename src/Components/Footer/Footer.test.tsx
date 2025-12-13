import { render, screen } from "@testing-library/react";
import Footer from "./Footer";

describe("Footer component", () => {
  test("renders footer text with current year", () => {
    const year = new Date().getFullYear();

    render(<Footer />);

    expect(
      screen.getByText(new RegExp(`© ${year} StayHealthy`, "i"))
    ).toBeInTheDocument();
  });

  test("renders developer GitHub link", () => {
    render(<Footer />);

    const link = screen.getByRole("link", { name: /saurabh lakhanpal/i });

    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute(
      "href",
      "https://github.com/SaurabhLP88"
    );
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
  });
});
