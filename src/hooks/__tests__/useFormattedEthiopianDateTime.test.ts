import { renderHook } from "@testing-library/react";
import {
  useFormattedEthiopianDate,
  useFormattedEthiopianDateTime,
} from "../useFormattedEthiopianDateTime";

import { EthiopianDate } from "../../lib/ethiopian-date";

describe("useFormattedEthiopianDate", () => {
  const etDate = { Year: 2017, Month: 3, Day: 11 };

  it("formats Year-Month-Day (yyyy-MM-dd)", () => {
    const { result } = renderHook(() =>
      useFormattedEthiopianDate(etDate, "yyyy-MM-dd")
    );
    expect(result.current).toBe("2017-03-11");
  });

  it("formats Day/Month/Year (dd/MM/yyyy)", () => {
    const { result } = renderHook(() =>
      useFormattedEthiopianDate(etDate, "dd/MM/yyyy")
    );
    expect(result.current).toBe("11/03/2017");
  });

  it("formats Short Month Name Day, Year (MMM dd, yyyy)", () => {
    const { result } = renderHook(() =>
      useFormattedEthiopianDate(etDate, "MMM dd, yyyy")
    );
    expect(result.current).toBe("ህዳር 11, 2017");
  });

  it("formats Full Month Name Day, Year (MMMM dd, yyyy)", () => {
    const { result } = renderHook(() =>
      useFormattedEthiopianDate(etDate, "MMMM dd, yyyy")
    );
    expect(result.current).toBe("ህዳር 11, 2017");
  });

  it("formats Day of Week, Month Day Year (E, MMM dd yyyy)", () => {
    const { result } = renderHook(() =>
      useFormattedEthiopianDate(etDate, "E, MMM dd yyyy")
    );
    expect(result.current).toBe("ረቡ, ህዳር 11 2017");
  });

  it("formats Full Day of Week, Full Month Name Day, Year (EEE, MMMM dd, yyyy)", () => {
    const { result } = renderHook(() =>
      useFormattedEthiopianDate(etDate, "EEE, MMMM dd, yyyy")
    );
    expect(result.current).toBe("ረቡዕ, ህዳር 11, 2017");
  });

  it("formats Full Month Name (MMMM)", () => {
    const { result } = renderHook(() =>
      useFormattedEthiopianDate(etDate, "MMMM")
    );
    expect(result.current).toBe("ህዳር");
  });

  it("formats Short Month Name (MMM)", () => {
    const { result } = renderHook(() =>
      useFormattedEthiopianDate(etDate, "MMM")
    );
    expect(result.current).toBe("ህዳር");
  });

  it("formats Day of Month (dd)", () => {
    const { result } = renderHook(() =>
      useFormattedEthiopianDate(etDate, "dd")
    );
    expect(result.current).toBe("11");
  });

  it("formats Full Day of Week Name (EEE)", () => {
    const { result } = renderHook(() =>
      useFormattedEthiopianDate(etDate, "EEE")
    );
    expect(result.current).toBe("ረቡዕ");
  });

  it("formats Short Day of Week Name (E)", () => {
    const { result } = renderHook(() => useFormattedEthiopianDate(etDate, "E"));
    expect(result.current).toBe("ረቡ");
  });
});

describe("useFormattedEthiopianDateTime", () => {
  const etDateTime: EthiopianDate.EtDateTime = {
    Year: 2017,
    Month: 3,
    Day: 11,
    hours: 0,
    minutes: 0,
    seconds: 0,
  };

  const etDateTimeNight: EthiopianDate.EtDateTime = {
    Year: 2017,
    Month: 3,
    Day: 11,
    hours: 23,
    minutes: 59,
    seconds: 59,
  };

  it("formats 24-hour Time (HH:mm)", () => {
    const { result } = renderHook(() =>
      useFormattedEthiopianDateTime(etDateTime, "HH:mm")
    );
    expect(result.current).toBe("00:00");
  });

  it("formats 12-hour Time with AM/PM (h:mm a)", () => {
    const { result } = renderHook(() =>
      useFormattedEthiopianDateTime(etDateTime, "h:mm a")
    );
    expect(result.current).toBe("12:00 AM");
  });

  it("formats 24-hour Time with Seconds (HH:mm:ss)", () => {
    const { result } = renderHook(() =>
      useFormattedEthiopianDateTime(etDateTime, "HH:mm:ss")
    );
    expect(result.current).toBe("00:00:00");
  });

  it("formats 12-hour Time with Seconds and AM/PM (h:mm:ss a)", () => {
    const { result } = renderHook(() =>
      useFormattedEthiopianDateTime(etDateTime, "h:mm:ss a")
    );
    expect(result.current).toBe("12:00:00 AM");
  });

  it("formats Date and Time (yyyy-MM-dd HH:mm:ss)", () => {
    const { result } = renderHook(() =>
      useFormattedEthiopianDateTime(etDateTime, "yyyy-MM-dd HH:mm:ss")
    );
    expect(result.current).toBe("2017-03-11 00:00:00");
  });

  it("formats Hour (12-hour) (h)", () => {
    const { result } = renderHook(() =>
      useFormattedEthiopianDateTime(etDateTime, "h")
    );
    expect(result.current).toBe("12");
  });

  it("formats Hour (24-hour) (HH)", () => {
    const { result } = renderHook(() =>
      useFormattedEthiopianDateTime(etDateTime, "HH")
    );
    expect(result.current).toBe("00");
  });

  it("formats Minutes (mm)", () => {
    const { result } = renderHook(() =>
      useFormattedEthiopianDateTime(etDateTime, "mm")
    );
    expect(result.current).toBe("00");
  });

  it("formats Seconds (ss)", () => {
    const { result } = renderHook(() =>
      useFormattedEthiopianDateTime(etDateTime, "ss")
    );
    expect(result.current).toBe("00");
  });

  it("formats AM/PM Indicator (a)", () => {
    const { result } = renderHook(() =>
      useFormattedEthiopianDateTime(etDateTime, "a")
    );
    expect(result.current).toBe("AM");
  });

  it("formats AM/PM Indicator (a) for PM", () => {
    const { result } = renderHook(() =>
      useFormattedEthiopianDateTime(etDateTimeNight, "a")
    );
    expect(result.current).toBe("PM");
  });
});
