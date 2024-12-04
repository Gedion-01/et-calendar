import { useState, useEffect } from "react";
import { EthiopianDate } from "../../lib/ethiopian-date";
import { Calendar } from "../Calander/Calendar";
import { EthiopianDatePickerProps } from "../../types";

export function EthiopianDatePicker({
  selectedDate,
  onDateChange,
  calanderClassNames = {},
}: EthiopianDatePickerProps) {
  const [ethDate, setEthDate] = useState(
    EthiopianDate.toEth(selectedDate || new Date())
  );

  useEffect(() => {
    setEthDate(EthiopianDate.toEth(selectedDate || new Date()));
  }, [selectedDate]);

  const handleEthDateChange = (newEthDate: EthiopianDate.EtDate) => {
    let gregDate = EthiopianDate.toGreg(newEthDate);

    const existingDate = selectedDate as Date | undefined;
    const hours = existingDate ? existingDate.getHours() : 0;
    const minutes = existingDate ? existingDate.getMinutes() : 0;
    const seconds = existingDate ? existingDate.getSeconds() : 0;

    // Create new Date with preserved or default time
    gregDate = new Date(
      gregDate.getFullYear(),
      gregDate.getMonth(),
      gregDate.getDate(),
      hours,
      minutes,
      seconds
    );

    onDateChange(gregDate);
    setEthDate(newEthDate);
  };

  return (
    <div>
      <Calendar
        date={ethDate}
        onChange={handleEthDateChange}
        isEthiopian={true}
        calendarClassNames={calanderClassNames}
      />
    </div>
  );
}
