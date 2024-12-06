import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Profile from "./profile";

describe("Profile Component", () => {
    test("renders profile page", () => {
        render(<Profile />);

        expect(screen.getAllByText("First Name:")).toHaveLength(2);
    });

    test("allows editing and saving profile information", () => {
        render(<Profile />);

        fireEvent.click(screen.getByText("Edit"));

        const firstNameInput = screen.getByDisplayValue("Sneha");
        fireEvent.change(firstNameInput, { target: { value: "NewFirstName" } });

        fireEvent.click(screen.getByText("Save"));

        expect(screen.getByText("NewFirstName")).toBeInTheDocument();
    });
});