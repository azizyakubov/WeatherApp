const WEATHER_BASE_URL = "https://api.openweathermap.org/data/2.5/weather";
const GEOCODE_BASE_URL = "https://api.openweathermap.org/geo/1.0/direct";
const FORECAST_BASE_URL = "https://api.openweathermap.org/data/2.5/forecast";

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

export async function getSuggestedCities(query) {
  const apiKey = getApiKey();
  const url = `${GEOCODE_BASE_URL}?q=${encodeURIComponent(
    query,
  )}&limit=5&appid=${apiKey}`;
  const results = await fetchJson(url);
  const cities = results;
  return cities;
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

export async function getFiveDayForecast(lat, lon) {
  const apiKey = getApiKey();
  const url = `${FORECAST_BASE_URL}?lat=${lat}&lon=${lon}&appid=${apiKey}&units=imperial`;
  return fetchJson(url);
}

export function formatHourlyEntry(entry) {
  const iconCode = entry.weather?.[0]?.icon;
  return {
    dt: entry.dt,
    time: new Date(entry.dt * 1000).toLocaleTimeString([], {
      hour: "numeric",
      hour12: true,
    }),
    temperature: `${Math.round(entry.main.temp)} F`,
    condition: entry.weather?.[0]?.description || "Unknown",
    icon: iconCode
      ? `https://openweathermap.org/img/wn/${iconCode}@2x.png`
      : null,
    pop: entry.pop != null ? `${Math.round(entry.pop * 100)}%` : null,
  };
}

// api key free tier limits to this endpoint: 5 day forecast returned by 3 hour groupings.
// The entry closest to noon is used for the icon/condition; high/low are the
// max/min temps across all entries for that day.
export function groupForecastByDay(list) {
  const days = {};
  for (const entry of list) {
    const dateKey = entry.dt_txt.slice(0, 10);
    if (!days[dateKey]) days[dateKey] = [];
    days[dateKey].push(entry);
  }

  return Object.entries(days).map(([date, entries]) => {
    const representative = entries.reduce((best, e) => {
      const hour = new Date(e.dt * 1000).getHours();
      const bestHour = new Date(best.dt * 1000).getHours();
      return Math.abs(hour - 12) < Math.abs(bestHour - 12) ? e : best;
    });
    const high = Math.max(...entries.map((e) => e.main.temp_max));
    const low = Math.min(...entries.map((e) => e.main.temp_min));
    const iconCode = representative.weather?.[0]?.icon;
    return {
      dt: representative.dt,
      day: new Date(`${date}T12:00:00`).toLocaleDateString([], {
        weekday: "short",
      }),
      high: `${Math.round(high)} F`,
      low: `${Math.round(low)} F`,
      condition: representative.weather?.[0]?.description || "Unknown",
      icon: iconCode
        ? `https://openweathermap.org/img/wn/${iconCode}@2x.png`
        : null,
    };
  });
}

export function formatWeatherPayload(payload) {
  // https://openweathermap.org/weather-conditions#Icon-list
  const iconCode = payload.weather?.[0]?.icon;
  return {
    city: payload.name,
    temperature: `${Math.round(payload.main.temp)} F`,
    condition: payload.weather?.[0]?.description || "Unknown",
    icon: iconCode
      ? `https://openweathermap.org/img/wn/${iconCode}@2x.png`
      : null,
    feelsLike: `${Math.round(payload.main.feels_like)} F`,
    humidity: `${payload.main.humidity}%`,
    wind: `${Math.round(payload.wind.speed)} mph`,
    highLow: `${Math.round(payload.main.temp_max)} F / ${Math.round(
      payload.main.temp_min,
    )} F`,
    updatedAt: new Date(payload.dt * 1000).toLocaleTimeString(),
  };
}
