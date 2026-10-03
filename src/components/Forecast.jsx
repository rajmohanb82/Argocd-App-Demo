import WeatherIcon from "./WeatherIcon.jsx";
import { describeWeather, formatDay, toFahrenheit } from "../weather.js";

function displayTemp(value, unit) {
  const next = unit === "F" ? toFahrenheit(value) : value;
  return `${Math.round(next)}°`;
}

export default function Forecast({ weather, unit }) {
  const { daily } = weather;

  return (
    <section className="forecast">
      <div className="section-head">
        <h3>Seven-day horizon</h3>
        <p>Highs, lows, and the mood of the week.</p>
      </div>
      <div className="forecast-grid">
        {daily.time.map((day, index) => {
          const info = describeWeather(daily.weather_code[index]);
          return (
            <article key={day} className="forecast-card">
              <p className="day">{index === 0 ? "Today" : formatDay(day, weather.timezone)}</p>
              <WeatherIcon type={info.type} size={40} />
              <p className="forecast-label">{info.label}</p>
              <p className="range">
                <strong>{displayTemp(daily.temperature_2m_max[index], unit)}</strong>
                <span>{displayTemp(daily.temperature_2m_min[index], unit)}</span>
              </p>
              <p className="precip">
                {daily.precipitation_probability_max[index] ?? 0}% rain
              </p>
            </article>
          );
        })}
      </div>
    </section>
  );
}
