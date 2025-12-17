import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import FindDoctorSearch from "./FindDoctorSearch";

/**
 * Mock react-router-dom hooks
 */
const mockNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
  useLocation: () => ({
    pathname: "/instant-consultation",
  }),
}));

/**
 * Mock specialities list
 */
jest.mock("../../../utils/specialities", () => [
  "Dentist",
  "Cardiologist",
  "Neurologist",
]);

describe("FindDoctorSearch", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const setup = (onSearch?: jest.Mock) => {
    return render(
      <MemoryRouter>
        <FindDoctorSearch onSearch={onSearch} />
      </MemoryRouter>
    );
  };

  it("renders correct title for instant consultation", () => {
    setup();

    expect(
      screen.getByText("Instant Consultation — Connect with a Doctor Now")
    ).toBeInTheDocument();
  });

  it("renders search input", () => {
    setup();

    expect(
      screen.getByPlaceholderText("Search doctors by name or speciality")
    ).toBeInTheDocument();
  });

  it("shows speciality dropdown on input focus", () => {
    setup();

    const input = screen.getByPlaceholderText(
      "Search doctors by name or speciality"
    );

    fireEvent.focus(input);

    expect(screen.getByText("Dentist")).toBeInTheDocument();
    expect(screen.getByText("Cardiologist")).toBeInTheDocument();
    expect(screen.getByText("Neurologist")).toBeInTheDocument();
  });

  it("hides speciality dropdown on input blur", () => {
    setup();

    const input = screen.getByPlaceholderText(
      "Search doctors by name or speciality"
    );

    fireEvent.focus(input);
    fireEvent.blur(input);

    expect(screen.queryByText("Dentist")).not.toBeVisible();
  });

  it("calls onSearch callback when typing", () => {
    const onSearch = jest.fn();
    setup(onSearch);

    const input = screen.getByPlaceholderText(
      "Search doctors by name or speciality"
    );

    fireEvent.change(input, { target: { value: "cardio" } });

    expect(onSearch).toHaveBeenCalledWith("cardio");
  });

  it("updates input value when typing", () => {
    setup();

    const input = screen.getByPlaceholderText(
      "Search doctors by name or speciality"
    ) as HTMLInputElement;

    fireEvent.change(input, { target: { value: "Dentist" } });

    expect(input.value).toBe("Dentist");
  });

  it("navigates to instant consultation with selected speciality", () => {
    setup();

    const input = screen.getByPlaceholderText(
      "Search doctors by name or speciality"
    );

    fireEvent.focus(input);

    fireEvent.mouseDown(screen.getByText("Dentist"));

    expect(mockNavigate).toHaveBeenCalledWith(
      "/instant-consultation?speciality=Dentist"
    );
  });

  it("hides dropdown after selecting a speciality", () => {
    setup();

    const input = screen.getByPlaceholderText(
      "Search doctors by name or speciality"
    );

    fireEvent.focus(input);
    fireEvent.mouseDown(screen.getByText("Dentist"));

    expect(screen.queryByText("Dentist")).not.toBeVisible();
  });
});
