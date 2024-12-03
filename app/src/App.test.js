import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders learn react link", () => {
  render(<App />);
  // Check if the component renders without crashing
  const appElement = screen.getByRole("navigation");
  expect(appElement).toBeInTheDocument();
});
