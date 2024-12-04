# Ethio Calendar Toolkit

The Ethiopian Calendar Toolkit is a comprehensive React library that provides components, hooks, and utilities for working with both the Ethiopian and Gregorian calendars. It facilitates date selection, formatting, and conversion between these two calendars, making it easy to build applications that require dual calendar support.

## Features

- **DatePicker Component**: A customizable date picker supporting Ethiopian and Gregorian calendars.
- **DateTimePicker Component**: A date-time picker for selecting both dates and times.
- **Custom Hooks**: Hooks for formatting and manipulating dates.
- **Utilities**: Functions for Ethiopian date conversions and operations.
- **Fully TypeScript Supported**: Includes comprehensive type definitions for better TypeScript integration.

## Installation

Install the package via npm:

```bash
npm install ethio-calendar-toolkit
```

## Usage

### DatePicker

The DatePicker component allows users to select dates using either the Ethiopian or Gregorian calendar, or both.

```tsx
import React, { useState } from "react";
import { EthiopianDate } from "ethio-calendar-toolkit/lib";
import { DatePicker } from "ethio-calendar-toolkit";

const App = () => {
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [ethDate, setEthDate] = useState(EthiopianDate.toEth(new Date()));

  const handleDateChange = (newDate: Date) => {
    setDate(newDate);
    setEthDate(EthiopianDate.toEth(newDate));
  };

  return (
    <DatePicker
      selectedDate={date} // The selected date
      onDateChange={handleDateChange} // This function will be called when a date is selected
      showCalendars="both" // Options: "gregorian" | "ethiopian" | "both"
      viewFirst="Gregorian" // Options: "Gregorian" | "Ethiopian"
      dateFormat="MMMM dd, yyyy" // Time tokens will be ignored in DatePicker
    />
  );
};

export default App;
```

### DateTimePicker

The DateTimePicker component extends the DatePicker by including time selection.

```tsx
import React, { useState } from "react";
import { DateTimePicker } from "ethio-calendar-toolkit";

const App = () => {
  const [dateTime, setDateTime] = useState<Date | undefined>();
  const [ethioDateTime, setEthioDateTime] = useState(
    EthiopianDate.toEth(new Date())
  );

  const handleDateTimeChange = (newDate: Date) => {
    setDateTime(newDate);
    setEthioDateTime(EthiopianDate.toEth(newDate));
  };

  return (
    <DateTimePicker
      selectedDate={dateTime} // The selected dateTime
      onDateChange={handleDateTimeChange} // This function will be called when a date is selected
      showCalendars="both" // Options: "gregorian" | "ethiopian" | "both"
      viewFirst="Ethiopian" // Options: "Gregorian" | "Ethiopian"
      dateFormat="MMMM dd, yyyy"
      timeFormat="24h" // Options: "12h" | "24h"
    />
  );
};

export default App;
```

## API Reference

### Components

#### DatePicker

A component for selecting dates using Ethiopian or Gregorian calendars.

**Props**

- `selectedDate?: Date`  
  The currently selected date.

- `onDateChange: (date: Date) => void`  
  Callback when the date changes.

- `showCalendars: 'ethiopian' | 'gregorian' | 'both'`  
  Determines which calendars to display.

- `viewFirst?: 'Ethiopian' | 'Gregorian'`  
  Specifies the initial calendar view when both calendars are shown. Default is "Gregorian".

- `dateFormat?: string`  
  Format string for displaying the date. Note: Time-related tokens will be ignored.

- `datePickerClassNames?: DatePickerClassNames`  
  Custom class names for styling the date picker.

- `calanderClassNames?: CalendarClassNames`  
  Custom class names for styling the calendar.

- `popoverProps?: PopoverProps`  
  Props to customize the popover behavior and appearance.

- `ethiopianTabName?: string`  
  Custom label for the Ethiopian calendar tab when both calendars are displayed.

- `gregorianTabName?: string`  
  Custom label for the Gregorian calendar tab when both calendars are displayed.

#### DateTimePicker

A component for selecting both dates and times, supporting Ethiopian and Gregorian calendars.

The `DateTimePicker` extends the functionality of the `DatePicker` by including time selection. It provides options for both 12-hour and 24-hour time formats and allows customization through various props and class names.

**Props**

- `selectedDateTime?: Date`  
  The currently selected date and time.

- `onDateTimeChange: (dateTime: Date) => void`  
  Callback function that is called when the date or time changes. Receives the new `Date` object as a parameter.

- `showCalendars: 'ethiopian' | 'gregorian' | 'both'`  
  Determines which calendars are displayed in the picker.

  - `'ethiopian'`: Only the Ethiopian calendar is shown.
  - `'gregorian'`: Only the Gregorian calendar is shown.
  - `'both'`: Both calendars are displayed, typically in a tabbed interface.

- `viewFirst?: 'Ethiopian' | 'Gregorian'`  
  Specifies which calendar is displayed first when both calendars are available.

  - **Default**: `'Gregorian'`

- `dateFormat?: string`  
  Format string for displaying the date portion. Uses tokens from date formatting libraries (e.g., `date-fns`). Time-related tokens will be ignored for the date portion.

  Example: `'MMMM dd, yyyy'`

- `timeFormat?: '12h' | '24h'`  
  Determines the time format used in the time picker.

  - `'12h'`: 12-hour format with AM/PM indicators.
  - `'24h'`: 24-hour format.
  - **Default**: `'24h'`

- `dateTimePickerClassNames?: DateTimePickerClassNames`  
  Custom class names for styling various parts of the DateTimePicker component.

- `calendarClassNames?: CalendarClassNames`  
  Custom class names for styling the calendar component within the picker.

- `timePickerClassNames?: TimePickerClassNames`  
  Custom class names for styling the time picker component.

- `popoverProps?: PopoverProps`  
  Props for customizing the behavior and appearance of the popover that contains the picker.

- `ethiopianTabName?: string`  
  Custom label for the Ethiopian calendar tab when both calendars are displayed.

- `gregorianTabName?: string`  
  Custom label for the Gregorian calendar tab when both calendars are displayed.

### Hooks

The toolkit provides several hooks for formatting dates and times.

#### useFormattedDate

Formats a Gregorian date.

```ts
const formattedDate = useFormattedDate(date: Date, format?: string): string;
```

#### useFormattedEthiopianDate

Formats an Ethiopian date.

```ts
const formattedEthiopianDate = useFormattedEthiopianDate(date: EthiopianDate, format?: string): string;
```

#### useFormattedDateTime

Formats a Gregorian date and time.

```ts
const formattedDateTime = useFormattedDateTime(date: Date, format?: string): string;
```

#### useFormattedEthiopianDateTime

Formats an Ethiopian date and time.

```ts
const formattedEthiopianDateTime = useFormattedEthiopianDateTime(date: EthiopianDate, format?: string): string;
```
