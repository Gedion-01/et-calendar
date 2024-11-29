import * as Popover from "@radix-ui/react-popover";
import * as Tabs from "@radix-ui/react-tabs";
import React, { useEffect, useState } from "react";
import { EthiopianDatePicker } from "../EthiopiaDatePicker/EthiopianDatePicker";
import { GregorianDatePicker } from "../GregorianDatePicker/GregorianDatePicker";
import { CalendarIcon } from "@radix-ui/react-icons";
import { DatePickerProps } from "../../types";
import { useFormattedEthiopianDate } from "../../hooks/useFormattedEthiopianDateTime";
import { EthiopianDate } from "../../lib/ethiopian-date";
import { useFormattedDate } from "../../hooks/useFormattedDate";
import "./DatePicker.css";

export const DatePicker: React.FC<DatePickerProps> = ({
  selectedDate,
  onDateChange,
  showCalendars,
  viewAs = "Gregorian",
  dateFormat = "MMMM dd, yyyy",
  datePickerClassNames = {},
  calanderClassNames = {},
  popoverProps = {},
  ethiopianTabName = "Ethiopian",
  gregorianTabName = "Gregorian",
}) => {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"ethiopian" | "gregorian">(
    showCalendars === "gregorian" ? "gregorian" : "ethiopian"
  );

  useEffect(() => {
    if (showCalendars === "both") {
      setActiveTab(viewAs === "Ethiopian" ? "ethiopian" : "gregorian");
    }
  }, [showCalendars, viewAs]);

  const formattedDate =
    selectedDate && viewAs === "Ethiopian"
      ? useFormattedEthiopianDate(EthiopianDate.toEth(selectedDate), dateFormat)
      : selectedDate
      ? useFormattedDate(selectedDate, dateFormat)
      : dateFormat;

  return (
    <div
      className={`date-picker-container ${
        datePickerClassNames.container || ""
      }`}
    >
      <Popover.Root open={open} onOpenChange={setOpen}>
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
              } ${
                !selectedDate
                  ? datePickerClassNames.placeholder || "placeholder"
                  : ""
              }`}
            >
              {formattedDate}
            </span>
          </button>
        </Popover.Trigger>
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
                  calanderClassNames={calanderClassNames}
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
                  calanderClassNames={calanderClassNames}
                />
              </Tabs.Content>
            </Tabs.Root>
          ) : showCalendars === "ethiopian" ? (
            <EthiopianDatePicker
              selectedDate={selectedDate}
              onDateChange={onDateChange}
              calanderClassNames={calanderClassNames}
            />
          ) : (
            <GregorianDatePicker
              selectedDate={selectedDate}
              onDateChange={onDateChange}
              calanderClassNames={calanderClassNames}
            />
          )}
        </Popover.Content>
      </Popover.Root>
    </div>
  );
};
