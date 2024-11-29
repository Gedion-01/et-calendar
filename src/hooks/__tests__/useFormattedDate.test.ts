import { renderHook } from "@testing-library/react";
import { useFormattedDate } from "../useFormattedDate";

describe("useFormattedDate", () => {
  const date = new Date(2017, 2, 11, 14, 30, 0); // March 11, 2017, 14:30:00 local time
  const dateUTC = new Date(Date.UTC(2017, 2, 11, 14, 30, 0)); // March 11, 2017, 14:30:00 UTC

  it("formats date with specified format (yyyy-MM-dd)", () => {
    const { result } = renderHook(() => useFormattedDate(date, "yyyy-MM-dd"));
    expect(result.current).toBe("2017-03-11");
  });

  it("formats date with specified format (dd/MM/yyyy)", () => {
    const { result } = renderHook(() => useFormattedDate(date, "dd/MM/yyyy"));
    expect(result.current).toBe("11/03/2017");
  });

  it("formats date with default format when no format is specified", () => {
    const { result } = renderHook(() => useFormattedDate(date));
    expect(result.current).toBe("2017-03-11");
  });

  it("returns empty string when date is undefined", () => {
    const { result } = renderHook(() =>
      useFormattedDate(undefined, "yyyy-MM-dd")
    );
    expect(result.current).toBe("");
  });

  it("formats date in UTC when zone is 'utc'", () => {
    const { result } = renderHook(() =>
      useFormattedDate(dateUTC, "yyyy-MM-dd", "utc")
    );
    expect(result.current).toBe("2017-03-11");
  });

  it("formats date in local time when zone is not specified", () => {
    const { result } = renderHook(() => useFormattedDate(date, "yyyy-MM-dd"));
    expect(result.current).toBe("2017-03-11");
  });
});
