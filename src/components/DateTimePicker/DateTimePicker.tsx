import "./DateTImePicker.css";
import { useEffect, useState } from "react";
import { Calendar } from "lucide-react";
import { EthiopianDatePicker } from "../EthiopiaDatePicker/EthiopianDatePicker";
import { GregorianDatePicker } from "../GregorianDatePicker/GregorianDatePicker";
import TimePicker from "../TimePicker/TimePicker";
import { useFormattedDate } from "../../hooks/useFormattedDate";
import { EthiopianDate } from "../../lib/ethiopian-date";
import { useFormattedEthiopianDate } from "../../hooks/useFormattedEthiopianDateTime";
import { DateTimePickerProps } from "../../types";
import { sanitizeDateFormat } from "../../utils/sanitizeDateFormat";
import { Popover } from "../Popover/Popover";
import { PopoverButton } from "../Popover/PopoverButton";
import { PopoverPanel } from "../Popover/PopoverPanel";
import { TabsRoot } from "../Tabs/TabsRoot";
import { TabsList } from "../Tabs/TabsList";
import { TabsTrigger } from "../Tabs/TabsTrigger";
import { TabsContent } from "../Tabs/TabsContent";
import { usePopoverContext } from "../Popover/PopoverContext";

export function DateTimePicker({
  selectedDate,
  onDateChange,
  showCalendars,
  viewFirst = "Gregorian",
  dateFormat = "MMMM dd, yyyy",
  timeFormat = "12h",
  minDate,
  maxDate,
  clampNavigation = false,
  enforceInitialWithinRange = true,
  closeOnSelect = true,
  datePickerClassNames = {},
  timePickerClassNames = {},
  calanderClassNames = {},
  popoverProps = {
    anchor: "bottom",
    align: "center",
    sideOffset: 10,
    alignOffset: 0,
  },
  ethiopianTabName = "Ethiopian",
  gregorianTabName = "Gregorian",
}: DateTimePickerProps) {
  const [time, setTime] = useState<string | undefined>(
    selectedDate
      ? `${selectedDate.getHours()}:${String(selectedDate.getMinutes()).padStart(2, "0")}`
      : undefined,
  );

  const handleTimeChange = (newTime: string) => {
    setTime(newTime);
    const [hourPart, minutePartRaw] = newTime.split(":");
    let hours24 = 0;
    let minutes = 0;

    if (timeFormat === "12h") {
      const [minuteValue, period] = minutePartRaw.split(" ");
      minutes = parseInt(minuteValue, 10);
      let h = parseInt(hourPart, 10);
      if (period === "PM" && h !== 12) h += 12;
      if (period === "AM" && h === 12) h = 0;
      hours24 = h;
    } else {
      minutes = parseInt(minutePartRaw, 10);
      hours24 = parseInt(hourPart, 10);
    }

    const baseDate = selectedDate ? new Date(selectedDate) : new Date();
    baseDate.setHours(
      hours24,
      minutes,
      baseDate.getSeconds(),
      baseDate.getMilliseconds(),
    );
    onDateChange(baseDate);
  };

  const sanitizedFormat = sanitizeDateFormat(dateFormat);

  useEffect(() => {
    if (!enforceInitialWithinRange) return;
    if (!selectedDate) return;
    const normalize = (d?: Date) =>
      d ? new Date(d.getFullYear(), d.getMonth(), d.getDate()) : undefined;
    const sel = normalize(selectedDate)!;
    const minN = normalize(minDate);
    const maxN = normalize(maxDate);
    let clamped: Date | undefined = sel;
    if (minN && sel < minN) clamped = new Date(minN);
    if (maxN && sel > maxN) clamped = new Date(maxN);
    if (clamped && clamped.getTime() !== sel.getTime()) {
      const hours = selectedDate.getHours();
      const minutes = selectedDate.getMinutes();
      const seconds = selectedDate.getSeconds();
      const millis = selectedDate.getMilliseconds();
      const adjusted = new Date(
        clamped.getFullYear(),
        clamped.getMonth(),
        clamped.getDate(),
        hours,
        minutes,
        seconds,
        millis,
      );
      onDateChange(adjusted);
    }
  }, [selectedDate, minDate, maxDate, enforceInitialWithinRange, onDateChange]);

  const formattedDate =
    selectedDate && viewFirst === "Ethiopian"
      ? useFormattedEthiopianDate(
          EthiopianDate.toEth(selectedDate),
          sanitizedFormat,
        )
      : selectedDate
        ? useFormattedDate(selectedDate, sanitizedFormat)
        : sanitizedFormat;

  function PanelContent() {
    const { setIsOpen } = usePopoverContext();
    const handleSelect = (d: Date) => {
      onDateChange(d);
      if (closeOnSelect) setIsOpen(false);
    };

    return (
      <>
        {showCalendars === "both" ? (
          <TabsRoot
            initialActiveTab={
              viewFirst === "Ethiopian" ? "ethiopian" : "gregorian"
            }
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
              <EthiopianDatePicker
                selectedDate={selectedDate}
                onDateChange={handleSelect}
                minDate={minDate}
                maxDate={maxDate}
                clampNavigation={clampNavigation}
                calanderClassNames={calanderClassNames}
              />
            </TabsContent>
            <TabsContent
              value="gregorian"
              className={`tabs-content ${
                datePickerClassNames.tabsContent || ""
              }`}
            >
              <GregorianDatePicker
                selectedDate={selectedDate}
                onDateChange={handleSelect}
                minDate={minDate}
                maxDate={maxDate}
                clampNavigation={clampNavigation}
                calanderClassNames={calanderClassNames}
              />
            </TabsContent>
          </TabsRoot>
        ) : showCalendars === "ethiopian" ? (
          <EthiopianDatePicker
            selectedDate={selectedDate}
            onDateChange={handleSelect}
            minDate={minDate}
            maxDate={maxDate}
            clampNavigation={clampNavigation}
          />
        ) : (
          <GregorianDatePicker
            selectedDate={selectedDate}
            onDateChange={handleSelect}
            minDate={minDate}
            maxDate={maxDate}
            clampNavigation={clampNavigation}
          />
        )}
      </>
    );
  }

  return (
    <div
      className={`date-time-picker-container ${
        datePickerClassNames.container || ""
      }`}
    >
      <TimePicker
        selectedTime={time}
        onTimeChange={handleTimeChange}
        timeFormat={timeFormat}
        closeOnSelect={closeOnSelect}
        timePickerClassNames={timePickerClassNames}
        popoverProps={popoverProps}
      />
      <Popover>
        <PopoverButton
          className={`trigger-button ${
            datePickerClassNames.triggerButton || ""
          }`}
        >
          <Calendar className={`icon ${datePickerClassNames.icon || ""}`} />
          <span
            className={`formatted-date ${
              datePickerClassNames.formattedDate || ""
            } ${
              !selectedDate
                ? datePickerClassNames.placeholder || "placeholder"
                : ""
            }`}
          >
            {formattedDate}
          </span>
        </PopoverButton>
        <PopoverPanel
          className={`${datePickerClassNames.popoverPanel || ""}`}
          anchor={popoverProps.anchor}
          align={popoverProps.align}
          sideOffset={popoverProps.sideOffset}
          alignOffset={popoverProps.alignOffset}
        >
          <PanelContent />
        </PopoverPanel>
      </Popover>
    </div>
  );
}
