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
  minDate,
  maxDate,
  clampNavigation,
  calendarClassNames = {},
}: CalendarProps) {
  const [viewDate, setViewDate] = useState(
    isEthiopian ? (date as EthiopianDate.EtDate) : (date as Date),
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
      { month: "long" },
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

  // Range helpers for clamping (layer library hard bounds with user bounds)
  const normalize = (d?: Date) =>
    d ? new Date(d.getFullYear(), d.getMonth(), d.getDate()) : undefined;
  const libMin = normalize(EthiopianDate.minEurDate);
  const libMax = normalize(EthiopianDate.maxEurDate);
  const userMin = normalize(minDate);
  const userMax = normalize(maxDate);
  const minN = (() => {
    if (libMin && userMin) return userMin > libMin ? userMin : libMin;
    return userMin ?? libMin;
  })();
  const maxN = (() => {
    if (libMax && userMax) return userMax < libMax ? userMax : libMax;
    return userMax ?? libMax;
  })();

  const monthRange = (month: number, year: number) => {
    if (isEthiopian) {
      const startGreg = EthiopianDate.toGreg({
        Day: 1,
        Month: month,
        Year: year,
      });
      const endDay = EthiopianDate.ethiopianMonthLength(month, year);
      const endGreg = EthiopianDate.toGreg({
        Day: endDay,
        Month: month,
        Year: year,
      });
      const start = new Date(
        startGreg.getFullYear(),
        startGreg.getMonth(),
        startGreg.getDate(),
      );
      const end = new Date(
        endGreg.getFullYear(),
        endGreg.getMonth(),
        endGreg.getDate(),
      );
      return { start, end };
    } else {
      const start = new Date(year, month - 1, 1);
      const end = new Date(year, month, 0);
      return { start, end };
    }
  };

  const yearRange = (year: number) => {
    if (isEthiopian) {
      const startGreg = EthiopianDate.toGreg({ Day: 1, Month: 1, Year: year });
      const lastMonthLen = EthiopianDate.ethiopianMonthLength(13, year);
      const endGreg = EthiopianDate.toGreg({
        Day: lastMonthLen,
        Month: 13,
        Year: year,
      });
      return {
        start: new Date(
          startGreg.getFullYear(),
          startGreg.getMonth(),
          startGreg.getDate(),
        ),
        end: new Date(
          endGreg.getFullYear(),
          endGreg.getMonth(),
          endGreg.getDate(),
        ),
      };
    } else {
      return { start: new Date(year, 0, 1), end: new Date(year, 11, 31) };
    }
  };

  const hasIntersection = (start: Date, end: Date) => {
    if (minN && end < minN) return false;
    if (maxN && start > maxN) return false;
    return true;
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
          (viewDate as EthiopianDate.EtDate).Year,
        )
      : getDaysInMonth(
          (viewDate as Date).getMonth() + 1,
          (viewDate as Date).getFullYear(),
        );

    const firstDay = getFirstDayOfMonth();

    for (let i = 0; i < firstDay; i++) {
      days.push(
        <div
          key={`empty-${i}`}
          className={`empty-day-cell ${calendarClassNames.emptyDayCell || ""}`}
        />,
      );
    }

    for (let i = 1; i <= totalDays; i++) {
      const candidateDate = (() => {
        if (isEthiopian) {
          const greg = EthiopianDate.toGreg({
            Day: i,
            Month: (viewDate as EthiopianDate.EtDate).Month,
            Year: (viewDate as EthiopianDate.EtDate).Year,
          });
          return new Date(greg.getFullYear(), greg.getMonth(), greg.getDate());
        } else {
          return new Date(
            (viewDate as Date).getFullYear(),
            (viewDate as Date).getMonth(),
            i,
          );
        }
      })();

      const normalize = (d?: Date) =>
        d ? new Date(d.getFullYear(), d.getMonth(), d.getDate()) : undefined;
      const minN = normalize(minDate);
      const maxN = normalize(maxDate);
      const isBeforeMin = minN ? candidateDate < minN : false;
      const isAfterMax = maxN ? candidateDate > maxN : false;
      const isDisabled = isBeforeMin || isAfterMax;

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
            (viewDate as EthiopianDate.EtDate).Year,
          )
        : isToday(
            i,
            (viewDate as Date).getMonth() + 1,
            (viewDate as Date).getFullYear(),
          );

      days.push(
        <div key={i} className={`day-cell ${calendarClassNames.dayCell || ""}`}>
          <button
            type="button"
            ref={isSelected ? selectedDateRef : null}
            onClick={
              isDisabled
                ? undefined
                : () => {
                    if (isEthiopian) {
                      onChange({
                        Day: i,
                        Month: (viewDate as EthiopianDate.EtDate).Month,
                        Year: (viewDate as EthiopianDate.EtDate).Year,
                      });
                    } else {
                      const existingDate = date as Date | undefined;
                      const hours = existingDate ? existingDate.getHours() : 0;
                      const minutes = existingDate
                        ? existingDate.getMinutes()
                        : 0;
                      const seconds = existingDate
                        ? existingDate.getSeconds()
                        : 0;

                      const newDate = new Date(
                        (viewDate as Date).getFullYear(),
                        (viewDate as Date).getMonth(),
                        i,
                        hours,
                        minutes,
                        seconds,
                      );
                      onChange(newDate);
                    }
                  }
            }
            disabled={isDisabled}
            className={`day-button ${calendarClassNames.dayButton || ""} ${
              isSelected ? calendarClassNames.selected || "selected" : ""
            } ${isTodayDate ? calendarClassNames.today || "selected" : ""} ${
              isTodayDate && !isSelected ? "today" : ""
            } ${isDisabled ? "disabled" : ""}`}
          >
            {i}
          </button>
        </div>,
      );
    }
    return days;
  };

  const weekDays = isEthiopian
    ? EthiopianDate.shortDays
    : ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const years = (() => {
    if (isEthiopian) {
      const startEt = EthiopianDate.toEth(minN ?? EthiopianDate.minEurDate);
      const endEt = EthiopianDate.toEth(maxN ?? EthiopianDate.maxEurDate);
      const startY = Math.min(startEt.Year, endEt.Year);
      const endY = Math.max(startEt.Year, endEt.Year);
      const len = endY - startY + 1;
      return Array.from({ length: len }, (_, i) => startY + i);
    } else {
      const startY = (minN ?? EthiopianDate.minEurDate).getFullYear();
      const endY = (maxN ?? EthiopianDate.maxEurDate).getFullYear();
      const s = Math.min(startY, endY);
      const e = Math.max(startY, endY);
      const len = e - s + 1;
      return Array.from({ length: len }, (_, i) => s + i);
    }
  })();

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
            disabled={
              !!clampNavigation &&
              (() => {
                const yr = isEthiopian
                  ? (viewDate as EthiopianDate.EtDate).Year
                  : (viewDate as Date).getFullYear();
                const r = monthRange(month.value, yr);
                return !hasIntersection(r.start, r.end);
              })()
            }
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
            disabled={
              !!clampNavigation &&
              (() => {
                const r = yearRange(year);
                return !hasIntersection(r.start, r.end);
              })()
            }
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
          disabled={
            !!clampNavigation &&
            (() => {
              if (isEthiopian) {
                const ethDate = viewDate as EthiopianDate.EtDate;
                const target =
                  ethDate.Month > 1
                    ? { Year: ethDate.Year, Month: ethDate.Month - 1 }
                    : { Year: ethDate.Year - 1, Month: 13 };
                const r = monthRange(target.Month, target.Year);
                return !hasIntersection(r.start, r.end);
              } else {
                const date = viewDate as Date;
                const y = date.getFullYear();
                const m0 = date.getMonth();
                const targetM = m0 === 0 ? 12 : m0; // 1-12
                const targetY = m0 === 0 ? y - 1 : y;
                const r = monthRange(targetM, targetY);
                return !hasIntersection(r.start, r.end);
              }
            })()
          }
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
          disabled={
            !!clampNavigation &&
            (() => {
              if (isEthiopian) {
                const ethDate = viewDate as EthiopianDate.EtDate;
                const target =
                  ethDate.Month < 13
                    ? { Year: ethDate.Year, Month: ethDate.Month + 1 }
                    : { Year: ethDate.Year + 1, Month: 1 };
                const r = monthRange(target.Month, target.Year);
                return !hasIntersection(r.start, r.end);
              } else {
                const date = viewDate as Date;
                const y = date.getFullYear();
                const m0 = date.getMonth();
                const targetM = m0 === 11 ? 1 : m0 + 2; // 1-12
                const targetY = m0 === 11 ? y + 1 : y;
                const r = monthRange(targetM, targetY);
                return !hasIntersection(r.start, r.end);
              }
            })()
          }
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
