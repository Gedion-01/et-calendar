/**
 * Calendar-day ("civil date") helpers.
 *
 * A civil date is a calendar day with no time and no zone attached. Every
 * helper here works on the *local* calendar fields of a `Date` and converts to
 * a day number (days since 1970-01-01) before doing arithmetic, so results are
 * identical in every time zone and never shift across a DST boundary.
 *
 * This is the arithmetic the pickers should use instead of subtracting
 * timestamps or comparing `toISOString()` values.
 */

const ONE_DAY = 24 * 60 * 60 * 1000;

/** Day number (days since 1970-01-01) of the local calendar date of `date`. */
export function toDayNumber(date: Date): number {
  return Math.floor(
    Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) / ONE_DAY
  );
}

/** Local midnight of the calendar date `dayNumber` days after 1970-01-01. */
export function fromDayNumber(dayNumber: number): Date {
  const utcMidnight = new Date(dayNumber * ONE_DAY);
  return new Date(
    utcMidnight.getUTCFullYear(),
    utcMidnight.getUTCMonth(),
    utcMidnight.getUTCDate()
  );
}

/** `date` shifted by whole calendar days (DST-safe). */
export function addDays(date: Date, days: number): Date {
  return fromDayNumber(toDayNumber(date) + days);
}

/** Whole calendar days from `from` to `to` (negative when `to` is earlier). */
export function differenceInDays(to: Date, from: Date): number {
  return toDayNumber(to) - toDayNumber(from);
}

/** True when both dates fall on the same calendar day. */
export function isSameDay(a?: Date | null, b?: Date | null): boolean {
  if (!a || !b) return false;
  return toDayNumber(a) === toDayNumber(b);
}

/** True when `date` is strictly between `start` and `end` (order agnostic). */
export function isBetween(
  date: Date,
  start?: Date | null,
  end?: Date | null
): boolean {
  if (!start || !end) return false;
  const day = toDayNumber(date);
  const a = toDayNumber(start);
  const b = toDayNumber(end);
  return day > Math.min(a, b) && day < Math.max(a, b);
}

/** First day of the month containing `date`. */
export function startOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

/** Last day of the month containing `date`. */
export function endOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0);
}

/** `date` limited to the `min`/`max` calendar days (bounds are inclusive). */
export function clampDate(date: Date, min?: Date, max?: Date): Date {
  const day = toDayNumber(date);
  if (min && day < toDayNumber(min)) return fromDayNumber(toDayNumber(min));
  if (max && day > toDayNumber(max)) return fromDayNumber(toDayNumber(max));
  return fromDayNumber(day);
}
