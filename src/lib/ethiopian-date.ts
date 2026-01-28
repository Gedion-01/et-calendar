export namespace EthiopianDate {
  const oneHour = 60 * 60 * 1000;
  const oneDay = 24 * oneHour;
  const oneYear = 365 * oneDay;
  const oneLeapYear = 366 * oneDay;
  const fourYears = 3 * oneYear + oneLeapYear;
  const globalTimeDifference =
    new Date("December 9, 2012").getTime() -
    new Date("April 1, 2005").getTime();
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
    if (gregorianDate < minEurDate || gregorianDate > maxEurDate) {
      throw new Error("Date out of supported range");
    }

    const referenceDate = new Date(1971, 8, 12); // September 12, 1971
    const difference = gregorianDate.getTime() - referenceDate.getTime();

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

  export function toGreg(ethDate: EtDate): Date {
    if (ethDate.Month === 13) {
      const maxDate = ethDate.Year % 4 === 3 ? 6 : 5;
      if (ethDate.Day > maxDate) {
        throw new Error(
          `Pagume has only ${maxDate} days in year ${ethDate.Year}`
        );
      }
    }

    const initialEuropeanDate =
      new Date(
        Date.UTC(ethDate.Year, ethDate.Month - 1, ethDate.Day)
      ).getTime() + globalTimeDifference;

    for (let count = -8; count <= 8; count++) {
      const eurDate = new Date(initialEuropeanDate + count * oneDay);
      const diff =
        eurDate.getTime() - new Date(Date.UTC(1971, 8, 12)).getTime();
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
        return eurDate;
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
