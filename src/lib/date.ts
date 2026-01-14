const CHICAGO_TZ = "America/Chicago";

export const getChicagoDateKey = (): string => {
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone: CHICAGO_TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  });
  const parts = formatter.formatToParts(new Date());
  const year = parts.find((part) => part.type === "year")?.value ?? "0000";
  const month = parts.find((part) => part.type === "month")?.value ?? "00";
  const day = parts.find((part) => part.type === "day")?.value ?? "00";
  return `${year}-${month}-${day}`;
};

const getTimeZoneOffset = (date: Date, timeZone: string): number => {
  const tzDate = new Date(date.toLocaleString("en-US", { timeZone }));
  return date.getTime() - tzDate.getTime();
};

export const getMsUntilChicagoMidnight = (): number => {
  const now = new Date();
  const offset = getTimeZoneOffset(now, CHICAGO_TZ);
  const chicagoNow = new Date(now.getTime() - offset);
  const chicagoMidnight = new Date(chicagoNow);
  chicagoMidnight.setHours(24, 0, 0, 0);
  return chicagoMidnight.getTime() - chicagoNow.getTime();
};
