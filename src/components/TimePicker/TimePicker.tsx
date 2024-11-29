import React, { useState, useRef, useEffect } from "react";
import * as Popover from "@radix-ui/react-popover";
import { Clock } from "lucide-react";
import * as Switch from "@radix-ui/react-switch";
import { TimeFormat, TimePickerProps } from "../../types/index";
import "./TimePicker.css";

export default function TimePicker({
  selectedTime,
  onTimeChange,
  timeFormat: initialTimeFormat = "12h",
  timePickerClassNames = {},
  popoverProps = {},
}: TimePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [localSelectedTime, setLocalSelectedTime] = useState(
    selectedTime || "12:00 AM"
  );
  const [timeFormat, setTimeFormat] = useState<TimeFormat>(initialTimeFormat);

  const hourRef = useRef<HTMLDivElement>(null);
  const minuteRef = useRef<HTMLDivElement>(null);

  const hours =
    timeFormat === "12h"
      ? Array.from({ length: 12 }, (_, i) =>
          (i + 1).toString().padStart(2, "0")
        )
      : Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, "0"));
  const minutes = Array.from({ length: 60 }, (_, i) =>
    i.toString().padStart(2, "0")
  );

  useEffect(() => {
    setLocalSelectedTime(selectedTime || "12:00 AM");
  }, [selectedTime]);

  useEffect(() => {
    setTimeFormat(initialTimeFormat);
  }, [initialTimeFormat]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        centerSelectedTime();
      }, 0);
    }
  }, [isOpen, localSelectedTime, timeFormat]);

  const centerSelectedTime = () => {
    const [hour, minute] = localSelectedTime.split(":");
    const [minuteValue] = minute.split(" ");
    scrollToSelectedItem(hourRef, convertHourToCurrentFormat(hour));
    scrollToSelectedItem(minuteRef, minuteValue);
  };

  const scrollToSelectedItem = (
    ref: React.RefObject<HTMLDivElement>,
    value: string
  ) => {
    if (ref.current) {
      const container = ref.current;
      const selectedElement = container.querySelector(
        `[data-value="${value}"]`
      ) as HTMLElement;
      if (selectedElement) {
        const containerHeight = container.clientHeight;
        const itemHeight = selectedElement.offsetHeight;
        const totalHeight = container.scrollHeight;
        const maxScroll = totalHeight - containerHeight;

        let scrollTop =
          selectedElement.offsetTop - containerHeight / 2 + itemHeight / 2;

        scrollTop = Math.max(0, Math.min(scrollTop, maxScroll));

        container.scrollTop = scrollTop;
      }
    }
  };

  const convertHourToCurrentFormat = (hour: string): string => {
    const hourNum = parseInt(hour);
    if (timeFormat === "12h") {
      if (hourNum === 0) return "12";
      if (hourNum > 12) return (hourNum - 12).toString().padStart(2, "0");
      return hour;
    } else {
      if (hourNum === 12 && localSelectedTime.includes("AM")) return "00";
      if (hourNum < 12 && localSelectedTime.includes("PM"))
        return (hourNum + 12).toString().padStart(2, "0");
      return hour;
    }
  };

  // const handleTimeClick = (type: "hour" | "minute", value: string) => {
  //   const [currentHour, currentMinute] = localSelectedTime.split(":");
  //   const [minuteValue, period] = currentMinute.split(" ");

  //   let newTime: string;
  //   if (type === "hour") {
  //     if (timeFormat === "24h") {
  //       newTime = `${value}:${minuteValue}`;
  //     } else {
  //       newTime = `${value}:${minuteValue} ${
  //         period || (parseInt(value) >= 12 ? "PM" : "AM")
  //       }`;
  //     }
  //   } else {
  //     if (timeFormat === "24h") {
  //       newTime = `${currentHour}:${value}`;
  //     } else {
  //       newTime = `${currentHour}:${value} ${
  //         period || (parseInt(currentHour) >= 12 ? "PM" : "AM")
  //       }`;
  //     }
  //   }

  //   setLocalSelectedTime(newTime);
  //   onTimeChange(newTime);
  // };
  const handleTimeClick = (type: "hour" | "minute", value: string) => {
    const [currentHour, currentMinute] = localSelectedTime.split(":");
    const [minuteValue, period] = currentMinute.split(" ");

    let newTime: string;
    if (type === "hour") {
      if (timeFormat === "24h") {
        newTime = `${value}:${minuteValue}`;
      } else {
        newTime = `${value}:${minuteValue} ${
          period || (parseInt(value) >= 12 ? "PM" : "AM")
        }`;
      }
    } else {
      if (timeFormat === "24h") {
        newTime = `${currentHour}:${value}`;
      } else {
        newTime = `${currentHour}:${value} ${
          period || (parseInt(currentHour) >= 12 ? "PM" : "AM")
        }`;
      }
    }

    setLocalSelectedTime(newTime);
    onTimeChange(newTime);
  };

  // const handlePeriodClick = (newPeriod: "AM" | "PM") => {
  //   const [hour, minute] = localSelectedTime.split(":");
  //   let newHour = hour;
  //   if (newPeriod === "PM" && parseInt(hour) < 12) {
  //     newHour = (parseInt(hour) + 12).toString().padStart(2, "0");
  //   } else if (newPeriod === "AM" && parseInt(hour) >= 12) {
  //     newHour = (parseInt(hour) - 12).toString().padStart(2, "0");
  //     if (newHour === "00") newHour = "12";
  //   }
  //   const newTime = `${newHour}:${minute.split(" ")[0]} ${newPeriod}`;
  //   setLocalSelectedTime(newTime);
  //   onTimeChange(newTime);
  // };
  const handlePeriodClick = (newPeriod: "AM" | "PM") => {
    const [hour, minute] = localSelectedTime.split(":");
    const [minuteValue] = minute.split(" ");
    let newHour = parseInt(hour);

    if (newPeriod === "PM" && newHour < 12) {
      newHour += 12;
    } else if (newPeriod === "AM" && newHour >= 12) {
      newHour -= 12;
    }

    const newTime = `${newHour
      .toString()
      .padStart(2, "0")}:${minuteValue} ${newPeriod}`;
    setLocalSelectedTime(newTime);
    onTimeChange(newTime);
  };

  // const toggleTimeFormat = () => {
  //   setTimeFormat((prev) => {
  //     const newFormat = prev === "12h" ? "24h" : "12h";
  //     const [hour, minute] = localSelectedTime.split(":");
  //     const [minuteValue, period] = minute.split(" ");

  //     let newHour: string;
  //     let newPeriod = period || (parseInt(hour) >= 12 ? "PM" : "AM");

  //     if (newFormat === "24h") {
  //       newHour = (
  //         parseInt(hour) +
  //         (newPeriod === "PM" && parseInt(hour) !== 12 ? 12 : 0)
  //       )
  //         .toString()
  //         .padStart(2, "0");
  //       if (newHour === "24") newHour = "00";
  //     } else {
  //       let hourNum = parseInt(hour);
  //       if (hourNum === 0) {
  //         newHour = "12";
  //         newPeriod = "AM";
  //       } else if (hourNum === 12) {
  //         newHour = "12";
  //         newPeriod = "PM";
  //       } else if (hourNum > 12) {
  //         newHour = (hourNum - 12).toString().padStart(2, "0");
  //         newPeriod = "PM";
  //       } else {
  //         newHour = hour;
  //         newPeriod = "AM";
  //       }
  //     }

  //     const newTime = `${newHour}:${minuteValue}${
  //       newPeriod ? ` ${newPeriod}` : ""
  //     }`;
  //     setLocalSelectedTime(newTime);
  //     onTimeChange(newTime);
  //     return newFormat;
  //   });
  // };
  const toggleTimeFormat = () => {
    setTimeFormat((prev) => {
      const newFormat = prev === "12h" ? "24h" : "12h";
      const [hour, minute] = localSelectedTime.split(":");
      const [minuteValue, period] = minute.split(" ");

      let newHour: string;
      let newPeriod = "";

      if (newFormat === "24h") {
        newHour = (
          parseInt(hour) + (period === "PM" && parseInt(hour) !== 12 ? 12 : 0)
        )
          .toString()
          .padStart(2, "0");
        if (newHour === "24") newHour = "00";
      } else {
        let hourNum = parseInt(hour);
        if (hourNum === 0) {
          newHour = "12";
          newPeriod = "AM";
        } else if (hourNum === 12) {
          newHour = "12";
          newPeriod = "PM";
        } else if (hourNum > 12) {
          newHour = (hourNum - 12).toString().padStart(2, "0");
          newPeriod = "PM";
        } else {
          newHour = hour;
          newPeriod = "AM";
        }
      }

      const newTime = `${newHour}:${minuteValue}${
        newPeriod ? ` ${newPeriod}` : ""
      }`;
      setLocalSelectedTime(newTime);
      onTimeChange(newTime);
      return newFormat;
    });
  };

  const formatTime = (time: string): string => {
    const [hour, minute] = time.split(":");
    const [minuteValue, period] = minute.split(" ");
    if (timeFormat === "12h") {
      const hourNum = parseInt(hour);
      const periodValue = period || (hourNum >= 12 ? "PM" : "AM");
      const hour12 = hourNum % 12 || 12;
      return `${hour12
        .toString()
        .padStart(2, "0")}:${minuteValue} ${periodValue}`;
    } else {
      return `${hour.padStart(2, "0")}:${minuteValue}`;
    }
  };

  return (
    <Popover.Root open={isOpen} onOpenChange={setIsOpen}>
      <Popover.Trigger asChild>
        <button
          className={`trigger-button ${
            timePickerClassNames.triggerButton || ""
          }`}
        >
          <Clock className={`icon ${timePickerClassNames.icon || ""}`} />
          <span
            className={`time-display ${
              timePickerClassNames.timeDisplay || ""
            } ${!selectedTime ? "placeholder" : ""}`}
          >
            {formatTime(localSelectedTime)}
          </span>
        </button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          className={`popover-content ${
            timePickerClassNames.popoverContent || ""
          }`}
          side={popoverProps.side || "bottom"}
          sideOffset={popoverProps.sideOffset || 5}
          align={popoverProps.align || "center"}
          alignOffset={popoverProps.alignOffset || 0}
          avoidCollisions={popoverProps.avoidCollisions || true}
          collisionBoundary={popoverProps.collisionBoundary || undefined}
          collisionPadding={popoverProps.collisionPadding || 10}
        >
          <div className={`header ${timePickerClassNames.header || ""}`}>
            <h3 className={`heading ${timePickerClassNames.heading || ""}`}>
              Select Time
            </h3>
            <div
              className={`time-format-toggle ${
                timePickerClassNames.timeFormatToggle || ""
              }`}
            >
              <span
                className={`time-format-label ${
                  timePickerClassNames.timeFormatLabel || ""
                }`}
              >
                24h
              </span>
              <Switch.Root
                checked={timeFormat === "24h"}
                onCheckedChange={toggleTimeFormat}
                className={`switch-root ${
                  timePickerClassNames.switchRoot || ""
                }`}
              >
                <Switch.Thumb
                  className={`switch-thumb ${
                    timePickerClassNames.switchThumb || ""
                  }`}
                />
              </Switch.Root>
            </div>
          </div>
          <div
            className={`time-sections ${
              timePickerClassNames.timeSections || ""
            }`}
          >
            <div
              className={`time-section ${
                timePickerClassNames.timeSection || ""
              }`}
            >
              <div
                className={`time-section-title ${
                  timePickerClassNames.timeSectionTitle || ""
                }`}
              >
                Hour
              </div>
              <div
                className={`timeSectionWrapper ${
                  timePickerClassNames.timeSectionWrapper || ""
                }`}
              >
                <div
                  className={`dividerWrapper ${
                    timePickerClassNames.dividerWrapper || ""
                  }`}
                >
                  <div
                    className={`divider ${timePickerClassNames.divider || ""}`}
                  ></div>
                </div>
                <div
                  ref={hourRef}
                  className={`time-list ${timePickerClassNames.timeList || ""}`}
                >
                  <div
                    className={`spacer ${timePickerClassNames.spacer || ""}`}
                  ></div>
                  {hours.map((hour) => (
                    <div
                      key={hour}
                      className={`time-item ${
                        timePickerClassNames.timeItem || ""
                      } ${
                        convertHourToCurrentFormat(
                          localSelectedTime.split(":")[0]
                        ) === hour
                          ? `${timePickerClassNames.activeTimeItem || "active"}`
                          : ""
                      }`}
                      onClick={() => handleTimeClick("hour", hour)}
                      data-value={hour}
                    >
                      {hour}
                    </div>
                  ))}
                  <div
                    className={`spacer ${timePickerClassNames.spacer || ""}`}
                  ></div>
                </div>
              </div>
            </div>
            <div
              className={`time-section ${
                timePickerClassNames.timeSection || ""
              }`}
            >
              <div
                className={`time-section-title ${timePickerClassNames.timeSectionTitle}`}
              >
                Minute
              </div>
              <div
                className={`timeSectionWrapper ${
                  timePickerClassNames.timeSectionWrapper || ""
                }`}
              >
                <div
                  className={`dividerWrapper ${
                    timePickerClassNames.dividerWrapper || ""
                  }`}
                >
                  <div
                    className={`divider ${timePickerClassNames.divider || ""}`}
                  ></div>
                </div>
                <div
                  ref={minuteRef}
                  className={`time-list ${timePickerClassNames.timeList || ""}`}
                >
                  <div
                    className={`spacer ${timePickerClassNames.spacer || ""}`}
                  ></div>
                  {minutes.map((minute) => (
                    <div
                      key={minute}
                      className={`time-item ${
                        timePickerClassNames.timeItem || ""
                      } ${
                        localSelectedTime.split(":")[1].split(" ")[0] === minute
                          ? `${timePickerClassNames.activeTimeItem || "active"}`
                          : ""
                      }`}
                      onClick={() => handleTimeClick("minute", minute)}
                      data-value={minute}
                    >
                      {minute}
                    </div>
                  ))}
                  <div
                    className={`spacer ${timePickerClassNames.spacer || ""}`}
                  ></div>
                </div>
              </div>
            </div>
            {timeFormat === "12h" && (
              <div
                className={`time-section ${
                  timePickerClassNames.timeSection || ""
                }`}
              >
                <div
                  className={`time-section-title ${
                    timePickerClassNames.timeSectionTitle || ""
                  }`}
                >
                  AM/PM
                </div>
                <div
                  className={`am-pm-buttons ${
                    timePickerClassNames.amPmButtons || ""
                  }`}
                >
                  {["AM", "PM"].map((period) => (
                    <button
                      key={period}
                      className={`am-pm-button ${
                        timePickerClassNames.amPmButton || ""
                      } ${
                        (localSelectedTime.split(" ")[1] ||
                          (parseInt(localSelectedTime.split(":")[0], 10) >= 12
                            ? "PM"
                            : "AM")) === period
                          ? `${
                              timePickerClassNames.activeAmPmButton ||
                              "active-am-pm-button"
                            }`
                          : ""
                      }`}
                      onClick={() => handlePeriodClick(period as "AM" | "PM")}
                    >
                      {period}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
