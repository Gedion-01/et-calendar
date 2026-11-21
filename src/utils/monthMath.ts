import { EthiopianDate } from "../lib/ethiopian-date";

/** First day of the month `count` months after `date`. */
export function addMonths(date: Date, count: number): Date {
  return new Date(date.getFullYear(), date.getMonth() + count, 1);
}

/** Signed distance in Gregorian months between the firsts of `a` and `b`. */
export function monthDistance(a: Date, b: Date): number {
  return (a.getFullYear() - b.getFullYear()) * 12 + (a.getMonth() - b.getMonth());
}

/** Ethiopian month shifted by `count` (13 months per year, Pagume included). */
export function addEthiopianMonths(
  etDate: EthiopianDate.EtDate,
  count: number
): EthiopianDate.EtDate {
  const index = etDate.Month - 1 + count;
  const yearOffset = Math.floor(index / 13);
  const month = ((index % 13) + 13) % 13 + 1;
  return { ...etDate, Year: etDate.Year + yearOffset, Month: month, Day: 1 };
}

/** Signed distance in Ethiopian months between `a` and `b`. */
export function ethiopianMonthDistance(
  a: EthiopianDate.EtDate,
  b: EthiopianDate.EtDate
): number {
  return (a.Year - b.Year) * 13 + (a.Month - b.Month);
}
