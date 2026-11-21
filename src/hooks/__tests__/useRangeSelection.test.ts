import { act, renderHook } from "@testing-library/react";
import { useRangeSelection } from "../useRangeSelection";

const day = (d: number) => new Date(2026, 10, d);

describe("useRangeSelection", () => {
  it("commits a range once both ends are picked", () => {
    const onChange = jest.fn();
    const { result } = renderHook(() => useRangeSelection({ onChange }));

    act(() => result.current.selectDay(day(10)));
    expect(result.current.anchor).toEqual(day(10));
    expect(onChange).not.toHaveBeenCalled();

    act(() => result.current.selectDay(day(14)));
    expect(onChange).toHaveBeenCalledWith({ start: day(10), end: day(14) });
    expect(result.current.anchor).toBeNull();
  });

  it("restarts when the second pick is earlier than the start", () => {
    const onChange = jest.fn();
    const { result } = renderHook(() => useRangeSelection({ onChange }));

    act(() => result.current.selectDay(day(10)));
    act(() => result.current.selectDay(day(5)));

    expect(onChange).not.toHaveBeenCalled();
    expect(result.current.anchor).toEqual(day(5));
  });

  it("ignores picks shorter than minNights", () => {
    const onChange = jest.fn();
    const { result } = renderHook(() =>
      useRangeSelection({ onChange, minNights: 2 })
    );

    act(() => result.current.selectDay(day(10)));
    expect(result.current.isDaySelectable(day(11))).toBe(false);
    act(() => result.current.selectDay(day(11)));

    expect(onChange).not.toHaveBeenCalled();
    expect(result.current.anchor).toEqual(day(10));

    act(() => result.current.selectDay(day(12)));
    expect(onChange).toHaveBeenCalledWith({ start: day(10), end: day(12) });
  });

  it("previews the hovered end", () => {
    const { result } = renderHook(() => useRangeSelection({}));

    act(() => result.current.selectDay(day(10)));
    act(() => result.current.setHoveredDay(day(13)));

    expect(result.current.displayStart).toEqual(day(10));
    expect(result.current.displayEnd).toEqual(day(13));
    expect(result.current.isPreviewing).toBe(true);
  });

  it("never selects a day rejected by disabledDays", () => {
    const onChange = jest.fn();
    const { result } = renderHook(() =>
      useRangeSelection({ onChange, disabledDays: (d) => d.getDate() === 10 })
    );

    act(() => result.current.selectDay(day(10)));
    expect(result.current.anchor).toBeNull();

    act(() => result.current.selectDay(day(9)));
    act(() => result.current.selectDay(day(12)));
    expect(onChange).toHaveBeenCalledWith({ start: day(9), end: day(12) });
  });

  it("clamps picks into minDate/maxDate", () => {
    const onChange = jest.fn();
    const { result } = renderHook(() =>
      useRangeSelection({ onChange, minDate: day(10), maxDate: day(20) })
    );

    act(() => result.current.selectDay(day(1)));
    expect(result.current.anchor).toEqual(day(10));

    act(() => result.current.selectDay(day(30)));
    expect(onChange).toHaveBeenCalledWith({ start: day(10), end: day(20) });
  });
});
