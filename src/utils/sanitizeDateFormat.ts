export const sanitizeDateFormat = (format: string): string => {
  const timeTokensWithSeparatorsRegex =
    /(?:[:\s])?(H{1,2}|h{1,2}|m{1,2}|s{1,2}|a|A)\b/g;

  if (timeTokensWithSeparatorsRegex.test(format)) {
    console.warn(
      `DatePicker: The provided dateFormat "${format}" contains time-related tokens which will be ignored.`
    );
  }

  // Remove time tokens along with any preceding colon or space
  const sanitizedFormat = format
    .replace(timeTokensWithSeparatorsRegex, "")
    .trim();

  return sanitizedFormat;
};
