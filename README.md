# Et-Calendar

[![npm package](https://badge.fury.io/js//et-calendar.svg)](https://www.npmjs.com/package/et-calendar)
[![Build Status](https://github.com/Gedion-01/et-calendar/actions/workflows/release.yml/badge.svg)](https://github.com/Gedion-01/et-calendar/actions)

Is the most **feature-rich React library** that provides components, hooks, and utilities for working with both the Ethiopian and Gregorian calendars. It facilitates date selection, formatting, and conversion between these two calendars, making it easy to build applications that require dual calendar support. The components are fully customizable using **Tailwind CSS** or standard **CSS**, allowing you to tailor the look and feel to match your application's design. (<a href="https://et-calendar-demo.netlify.app/" target="_blank">Demo</a>)

<p align="center">
  <img src="https://res.cloudinary.com/dcrldqkrc/image/upload/v1734594570/288c2edf-4bb9-49f0-a22d-63d607289fd7.png" alt="Image 1" width="230"/>
  <img src="https://res.cloudinary.com/dcrldqkrc/image/upload/v1734595160/0b1a87dc-41c3-4271-b5e0-18d27ebad931.png" alt="Image 2" width="230"/>
  <img src="https://res.cloudinary.com/dcrldqkrc/image/upload/v1734595307/3b7fb9c8-aa16-4ea3-b6f8-057a9dc9b264.png" alt="Image 3" width="230" height="296"/>
</p>

## Features

- **DatePicker Component**: Customizable Ethiopian/Gregorian picker with min/max bounds, optional clamped navigation, and close-on-select.
- **DateTimePicker Component**: Date + time picker with the same bounds/close-on-select behaviors and 12h/24h time support.
- **Custom Hooks**: Hooks for formatting and manipulating dates.
- **Utilities**: Functions for Ethiopian date conversions and operations.
- **Fully TypeScript Supported**: Includes comprehensive type definitions for better TypeScript integration.

## Installation

Install the package via npm:

```bash
npm install et-calendar
```

Or via Yarn:

```bash
yarn add et-calendar
```

## Usage

### DatePicker

The DatePicker component allows users to select dates using either the Ethiopian or Gregorian calendar, or both.

```tsx
import { useState } from "react";
import { EthiopianDate } from "et-calendar/lib";
import { DatePicker } from "et-calendar";

function App() {
  const [date, setDate] = useState<Date>(() => new Date());
  const [ethDate, setEthDate] = useState(() => EthiopianDate.toEth(new Date()));

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
      minDate={new Date(2020, 0, 1)}
      maxDate={new Date(2030, 11, 31)}
      clampNavigation // Prevent navigating outside min/max
      enforceInitialWithinRange // Clamp initial selection into min/max range
      closeOnSelect // Close popover after day pick
    />
  );
}

export default App;
```

### DateTimePicker

The DateTimePicker component extends the DatePicker by including time selection.

```tsx
import { useState } from "react";
import { EthiopianDate } from "et-calendar/lib";
import { DateTimePicker } from "et-calendar";

function App() {
  const [dateTime, setDateTime] = useState<Date>(() => new Date());
  const [ethDateTime, setEthioDateTime] = useState(() =>
    EthiopianDate.toEthDateTime(new Date()),
  );

  const handleDateTimeChange = (newDate: Date) => {
    setDateTime(newDate);
    setEthioDateTime(EthiopianDate.toEthDateTime(newDate));
  };

  return (
    <DateTimePicker
      selectedDate={dateTime} // The selected dateTime
      onDateChange={handleDateTimeChange} // This function will be called when a date is selected
      showCalendars="both" // Options: "gregorian" | "ethiopian" | "both"
      viewFirst="Ethiopian" // Options: "Gregorian" | "Ethiopian"
      dateFormat="MMMM dd, yyyy"
      timeFormat="24h" // Options: "12h" | "24h"
      minDate={new Date(2020, 0, 1)}
      maxDate={new Date(2030, 11, 31)}
      clampNavigation // Prevent navigating outside min/max
      closeOnSelect // Close after date pick and after minute pick in time
    />
  );
}

export default App;
```

### EthiopianDate Utilities

The EthiopianDate namespace provides functions for converting between Ethiopian and Gregorian dates and performing date calculations.

```tsx
import { EthiopianDate } from "et-calendar/lib";
```

#### Converting Gregorian Date to Ethiopian Date

```ts
import { EthiopianDate } from "et-calendar/lib";

const currentGregorianDate = new Date();
const ethDate = EthiopianDate.toEth(currentGregorianDate);
console.log(ethDate); // Outputs the Ethiopian date object
```

#### Converting Ethiopian Date to Gregorian Date

```ts
import { EthiopianDate } from "et-calendar/lib";

const ethDate: EthiopianDate.EtDate = {
  Day: 1,
  Month: 1,
  Year: 2015,
};

const gregorianDate = EthiopianDate.toGreg(ethDate);
console.log(gregorianDate); // Outputs the corresponding Gregorian Date
```

#### Converting Gregorian DateTime to Ethiopian DateTime

```ts
import { EthiopianDate } from "et-calendar/lib";

const currentGregorianDateTime = new Date();
const ethDateTime = EthiopianDate.toEthDateTime(currentGregorianDateTime);
console.log(ethDateTime); // Outputs the Ethiopian date-time object
```

#### Converting Ethiopian DateTime to Gregorian DateTime

```ts
import { EthiopianDate } from "et-calendar/lib";

const ethDateTime: EthiopianDate.EtDateTime = {
  Day: 1,
  Month: 1,
  Year: 2015,
  hours: 10,
  minutes: 30,
  seconds: 0,
};

const gregorianDateTime = EthiopianDate.toGregDateTime(ethDateTime);
console.log(gregorianDateTime); // Outputs the corresponding Gregorian Date with time
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
import { useFormattedEthiopianDate } from "et-calendar";
import { EthiopianDate } from "et-calendar/lib";

const ethDate: EthiopianDate.EtDate = {
  Day: 1,
  Month: 1,
  Year: 2015,
};

const formattedEthDate = useFormattedEthiopianDate(ethDate, "MMMM dd, yyyy");
console.log(formattedEthDate); // Outputs: "መስከረም 01, 2015"
```

##### `Using formatEtDate Function from the Library`

Alternatively, you can use the formatEtDate function provided in the EthiopianDate namespace for formatting.

```ts
import { EthiopianDate } from "et-calendar/lib";

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
import { DatePicker } from "et-calendar";
```

**Props**

- `selectedDate?: Date` — Currently selected date.
- `onDateChange: (date: Date) => void` — Callback when the date changes.
- `showCalendars: 'ethiopian' | 'gregorian' | 'both'` — Which calendars to display.
- `viewFirst?: 'Ethiopian' | 'Gregorian'` — Initial tab when showing both. Default: "Gregorian".
- `dateFormat?: string` — Display format (time tokens ignored).
- `minDate?: Date` / `maxDate?: Date` — Bounds for selection and navigation.
- `clampNavigation?: boolean` — Prevent navigating outside min/max months/years.
- `enforceInitialWithinRange?: boolean` — Clamp initial selectedDate into min/max.
- `closeOnSelect?: boolean` — Close popover after selecting a date. Default: true.
- `datePickerClassNames?: DatePickerClassNames` — Styling hooks for trigger/panel/tabs.
- `calanderClassNames?: CalendarClassNames` — Styling hooks for the calendar grid.
- `popoverProps?: PopoverProps` — Popover positioning tweaks.
- `ethiopianTabName?: string` / `gregorianTabName?: string` — Custom tab labels.

  _All props are optional unless noted. Defaults shown above apply when omitted._

#### DateTimePicker

A component for selecting both dates and times, supporting Ethiopian and Gregorian calendars.

The `DateTimePicker` extends the functionality of the `DatePicker` by including time selection. It provides options for both 12-hour and 24-hour time formats and allows customization through various props and class names.

##### Importing

```tsx
import { DateTimePicker } from "et-calendar";
```

**Props**

- `selectedDate?: Date` — Currently selected date/time.
- `onDateChange: (date: Date) => void` — Callback on date/time change.
- `showCalendars: 'ethiopian' | 'gregorian' | 'both'` — Which calendars to show.
- `viewFirst?: 'Ethiopian' | 'Gregorian'` — Initial tab when showing both. Default: "Gregorian".
- `dateFormat?: string` — Display format for the date portion.
- `timeFormat?: '12h' | '24h'` — Time picker mode. Default: "12h".
- `minDate?: Date` / `maxDate?: Date` — Bounds for selection and navigation.
- `clampNavigation?: boolean` — Prevent navigating outside min/max months/years.
- `enforceInitialWithinRange?: boolean` — Clamp initial selectedDate into min/max. Default: true.
- `closeOnSelect?: boolean` — Close popovers after picking a date and after picking minutes (and AM/PM) in the time picker.
- `datePickerClassNames?: DatePickerClassNames` — Styling hooks for the date trigger/panel/tabs.
- `timePickerClassNames?: TimePickerClassNames` — Styling hooks for the time picker.
- `calanderClassNames?: CalendarClassNames` — Styling hooks for the calendar grid.
- `popoverProps?: PopoverProps` — Popover positioning tweaks.
- `ethiopianTabName?: string` / `gregorianTabName?: string` — Custom tab labels.

### EthiopianDate Namespace

A collection of functions and types for Ethiopian date operations and conversions.

#### Importing

```tsx
import { EthiopianDate } from "et-calendar/lib";
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

- `EtDateTime`  
  Represents an Ethiopian date with time.

```ts
interface EtDateTime extends EtDate {
  hours: number;
  minutes: number;
  seconds?: number;
}
```

#### Functions

- `toEth(gregorianDate: Date): EtDate`  
  Converts a Gregorian date to an Ethiopian date.

- `toGreg(ethDate: EtDate): Date`  
  Converts an Ethiopian date to a Gregorian date.

- `toEthDateTime(gregorianDate: Date): EtDateTime`  
  Converts a Gregorian date (with time) to an Ethiopian date-time.

- `toGregDateTime(ethDateTime: EtDateTime): Date`  
  Converts an Ethiopian date-time to a Gregorian date (including time).

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
import { useFormattedDate } from "et-calendar/hooks";
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
import { useFormattedDate } from "et-calendar/hooks";

const date = new Date();
const formattedDate = useFormattedDate(
  date,
  "MMMM dd, yyyy",
  "America/New_York",
);
console.log(formattedDate); // Outputs: "October 25, 2023"
```

`useFormattedDateTime`

Formats a **Gregorian date and time** according to a specified format string and time zone.

#### Importing

```tsx
import { useFormattedDateTime } from "et-calendar/hooks";
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
import { useFormattedDateTime } from "et-calendar/hooks";

const dateTime = new Date();
const formattedDateTime = useFormattedDateTime(
  dateTime,
  "MMMM dd, yyyy HH:mm",
  "America/New_York",
);
console.log(formattedDateTime); // Outputs: "October 25, 2023 14:30"
```

`useFormattedEthiopianDate`

Formats an Ethiopian date according to a specified format string.

#### Importing

```tsx
import { useFormattedEthiopianDate } from "et-calendar/hooks";
import { EthiopianDate } from "et-calendar/lib";
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
import { useFormattedEthiopianDate } from "et-calendar/hooks";
import { EthiopianDate } from "et-calendar/lib";

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
import { useFormattedEthiopianDateTime } from "et-calendar/hooks";
import { EthiopianDate } from "et-calendar/lib";
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
import { useFormattedEthiopianDateTime } from "et-calendar/hooks";
import { EthiopianDate } from "et-calendar/lib";

const ethDateTime: EthiopianDate.EtDateTime = {
  Day: 1,
  Month: 1,
  Year: 2015,
  hours: 14,
  minutes: 30,
  seconds: 0,
};

const formattedEthDateTime = useFormattedEthiopianDateTime(
  ethDateTime,
  "MMMM dd, yyyy HH:mm",
);
console.log(formattedEthDateTime); // Outputs: "መስከረም 01, 2015 14:30"
```

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements or fixes.

## Future Plans

plan to add date range pickers in future releases. Stay tuned for updates!

## License

This project is licensed under the `MIT License.`
