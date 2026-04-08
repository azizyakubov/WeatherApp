# WeatherApp

Augment FE Take home. A Vue 3 weather dashboard that shows current conditions for your location and a set of saved cities, with hourly and 5-day forecast detail views.

## Prerequisites

- Node.js 16+
- An [OpenWeatherMap](https://openweathermap.org/api) API key

## Setup

### 1. Clone the repo

```bash
git clone <repo-url>
cd WeatherApp
```

### 2. Install dependencies

```bash
npm install
```

### 3. Add your API key

Create a `.env` file in the project root:

```
OPENWEATHER_API_KEY='your_api_key_here'
```

> The key is exposed to the build via `vue.config.js` using `webpack.DefinePlugin`.

### 4. Run locally

```bash
npm run serve
```

The app will be available at **http://localhost:8080**.

## Features

- Current location weather via browser geolocation
  - Make sure to Allow location services on device, as well as grant permissions for chrome when prompted
- Saved city cards with live weather data
- Add and remove cities — persisted to `localStorage`
- Click any city name to open a detail view with:
  - Next 6 hours (3-hour intervals)
  - 5-day forecast with daily high/low

## API used

All data comes from [OpenWeatherMap](https://openweathermap.org):

| Endpoint            | Purpose                 |
| ------------------- | ----------------------- |
| `geo/1.0/direct`    | City name → coordinates |
| `data/2.5/weather`  | Current conditions      |
| `data/2.5/forecast` | 5-day / 3-hour forecast |
