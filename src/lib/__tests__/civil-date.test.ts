import {
  addDays,
  clampDate,
  differenceInDays,
  endOfMonth,
  fromDayNumber,
  isBetween,
  isSameDay,
  startOfMonth,
  toDayNumber,
} from "../civil-date";

describe("civil-date", () => {
  it("maps 1970-01-01 to day 0 and round-trips to local midnight", () => {
    expect(toDayNumber(new Date(1970, 0, 1))).toBe(0);

    const back = fromDayNumber(0);
    expect([
      back.getFullYear(),
      back.getMonth(),
      back.getDate(),
    ]).toEqual([1970, 0, 1]);
    expect(back.getHours()).toBe(0);
  });

  it("counts whole days regardless of the time of day", () => {
    expect(
      differenceInDays(new Date(2024, 1, 10, 23, 59), new Date(2024, 1, 3, 0, 1))
    ).toBe(7);
  });

  it("adds days across a DST transition", () => {
    // Chile starts DST on 2022-09-11 at 00:00, so that local midnight does not
    // exist -- timestamp arithmetic would land on the 10th or the 12th here.
    const before = new Date(2022, 8, 10);
    const next = addDays(before, 1);

    expect([
      next.getFullYear(),
      next.getMonth(),
      next.getDate(),
    ]).toEqual([2022, 8, 11]);
    expect(differenceInDays(next, before)).toBe(1);
    expect(addDays(next, 1).getDate()).toBe(12);
  });

  it("isSameDay ignores the time of day", () => {
    expect(isSameDay(new Date(2024, 0, 5, 1), new Date(2024, 0, 5, 23))).toBe(
      true
    );
    expect(isSameDay(new Date(2024, 0, 5), new Date(2024, 0, 6))).toBe(false);
    expect(isSameDay(null, new Date())).toBe(false);
  });

  it("isBetween is exclusive and order agnostic", () => {
    const start = new Date(2024, 0, 10);
    const end = new Date(2024, 0, 20);

    expect(isBetween(new Date(2024, 0, 15), start, end)).toBe(true);
    expect(isBetween(new Date(2024, 0, 10), start, end)).toBe(false);
    expect(isBetween(new Date(2024, 0, 20), start, end)).toBe(false);
    expect(isBetween(new Date(2024, 0, 15), end, start)).toBe(true);
  });

  it("clamps to inclusive bounds", () => {
    const min = new Date(2024, 0, 10);
    const max = new Date(2024, 0, 20);

    expect(clampDate(new Date(2024, 0, 1), min, max).getDate()).toBe(10);
    expect(clampDate(new Date(2024, 0, 31), min, max).getDate()).toBe(20);
    expect(clampDate(new Date(2024, 0, 15)).getDate()).toBe(15);
  });

  it("computes month boundaries", () => {
    expect(startOfMonth(new Date(2024, 1, 15)).getDate()).toBe(1);
    expect(endOfMonth(new Date(2024, 1, 15)).getDate()).toBe(29); // leap year
  });
});
