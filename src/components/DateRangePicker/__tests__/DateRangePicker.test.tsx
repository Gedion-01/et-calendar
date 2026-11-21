import { fireEvent, render, screen } from "@testing-library/react";
import { DateRangePicker } from "../DateRangePicker";
import { DateRangePickerProps } from "../../../types";

const day = (d: number) => new Date(2026, 10, d);
const cellFor = (d: number) =>
  screen.getByText(String(d)).closest(".day-cell") as HTMLElement;

const renderPicker = (props: Partial<DateRangePickerProps> = {}) => {
  const onChange = jest.fn();
  render(
    <DateRangePicker
      defaultValue={{ start: day(1) }}
      onChange={onChange}
      showCalendars="gregorian"
      {...props}
    />
  );
  return { onChange };
};

const open = () => fireEvent.click(screen.getByRole("button"));

describe("DateRangePicker", () => {
  it("commits start and end", () => {
    const { onChange } = renderPicker();
    open();

    fireEvent.click(screen.getByText("10"));
    expect(onChange).not.toHaveBeenCalled();

    fireEvent.click(screen.getByText("14"));
    expect(onChange).toHaveBeenCalledWith({ start: day(10), end: day(14) });
  });

  it("restarts when a day before the pending start is picked", () => {
    const { onChange } = renderPicker();
    open();

    fireEvent.click(screen.getByText("10"));
    fireEvent.click(screen.getByText("5"));
    expect(onChange).not.toHaveBeenCalled();

    fireEvent.click(screen.getByText("12"));
    expect(onChange).toHaveBeenCalledWith({ start: day(5), end: day(12) });
  });

  it("paints the band and stays open when closeOnSelect is false", () => {
    renderPicker({ closeOnSelect: false });
    open();

    fireEvent.click(screen.getByText("10"));
    fireEvent.click(screen.getByText("14"));

    expect(document.querySelector(".popover-panel")).not.toBeNull();
    expect(cellFor(12).hasAttribute("data-in-range")).toBe(true);
    expect(cellFor(10).hasAttribute("data-range-start")).toBe(true);
    expect(cellFor(14).hasAttribute("data-range-end")).toBe(true);
  });

  it("closes once the range is complete", () => {
    renderPicker();
    open();

    fireEvent.click(screen.getByText("10"));
    fireEvent.click(screen.getByText("14"));

    expect(document.querySelector(".popover-panel")).toBeNull();
  });

  it("shows the committed range in the trigger", () => {
    renderPicker({ value: { start: day(10), end: day(14) } });

    const trigger = screen.getByRole("button");
    expect(trigger).toHaveTextContent(/Nov 10, 2026/);
    expect(trigger).toHaveTextContent(/Nov 14, 2026/);
  });

  it("never commits a day rejected by disabledDays", () => {
    const { onChange } = renderPicker({
      disabledDays: (d) => d.getDate() === 10,
    });
    open();

    expect((screen.getByText("10") as HTMLButtonElement).disabled).toBe(true);
    fireEvent.click(screen.getByText("10"));
    expect(onChange).not.toHaveBeenCalled();
  });
});
