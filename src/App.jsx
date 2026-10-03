import { useEffect, useMemo, useRef, useState } from "react";
import { fetchWeather, reverseLabel, searchPlaces } from "./api.js";
import { DEFAULT_PLACE, describeWeather } from "./weather.js";
import WeatherBackground from "./components/WeatherBackground.jsx";
import SearchBar from "./components/SearchBar.jsx";
import CurrentWeather from "./components/CurrentWeather.jsx";
import Forecast from "./components/Forecast.jsx";

const CONFIG = window.__APP_CONFIG__ ?? {
  title: "SkyCast",
  subtitle: "Live weather for GitOps classrooms",
  version: "1.0.0",
  labHint: "ConfigMap banner",
};

export default function App() {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [open, setOpen] = useState(false);
  const [searching, setSearching] = useState(false);
  const [locating, setLocating] = useState(false);
  const [place, setPlace] = useState(DEFAULT_PLACE);
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [unit, setUnit] = useState("C");
  const skipSearchRef = useRef(false);

  const scene = useMemo(() => {
    if (!weather) return { type: "cloudy", isDay: true, label: "Partly cloudy" };
    const info = describeWeather(weather.current.weather_code);
    return {
      ...info,
      isDay: weather.current.is_day === 1,
    };
  }, [weather]);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError("");
      try {
        const data = await fetchWeather(place.latitude, place.longitude);
        if (!cancelled) setWeather(data);
      } catch (err) {
        if (!cancelled) setError(err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [place]);

  useEffect(() => {
    const name = query.trim();
    if (skipSearchRef.current) {
      skipSearchRef.current = false;
      setSuggestions([]);
      setOpen(false);
      return undefined;
    }

    if (name.length < 2) {
      setSuggestions([]);
      setOpen(false);
      return undefined;
    }

    const timer = setTimeout(async () => {
      setSearching(true);
      try {
        const results = await searchPlaces(name);
        setSuggestions(results);
        setOpen(results.length > 0);
      } catch (err) {
        setError(err.message);
      } finally {
        setSearching(false);
      }
    }, 280);

    return () => clearTimeout(timer);
  }, [query]);

  function selectPlace(next) {
    skipSearchRef.current = true;
    setLoading(true);
    setPlace(next);
    setQuery(reverseLabel(next));
    setSuggestions([]);
    setOpen(false);
  }

  function useMyLocation() {
    if (!navigator.geolocation) {
      setError("This browser cannot share your location.");
      return;
    }

    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        selectPlace({
          id: "here",
          name: "My location",
          admin1: "",
          country: "GPS",
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        setLocating(false);
      },
      () => {
        setError("Location permission was denied. Search a city instead.");
        setLocating(false);
      }
    );
  }

  return (
    <div className={`app-shell ${scene.type} ${scene.isDay ? "day" : "night"}`}>
      <WeatherBackground type={scene.type} isDay={scene.isDay} />

      <main className="content">
        <header className="topbar">
          <div>
            <p className="brand-kicker">GitOps weather studio</p>
            <h1>{CONFIG.title}</h1>
            <p className="subtitle">{CONFIG.subtitle}</p>
          </div>
          <span className="version-pill">v{CONFIG.version}</span>
        </header>

        <p className="lab-hint">{CONFIG.labHint}</p>

        <SearchBar
          query={query}
          onQueryChange={setQuery}
          suggestions={suggestions}
          loading={searching}
          onSelect={selectPlace}
          onUseLocation={useMyLocation}
          locating={locating}
          open={open}
          setOpen={setOpen}
        />

        {error && <p className="banner error">{error}</p>}
        {loading && <p className="banner">Reading the sky…</p>}

        {weather && !loading && (
          <>
            <CurrentWeather
              place={{
                label: reverseLabel(place),
                type: scene.type,
                condition: scene.label,
              }}
              weather={weather}
              unit={unit}
              onToggleUnit={() => setUnit((prev) => (prev === "C" ? "F" : "C"))}
            />
            <Forecast weather={weather} unit={unit} />
          </>
        )}

        <footer className="footer">
          Weather by{" "}
          <a href="https://open-meteo.com/" target="_blank" rel="noreferrer">
            Open-Meteo
          </a>{" "}
          · Built for Argo CD drift and auto-heal labs
        </footer>
      </main>
    </div>
  );
}
