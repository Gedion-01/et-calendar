import { EthiopianDate } from "../ethiopian-date";

describe("EthiopianDate", () => {
  it("should correctly identify leap years", () => {
    expect(EthiopianDate.isLeapYearEt(2011)).toBe(true);
    expect(EthiopianDate.isLeapYearEt(2012)).toBe(false);
  });

  it("should return correct month length", () => {
    expect(EthiopianDate.ethiopianMonthLength(1, 2011)).toBe(30);
    expect(EthiopianDate.ethiopianMonthLength(13, 2011)).toBe(6);
    expect(EthiopianDate.ethiopianMonthLength(13, 2012)).toBe(5);
  });

  it("should convert Gregorian date to Ethiopian date", () => {
    // Build the Gregorian date in local time: a UTC-midnight instant is the
    // previous local calendar day in time zones west of UTC.
    const gregorianDate = new Date(2023, 8, 11); // September 11, 2023
    const ethiopianDate = EthiopianDate.toEth(gregorianDate);
    expect(ethiopianDate).toEqual({ Year: 2015, Month: 13, Day: 6 });
  });

  it("should convert Ethiopian date to Gregorian date", () => {
    const ethiopianDate: EthiopianDate.EtDate = {
      Year: 2016,
      Month: 1,
      Day: 1,
    };
    const gregorianDate = EthiopianDate.toGreg(ethiopianDate);

    // Assert on the local calendar fields (an ISO string is UTC based and would
    // report the previous day for time zones east of UTC).
    expect(gregorianDate.getFullYear()).toBe(2023);
    expect(gregorianDate.getMonth()).toBe(8); // September (0-based)
    expect(gregorianDate.getDate()).toBe(12);
  });

  it("should return local midnight for the converted Gregorian date", () => {
    const gregorianDate = EthiopianDate.toGreg({
      Year: 2016,
      Month: 1,
      Day: 1,
    });

    expect(gregorianDate.getHours()).toBe(0);
    expect(gregorianDate.getMinutes()).toBe(0);
    expect(gregorianDate.getSeconds()).toBe(0);
    expect(gregorianDate.getMilliseconds()).toBe(0);
  });

  it("should map an Ethiopian date to the correct Gregorian weekday", () => {
    // Hidar 11, 2017 E.C. is Wednesday, November 20, 2024 G.C.
    const gregorianDate = EthiopianDate.toGreg({
      Year: 2017,
      Month: 3,
      Day: 11,
    });

    expect(gregorianDate.getFullYear()).toBe(2024);
    expect(gregorianDate.getMonth()).toBe(10); // November (0-based)
    expect(gregorianDate.getDate()).toBe(20);
    expect(gregorianDate.getDay()).toBe(3); // Wednesday
  });

  it("should round-trip every Ethiopian date through the Gregorian calendar", () => {
    for (let year = 2000; year <= 2030; year++) {
      for (let month = 1; month <= 13; month++) {
        const monthLength = EthiopianDate.ethiopianMonthLength(month, year);

        for (let day = 1; day <= monthLength; day++) {
          const ethiopianDate = { Year: year, Month: month, Day: day };

          expect(
            EthiopianDate.toEth(EthiopianDate.toGreg(ethiopianDate))
          ).toEqual(ethiopianDate);
        }
      }
    }
  });

  it("should round-trip every Gregorian day back to the same calendar day", () => {
    const end = new Date(2026, 11, 31);

    for (
      let cursor = new Date(2020, 0, 1);
      cursor <= end;
      cursor.setDate(cursor.getDate() + 1)
    ) {
      const gregorianDate = new Date(
        cursor.getFullYear(),
        cursor.getMonth(),
        cursor.getDate()
      );
      const ethiopianDate = EthiopianDate.toEth(gregorianDate);
      const converted = EthiopianDate.toGreg(ethiopianDate);

      expect([
        converted.getFullYear(),
        converted.getMonth(),
        converted.getDate(),
      ]).toEqual([
        gregorianDate.getFullYear(),
        gregorianDate.getMonth(),
        gregorianDate.getDate(),
      ]);
    }
  });

  it("should return correct month name in Amharic", () => {
    expect(EthiopianDate.getEtMonthName(1, true)).toBe("መስከረም");
    expect(EthiopianDate.getEtMonthName(13, true)).toBe("ጳጉሜ");
  });

  it("should return correct month name in Latin", () => {
    expect(EthiopianDate.getEtMonthName(1, false)).toBe("Meskerem");
    expect(EthiopianDate.getEtMonthName(13, false)).toBe("Pagume");
  });

  it("should format Ethiopian date correctly in Amharic", () => {
    const ethiopianDate: EthiopianDate.EtDate = {
      Year: 2016,
      Month: 1,
      Day: 1,
    };
    const formattedDate = EthiopianDate.formatEtDate(ethiopianDate, "AMH");
    expect(formattedDate).toBe("መስከረም 1, 2016");
  });

  it("should format Ethiopian date correctly in English", () => {
    const ethiopianDate: EthiopianDate.EtDate = {
      Year: 2016,
      Month: 1,
      Day: 1,
    };
    const formattedDate = EthiopianDate.formatEtDate(ethiopianDate, "EN");
    expect(formattedDate).toBe("Meskerem 1, 2016");
  });

  it("should throw an error for invalid Ethiopian date in a non-leap year", () => {
    const invalidEthiopianDate: EthiopianDate.EtDate = {
      Year: 2016,
      Month: 13,
      Day: 6,
    };
    expect(() => EthiopianDate.toGreg(invalidEthiopianDate)).toThrow(
      "Pagume has only 5 days in year 2016"
    );
  });

  it("should throw an error for invalid Ethiopian date in a leap year", () => {
    const invalidEthiopianDate: EthiopianDate.EtDate = {
      Year: 2015,
      Month: 13,
      Day: 7,
    };
    expect(() => EthiopianDate.toGreg(invalidEthiopianDate)).toThrow(
      "Pagume has only 6 days in year 2015"
    );
  });

  it("should convert Gregorian datetime to Ethiopian EtDateTime with time preserved", () => {
    const gregorianDate = new Date(Date.UTC(2023, 8, 11, 15, 30, 45));

    const baseEthiopianDate = EthiopianDate.toEth(gregorianDate);
    const ethiopianDateTime = EthiopianDate.toEthDateTime(gregorianDate);

    expect(ethiopianDateTime.Year).toBe(baseEthiopianDate.Year);
    expect(ethiopianDateTime.Month).toBe(baseEthiopianDate.Month);
    expect(ethiopianDateTime.Day).toBe(baseEthiopianDate.Day);

    expect(ethiopianDateTime.hours).toBe(gregorianDate.getHours());
    expect(ethiopianDateTime.minutes).toBe(gregorianDate.getMinutes());
    expect(ethiopianDateTime.seconds).toBe(gregorianDate.getSeconds());
  });

  it("should convert Ethiopian EtDateTime to Gregorian datetime with time preserved", () => {
    const ethiopianDateTime: EthiopianDate.EtDateTime = {
      Year: 2016,
      Month: 1,
      Day: 1,
      hours: 10,
      minutes: 15,
      seconds: 30,
    };

    const gregorianDateTime = EthiopianDate.toGregDateTime(ethiopianDateTime);

    expect(gregorianDateTime.getFullYear()).toBe(2023);
    expect(gregorianDateTime.getMonth()).toBe(8); // September (0-based)
    expect(gregorianDateTime.getDate()).toBe(12);

    expect(gregorianDateTime.getHours()).toBe(10);
    expect(gregorianDateTime.getMinutes()).toBe(15);
    expect(gregorianDateTime.getSeconds()).toBe(30);
  });
});
