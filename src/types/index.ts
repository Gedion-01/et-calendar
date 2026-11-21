import { EthiopianDate } from "../lib/ethiopian-date";

interface DatePickerClassNames {
  container?: string;
  popoverPanel?: string;
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
  // Range selection
  inRange?: string;
  rangeStart?: string;
  rangeEnd?: string;
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
  timeSectionWrapper?: string;
  dividerWrapper?: string;
  divider?: string;
  timeList?: string;
  timeItem?: string;
  activeTimeItem?: string;
  spacer?: string;
  amPmButtons?: string;
  amPmButton?: string;
  activeAmPmButton?: string;
  placeholder?: string;
}

interface PopoverProps {
  anchor?: Placement;
  align?: Alignment;
  sideOffset?: number;
  alignOffset?: number;
}

export interface DatePickerProps {
  selectedDate?: Date;
  onDateChange: (date: Date) => void;
  showCalendars: "ethiopian" | "gregorian" | "both";
  viewFirst?: "Ethiopian" | "Gregorian";
  dateFormat?: string; // Note: Time-related tokens will be ignored
  minDate?: Date;
  maxDate?: Date;
  clampNavigation?: boolean;
  enforceInitialWithinRange?: boolean;
  closeOnSelect?: boolean;
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
  dateFormat?: string; // Note: Time-related tokens will be ignored
  timeFormat?: TimeFormat;
  minDate?: Date;
  maxDate?: Date;
  clampNavigation?: boolean;
  enforceInitialWithinRange?: boolean;
  closeOnSelect?: boolean;
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
  minDate?: Date;
  maxDate?: Date;
  clampNavigation?: boolean;

  /** Controlled visible month; omit to let the calendar manage it. */
  viewDate?: Date | EthiopianDate.EtDate;
  onViewDateChange?: (viewDate: Date | EthiopianDate.EtDate) => void;
  /** Extra per-day disable rule (holidays, blackout dates, ...). */
  disabledDays?: (date: Date) => boolean;

  /** Selection model; `range` renders the band between start and end. */
  mode?: "single" | "range";
  rangeStart?: Date | null;
  rangeEnd?: Date | null;
  /** Style the band as a preview (start picked, end not committed yet). */
  rangePreview?: boolean;
  onDayHover?: (date: Date | null) => void;

  calendarClassNames?: CalendarClassNames;
}

export interface DateRange {
  start?: Date;
  end?: Date;
}

export type TimeFormat = "12h" | "24h";

export interface TimePickerProps {
  selectedTime?: string;
  onTimeChange: (time: string) => void;
  timeFormat?: TimeFormat;
  closeOnSelect?: boolean;
  timePickerClassNames?: TimePickerClassNames;
  popoverProps?: PopoverProps;
}

export interface EthiopianDatePickerProps {
  selectedDate?: Date;
  onDateChange: (date: Date) => void;
  minDate?: Date;
  maxDate?: Date;
  clampNavigation?: boolean;
  calanderClassNames?: CalendarClassNames;
}

export interface GregorianDatePickerProps {
  selectedDate?: Date;
  onDateChange: (date: Date) => void;
  minDate?: Date;
  maxDate?: Date;
  clampNavigation?: boolean;
  calanderClassNames?: CalendarClassNames;
}

export type Placement = "top" | "bottom" | "left" | "right";
export type Alignment = "start" | "center" | "end";

export interface Position {
  x: number;
  y: number;
}

export interface PositionConfig {
  placement: Placement;
  align: Alignment;
  sideOffset: number;
  alignOffset: number;
}
