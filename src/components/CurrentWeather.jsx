import WeatherIcon from "./WeatherIcon.jsx";
import { formatClock, formatHour, toFahrenheit, windDirection } from "../weather.js";

function displayTemp(value, unit) {
  const next = unit === "F" ? toFahrenheit(value) : value;
  return `${Math.round(next)}°`;
}

export default function CurrentWeather({ place, weather, unit, onToggleUnit }) {
  const { current, current_units: units, daily } = weather;
  const isDay = current.is_day === 1;
  const label = place.label;
  const timeZone = weather.timezone;

  return (
    <section className="hero-card">
      <div className="hero-top">
        <div>
          <p className="eyebrow">{isDay ? "Daylight chapter" : "Night chapter"}</p>
          <h2>{label}</h2>
          <p className="subtle">{formatClock(current.time, timeZone)}</p>
        </div>
        <button type="button" className="unit-toggle" onClick={onToggleUnit}>
          {unit === "C" ? "°C" : "°F"}
        </button>
      </div>

      <div className="hero-temp">
        <div className="temp-block">
          <span className="temp">{displayTemp(current.temperature_2m, unit)}</span>
          <p className="condition">{place.condition}</p>
          <p className="feels">
            Feels like {displayTemp(current.apparent_temperature, unit)}
            {unit}
          </p>
        </div>
        <div className="hero-icon">
          <WeatherIcon type={place.type} isDay={isDay} size={92} />
        </div>
      </div>

      <dl className="metrics">
        <div>
          <dt>Humidity</dt>
          <dd>{Math.round(current.relative_humidity_2m)}%</dd>
        </div>
        <div>
          <dt>Wind</dt>
          <dd>
            {Math.round(current.wind_speed_10m)} {units.wind_speed_10m}{" "}
            {windDirection(current.wind_direction_10m)}
          </dd>
        </div>
        <div>
          <dt>Pressure</dt>
          <dd>
            {Math.round(current.pressure_msl)} {units.pressure_msl}
          </dd>
        </div>
        <div>
          <dt>Rain now</dt>
          <dd>
            {current.precipitation} {units.precipitation}
          </dd>
        </div>
        <div>
          <dt>Sunrise</dt>
          <dd>{formatHour(daily.sunrise[0], timeZone)}</dd>
        </div>
        <div>
          <dt>Sunset</dt>
          <dd>{formatHour(daily.sunset[0], timeZone)}</dd>
        </div>
      </dl>
    </section>
  );
}
