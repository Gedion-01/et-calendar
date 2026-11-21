import { fireEvent, render, screen } from "@testing-library/react";
import { DatePicker } from "../../DatePicker/DatePicker";

describe("PopoverPanel", () => {
  it("portals the open panel to document.body", () => {
    render(
      <DatePicker
        selectedDate={new Date(2026, 10, 15)}
        onDateChange={() => {}}
        showCalendars="gregorian"
      />
    );

    expect(document.querySelector(".popover-panel")).toBeNull();

    fireEvent.click(screen.getByRole("button"));

    const panel = document.querySelector(".popover-panel");
    expect(panel).not.toBeNull();
    // Anchored to <body> so a transformed/filtered ancestor cannot become the
    // containing block of the `position: fixed` panel and shift it.
    expect(panel?.parentElement).toBe(document.body);
  });

  it("positions itself against the trigger rect, not the panel's own rect", () => {
    render(
      <DatePicker
        selectedDate={new Date(2026, 10, 15)}
        onDateChange={() => {}}
        showCalendars="gregorian"
      />
    );

    fireEvent.click(screen.getByRole("button"));
    const panel = document.querySelector(".popover-panel") as HTMLElement;

    expect(panel.style.position).toBe("fixed");
    expect(panel.dataset.placement).toBe("bottom");
  });
});
