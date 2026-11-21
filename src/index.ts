// Styles: shared dark-theme tokens (no-op unless a `.dark` ancestor exists)
import "./styles/dark-theme.css";

// Component: DatePicker, DateTimePicker, DateRangePicker
import { DatePicker } from "./components/DatePicker/DatePicker";
import { DateTimePicker } from "./components/DateTimePicker/DateTimePicker";
import { DateRangePicker } from "./components/DateRangePicker/DateRangePicker";

export { DatePicker, DateTimePicker, DateRangePicker };
export type { DateRange, DateRangePickerProps } from "./types";
