import React, { useState, useEffect, useRef } from "react";
import "./AddressSearch.css";

const AddressSearch = ({ onSelect, placeholder = "🔍 Search Location" }) => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [active, setActive] = useState(-1);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (!query) return setSuggestions([]);

      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${query}&format=json&addressdetails=1&limit=5`
        );
        const data = await res.json();

        const formatted = data.map((item) => ({
          name: item.display_name,
          lat: parseFloat(item.lat),
          lng: parseFloat(item.lon),
        }));

        setSuggestions(formatted);
      } catch (err) {
        console.error("❌ Error fetching suggestions:", err);
      }
    };

    const delayDebounce = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(delayDebounce);
  }, [query]);

  const handleSelect = (place) => {
    setQuery(place.name);
    setSuggestions([]);
    onSelect(place);
  };

  const handleKeyDown = (e) => {
    if (e.key === "ArrowDown") {
      setActive((prev) => (prev < suggestions.length - 1 ? prev + 1 : prev));
    } else if (e.key === "ArrowUp") {
      setActive((prev) => (prev > 0 ? prev - 1 : -1));
    } else if (e.key === "Enter" && active >= 0) {
      handleSelect(suggestions[active]);
    }
  };

  return (
    <div className="address-search" ref={dropdownRef}>
      <input
        type="text"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setActive(-1);
        }}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className="address-input"
      />
      {suggestions.length > 0 && (
        <ul className="suggestions-dropdown">
          {suggestions.map((place, index) => (
            <li
              key={index}
              className={index === active ? "active" : ""}
              onClick={() => handleSelect(place)}
            >
              {place.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AddressSearch;
