export namespace EthiopianDate {
  const oneHour = 60 * 60 * 1000;
  const oneDay = 24 * oneHour;
  const oneYear = 365 * oneDay;
  const oneLeapYear = 366 * oneDay;
  const fourYears = 3 * oneYear + oneLeapYear;

  /**
   * Meskerem 1, 1964 E.C. corresponds to September 12, 1971 G.C. It is stored
   * as a UTC day number (days since 1970-01-01) so every conversion below can
   * be performed in whole calendar days, independently of the local UTC offset
   * and of daylight-saving transitions.
   */
  const ethiopianEpochDay = Math.floor(Date.UTC(1971, 8, 12) / oneDay);

  export const minEurDate = new Date(1900, 2, 1);
  export const maxEurDate = new Date(2100, 1, 1);

  export interface EtDate {
    Day: number;
    Month: number;
    Year: number;
  }

  export interface EtDateTime extends EtDate {
    hours: number;
    minutes: number;
    seconds?: number;
  }

  export const shortDays = ["እሑ", "ሰኞ", "ማክ", "ረቡ", "ሐሙ", "ዓር", "ቅዳ"];
  export const longDays = ["እሑድ", "ሰኞ", "ማክሰኞ", "ረቡዕ", "ሐሙስ", "ዓርብ", "ቅዳሜ"];

  export const ethMonths = [
    "መስከረም",
    "ጥቅምት",
    "ህዳር",
    "ታህሳስ",
    "ጥር",
    "የካቲት",
    "መጋቢት",
    "ሚያዚያ",
    "ግንቦት",
    "ሰኔ",
    "ሐምሌ",
    "ነሀሴ",
    "ጳጉሜ",
  ];

  export const ethMonthsLatin = [
    "Meskerem",
    "Tikimt",
    "Hidar",
    "Tahsas",
    "Tir",
    "Yekatit",
    "Megabit",
    "Meyazya",
    "Ginbot",
    "Sene",
    "Hamle",
    "Nehase",
    "Pagume",
  ];

  /** Day number (days since 1970-01-01) of the local calendar date of `date`. */
  function toDayNumber(date: Date): number {
    return Math.floor(
      Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) / oneDay
    );
  }

  /** Local midnight of the Gregorian date `dayNumber` days after 1970-01-01. */
  function fromDayNumber(dayNumber: number): Date {
    const utcMidnight = new Date(dayNumber * oneDay);
    return new Date(
      utcMidnight.getUTCFullYear(),
      utcMidnight.getUTCMonth(),
      utcMidnight.getUTCDate()
    );
  }

  /** Whole days from Meskerem 1, 1964 to `etDate` (negative before the epoch). */
  function ethiopianDayOffset(etDate: EtDate): number {
    const yearsSinceEpoch = etDate.Year - 1964;
    const cycles = Math.floor(yearsSinceEpoch / 4);
    const remainingYears = yearsSinceEpoch - cycles * 4;
    return (
      cycles * (fourYears / oneDay) +
      remainingYears * (oneYear / oneDay) +
      (etDate.Month - 1) * 30 +
      (etDate.Day - 1)
    );
  }

  export function isLeapYearEt(y: number): boolean {
    return y % 4 === 3;
  }

  export function ethiopianMonthLength(m: number, y: number): number {
    if (m === 13) {
      return isLeapYearEt(y) ? 6 : 5;
    }
    return 30;
  }

  export function toEth(gregorianDate: Date): EtDate {
    const dayNumber = toDayNumber(gregorianDate);
    if (
      dayNumber < toDayNumber(minEurDate) ||
      dayNumber > toDayNumber(maxEurDate)
    ) {
      throw new Error("Date out of supported range");
    }

    const difference = (dayNumber - ethiopianEpochDay) * oneDay;

    const fourYearsPassed = Math.floor(difference / fourYears);
    let remainingYears = Math.floor(
      (difference - fourYearsPassed * fourYears) / oneYear
    );
    if (remainingYears === 4) remainingYears = 3;

    const remainingMonths = Math.floor(
      (difference - fourYearsPassed * fourYears - remainingYears * oneYear) /
      (30 * oneDay)
    );
    const remainingDays = Math.floor(
      (difference -
        fourYearsPassed * fourYears -
        remainingYears * oneYear -
        remainingMonths * 30 * oneDay) /
      oneDay
    );

    return {
      Year: remainingYears + 4 * fourYearsPassed + 1964,
      Month: remainingMonths + 1,
      Day: remainingDays + 1,
    };
  }

  export function toEthDateTime(gregorianDate: Date): EtDateTime {
    const base = toEth(gregorianDate);

    return {
      ...base,
      hours: gregorianDate.getHours(),
      minutes: gregorianDate.getMinutes(),
      seconds: gregorianDate.getSeconds(),
    };
  }

  /**
   * Returns the Gregorian date for `ethDate` as a Date at local midnight, so
   * `getFullYear() / getMonth() / getDate() / getDay()` describe the correct
   * calendar day in every time zone.
   */
  export function toGreg(ethDate: EtDate): Date {
    if (ethDate.Month === 13) {
      const maxDate = ethDate.Year % 4 === 3 ? 6 : 5;
      if (ethDate.Day > maxDate) {
        throw new Error(
          `Pagume has only ${maxDate} days in year ${ethDate.Year}`
        );
      }
    }

    const initialGregorianDay = ethiopianEpochDay + ethiopianDayOffset(ethDate);

    for (let count = -8; count <= 8; count++) {
      const candidateDay = initialGregorianDay + count;
      const diff = (candidateDay - ethiopianEpochDay) * oneDay;

      const fourYearsPassed = Math.floor(diff / fourYears);
      let remainingYears = Math.floor(
        (diff - fourYearsPassed * fourYears) / oneYear
      );
      if (remainingYears === 4) remainingYears = 3;

      const remMonths = Math.floor(
        (diff - fourYearsPassed * fourYears - remainingYears * oneYear) /
        (30 * oneDay)
      );
      const remDays = Math.floor(
        (diff -
          fourYearsPassed * fourYears -
          remainingYears * oneYear -
          remMonths * 30 * oneDay) /
        oneDay
      );

      if (ethDate.Day === remDays + 1 && ethDate.Month === remMonths + 1) {
        return fromDayNumber(candidateDay);
      }
    }

    throw new Error("Could not find a corresponding Gregorian date");
  }

  export function toGregDateTime(ethDateTime: EtDateTime): Date {
    const base = toGreg({
      Day: ethDateTime.Day,
      Month: ethDateTime.Month,
      Year: ethDateTime.Year,
    });

    base.setHours(
      ethDateTime.hours,
      ethDateTime.minutes,
      ethDateTime.seconds ?? 0,
      0,
    );

    return base;
  }

  export function getEtMonthName(
    m: number,
    useAmharic: boolean = true
  ): string {
    if (m > 0 && m <= 13) {
      return useAmharic ? ethMonths[m - 1] : ethMonthsLatin[m - 1];
    }
    return "";
  }

  export function formatEtDate(
    date: EtDate,
    locale: "AMH" | "EN" = "EN"
  ): string {
    const monthName = getEtMonthName(date.Month, locale === "AMH");
    return `${monthName} ${date.Day}, ${date.Year}`;
  }
}
