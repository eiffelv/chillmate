import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { LoginContext } from "./LoginContext";
import Login from "./login";

// Mock the fetch function
global.fetch = jest.fn();

// Mock the navigate function
const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

// Helper function to render the Login component with required providers
const renderLogin = () => {
  const mockLogin = jest.fn();
  render(
    <BrowserRouter>
      <LoginContext.Provider value={{ login: mockLogin }}>
        <Login />
      </LoginContext.Provider>
    </BrowserRouter>
  );
  return { mockLogin };
};

describe("Login Component", () => {
  beforeEach(() => {
    fetch.mockClear();
    mockNavigate.mockClear();
  });

  test("renders login form", () => {
    renderLogin();
    expect(screen.getByPlaceholderText("Username")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Password")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /login/i })).toBeInTheDocument();
  });

  test("handles successful login", async () => {
    fetch.mockImplementationOnce(() =>
      Promise.resolve({
        json: () =>
          Promise.resolve({
            message: "Login successful",
            access_token: "fake-token",
          }),
      })
    );

    const { mockLogin } = renderLogin();

    fireEvent.change(screen.getByPlaceholderText("Username"), {
      target: { value: "testuser" },
    });
    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { value: "password123" },
    });
    fireEvent.click(screen.getByRole("button", { name: /login/i }));

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalled();
      expect(mockNavigate).toHaveBeenCalledWith("/");
    });
  });

  test("handles failed login", async () => {
    const alertMock = jest.spyOn(window, "alert").mockImplementation(() => {});

    fetch.mockImplementationOnce(() =>
      Promise.resolve({
        json: () =>
          Promise.resolve({ message: "Invalid username or password" }),
      })
    );

    renderLogin();

    fireEvent.change(screen.getByPlaceholderText("Username"), {
      target: { value: "wronguser" },
    });
    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { value: "wrongpass" },
    });
    fireEvent.click(screen.getByRole("button", { name: /login/i }));

    await waitFor(() => {
      expect(alertMock).toHaveBeenCalledWith("Username/password is incorrect");
    });

    alertMock.mockRestore();
  });
});
