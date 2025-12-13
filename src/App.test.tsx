import { render, screen } from '@testing-library/react';
import App from './App';

test("renders StayHealthy app", () => {
  render(<App />);
  expect(screen.getByText(/StayHealthy/i)).toBeInTheDocument();
});