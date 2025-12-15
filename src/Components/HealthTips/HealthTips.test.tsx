import { render, screen } from "@testing-library/react";
import HealthTips from "./HealthTips";

jest.mock("../../assets/images/water.svg", () => "water.svg");
jest.mock("../../assets/images/meal.svg", () => "meal.svg");
jest.mock("../../assets/images/exercise.svg", () => "exercise.svg");

describe("HealthTips", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () =>
          Promise.resolve([
            {
              title: "Stay Hydrated",
              description: "Drink water daily",
              image: "water.svg",
            },
            {
              title: "Eat Healthy",
              description: "Balanced meals are important",
              image: "meal.svg",
            },
          ]),
      } as Response)
    );
  });

  test("renders Health Tips page title and description", async () => {
    render(<HealthTips />);

    // ⬇️ WAIT for useEffect to complete
    expect(
      await screen.findByRole("heading", { name: /Health Tips/i })
    ).toBeInTheDocument();

    expect(
      screen.getByText(/Small daily habits can make a big difference/i)
    ).toBeInTheDocument();
  });

  test("renders Health Tips fetched from API", async () => {
    render(<HealthTips />);

    expect(
      await screen.findByText(/Stay Hydrated/i)
    ).toBeInTheDocument();

    expect(
      screen.getByText(/Drink water daily/i)
    ).toBeInTheDocument();

    expect(
      screen.getByText(/Eat Healthy/i)
    ).toBeInTheDocument();
  });

  test("renders empty state when API returns empty list", async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      json: async () => [],
    });

    render(<HealthTips />);

    expect(
      await screen.findByRole("heading", { name: /Health Tips/i })
    ).toBeInTheDocument();
  });
});
