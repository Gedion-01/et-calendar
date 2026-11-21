import { useState } from "react";
import { Calendar as CalendarIcon } from "lucide-react";
import { Calendar } from "../Calander/Calendar";
import { Popover } from "../Popover/Popover";
import { PopoverButton } from "../Popover/PopoverButton";
import { PopoverPanel } from "../Popover/PopoverPanel";
import { usePopoverContext } from "../Popover/PopoverContext";
import { TabsRoot } from "../Tabs/TabsRoot";
import { TabsList } from "../Tabs/TabsList";
import { TabsTrigger } from "../Tabs/TabsTrigger";
import { TabsContent } from "../Tabs/TabsContent";
import { DateRangePickerProps } from "../../types";
import { EthiopianDate } from "../../lib/ethiopian-date";
import { startOfMonth } from "../../lib/civil-date";
import { useRangeSelection } from "../../hooks/useRangeSelection";
import { useResponsiveMonths } from "../../hooks/useResponsiveMonths";
import { useFormattedDate } from "../../hooks/useFormattedDate";
import { useFormattedEthiopianDate } from "../../hooks/useFormattedEthiopianDateTime";
import { sanitizeDateFormat } from "../../utils/sanitizeDateFormat";
import {
  addEthiopianMonths,
  addMonths,
  ethiopianMonthDistance,
  monthDistance,
} from "../../utils/monthMath";
import "./DateRangePicker.css";

export function DateRangePicker({
  value,
  defaultValue,
  onChange,
  minDate,
  maxDate,
  minNights,
  maxNights,
  numberOfMonths,
  showCalendars = "both",
  viewFirst = "Gregorian",
  dateFormat = "MMM dd, yyyy",
  rangeSeparator = " \u2013 ",
  placeholder = "Select a date range",
  disabledDays,
  closeOnSelect = true,
  datePickerClassNames = {},
  calanderClassNames = {},
  popoverProps = {
    anchor: "bottom",
    align: "center",
    sideOffset: 10,
    alignOffset: 0,
  },
  ethiopianTabName = "Ethiopian",
  gregorianTabName = "Gregorian",
}: DateRangePickerProps) {
  const format = sanitizeDateFormat(dateFormat);
  const months = useResponsiveMonths(numberOfMonths);

  const selection = useRangeSelection({
    value,
    defaultValue,
    onChange,
    minDate,
    maxDate,
    minNights,
    maxNights,
    disabledDays,
  });

  const { start, end } = selection.range;

  // Called unconditionally: they are cheap, and hook order must stay stable.
  const fallback = new Date();
  const startGregorian = useFormattedDate(start, format);
  const endGregorian = useFormattedDate(end, format);
  const startEthiopian = useFormattedEthiopianDate(
    EthiopianDate.toEth(start ?? fallback),
    format
  );
  const endEthiopian = useFormattedEthiopianDate(
    EthiopianDate.toEth(end ?? fallback),
    format
  );

  const ethiopianFirst = viewFirst === "Ethiopian";
  const startLabel = ethiopianFirst ? startEthiopian : startGregorian;
  const endLabel = ethiopianFirst ? endEthiopian : endGregorian;

  const summary = !start
    ? placeholder
    : end
      ? `${startLabel}${rangeSeparator}${endLabel}`
      : `${startLabel}${rangeSeparator}\u2026`;

  const initialDay = start ?? minDate ?? fallback;
  const [gregorianBase, setGregorianBase] = useState(() =>
    startOfMonth(initialDay)
  );
  const [ethiopianBase, setEthiopianBase] = useState(() => ({
    ...EthiopianDate.toEth(initialDay),
    Day: 1,
  }));

  function Months({ isEthiopian }: { isEthiopian: boolean }) {
    const { setIsOpen } = usePopoverContext();
    const selectedDay = selection.displayStart ?? initialDay;

    return (
      <div
        className={`range-months ${datePickerClassNames.monthsWrapper || ""}`}
        style={{ gridTemplateColumns: `repeat(${months}, minmax(0, 1fr))` }}
      >
        {Array.from({ length: months }, (_, index) => (
          <Calendar
            key={index}
            mode="range"
            isEthiopian={isEthiopian}
            date={
              isEthiopian ? EthiopianDate.toEth(selectedDay) : selectedDay
            }
            viewDate={
              isEthiopian
                ? addEthiopianMonths(ethiopianBase, index)
                : addMonths(gregorianBase, index)
            }
            onViewDateChange={(next) => {
              if (isEthiopian) {
                const derived = addEthiopianMonths(ethiopianBase, index);
                setEthiopianBase((base) =>
                  addEthiopianMonths(
                    base,
                    ethiopianMonthDistance(
                      next as EthiopianDate.EtDate,
                      derived
                    )
                  )
                );
              } else {
                const derived = addMonths(gregorianBase, index);
                setGregorianBase((base) =>
                  addMonths(base, monthDistance(next as Date, derived))
                );
              }
            }}
            rangeStart={selection.displayStart}
            rangeEnd={selection.displayEnd}
            rangePreview={selection.isPreviewing}
            onDayHover={selection.setHoveredDay}
            disabledDays={(day) => !selection.isDaySelectable(day)}
            minDate={minDate}
            maxDate={maxDate}
            calendarClassNames={calanderClassNames}
            onChange={(next) => {
              const day = isEthiopian
                ? EthiopianDate.toGreg(next as EthiopianDate.EtDate)
                : (next as Date);
              if (selection.selectDay(day) && closeOnSelect) {
                setIsOpen(false);
              }
            }}
          />
        ))}
      </div>
    );
  }

  return (
    <div
      className={`date-picker-container range-picker-container ${
        datePickerClassNames.container || ""
      }`}
    >
      <Popover>
        <PopoverButton
          className={`trigger-button ${datePickerClassNames.triggerButton || ""}`}
        >
          <CalendarIcon className={`icon ${datePickerClassNames.icon || ""}`} />
          <span
            className={`formatted-date ${
              datePickerClassNames.triggerSummary || ""
            } ${
              !start ? datePickerClassNames.placeholder || "placeholder" : ""
            }`}
          >
            {summary}
          </span>
        </PopoverButton>

        <PopoverPanel
          className={datePickerClassNames.popoverPanel || ""}
          anchor={popoverProps.anchor}
          align={popoverProps.align}
          sideOffset={popoverProps.sideOffset}
          alignOffset={popoverProps.alignOffset}
        >
          {showCalendars === "both" ? (
            <TabsRoot
              initialActiveTab={ethiopianFirst ? "ethiopian" : "gregorian"}
            >
              <TabsList className={datePickerClassNames.tabsList || ""}>
                <TabsTrigger
                  value="ethiopian"
                  className={`tabs-trigger ${
                    datePickerClassNames.tabsTrigger || ""
                  }`}
                >
                  {ethiopianTabName}
                </TabsTrigger>
                <TabsTrigger
                  value="gregorian"
                  className={`tabs-trigger ${
                    datePickerClassNames.tabsTrigger || ""
                  }`}
                >
                  {gregorianTabName}
                </TabsTrigger>
              </TabsList>
              <TabsContent
                value="ethiopian"
                className={`tabs-content ${
                  datePickerClassNames.tabsContent || ""
                }`}
              >
                <Months isEthiopian />
              </TabsContent>
              <TabsContent
                value="gregorian"
                className={`tabs-content ${
                  datePickerClassNames.tabsContent || ""
                }`}
              >
                <Months isEthiopian={false} />
              </TabsContent>
            </TabsRoot>
          ) : (
            <Months isEthiopian={showCalendars === "ethiopian"} />
          )}
        </PopoverPanel>
      </Popover>
    </div>
  );
}
