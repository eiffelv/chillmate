import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import JournalPage from "./journal";
import { LoginContext } from "./LoginContext";

// Mock scrollIntoView
window.HTMLElement.prototype.scrollIntoView = jest.fn();

// Mock API response format
const mockEntries = [
  { 
    Title: "Test Entry 1", 
    Content: "Content 1" 
  },
  { 
    Title: "Test Entry 2", 
    Content: "Content 2" 
  }
];

// Mock fetch with proper response structure
const mockFetch = (responseData) => {
  return jest.fn().mockImplementation(() =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve(responseData)
    })
  );
};

describe('JournalPage', () => {
  beforeEach(() => {
    global.fetch = mockFetch(mockEntries);
    localStorage.setItem("accessToken", "test-token");
  });

  afterEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  test("renders Journal Page", async () => {
    render(
        <LoginContext.Provider value={{ isLoggedIn: true }}>
            <JournalPage />
        </LoginContext.Provider>
    );

    expect(screen.getByText(/Journal/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Search journal.../i)).toBeInTheDocument();
    expect(screen.getByText(/\+/i)).toBeInTheDocument();

    await waitFor(() => {
        expect(screen.getByText(/Test Entry 1/i)).toBeInTheDocument();
    });
  });

  test("creates a new journal entry", async () => {
    // Mock initial empty journal list
    global.fetch = mockFetch([]);
    
    render(
      <LoginContext.Provider value={{ isLoggedIn: true }}>
        <JournalPage />
      </LoginContext.Provider>
    );
  
    // Open add form
    fireEvent.click(screen.getByText(/\+/i));
  
    // Fill form fields
    const titleInput = screen.getByPlaceholderText(/Title/i);
    const contentInput = screen.getByPlaceholderText(/Write your journal/i);
  
    fireEvent.change(titleInput, { target: { value: "New Entry" } });
    fireEvent.change(contentInput, { target: { value: "New Content" } });
  
    // Mock successful journal creation
    global.fetch = mockFetch({
      Title: "New Entry",
      Content: "New Content"
    });
  
    // Submit form
    const saveButton = screen.getByText('Save');
    fireEvent.click(saveButton);
  
    // Wait for entry to appear in list
    await waitFor(() => {
      expect(screen.getByText(/New Content/i)).toBeInTheDocument();
    });
  });
});