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

// Mock FormEnabler
jest.mock("./FormEnabler", () => ({
  toggleEnable: jest.fn(),
  toggleDisable: jest.fn()
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
    // Reset fetch mock
    global.fetch.mockClear();
    // Reset navigate mock
    mockNavigate.mockClear();
  });

  test("renders login form", () => {
    renderLogin();
    expect(screen.getByPlaceholderText("Username")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Password")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /login/i })).toBeInTheDocument();
  });

  it("handles successful login", async () => {
    // Mock successful fetch response
    global.fetch.mockResolvedValueOnce({
      json: async () => ({ 
        accessToken: "fake-token",
        access_token: "fake-token" 
      })
    });

    render(
      <BrowserRouter>
        <LoginContext.Provider value={{ login: jest.fn() }}>
          <Login />
        </LoginContext.Provider>
      </BrowserRouter>
    );

    // Fill form
    fireEvent.change(screen.getByPlaceholderText(/username/i), {
      target: { value: "testuser" }
    });
    fireEvent.change(screen.getByPlaceholderText(/password/i), {
      target: { value: "testpass" }
    });

    // Submit form
    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    // Wait for success message
    await waitFor(() => {
      expect(screen.getByText(/login successful/i)).toBeInTheDocument();
    });
  });

  it("handles login failure", async () => {
    // Mock failed fetch response
    global.fetch.mockResolvedValueOnce({
      json: async () => ({ 
        message: "Invalid username or password" 
      })
    });

    render(
      <BrowserRouter>
        <LoginContext.Provider value={{ login: jest.fn() }}>
          <Login />
        </LoginContext.Provider>
      </BrowserRouter>
    );

    // Fill and submit form
    fireEvent.change(screen.getByPlaceholderText(/username/i), {
      target: { value: "wronguser" }
    });
    fireEvent.change(screen.getByPlaceholderText(/password/i), {
      target: { value: "wrongpass" }
    });

    // Submit form
    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    // Verify error message
    await waitFor(() => {
      expect(screen.getByText(/username\/password is incorrect/i)).toBeInTheDocument();
    });
  });
});
