import "./DateTImePicker.css";
import { useState } from "react";
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

export function DateTimePicker({
  selectedDate,
  onDateChange,
  showCalendars,
  viewFirst = "Gregorian",
  dateFormat = "MMMM dd, yyyy",
  timeFormat = "12h",
  datePickerClassNames = {},
  timePickerClassNames = {},
  popoverProps = {
    anchor: "bottom",
    align: "center",
    sideOffset: 10,
    alignOffset: 0,
  },
  ethiopianTabName = "Ethiopian",
  gregorianTabName = "Gregorian",
}: DateTimePickerProps) {
  const [time, setTime] = useState(
    selectedDate
      ? `${selectedDate.getHours()}:${String(
          selectedDate.getMinutes()
        ).padStart(2, "0")}`
      : undefined
  );

  const handleTimeChange = (newTime: string) => {
    setTime(newTime);
    const [hours, minutes] = newTime.split(":");
    const [minuteValue, period] = minutes.split(" ");
    let hours24 = parseInt(hours);
    if (period === "PM" && hours24 !== 12) {
      hours24 += 12;
    } else if (period === "AM" && hours24 === 12) {
      hours24 = 0;
    }

    const newDate = selectedDate ? new Date(selectedDate) : new Date();
    newDate.setHours(hours24, parseInt(minuteValue));
    onDateChange(newDate);
  };

  const sanitizedFormat = sanitizeDateFormat(dateFormat);

  const formattedDate =
    selectedDate && viewFirst === "Ethiopian"
      ? useFormattedEthiopianDate(
          EthiopianDate.toEth(selectedDate),
          sanitizedFormat
        )
      : selectedDate
      ? useFormattedDate(selectedDate, sanitizedFormat)
      : sanitizedFormat;

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
            }
${!selectedDate ? datePickerClassNames.placeholder || "placeholder" : ""}`}
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
                  onDateChange={onDateChange}
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
                  onDateChange={onDateChange}
                />
              </TabsContent>
            </TabsRoot>
          ) : showCalendars === "ethiopian" ? (
            <EthiopianDatePicker
              selectedDate={selectedDate}
              onDateChange={onDateChange}
            />
          ) : (
            <GregorianDatePicker
              selectedDate={selectedDate}
              onDateChange={onDateChange}
            />
          )}
        </PopoverPanel>
      </Popover>
    </div>
  );
}
