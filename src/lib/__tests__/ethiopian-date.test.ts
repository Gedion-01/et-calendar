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
    const gregorianDate = new Date(Date.UTC(2023, 8, 11)); // September 11, 2023
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
    expect(gregorianDate.toISOString().split("T")[0]).toBe("2023-09-12");
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
});
