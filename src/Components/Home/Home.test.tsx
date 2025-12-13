import { render, screen, within, act } from "@testing-library/react";
import Home from "./Home";

beforeEach(() => {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      json: () => Promise.resolve(null),
    } as Response)
  );
});

// Mock Navbar
jest.mock("../Navbar/Navbar", () => (props: any) => (
  <div data-testid="navbar">
    Navbar - {props.username}
  </div>
));

// Mock Footer
jest.mock("../Footer/Footer", () => () => (
  <div data-testid="footer">Footer</div>
));

// Mock Notification
jest.mock("../Notification/Notification", () => (props: any) => (
  <div data-testid="notification">
    <h3>{props.title}</h3>
    <div
      data-testid="notification-message"
      dangerouslySetInnerHTML={{ __html: props.message }}
    />
    <button onClick={props.onClose}>Close</button>
  </div>
));

test("renders navbar, footer and children", () => {
  render(
    <Home loggedIn={false} setLoggedIn={jest.fn()}>
      <div>Child Content</div>
    </Home>
  );

  expect(screen.getByTestId("navbar")).toBeInTheDocument();
  expect(screen.getByTestId("footer")).toBeInTheDocument();
  expect(screen.getByText("Child Content")).toBeInTheDocument();
});

test("syncs username from sessionStorage", () => {
  sessionStorage.setItem("name", "Saurabh");

  render(
    <Home loggedIn={true} setLoggedIn={jest.fn()}>
      <div />
    </Home>
  );

  expect(screen.getByText(/saurabh/i)).toBeInTheDocument();
});

test("loads existing notification when logged in", async () => {
  sessionStorage.setItem("auth-token", "fake-token");

  global.fetch = jest.fn(() =>
    Promise.resolve({
      json: () =>
        Promise.resolve({
          title: "Appointment Booked",
          message: "Your appointment is confirmed",
        }),
    } as Response)
  );

  render(
    <Home loggedIn={true} setLoggedIn={jest.fn()}>
      <div />
    </Home>
  );

  expect(await screen.findByText(/appointment booked/i)).toBeInTheDocument();
  expect(await screen.findByText(/your appointment is confirmed/i)).toBeInTheDocument();
});

test("shows notification when new-notification event fires", async () => {
  render(
    <Home loggedIn={true} setLoggedIn={jest.fn()}>
      <div />
    </Home>
  );

  const event = new CustomEvent("new-notification", {
    detail: {
      title: "New Alert",
      message: "Test notification message",
    },
  });

  await act(async () => {
    await Promise.resolve(); // ⬅️ allow useEffect to register listeners
    });

    window.dispatchEvent(event);

  const notification = await screen.findByTestId("notification");

  expect(
    within(notification).getByTestId("notification-message")
  ).toHaveTextContent("Test notification message");

  expect(within(notification).getByText("New Alert")).toBeInTheDocument();
});



