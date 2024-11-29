import { DateTime } from "luxon";

export function useFormattedDate(
  date: Date | undefined,
  format: string = "yyyy-MM-dd",
  zone: string = "default"
): string {
  if (!date) return "";

  let dateTime = DateTime.fromJSDate(date, { zone: zone });

  dateTime = dateTime.setLocale("en-US");

  return dateTime.toFormat(format);
}
