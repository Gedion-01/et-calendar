import { renderHook } from "@testing-library/react";
import { useFormattedDateTime } from "../useFormattedDateTime";

describe("useFormattedDateTime", () => {
  const date = new Date(Date.UTC(2017, 2, 11, 14, 30, 0)); // March 11, 2017, 14:30:00 UTC
  const dateInLocalTime = new Date(2017, 2, 11, 14, 30, 0); // March 11, 2017, 14:30:00 local time

  it("formats date and time with specified format (yyyy-MM-dd HH:mm:ss)", () => {
    const { result } = renderHook(() =>
      useFormattedDateTime(date, "yyyy-MM-dd HH:mm:ss", "utc")
    );
    expect(result.current).toBe("2017-03-11 14:30:00");
  });

  it("formats date and time with specified format (dd/MM/yyyy HH:mm)", () => {
    const { result } = renderHook(() =>
      useFormattedDateTime(date, "dd/MM/yyyy HH:mm", "utc")
    );
    expect(result.current).toBe("11/03/2017 14:30");
  });

  it("formats date and time with default format when no format is specified", () => {
    const { result } = renderHook(() =>
      useFormattedDateTime(date, undefined, "utc")
    );
    expect(result.current).toBe("2017-03-11 14:30:00");
  });

  it("returns empty string when date is undefined", () => {
    const { result } = renderHook(() =>
      useFormattedDateTime(undefined, "yyyy-MM-dd HH:mm:ss")
    );
    expect(result.current).toBe("");
  });

  it("formats date and time in UTC when zone is 'utc'", () => {
    const { result } = renderHook(() =>
      useFormattedDateTime(date, "yyyy-MM-dd HH:mm:ss", "utc")
    );
    expect(result.current).toBe("2017-03-11 14:30:00");
  });

  it("formats date and time in local time when zone is not specified", () => {
    const { result } = renderHook(() =>
      useFormattedDateTime(dateInLocalTime, "yyyy-MM-dd HH:mm:ss", undefined)
    );
    expect(result.current).toBe("2017-03-11 14:30:00");
  });
});
