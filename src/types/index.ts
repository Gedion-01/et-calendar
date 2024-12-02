import { EthiopianDate } from "../lib/ethiopian-date";

interface DatePickerClassNames {
  container?: string;
  popoverContent?: string;
  triggerButton?: string;
  icon?: string;
  formattedDate?: string;
  tabsList?: string;
  tabsTrigger?: string;
  tabsContent?: string;
  placeholder?: string;
}

interface CalendarClassNames {
  container?: string;
  header?: string;
  navButton?: string;
  monthYearButton?: string;
  weekdays?: string;
  weekday?: string;
  monthView?: string;
  monthGrid?: string;
  yearView?: string;
  yearGrid?: string;
  dayCell?: string;
  dayButton?: string;
  selected?: string;
  today?: string;
  emptyDayCell?: string;
  monthButton?: string;
  yearButton?: string;
  icon?: string;
}

interface TimePickerClassNames {
  triggerButton?: string;
  icon?: string;
  timeDisplay?: string;
  popoverContent?: string;
  header?: string;
  heading?: string;
  timeFormatToggle?: string;
  timeFormatLabel?: string;
  switchRoot?: string;
  switchThumb?: string;
  timeSections?: string;
  timeSection?: string;
  timeSectionTitle?: string;
  timeSectionWrapper?: string; // Renamed from 'relative'
  dividerWrapper?: string; // Renamed from 'absolute'
  divider?: string;
  timeList?: string;
  timeItem?: string;
  activeTimeItem?: string;
  spacer?: string;
  amPmButtons?: string;
  amPmButton?: string;
  activeAmPmButton?: string;
  popoverArrow?: string;
  placeholder?: string;
}

interface PopoverProps {
  side?: "top" | "right" | "bottom" | "left";
  sideOffset?: number;
  align?: "start" | "center" | "end";
  alignOffset?: number;
  avoidCollisions?: boolean;
  collisionBoundary?: Element | null;
  collisionPadding?: number;
}

export interface DatePickerProps {
  selectedDate?: Date;
  onDateChange: (date: Date) => void;
  showCalendars: "ethiopian" | "gregorian" | "both";
  viewFirst?: "Ethiopian" | "Gregorian";
  dateFormat?: string;
  datePickerClassNames?: DatePickerClassNames;
  calanderClassNames?: CalendarClassNames;
  popoverProps?: PopoverProps;
  ethiopianTabName?: string;
  gregorianTabName?: string;
}

export interface DateTimePickerProps {
  selectedDate?: Date;
  onDateChange: (date: Date) => void;
  showCalendars: "ethiopian" | "gregorian" | "both";
  viewFirst?: "Ethiopian" | "Gregorian";
  dateFormat?: string;
  timeFormat?: TimeFormat;
  datePickerClassNames?: DatePickerClassNames;
  timePickerClassNames?: TimePickerClassNames;
  calanderClassNames?: CalendarClassNames;
  popoverProps?: PopoverProps;
  ethiopianTabName?: string;
  gregorianTabName?: string;
}

export interface CalendarProps {
  date: Date | EthiopianDate.EtDate;
  onChange: (date: any) => void;
  isEthiopian: boolean;

  // Optional calanderClassNames props for customization of the calendar.
  calendarClassNames?: CalendarClassNames;
}

export type TimeFormat = "12h" | "24h";

export interface TimePickerProps {
  selectedTime?: string;
  onTimeChange: (time: string) => void;
  timeFormat?: TimeFormat;
  timePickerClassNames?: TimePickerClassNames;
  popoverProps?: PopoverProps;
}

export interface EthiopianDatePickerProps {
  selectedDate?: Date;
  onDateChange: (date: Date) => void;
  calanderClassNames?: CalendarClassNames;
}

export interface GregorianDatePickerProps {
  selectedDate?: Date;
  onDateChange: (date: Date) => void;
  calanderClassNames?: CalendarClassNames;
}
