import { useCallback, useState } from "react";
import { clampDate, differenceInDays } from "../lib/civil-date";
import { DateRange } from "../types";

export interface UseRangeSelectionOptions {
  /** Controlled range. Omit to let the hook own the state. */
  value?: DateRange;
  defaultValue?: DateRange;
  onChange?: (range: DateRange) => void;
  minDate?: Date;
  maxDate?: Date;
  /** Minimum number of nights between start and end (inclusive). */
  minNights?: number;
  maxNights?: number;
  disabledDays?: (date: Date) => boolean;
}

export interface UseRangeSelectionResult {
  /** Last committed range. */
  range: DateRange;
  /** Start that is waiting for its end, if any. */
  anchor: Date | null;
  hovered: Date | null;
  /** What the grid should paint: committed range, or anchor + hover preview. */
  displayStart: Date | null;
  displayEnd: Date | null;
  isPreviewing: boolean;
  isDaySelectable: (date: Date) => boolean;
  /** Returns true when the pick completed a range. */
  selectDay: (date: Date) => boolean;
  setHoveredDay: (date: Date | null) => void;
  reset: () => void;
}

/**
 * Range selection state machine.
 *
 *   idle --pick--> awaitingEnd(start) --pick>=start--> committed(start, end)
 *                                   --pick<start--> awaitingEnd(newStart)
 *
 * Picking a day before the pending start restarts the range instead of
 * swapping the ends, and days that would violate minNights/maxNights (or that
 * `disabledDays` rejects) are ignored.
 */
export function useRangeSelection({
  value,
  defaultValue,
  onChange,
  minDate,
  maxDate,
  minNights,
  maxNights,
  disabledDays,
}: UseRangeSelectionOptions): UseRangeSelectionResult {
  const isControlled = value !== undefined;
  const [internalRange, setInternalRange] = useState<DateRange>(
    defaultValue ?? {}
  );
  const range = isControlled ? (value as DateRange) : internalRange;

  const [anchor, setAnchor] = useState<Date | null>(null);
  const [hovered, setHovered] = useState<Date | null>(null);

  const commit = useCallback(
    (next: DateRange) => {
      if (!isControlled) setInternalRange(next);
      onChange?.(next);
    },
    [isControlled, onChange]
  );

  const isDaySelectable = useCallback(
    (date: Date) => {
      if (disabledDays?.(date)) return false;
      if (!anchor) return true;

      const nights = differenceInDays(date, anchor);
      // Earlier than the anchor restarts the range, so it stays selectable.
      if (nights <= 0) return true;
      if (minNights !== undefined && nights < minNights) return false;
      if (maxNights !== undefined && nights > maxNights) return false;
      return true;
    },
    [anchor, disabledDays, minNights, maxNights]
  );

  const selectDay = useCallback(
    (date: Date): boolean => {
      const day = clampDate(date, minDate, maxDate);
      if (disabledDays?.(day)) return false;

      if (!anchor) {
        setAnchor(day);
        setHovered(null);
        return false;
      }

      const nights = differenceInDays(day, anchor);
      if (nights <= 0) {
        // Restart (Option A) rather than swapping the ends.
        setAnchor(day);
        setHovered(null);
        return false;
      }
      if (minNights !== undefined && nights < minNights) return false;
      if (maxNights !== undefined && nights > maxNights) return false;

      const next = { start: anchor, end: day };
      setAnchor(null);
      setHovered(null);
      commit(next);
      return true;
    },
    [anchor, commit, disabledDays, maxDate, maxNights, minDate, minNights]
  );

  const previewEnd =
    anchor && hovered && differenceInDays(hovered, anchor) >= 0
      ? hovered
      : null;

  return {
    range,
    anchor,
    hovered,
    displayStart: anchor ?? range.start ?? null,
    displayEnd: anchor ? previewEnd : range.end ?? null,
    isPreviewing: anchor !== null && previewEnd !== null,
    isDaySelectable,
    selectDay,
    setHoveredDay: setHovered,
    reset: () => {
      setAnchor(null);
      setHovered(null);
      commit({});
    },
  };
}
