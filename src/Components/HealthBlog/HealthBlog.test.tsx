import { render, screen, fireEvent } from "@testing-library/react";
import HealthBlog from "./HealthBlog";

/* ---------------- MOCK FETCH ---------------- */

beforeEach(() => {
  global.fetch = jest.fn((input: RequestInfo | URL) => {
    const url = input.toString();

    if (url.includes("/api/healthblog")) {
      return Promise.resolve({
        ok: true,
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

    if (url.includes("/api/healthtips")) {
      return Promise.resolve({
        ok: true,
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
      ok: true,
      json: () => Promise.resolve([]),
    } as Response);
  });
});

/* ---------------- MOCK ASSETS ---------------- */

jest.mock("../../assets/images/exercise.svg", () => "mock-image");
jest.mock("../../assets/videos/Physician_Doctor.mp4", () => "mock-video");

/* ---------------- TESTS ---------------- */

describe("HealthBlog", () => {
  test("renders page title and search box", async () => {
    render(<HealthBlog />);

    expect(
      await screen.findByRole("heading", { name: /health blog/i })
    ).toBeInTheDocument();

    expect(
      screen.getByPlaceholderText(/search videos and tips/i)
    ).toBeInTheDocument();
  });

  test("loads and displays health videos", async () => {
    render(<HealthBlog />);

    const videoTitle = await screen.findByText("Morning Stretch");
    expect(videoTitle).toBeInTheDocument();

    expect(
      screen.getByText(/stretching improves flexibility/i)
    ).toBeInTheDocument();
  });

  test("filters videos by category", async () => {
    render(<HealthBlog />);

    // wait for video to load
    await screen.findByText("Morning Stretch");

    fireEvent.click(screen.getByText("Fitness"));

    expect(
      await screen.findByText("Morning Stretch")
    ).toBeInTheDocument();
  });

  test("shows daily health tips", async () => {
    render(<HealthBlog />);

    const tipTitle = await screen.findByText("Drink Water");
    expect(tipTitle).toBeInTheDocument();
  });

  test("opens video modal on watch click", async () => {
    render(<HealthBlog />);

    // wait for video card
    await screen.findByText("Morning Stretch");

    const watchButton = screen.getByRole("button", {
      name: /watch video/i,
    });

    fireEvent.click(watchButton);

    expect(
      await screen.findByTestId("health-video")
    ).toBeInTheDocument();
  });
});
