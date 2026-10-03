import { useMemo } from "react";

function seeded(count, salt) {
  return Array.from({ length: count }, (_, index) => {
    const n = Math.sin((index + 1) * (salt + 2.17)) * 10000;
    const value = n - Math.floor(n);
    return {
      id: `${salt}-${index}`,
      left: value * 100,
      delay: value * 8,
      duration: 4 + (value * 9),
      size: 0.5 + value * 1.6,
      drift: -20 + value * 40,
    };
  });
}

export default function WeatherBackground({ type = "cloudy", isDay = true }) {
  const rain = useMemo(() => seeded(70, 1), []);
  const snow = useMemo(() => seeded(48, 2), []);
  const stars = useMemo(() => seeded(90, 3), []);
  const clouds = useMemo(() => seeded(6, 4), []);

  const scene = `${type} ${isDay ? "day" : "night"}`;

  return (
    <div className={`weather-bg ${scene}`} aria-hidden="true">
      <div className="sky-wash" />
      <div className="sun" />
      <div className="moon" />
      <div className="aurora" />

      <div className="starfield">
        {stars.map((star) => (
          <span
            key={star.id}
            className="star"
            style={{
              left: `${star.left}%`,
              top: `${(star.delay * 11) % 90}%`,
              animationDelay: `${star.delay}s`,
              transform: `scale(${star.size})`,
            }}
          />
        ))}
      </div>

      <div className="cloud-layer">
        {clouds.map((cloud, index) => (
          <span
            key={cloud.id}
            className={`cloud cloud-${index}`}
            style={{
              top: `${12 + index * 10}%`,
              animationDuration: `${28 + cloud.duration * 2}s`,
              animationDelay: `${-cloud.delay * 3}s`,
              opacity: 0.18 + (index % 3) * 0.12,
            }}
          />
        ))}
      </div>

      <div className="rain-layer">
        {rain.map((drop) => (
          <span
            key={drop.id}
            className="raindrop"
            style={{
              left: `${drop.left}%`,
              animationDelay: `${drop.delay * -1}s`,
              animationDuration: `${0.7 + drop.size * 0.6}s`,
            }}
          />
        ))}
      </div>

      <div className="snow-layer">
        {snow.map((flake) => (
          <span
            key={flake.id}
            className="snowflake"
            style={{
              left: `${flake.left}%`,
              animationDelay: `${flake.delay * -1}s`,
              animationDuration: `${6 + flake.duration}s`,
              fontSize: `${10 + flake.size * 10}px`,
              ["--drift"]: `${flake.drift}px`,
            }}
          >
            ✻
          </span>
        ))}
      </div>

      <div className="fog-layer">
        <span className="fog fog-a" />
        <span className="fog fog-b" />
        <span className="fog fog-c" />
      </div>

      <div className="lightning" />
      <div className="grain" />
    </div>
  );
}
