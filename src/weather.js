const WEATHER_MAP = [
  { codes: [0], type: "clear", label: "Clear sky" },
  { codes: [1], type: "clear", label: "Mostly clear" },
  { codes: [2], type: "cloudy", label: "Partly cloudy" },
  { codes: [3], type: "overcast", label: "Overcast" },
  { codes: [45, 48], type: "fog", label: "Fog" },
  { codes: [51, 53, 55, 56, 57], type: "drizzle", label: "Drizzle" },
  { codes: [61, 63, 65, 66, 67, 80, 81, 82], type: "rain", label: "Rain" },
  { codes: [71, 73, 75, 77, 85, 86], type: "snow", label: "Snow" },
  { codes: [95, 96, 99], type: "thunder", label: "Thunderstorm" },
];

export function describeWeather(code) {
  const match = WEATHER_MAP.find((entry) => entry.codes.includes(code));
  return match ?? { type: "cloudy", label: "Changing skies" };
}

export function windDirection(degrees) {
  const points = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
  return points[Math.round(((degrees % 360) / 45)) % 8];
}

function wallClock(iso) {
  const normalized = iso.length === 10 ? `${iso}T12:00` : iso;
  const [datePart, timePart = "00:00"] = normalized.split("T");
  const [hour = "00", minute = "00"] = timePart.split(":");
  return new Date(
    Date.UTC(
      Number(datePart.slice(0, 4)),
      Number(datePart.slice(5, 7)) - 1,
      Number(datePart.slice(8, 10)),
      Number(hour),
      Number(minute)
    )
  );
}

export function formatClock(iso) {
  return new Intl.DateTimeFormat(undefined, {
    weekday: "long",
    hour: "numeric",
    minute: "2-digit",
    timeZone: "UTC",
  }).format(wallClock(iso));
}

export function formatDay(iso) {
  return new Intl.DateTimeFormat(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  }).format(wallClock(iso));
}

export function formatHour(iso) {
  return new Intl.DateTimeFormat(undefined, {
    hour: "numeric",
    minute: "2-digit",
    timeZone: "UTC",
  }).format(wallClock(iso));
}

export function toFahrenheit(celsius) {
  return (celsius * 9) / 5 + 32;
}

export const DEFAULT_PLACE = {
  id: "bengaluru-default",
  name: "Bengaluru",
  admin1: "Karnataka",
  country: "India",
  latitude: 12.9716,
  longitude: 77.5946,
  timezone: "Asia/Kolkata",
};
