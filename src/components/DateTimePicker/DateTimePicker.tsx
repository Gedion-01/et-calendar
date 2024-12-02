import React, { useEffect, useState } from "react";
import * as Popover from "@radix-ui/react-popover";
import * as Tabs from "@radix-ui/react-tabs";
import { CalendarIcon } from "@radix-ui/react-icons";
import { EthiopianDatePicker } from "../EthiopiaDatePicker/EthiopianDatePicker";
import { GregorianDatePicker } from "../GregorianDatePicker/GregorianDatePicker";
import TimePicker from "../TimePicker/TimePicker";
import { useFormattedDate } from "../../hooks/useFormattedDate";
import { EthiopianDate } from "../../lib/ethiopian-date";
import { useFormattedEthiopianDate } from "../../hooks/useFormattedEthiopianDateTime";
import { DateTimePickerProps } from "../../types";
import "./DateTImePicker.css";

export const DateTimePicker: React.FC<DateTimePickerProps> = ({
  selectedDate,
  onDateChange,
  showCalendars,
  viewFirst = "Gregorian",
  dateFormat = "MMMM dd, yyyy",
  timeFormat = "12h",
  datePickerClassNames = {},
  timePickerClassNames = {},
  popoverProps = {},
  ethiopianTabName = "Ethiopian",
  gregorianTabName = "Gregorian",
}) => {
  const [time, setTime] = useState(
    selectedDate
      ? `${selectedDate.getHours()}:${String(
          selectedDate.getMinutes()
        ).padStart(2, "0")}`
      : undefined
  );
  const [activeTab, setActiveTab] = useState<"ethiopian" | "gregorian">(
    showCalendars === "gregorian" ? "gregorian" : "ethiopian"
  );

  useEffect(() => {
    if (showCalendars === "both") {
      setActiveTab(viewFirst === "Ethiopian" ? "ethiopian" : "gregorian");
    }
  }, [showCalendars, viewFirst]);

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
    // const newDate = selectedDate ?  Date(selectedDate) : new Date();
    const newDate = selectedDate ? new Date(selectedDate) : new Date();
    newDate.setHours(hours24, parseInt(minuteValue));
    onDateChange(newDate);
  };

  const formattedDate =
    selectedDate && viewFirst === "Ethiopian"
      ? useFormattedEthiopianDate(EthiopianDate.toEth(selectedDate), dateFormat)
      : selectedDate
      ? useFormattedDate(selectedDate, dateFormat)
      : dateFormat;
  return (
    <div
      className={`date-time-picker-container ${
        datePickerClassNames.container || ""
      }`}
    >
      <Popover.Root>
        <TimePicker
          selectedTime={time}
          onTimeChange={handleTimeChange}
          timeFormat={timeFormat}
          timePickerClassNames={timePickerClassNames}
          popoverProps={popoverProps}
        />
        <Popover.Trigger asChild>
          <button
            className={`trigger-button ${
              datePickerClassNames.triggerButton || ""
            }`}
          >
            <CalendarIcon
              className={`icon ${datePickerClassNames.icon || ""}`}
            />
            <span
              className={`formatted-date ${
                datePickerClassNames.formattedDate || ""
              }
${!selectedDate ? datePickerClassNames.placeholder || "placeholder" : ""}`}
            >
              {formattedDate}
            </span>
          </button>
        </Popover.Trigger>
        <Popover.Portal>
          <Popover.Content
            className={`popover-content ${
              datePickerClassNames.popoverContent || ""
            }`}
            side={popoverProps.side || "bottom"}
            sideOffset={popoverProps.sideOffset || 5}
            align={popoverProps.align || "center"}
            alignOffset={popoverProps.alignOffset || 0}
            avoidCollisions={popoverProps.avoidCollisions || true}
            collisionBoundary={popoverProps.collisionBoundary || undefined}
            collisionPadding={popoverProps.collisionPadding || 10}
          >
            {showCalendars === "both" ? (
              <Tabs.Root
                value={activeTab}
                onValueChange={(value) =>
                  setActiveTab(value as "ethiopian" | "gregorian")
                }
                defaultValue={activeTab}
              >
                <Tabs.List
                  className={`tabs-list ${datePickerClassNames.tabsList || ""}`}
                >
                  <Tabs.Trigger
                    value="ethiopian"
                    className={`tabs-trigger ${
                      datePickerClassNames.tabsTrigger || ""
                    } ${activeTab === "ethiopian" ? "active" : ""}`}
                  >
                    {ethiopianTabName}
                  </Tabs.Trigger>
                  <Tabs.Trigger
                    value="gregorian"
                    className={`tabs-trigger ${
                      datePickerClassNames.tabsTrigger || ""
                    } ${activeTab === "gregorian" ? "active" : ""}`}
                  >
                    {gregorianTabName}
                  </Tabs.Trigger>
                </Tabs.List>
                <Tabs.Content
                  value="ethiopian"
                  className={`tabs-content ${
                    datePickerClassNames.tabsContent || ""
                  }`}
                >
                  <EthiopianDatePicker
                    selectedDate={selectedDate}
                    onDateChange={onDateChange}
                  />
                </Tabs.Content>
                <Tabs.Content
                  value="gregorian"
                  className={`tabs-content ${
                    datePickerClassNames.tabsContent || ""
                  }`}
                >
                  <GregorianDatePicker
                    selectedDate={selectedDate}
                    onDateChange={onDateChange}
                  />
                </Tabs.Content>
              </Tabs.Root>
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
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>
    </div>
  );
};
