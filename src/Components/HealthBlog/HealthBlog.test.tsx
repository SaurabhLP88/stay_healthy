import { render, screen, fireEvent } from "@testing-library/react";
import HealthBlog from "./HealthBlog";

// ✅ Mock API_URL fetches
beforeEach(() => {
  global.fetch = jest.fn((input: RequestInfo | URL) => {
    const url = input.toString();
    if (String(url).includes("/api/healthblog")) {
      return Promise.resolve({
        json: () =>
          Promise.resolve([
            {
              category: "Fitness",
              title: "Morning Stretch",
              description: "Stretching improves flexibility",
              thumbnail: "exercise.svg",
              videofile: "Physician_Doctor.mp4",
            },
          ]),
      } as Response);
    }

    if (String(url).includes("/api/healthtips")) {
      return Promise.resolve({
        json: () =>
          Promise.resolve([
            {
              title: "Drink Water",
              description: "Stay hydrated daily",
            },
          ]),
      } as Response);
    }

    return Promise.resolve({
      json: () => Promise.resolve([]),
    } as Response);
  });
});

// ✅ Mock dynamic image/video requires
jest.mock("../../assets/images/exercise.svg", () => "mock-image");
jest.mock("../../assets/videos/Physician_Doctor.mp4", () => "mock-video");

describe("HealthBlog", () => {
  test("renders page title and search box", () => {
    render(<HealthBlog />);

    expect(screen.getByText(/health blog/i)).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(/search videos and tips/i)
    ).toBeInTheDocument();
  });

  test("loads and displays health videos", async () => {
    render(<HealthBlog />);

    expect(await screen.findByText("Morning Stretch")).toBeInTheDocument();
    expect(
      screen.getByText(/stretching improves flexibility/i)
    ).toBeInTheDocument();
  });

  test("filters videos by category", async () => {
    render(<HealthBlog />);

    fireEvent.click(screen.getByText("Fitness"));

    expect(await screen.findByText("Morning Stretch")).toBeInTheDocument();
  });

  test("shows daily health tips", async () => {
    render(<HealthBlog />);

    expect(await screen.findByText("Drink Water")).toBeInTheDocument();
  });

  test("opens video modal on watch click", async () => {
    render(<HealthBlog />);

    const watchButton = await screen.findByRole("button", {
      name: /watch video/i,
    });

    fireEvent.click(watchButton);
    expect(
        await screen.findByTestId("health-video")
    ).toBeInTheDocument();
    });
});
