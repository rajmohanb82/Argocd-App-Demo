import { useEffect, useRef } from "react";

export default function SearchBar({
  query,
  onQueryChange,
  suggestions,
  loading,
  onSelect,
  onUseLocation,
  locating,
  open,
  setOpen,
}) {
  const boxRef = useRef(null);

  useEffect(() => {
    function onClick(event) {
      if (boxRef.current && !boxRef.current.contains(event.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [setOpen]);

  return (
    <div className="search-wrap" ref={boxRef}>
      <label className="search-box">
        <span className="search-icon" aria-hidden="true">
          ⌕
        </span>
        <input
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          onFocus={() => query.trim().length >= 2 && setOpen(true)}
          placeholder="Search any city, valley, or coast…"
          aria-label="Search location"
          autoComplete="off"
        />
        {loading && <span className="search-spinner" />}
      </label>
      <button type="button" className="ghost-btn" onClick={onUseLocation} disabled={locating}>
        {locating ? "Finding you…" : "Use my location"}
      </button>

      {open && suggestions.length > 0 && (
        <ul className="suggestions" role="listbox">
          {suggestions.map((place) => (
            <li key={place.id}>
              <button type="button" onClick={() => onSelect(place)}>
                <strong>{place.name}</strong>
                <span>{[place.admin1, place.country].filter(Boolean).join(" · ")}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
