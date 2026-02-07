import {
  addDays,
  formatDate,
  getISOWeek,
  isAfter,
  startOfWeek,
} from "date-fns";

interface RecurringCalendarPreviewProps {
  startDate?: Date;
  endDate?: Date;
  selectedDay?: string;
  selectedWeek?: string;
  maxHeightClassName?: string;
}

const DAYS = [
  { label: "L", value: "Lunes" },
  { label: "M", value: "Martes" },
  { label: "X", value: "Miércoles" },
  { label: "J", value: "Jueves" },
  { label: "V", value: "Viernes" },
];

function RecurringCalendarPreview({
  startDate,
  endDate,
  selectedDay,
  selectedWeek,
  maxHeightClassName = "max-h-72",
}: RecurringCalendarPreviewProps) {
  const effectiveDay = selectedDay ?? "";
  const effectiveWeek = selectedWeek ?? "todas";
  const weeksPreview = buildWeeksPreview(startDate, endDate, effectiveWeek);

  return (
    <div className="mt-3 rounded-md border bg-gray-50 p-3">
      <div className="mb-2 text-sm font-medium text-[#1a3a5a]">
        Previsualización de calendario
      </div>

      {startDate && endDate ? (
        <div
          className={`space-y-2 overflow-auto text-xs ${maxHeightClassName}`}
        >
          <div className="flex items-center gap-2 text-gray-500">
            <span className="w-16">Semana</span>
            <div className="grid grow grid-cols-5 gap-1">
              {DAYS.map((day) => (
                <span
                  key={day.value}
                  className="rounded bg-white px-2 py-1 text-center"
                >
                  {day.label}
                </span>
              ))}
            </div>
          </div>

          {weeksPreview.map((week, index) => {
            const previousWeek = weeksPreview[index - 1];
            const isNewMonth =
              !previousWeek ||
              formatDate(previousWeek.start, "MMMM") !==
                formatDate(week.start, "MMMM");

            return (
              <div key={week.start.toISOString()} className="space-y-1">
                {isNewMonth && (
                  <div className="pl-16 text-[11px] font-semibold text-[#1a3a5a]">
                    {formatDate(week.start, "MMMM")}
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <span
                    className={`w-16 rounded px-2 py-1 text-center text-xs font-semibold ${
                      week.isSelectedWeek
                        ? "bg-blue-600 text-white"
                        : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    {week.weekNumber}
                  </span>

                  <div className="grid grow grid-cols-5 gap-1">
                    {DAYS.map((day, dayIndex) => {
                      const dayDate = addDays(week.start, dayIndex);
                      const isDaySelected = day.value === effectiveDay;
                      const isActive = week.isSelectedWeek && isDaySelected;
                      const isOutsideRange =
                        (startDate && isAfter(startDate, dayDate)) ||
                        (endDate && isAfter(dayDate, endDate));

                      return (
                        <span
                          key={day.value}
                          className={`rounded px-2 py-1 text-center ${
                            isOutsideRange
                              ? "bg-white text-gray-300"
                              : isActive
                                ? "bg-emerald-600 text-white"
                                : isDaySelected
                                  ? "bg-emerald-100 text-emerald-800"
                                  : "bg-white text-gray-600"
                          }`}
                        >
                          {formatDate(dayDate, "d")}
                        </span>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-xs text-gray-500">
          Selecciona fechas de inicio y fin para ver la previsualización.
        </p>
      )}
    </div>
  );
}

export default RecurringCalendarPreview;

function buildWeeksPreview(
  startDate: Date | undefined,
  endDate: Date | undefined,
  effectiveWeek: string,
) {
  if (!startDate || !endDate) return [];

  const start = startOfWeek(startDate, { weekStartsOn: 1 });
  const end = startOfWeek(endDate, { weekStartsOn: 1 });
  const weeks: {
    start: Date;
    weekNumber: number;
    isSelectedWeek: boolean;
  }[] = [];
  let cursor = start;

  while (!isAfter(cursor, end)) {
    const weekNumber = getISOWeek(cursor);
    const isEven = weekNumber % 2 === 0;
    const isSelectedWeek =
      effectiveWeek === "semanal" ||
      (effectiveWeek === "pares" ? isEven : !isEven);

    weeks.push({
      start: cursor,
      weekNumber,
      isSelectedWeek,
    });

    cursor = addDays(cursor, 7);
  }

  return weeks;
}
