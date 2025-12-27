import { render, screen } from "@testing-library/react";
import SelfCheck from "./SelfCheck";

// ---------------- MOCK MethodCard ----------------
jest.mock("./MethodCard", () => {
  return function MockMethodCard(props: any) {
    return (
      <div data-testid="method-card">
        <h3>{props.title}</h3>
        <p>{props.description}</p>
      </div>
    );
  };
});

// ---------------- MOCK ALL IMAGES ----------------
jest.mock("../../assets/images/self.svg", () => "self.svg");
jest.mock("../../assets/images/sleep.svg", () => "sleep.svg");
jest.mock("../../assets/images/water.svg", () => "water.svg");

// ---------------- TESTS ----------------
describe("SelfCheck", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true, // ✅ IMPORTANT
        json: async () => [],
      } as Response)
    );
  });

  test("renders self check header and description", async () => {
    render(<SelfCheck />);

    expect(
      await screen.findByText(/Self Health Checkup/i)
    ).toBeInTheDocument();

    expect(
      screen.getByText(/Regular self-checkups help you stay aware/i)
    ).toBeInTheDocument();
  });

  test("renders self checkup methods from API", async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true, // ✅ IMPORTANT
      json: async () => [
        {
          title: "Heart Rate Check",
          image: "sleep.svg",
          description: "Measure your pulse regularly",
        },
        {
          title: "Breathing Test",
          image: "water.svg",
          description: "Observe breathing patterns",
        },
      ],
    });

    render(<SelfCheck />);

    expect(
      await screen.findByText("Heart Rate Check")
    ).toBeInTheDocument();

    expect(
      screen.getByText("Measure your pulse regularly")
    ).toBeInTheDocument();

    expect(
      screen.getAllByTestId("method-card")
    ).toHaveLength(2);
  });

  test("renders no method cards when API returns empty list", async () => {
    render(<SelfCheck />);

    expect(
      await screen.findByText(/Self Checkup Methods/i)
    ).toBeInTheDocument();

    expect(
      screen.queryAllByTestId("method-card")
    ).toHaveLength(0);
  });
});
