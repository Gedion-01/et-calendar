import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { EthiopianDate } from "../../lib/ethiopian-date";
import { CalendarProps } from "../../types";
import "./Calender.css";

type View = "calendar" | "month" | "year";

export function Calendar({
  date,
  onChange,
  isEthiopian,
  calendarClassNames = {},
}: CalendarProps) {
  const [viewDate, setViewDate] = useState(
    isEthiopian ? (date as EthiopianDate.EtDate) : (date as Date)
  );
  const [currentView, setCurrentView] = useState<View>("calendar");
  const selectedDateRef = useRef<HTMLButtonElement | null>(null);
  const currentYearRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    setViewDate(isEthiopian ? (date as EthiopianDate.EtDate) : (date as Date));
  }, [date, isEthiopian]);
  useEffect(() => {
    if (selectedDateRef.current && currentView === "calendar") {
      selectedDateRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [viewDate, currentView]);
  useEffect(() => {
    if (currentYearRef.current && currentView === "year") {
      currentYearRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [currentView]);
  const getDaysInMonth = (month: number, year: number) => {
    if (isEthiopian) {
      return EthiopianDate.ethiopianMonthLength(month, year);
    }
    return new Date(year, month, 0).getDate();
  };
  const getMonthName = (month: number) => {
    if (isEthiopian) {
      return EthiopianDate.getEtMonthName(month);
    }
    return new Date(new Date().getFullYear(), month - 1).toLocaleString(
      "default",
      { month: "long" }
    );
  };
  const getFirstDayOfMonth = () => {
    if (isEthiopian) {
      const ethDate = viewDate as EthiopianDate.EtDate;
      const gregDate = EthiopianDate.toGreg({ ...ethDate, Day: 1 });
      return gregDate.getDay();
    } else {
      const date = viewDate as Date;
      return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    }
  };

  const handlePrevMonth = () => {
    if (isEthiopian) {
      const ethDate = viewDate as EthiopianDate.EtDate;
      if (ethDate.Month > 1) {
        setViewDate({ ...ethDate, Month: ethDate.Month - 1 });
      } else {
        setViewDate({ Year: ethDate.Year - 1, Month: 13, Day: 1 });
      }
    } else {
      const date = viewDate as Date;
      setViewDate(new Date(date.getFullYear(), date.getMonth() - 1, 1));
    }
  };

  const handleNextMonth = () => {
    if (isEthiopian) {
      const ethDate = viewDate as EthiopianDate.EtDate;
      if (ethDate.Month < 13) {
        setViewDate({ ...ethDate, Month: ethDate.Month + 1 });
      } else {
        setViewDate({ Year: ethDate.Year + 1, Month: 1, Day: 1 });
      }
    } else {
      const date = viewDate as Date;
      setViewDate(new Date(date.getFullYear(), date.getMonth() + 1, 1));
    }
  };

  const handleYearChange = (year: number) => {
    if (isEthiopian) {
      setViewDate({ ...(viewDate as EthiopianDate.EtDate), Year: year });
    } else {
      setViewDate(new Date(year, (viewDate as Date).getMonth(), 1));
    }
    setCurrentView("calendar");
  };

  const handleMonthChange = (month: number) => {
    if (isEthiopian) {
      setViewDate({ ...(viewDate as EthiopianDate.EtDate), Month: month });
    } else {
      setViewDate(new Date((viewDate as Date).getFullYear(), month - 1, 1));
    }
    setCurrentView("calendar");
  };

  const isToday = (day: number, month: number, year: number) => {
    const today = new Date();
    if (isEthiopian) {
      const todayEth = EthiopianDate.toEth(today);
      return (
        day === todayEth.Day &&
        month === todayEth.Month &&
        year === todayEth.Year
      );
    } else {
      return (
        day === today.getUTCDate() &&
        month === today.getUTCMonth() + 1 &&
        year === today.getUTCFullYear()
      );
    }
  };

  const renderCalendarDays = () => {
    const days = [];
    const totalDays = isEthiopian
      ? getDaysInMonth(
          (viewDate as EthiopianDate.EtDate).Month,
          (viewDate as EthiopianDate.EtDate).Year
        )
      : getDaysInMonth(
          (viewDate as Date).getMonth() + 1,
          (viewDate as Date).getFullYear()
        );

    const firstDay = getFirstDayOfMonth();

    for (let i = 0; i < firstDay; i++) {
      days.push(
        <div
          key={`empty-${i}`}
          className={`empty-day-cell ${calendarClassNames.emptyDayCell || ""}`}
        />
      );
    }

    for (let i = 1; i <= totalDays; i++) {
      const isSelected = isEthiopian
        ? i === (date as EthiopianDate.EtDate).Day &&
          (viewDate as EthiopianDate.EtDate).Month ===
            (date as EthiopianDate.EtDate).Month &&
          (viewDate as EthiopianDate.EtDate).Year ===
            (date as EthiopianDate.EtDate).Year
        : i === (date as Date).getDate() &&
          (viewDate as Date).getMonth() === (date as Date).getMonth() &&
          (viewDate as Date).getFullYear() === (date as Date).getFullYear();

      const isTodayDate = isEthiopian
        ? isToday(
            i,
            (viewDate as EthiopianDate.EtDate).Month,
            (viewDate as EthiopianDate.EtDate).Year
          )
        : isToday(
            i,
            (viewDate as Date).getMonth() + 1,
            (viewDate as Date).getFullYear()
          );

      days.push(
        <div key={i} className={`day-cell ${calendarClassNames.dayCell || ""}`}>
          <button
            type="button"
            ref={isSelected ? selectedDateRef : null}
            onClick={() => {
              if (isEthiopian) {
                onChange({
                  Day: i,
                  Month: (viewDate as EthiopianDate.EtDate).Month,
                  Year: (viewDate as EthiopianDate.EtDate).Year,
                });
              } else {
                const existingDate = date as Date | undefined;
                const hours = existingDate ? existingDate.getHours() : 0;
                const minutes = existingDate ? existingDate.getMinutes() : 0;
                const seconds = existingDate ? existingDate.getSeconds() : 0;

                const newDate = new Date(
                  (viewDate as Date).getFullYear(),
                  (viewDate as Date).getMonth(),
                  i,
                  hours,
                  minutes,
                  seconds
                );
                onChange(newDate);
              }
            }}
            className={`day-button ${calendarClassNames.dayButton || ""} ${
              isSelected ? calendarClassNames.selected || "selected" : ""
            } ${isTodayDate ? calendarClassNames.today || "selected" : ""} ${
              isTodayDate && !isSelected ? "today" : ""
            }`}
          >
            {i}
          </button>
        </div>
      );
    }
    return days;
  };

  const weekDays = isEthiopian
    ? EthiopianDate.shortDays
    : ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const years = isEthiopian
    ? Array.from({ length: 200 }, (_, i) => i + 1900)
    : Array.from({ length: 200 }, (_, i) => i + 1900);

  const months = isEthiopian
    ? EthiopianDate.ethMonths.map((month, index) => ({
        name: month,
        value: index + 1,
      }))
    : Array.from({ length: 12 }, (_, i) => ({
        name: new Date(0, i).toLocaleString("default", { month: "long" }),
        value: i + 1,
      }));

  const renderMonthView = () => (
    <div className={`month-view ${calendarClassNames.monthView || ""}`}>
      <button
        type="button"
        onClick={() => setCurrentView("year")}
        className={`year-display-button ${calendarClassNames.yearButton || ""}`}
      >
        {isEthiopian
          ? (viewDate as EthiopianDate.EtDate).Year
          : (viewDate as Date).getFullYear()}
      </button>
      <div className={`month-grid ${calendarClassNames.monthGrid || ""}`}>
        {months.map((month) => (
          <button
            type="button"
            key={month.value}
            onClick={() => handleMonthChange(month.value)}
            className={`month-button ${
              (
                isEthiopian
                  ? (viewDate as EthiopianDate.EtDate).Month === month.value
                  : (viewDate as Date).getMonth() === month.value - 1
              )
                ? calendarClassNames.selected || "selected"
                : calendarClassNames.monthButton || ""
            }`}
          >
            {month.name.slice(0, 3)}
          </button>
        ))}
      </div>
    </div>
  );

  const renderYearView = () => (
    <div className={`year-view ${calendarClassNames.yearView || ""}`}>
      <div className={`year-grid ${calendarClassNames.yearGrid || ""}`}>
        {years.map((year) => (
          <button
            type="button"
            key={year}
            ref={
              (
                isEthiopian
                  ? (viewDate as EthiopianDate.EtDate).Year === year
                  : (viewDate as Date).getFullYear() === year
              )
                ? currentYearRef
                : null
            }
            onClick={() => handleYearChange(year)}
            className={`year-button ${
              (
                isEthiopian
                  ? (viewDate as EthiopianDate.EtDate).Year === year
                  : (viewDate as Date).getFullYear() === year
              )
                ? calendarClassNames.selected || "selected"
                : calendarClassNames.yearButton || ""
            }`}
          >
            {year}
          </button>
        ))}
      </div>
    </div>
  );

  const renderCalendarView = () => (
    <>
      <div className={`calendar-header ${calendarClassNames.header || ""}`}>
        <button
          type="button"
          onClick={handlePrevMonth}
          className={`nav-button ${calendarClassNames.navButton || ""}`}
        >
          <ChevronLeft className={`icon ${calendarClassNames.icon || ""}`} />
        </button>
        <button
          type="button"
          onClick={() => setCurrentView("month")}
          className={`month-year-button ${
            calendarClassNames.monthYearButton || ""
          }`}
        >
          {isEthiopian
            ? `${getMonthName((viewDate as EthiopianDate.EtDate).Month)} ${
                (viewDate as EthiopianDate.EtDate).Year
              }`
            : `${getMonthName((viewDate as Date).getMonth() + 1)} ${(
                viewDate as Date
              ).getFullYear()}`}
        </button>
        <button
          type="button"
          onClick={handleNextMonth}
          className={`nav-button ${calendarClassNames.navButton || ""}`}
        >
          <ChevronRight className={`icon ${calendarClassNames.icon || ""}`} />
        </button>
      </div>

      <div className={`weekdays ${calendarClassNames.weekdays || ""}`}>
        {weekDays.map((day) => (
          <div
            key={day}
            className={`weekday ${calendarClassNames.weekday || ""}`}
          >
            {day}
          </div>
        ))}
        {renderCalendarDays()}
      </div>
    </>
  );

  return (
    <div className={`calendar-container ${calendarClassNames.container || ""}`}>
      {currentView === "calendar" && renderCalendarView()}
      {currentView === "month" && renderMonthView()}
      {currentView === "year" && renderYearView()}
    </div>
  );
}
