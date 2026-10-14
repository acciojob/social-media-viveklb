import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import App from "./App";

describe("Social media app", () => {
  it("keeps the fifth reaction at zero and disabled", () => {
    render(<App />);

    const supportButton = screen.getAllByRole("button", { name: /Support 0/i })[0];
    expect(supportButton.disabled).toBe(true);

    fireEvent.click(supportButton);
    expect(supportButton.textContent).toContain("Support");
    expect(supportButton.textContent).toContain("0");
  });

  it("updates a post title and content from its detail page", () => {
    render(<App />);

    fireEvent.click(screen.getAllByRole("link", { name: "View Post" })[0]);
    fireEvent.click(screen.getByRole("button", { name: "Edit" }));
    fireEvent.change(screen.getByLabelText("Title"), { target: { value: "Updated title" } });
    fireEvent.change(screen.getByLabelText("Content"), { target: { value: "Updated content" } });
    fireEvent.click(screen.getByRole("button", { name: "Save Changes" }));

    expect(screen.getByRole("heading", { name: "Updated title" })).toBeTruthy();
    expect(screen.getByText("Updated content")).toBeTruthy();
    expect(screen.getByText("By Alex Morgan")).toBeTruthy();
  });

  it("refreshes notifications from the latest post content", () => {
    render(<App />);

    fireEvent.click(screen.getByRole("link", { name: "Notifications" }));
    expect(screen.queryByText(/shared a post:/)).toBeNull();
    fireEvent.click(screen.getByRole("button", { name: "Refresh Notifications" }));
    expect(screen.getByText("Alex Morgan shared a post: A little inspiration")).toBeTruthy();

    fireEvent.click(screen.getByRole("link", { name: "Posts" }));
    fireEvent.click(screen.getAllByRole("link", { name: "View Post" })[0]);
    fireEvent.click(screen.getByRole("button", { name: "Edit" }));
    fireEvent.change(screen.getByLabelText("Title"), { target: { value: "Updated title" } });
    fireEvent.change(screen.getByLabelText("Content"), { target: { value: "Updated content" } });
    fireEvent.click(screen.getByRole("button", { name: "Save Changes" }));

    fireEvent.click(screen.getByRole("link", { name: "Notifications" }));
    fireEvent.click(screen.getByRole("button", { name: "Refresh Notifications" }));
    expect(screen.getByText("Alex Morgan shared a post: Updated title")).toBeTruthy();
    expect(screen.queryByText("Alex Morgan shared a post: A little inspiration")).toBeNull();
  });
});
