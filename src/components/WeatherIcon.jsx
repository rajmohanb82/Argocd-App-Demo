export default function WeatherIcon({ type, isDay = true, size = 56 }) {
  const stroke = "currentColor";

  if (type === "clear") {
    return (
      <svg width={size} height={size} viewBox="0 0 64 64" fill="none" aria-hidden="true">
        {isDay ? (
          <>
            <circle cx="32" cy="32" r="12" fill="#ffd166" />
            {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
              <line
                key={angle}
                x1="32"
                y1="32"
                x2={32 + 24 * Math.cos((angle * Math.PI) / 180)}
                y2={32 + 24 * Math.sin((angle * Math.PI) / 180)}
                stroke="#ffd166"
                strokeWidth="3"
                strokeLinecap="round"
              />
            ))}
          </>
        ) : (
          <path
            d="M40 18a16 16 0 1 0 10 28 20 20 0 1 1-10-28Z"
            fill="#f4f1de"
          />
        )}
      </svg>
    );
  }

  if (type === "snow") {
    return (
      <svg width={size} height={size} viewBox="0 0 64 64" fill="none" aria-hidden="true">
        <path d="M32 10v44M14 21l36 22M14 43l36-22" stroke={stroke} strokeWidth="3" />
        <circle cx="32" cy="32" r="4" fill={stroke} />
      </svg>
    );
  }

  if (type === "thunder") {
    return (
      <svg width={size} height={size} viewBox="0 0 64 64" fill="none" aria-hidden="true">
        <path
          d="M18 28h18l-6 14h12L24 56l6-16H16l2-12Z"
          fill="#ffd166"
        />
        <path
          d="M18 30c0-9 8-16 18-16 8 0 15 5 17 12"
          stroke={stroke}
          strokeWidth="3"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  if (type === "rain" || type === "drizzle") {
    return (
      <svg width={size} height={size} viewBox="0 0 64 64" fill="none" aria-hidden="true">
        <path
          d="M18 30c0-9 8-16 18-16 8 0 15 5 17 12 6 1 11 7 11 14 0 8-6 14-14 14H22c-8 0-14-6-14-14 0-7 5-12 10-14Z"
          stroke={stroke}
          strokeWidth="3"
        />
        <path d="M24 52l-3 8M32 52l-3 8M40 52l-3 8" stroke="#9ad0ff" strokeWidth="3" />
      </svg>
    );
  }

  if (type === "fog") {
    return (
      <svg width={size} height={size} viewBox="0 0 64 64" fill="none" aria-hidden="true">
        <path d="M12 26h40M10 34h44M14 42h36" stroke={stroke} strokeWidth="3" strokeLinecap="round" />
      </svg>
    );
  }

  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" aria-hidden="true">
      <path
        d="M18 34c0-9 8-16 18-16 8 0 15 5 17 12 6 1 11 7 11 14 0 8-6 14-14 14H22c-8 0-14-6-14-14 0-7 5-12 10-14Z"
        stroke={stroke}
        strokeWidth="3"
      />
    </svg>
  );
}
