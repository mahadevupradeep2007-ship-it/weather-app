import { useState } from "react";
import "./weather.css";

function App() {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [weather, setWeather] = useState(null);

  const handleInputChange = async (e) => {
    const value = e.target.value;
    setQuery(value);

    if (value.length < 2) {
      setSuggestions([]);
      return;
    }

    try {
      const res = await fetch(
        `https://api.openweathermap.org/geo/1.0/direct?q=${value}&limit=5&appid=b1d6ca738f67fa2d1f9d39b296284bbc`
      );

      const data = await res.json();
      setSuggestions(data);
    } catch (err) {
      console.error(err);
    }
  };
  const handleSearch = async () => {
    if (!query) return;

    try {
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${query}&appid=b1d6ca738f67fa2d1f9d39b296284bbc&units=metric`
      );

      if (!res.ok) throw new Error("City not found");

      const data = await res.json();

      setWeather({
        city: data.name,
        country: data.sys.country,
        temp: `${data.main.temp}°C`,
      });

      setSuggestions([]); // clear dropdown
    } catch {
      setWeather(null);
      alert("City not found");
    }
  };

return (
  <div className="container">
    <div className="card">
      <h1 className="title">Weather Finder</h1>

      <input
        className="input"
        value={query}
        onChange={handleInputChange}
        placeholder="Enter city..."
      />

      <button className="button" onClick={handleSearch}>
        Search
      </button>

      {suggestions.length > 0 && (
        <ul className="suggestions">
          {suggestions.map((item, index) => (
            <li
              key={index}
              onClick={() => {
                setQuery(item.name);
                setSuggestions([]);
              }}
            >
              {item.name}, {item.country}
            </li>
          ))}
        </ul>
      )}

      {weather && (
        <div className="weather-box">
          <h2>
            {weather.city}, {weather.country}
          </h2>
          <p className="temp">{weather.temp}</p>
        </div>
      )}
    </div>
  </div>
)}
export default App;
