import "./DatePicker.css";
import { EthiopianDatePicker } from "../EthiopiaDatePicker/EthiopianDatePicker";
import { GregorianDatePicker } from "../GregorianDatePicker/GregorianDatePicker";
import { Calendar } from "lucide-react";
import { DatePickerProps } from "../../types";
import { useFormattedEthiopianDate } from "../../hooks/useFormattedEthiopianDateTime";
import { EthiopianDate } from "../../lib/ethiopian-date";
import { useFormattedDate } from "../../hooks/useFormattedDate";
import { sanitizeDateFormat } from "../../utils/sanitizeDateFormat";
import { PopoverButton } from "../Popover/PopoverButton";
import { PopoverPanel } from "../Popover/PopoverPanel";
import { Popover } from "../Popover/Popover";
import { TabsRoot } from "../Tabs/TabsRoot";
import { TabsList } from "../Tabs/TabsList";
import { TabsTrigger } from "../Tabs/TabsTrigger";
import { TabsContent } from "../Tabs/TabsContent";

export function DatePicker({
  selectedDate,
  onDateChange,
  showCalendars,
  viewFirst = "Gregorian",
  dateFormat = "MMMM dd, yyyy",
  datePickerClassNames = {},
  calanderClassNames = {},
  popoverProps = {
    anchor: "bottom",
    align: "center",
    sideOffset: 8,
    alignOffset: 0,
  },
  ethiopianTabName = "Ethiopian",
  gregorianTabName = "Gregorian",
}: DatePickerProps) {
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
      className={`date-picker-container ${
        datePickerClassNames.container || ""
      }`}
    >
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
                  onDateChange={onDateChange}
                  calanderClassNames={calanderClassNames}
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
