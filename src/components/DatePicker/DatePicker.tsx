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
import { usePopoverContext } from "../Popover/PopoverContext";
import { TabsRoot } from "../Tabs/TabsRoot";
import { TabsList } from "../Tabs/TabsList";
import { TabsTrigger } from "../Tabs/TabsTrigger";
import { TabsContent } from "../Tabs/TabsContent";
import { useEffect } from "react";

export function DatePicker({
  selectedDate,
  onDateChange,
  showCalendars,
  viewFirst = "Gregorian",
  dateFormat = "MMMM dd, yyyy",
  minDate,
  maxDate,
  clampNavigation = false,
  enforceInitialWithinRange = true,
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
}: DatePickerProps) {
  const sanitizedFormat = sanitizeDateFormat(dateFormat);

  const formattedDate =
    selectedDate && viewFirst === "Ethiopian"
      ? useFormattedEthiopianDate(
          EthiopianDate.toEth(selectedDate),
          sanitizedFormat,
        )
      : selectedDate
        ? useFormattedDate(selectedDate, sanitizedFormat)
        : sanitizedFormat;

  // Optionally enforce the initial selectedDate to be within [minDate, maxDate]
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
      // Preserve original time parts if provided
      const hours = selectedDate.getHours();
      const minutes = selectedDate.getMinutes();
      const seconds = selectedDate.getSeconds();
      const adjusted = new Date(
        clamped.getFullYear(),
        clamped.getMonth(),
        clamped.getDate(),
        hours,
        minutes,
        seconds,
      );
      onDateChange(adjusted);
    }
  }, [selectedDate, minDate, maxDate, enforceInitialWithinRange, onDateChange]);

  // Define inner panel content component to access Popover context
  function PanelContent() {
    const { setIsOpen } = usePopoverContext();
    const handle = (d: Date) => {
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
                onDateChange={handle}
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
                onDateChange={handle}
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
            onDateChange={handle}
            minDate={minDate}
            maxDate={maxDate}
            clampNavigation={clampNavigation}
          />
        ) : (
          <GregorianDatePicker
            selectedDate={selectedDate}
            onDateChange={handle}
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
          <PanelContent />
        </PopoverPanel>
      </Popover>
    </div>
  );
}
