import { sanitizeDateFormat } from "../sanitizeDateFormat";

describe("sanitizeDateFormat", () => {
  it("removes time tokens and preceding separators", () => {
    const format = "MMMM dd, yyyy hh:mm:ss a";
    const expected = "MMMM dd, yyyy";
    expect(sanitizeDateFormat(format)).toBe(expected);
  });

  it("removes time tokens with different separators", () => {
    const format = "dd-MM-yyyy HH:mm";
    const expected = "dd-MM-yyyy";
    expect(sanitizeDateFormat(format)).toBe(expected);
  });

  it("returns the original format if no time tokens are present", () => {
    const format = "dd/MM/yyyy";
    const expected = "dd/MM/yyyy";
    expect(sanitizeDateFormat(format)).toBe(expected);
  });

  it("handles multiple time tokens correctly", () => {
    const format = "yyyy/MM/dd h:m A";
    const expected = "yyyy/MM/dd";
    expect(sanitizeDateFormat(format)).toBe(expected);
  });

  it("trims whitespace after removal", () => {
    const format = "MMMM dd, yyyy hh:mm:ss a ";
    const expected = "MMMM dd, yyyy";
    expect(sanitizeDateFormat(format)).toBe(expected);
  });
});
