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
});
