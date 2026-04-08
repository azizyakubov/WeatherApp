const WEATHER_BASE_URL = "https://api.openweathermap.org/data/2.5/weather";
const GEOCODE_BASE_URL = "https://api.openweathermap.org/geo/1.0/direct";

function getApiKey() {
  const apiKey = process.env.OPENWEATHER_API_KEY;
  if (!apiKey) {
    throw new Error(
      "Missing OpenWeather API key. Set OPENWEATHER_API_KEY .env.",
    );
  }
  return apiKey;
}

async function fetchJson(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }
  return response.json();
}

export async function getCoordinatesByCityQuery(query) {
  const apiKey = getApiKey();
  const url = `${GEOCODE_BASE_URL}?q=${encodeURIComponent(
    query,
  )}&limit=1&appid=${apiKey}`;
  const results = await fetchJson(url);
  if (!Array.isArray(results) || results.length === 0) {
    throw new Error("City coordinates not found.");
  }

  const city = results[0];
  return {
    lat: city.lat,
    lon: city.lon,
    name: city.name,
    country: city.country,
    state: city.state || "",
  };
}

export async function getCurrentWeatherByCoords(lat, lon) {
  const apiKey = getApiKey();
  const url = `${WEATHER_BASE_URL}?lat=${lat}&lon=${lon}&appid=${apiKey}&units=imperial`;
  return fetchJson(url);
}

export function formatWeatherPayload(payload) {
  return {
    city: payload.name,
    temperature: `${Math.round(payload.main.temp)} F`,
    condition: payload.weather?.[0]?.description || "Unknown",
    feelsLike: `${Math.round(payload.main.feels_like)} F`,
    humidity: `${payload.main.humidity}%`,
    wind: `${Math.round(payload.wind.speed)} mph`,
    highLow: `${Math.round(payload.main.temp_max)} F / ${Math.round(
      payload.main.temp_min,
    )} F`,
    updatedAt: new Date(payload.dt * 1000).toLocaleTimeString(),
  };
}
