import { DateTime } from "luxon";

export function useFormattedDateTime(
  date: Date | undefined,
  format: string = "yyyy-MM-dd HH:mm:ss",
  zone?: string
): string {
  if (!date) return "";

  let dateTime = DateTime.fromJSDate(date, { zone: zone });

  if (isNaN(dateTime.second) || dateTime.second === null) {
    dateTime = dateTime.set({
      second: dateTime.second || 0,
      millisecond: dateTime.millisecond || 0,
    });
  }

  dateTime = dateTime.setLocale("en-US");

  return dateTime.toFormat(format);
}
