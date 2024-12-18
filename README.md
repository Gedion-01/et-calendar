# Eth-Calendar

The Eth-Calendar is a **feature-rich React library** that provides components, hooks, and utilities for working with both the Ethiopian and Gregorian calendars. It facilitates date selection, formatting, and conversion between these two calendars, making it easy to build applications that require dual calendar support. The components are fully customizable using **Tailwind CSS** or standard **CSS**, allowing you to tailor the look and feel to match your application's design.

## Features

- **DatePicker Component**: A customizable date picker supporting Ethiopian and Gregorian calendars.
- **DateTimePicker Component**: A date-time picker for selecting both dates and times.
- **Custom Hooks**: Hooks for formatting and manipulating dates.
- **Utilities**: Functions for Ethiopian date conversions and operations.
- **Fully TypeScript Supported**: Includes comprehensive type definitions for better TypeScript integration.

## Installation

Install the package via npm:

```bash
npm install eth-calendar
```

## Usage

### DatePicker

The DatePicker component allows users to select dates using either the Ethiopian or Gregorian calendar, or both.

```tsx
import React, { useState } from "react";
import { EthiopianDate } from "eth-calendar/lib";
import { DatePicker } from "eth-calendar";

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
import { DateTimePicker } from "eth-calendar";

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

### EthiopianDate Utilities

The EthiopianDate namespace provides functions for converting between Ethiopian and Gregorian dates and performing date calculations.

```tsx
import { EthiopianDate } from "eth-calendar/lib";
```

#### Converting Gregorian Date to Ethiopian Date

```ts
import { EthiopianDate } from "eth-calendar/lib";

const currentGregorianDate = new Date();
const ethDate = EthiopianDate.toEth(currentGregorianDate);
console.log(ethDate); // Outputs the Ethiopian date object
```

#### Converting Ethiopian Date to Gregorian Date

```ts
import { EthiopianDate } from "eth-calendar/lib";

const ethDate: EthiopianDate.EtDate = {
  Day: 1,
  Month: 1,
  Year: 2015,
};

const gregorianDate = EthiopianDate.toGreg(ethDate);
console.log(gregorianDate); // Outputs the corresponding Gregorian Date
```

#### Formatting Ethiopian Dates

To format Ethiopian dates or date-times, you have two options:

1. **Use the provided hooks for better formatting options.**
2. **Use the `formatEtDate` function from the EthiopianDate namespace.**

##### `Using Hooks for Better Formatting`

The toolkit offers hooks that simplify the formatting of Ethiopian dates and date-times. These hooks provide flexible formatting using familiar tokens.

##### `useFormattedEthiopianDate`

Formats an Ethiopian date according to a specified format string.

```ts
import { useFormattedEthiopianDate } from "eth-calendar";
import { EthiopianDate } from "eth-calendar/lib";

const ethDate: EthiopianDate.EtDate = {
  Day: 1,
  Month: 1,
  Year: 2015,
};

const formattedEthDate = useFormattedEthiopianDate(ethDate, "MMMM dd, yyyy");
console.log(formattedEthDate); // Outputs: "መስከረም 01, 2015"
```

##### Using formatEtDate Function from the Library

Alternatively, you can use the formatEtDate function provided in the EthiopianDate namespace for formatting.

```ts
import { EthiopianDate } from "eth-calendar/lib";

const ethDate: EthiopianDate.EtDate = {
  Day: 1,
  Month: 1,
  Year: 2015,
};

const formattedEthDate = EthiopianDate.formatEtDate(ethDate);
console.log(formattedEthDate); // E.g., "Meskerem 1, 2015"
```

The `formatEtDate` function provides a straightforward way to format Ethiopian dates using the default format.

**Note:** Using the hooks offers more flexibility and supports custom format strings, while `formatEtDate` uses a standard format.

## API Reference

### Components

#### DatePicker

A component for selecting dates using Ethiopian or Gregorian calendars.

##### Importing

```tsx
import { DatePicker } from "eth-calendar";
```

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
  Props to customize the popover behavior.

- `ethiopianTabName?: string`  
  Custom label for the Ethiopian calendar tab when both calendars are displayed.

- `gregorianTabName?: string`  
  Custom label for the Gregorian calendar tab when both calendars are displayed.

#### DateTimePicker

A component for selecting both dates and times, supporting Ethiopian and Gregorian calendars.

The `DateTimePicker` extends the functionality of the `DatePicker` by including time selection. It provides options for both 12-hour and 24-hour time formats and allows customization through various props and class names.

##### Importing

```tsx
import { DateTimePicker } from "eth-calendar";
```

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
  - **Default**: `'12h'`

- `dateTimePickerClassNames?: DateTimePickerClassNames`  
  Custom class names for styling various parts of the DateTimePicker component.

- `calendarClassNames?: CalendarClassNames`  
  Custom class names for styling the calendar component within the picker.

- `timePickerClassNames?: TimePickerClassNames`  
  Custom class names for styling the time picker component.

- `popoverProps?: PopoverProps`  
  Props for customizing the behavior contains the picker.

- `ethiopianTabName?: string`  
  Custom label for the Ethiopian calendar tab when both calendars are displayed.

- `gregorianTabName?: string`  
  Custom label for the Gregorian calendar tab when both calendars are displayed.

### EthiopianDate Namespace

A collection of functions and types for Ethiopian date operations and conversions.

#### Importing

```tsx
import { EthiopianDate } from "eth-calendar/lib";
```

#### Types

- `EtDate`  
  Represents an Ethiopian date.

```ts
interface EtDate {
  Day: number;
  Month: number;
  Year: number;
}
```

#### Functions

- `toEth(gregorianDate: Date): EtDate`  
  Converts a Gregorian date to an Ethiopian date.

- `toGreg(ethDate: EtDate): Date`  
  Converts an Ethiopian date to a Gregorian date.

- `formatEtDate(date: EtDate, locale?: 'AMH' | 'EN'): string`  
  Formats an Ethiopian date as a string.

- `isLeapYearEt(year: number): boolean`  
  Determines if an Ethiopian year is a leap year.

- `ethiopianMonthLength(month: number, year: number): number`  
  Returns the number of days in a given Ethiopian month.

- Additional Utility Functions

### Hooks

The toolkit provides several hooks for formatting dates and times.

`useFormattedDate`

#### Importing

```tsx
import { useFormattedDate } from "eth-calendar/hooks";
```

#### Usage

```tsx
const formattedDate = useFormattedDate(date, format?, zone?);
```

- #### Parameters:
  - `date: Date`  
    The Gregorian date to format.
  - `format?: string`  
    Optional format string. Default is `'MMMM dd, yyyy'`.
  - `zone?: string`  
    Optional time zone. Default is `'default'`.

#### Example

```tsx
import { useFormattedDate } from "eth-calendar/hooks";

const date = new Date();
const formattedDate = useFormattedDate(
  date,
  "MMMM dd, yyyy",
  "America/New_York"
);
console.log(formattedDate); // Outputs: "October 25, 2023"
```

`useFormattedDateTime`

Formats a **Gregorian date and time** according to a specified format string and time zone.

#### Importing

```tsx
import { useFormattedDateTime } from "eth-calendar/hooks";
```

#### Usage

```ts
const formattedDateTime = useFormattedDateTime(dateTime, format?, zone?);
```

- #### Parameters:
  - `dateTime: Date`  
    The Gregorian date to format.
  - `format?: string`  
    Optional format string. Default is `'MMMM dd, yyyy'`.
  - `zone?: string`  
    Optional time zone. Default is `'default'`.

#### Example

```tsx
import { useFormattedDateTime } from "eth-calendar/hooks";

const dateTime = new Date();
const formattedDateTime = useFormattedDateTime(
  dateTime,
  "MMMM dd, yyyy HH:mm",
  "America/New_York"
);
console.log(formattedDateTime); // Outputs: "October 25, 2023 14:30"
```

`useFormattedEthiopianDate`

Formats an Ethiopian date according to a specified format string.

#### Importing

```tsx
import { useFormattedEthiopianDate } from "eth-calendar/hooks";
import { EthiopianDate } from "eth-calendar/lib";
```

#### Usage

```tsx
const formattedEthDate = useFormattedEthiopianDate(ethDate, format?);
```

- #### Parameters:
  - `ethDate: EthiopianDate.EtDate`  
    The Ethiopian date to format.
  - `format?: string`  
    Optional format string. Default is `'MMMM dd, yyyy'`.

#### Example

```tsx
import { useFormattedEthiopianDate } from "eth-calendar/hooks";
import { EthiopianDate } from "eth-calendar/lib";

const ethDate: EthiopianDate.EtDate = {
  Day: 1,
  Month: 1,
  Year: 2015,
};

const formattedEthDate = useFormattedEthiopianDate(ethDate, "MMMM dd, yyyy");
console.log(formattedEthDate); // Outputs: "መስከረም 01, 2015"
```

`useFormattedEthiopianDateTime`

Formats an **Ethiopian date and time** according to a specified format string.

#### Importing

```tsx
import { useFormattedEthiopianDateTime } from "eth-calendar/hooks";
import { EthiopianDate } from "eth-calendar/lib";
```

#### Usage

```ts
const formattedEthDateTime = useFormattedEthiopianDateTime(ethDateTime, format?);
```

- #### Parameters:
  - `ethDateTime: EthiopianDate.EtDateTime`  
    The Ethiopian date and time to format.
  - `format?: string`  
    Optional format string. Default is `'MMMM dd, yyyy HH:mm:ss'`.

#### Example

```tsx
import { useFormattedEthiopianDateTime } from "eth-calendar/hooks";
import { EthiopianDate } from "eth-calendar/lib";

const ethDateTime: EtDateTime = {
  Day: 1,
  Month: 1,
  Year: 2015,
  Hour: 14,
  Minute: 30,
  Second:
};

const formattedEthDateTime = useFormattedEthiopianDateTime(
  ethDateTime,
  "MMMM dd, yyyy HH:mm"
);
console.log(formattedEthDateTime); // Outputs: "መስከረም 01, 2015 14:30"
```

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements or fixes.

## License

This project is licensed under the `MIT License.`
