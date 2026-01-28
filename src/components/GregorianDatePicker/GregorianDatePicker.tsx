import { useState, useEffect } from "react";
import { Calendar } from "../Calander/Calendar";
import { GregorianDatePickerProps } from "../../types";

export function GregorianDatePicker({
  selectedDate,
  onDateChange,
  minDate,
  maxDate,
  clampNavigation,
  calanderClassNames = {},
}: GregorianDatePickerProps) {
  const [date, setDate] = useState(selectedDate || new Date());

  useEffect(() => {
    setDate(selectedDate || new Date());
  }, [selectedDate]);

  const handleDateChange = (newDate: Date) => {
    const existingDate = selectedDate as Date | undefined;
    const hours = existingDate ? existingDate.getHours() : 0;
    const minutes = existingDate ? existingDate.getMinutes() : 0;
    const seconds = existingDate ? existingDate.getSeconds() : 0;

    // Create a new Date with preserved or default time
    const updatedDate = new Date(
      newDate.getFullYear(),
      newDate.getMonth(),
      newDate.getDate(),
      hours,
      minutes,
      seconds,
    );

    setDate(updatedDate);
    onDateChange(updatedDate);
  };

  return (
    <div>
      <Calendar
        date={date}
        onChange={handleDateChange}
        isEthiopian={false}
        minDate={minDate}
        maxDate={maxDate}
        clampNavigation={clampNavigation}
        calendarClassNames={calanderClassNames}
      />
    </div>
  );
}
