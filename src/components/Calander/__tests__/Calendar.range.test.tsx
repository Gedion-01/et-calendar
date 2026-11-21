import { fireEvent, render, screen } from "@testing-library/react";
import { Calendar } from "../Calendar";

const day = (d: number) => new Date(2026, 10, d);
const cellFor = (d: number) =>
  screen.getByText(String(d)).closest(".day-cell") as HTMLElement;

const renderRange = (
  props: Partial<React.ComponentProps<typeof Calendar>> = {}
) =>
  render(
    <Calendar
      mode="range"
      date={day(15)}
      onChange={() => {}}
      isEthiopian={false}
      rangeStart={day(10)}
      rangeEnd={day(14)}
      {...props}
    />
  );

describe("Calendar range mode", () => {
  it("marks the start, the end and the days in between", () => {
    renderRange();

    expect(cellFor(10).hasAttribute("data-range-start")).toBe(true);
    expect(cellFor(14).hasAttribute("data-range-end")).toBe(true);

    for (const d of [11, 12, 13]) {
      expect(cellFor(d).hasAttribute("data-in-range")).toBe(true);
    }

    expect(cellFor(15).hasAttribute("data-in-range")).toBe(false);
    expect(cellFor(10).hasAttribute("data-in-range")).toBe(false);
    expect(cellFor(14).hasAttribute("data-in-range")).toBe(false);
  });

  it("flags the band as a preview while the end is only hovered", () => {
    renderRange({ rangePreview: true });

    expect(cellFor(12).hasAttribute("data-range-preview")).toBe(true);
  });

  it("reports hovered days so the picker can preview the range", () => {
    const onDayHover = jest.fn();
    renderRange({ onDayHover });

    fireEvent.mouseEnter(screen.getByText("12"));
    expect(onDayHover).toHaveBeenCalledWith(day(12));

    fireEvent.mouseLeave(screen.getByText("12"));
    expect(onDayHover).toHaveBeenLastCalledWith(null);
  });

  it("does not paint a band in single mode", () => {
    render(<Calendar date={day(15)} onChange={() => {}} isEthiopian={false} />);

    expect(document.querySelector("[data-in-range]")).toBeNull();
  });

  it("honours disabledDays", () => {
    renderRange({ disabledDays: (d: Date) => d.getDate() === 12 });

    expect((screen.getByText("12") as HTMLButtonElement).disabled).toBe(true);
    expect((screen.getByText("11") as HTMLButtonElement).disabled).toBe(false);
  });
});
