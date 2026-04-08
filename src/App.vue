<template>
  <div class="app-shell">
    <header class="hero">
      <h1>Weather Dashboard</h1>
      <p>Welcome to WeatherApp</p>
    </header>

    <div class="panel">
      <h2>Current Location</h2>
      <div class="weather-card current-card">
        <h3>{{ currentLocation.city }}</h3>
        <p class="temp current-temp">{{ currentLocation.temperature }}</p>
        <p class="condition">{{ currentLocation.condition }}</p>
        <p class="updated-at">Updated: {{ currentLocation.updatedAt }}</p>
        <div class="current-card-details">
          <p><strong>Feels like:</strong> {{ currentLocation.feelsLike }}</p>
          <p><strong>Humidity:</strong> {{ currentLocation.humidity }}</p>
          <p><strong>Wind:</strong> {{ currentLocation.wind }}</p>
          <p><strong>High / Low:</strong> {{ currentLocation.highLow }}</p>
        </div>
      </div>
    </div>

    <div class="panel">
      <div class="panel-heading">
        <h2>Selected Cities</h2>
        <button type="button" disabled>Add City</button>
      </div>

      <div class="city-grid">
        <CityCard v-for="city in selectedCities" :key="city.id" :city="city" />
      </div>
    </div>
  </div>
</template>

<script setup>
import CityCard from "./components/CityCard.vue";

const currentLocation = {
  city: "Current Location (Placeholder)",
  temperature: "72 F",
  condition: "Partly Cloudy",
  feelsLike: "74 F",
  humidity: "58%",
  wind: "8 mph NW",
  highLow: "78 F / 63 F",
  updatedAt: "Just now",
};

const selectedCities = [
  {
    id: "la-us",
    name: "Los Angeles, CA, US",
    temperature: "75 F",
    condition: "Sunny",
  },
  {
    id: "sf-us",
    name: "San Francisco, CA, US",
    temperature: "64 F",
    condition: "Foggy",
  },
  {
    id: "austin-us",
    name: "Austin, TX, US",
    temperature: "83 F",
    condition: "Hot and Clear",
  },
  {
    id: "lisbon-pt",
    name: "Lisbon, PT",
    temperature: "70 F",
    condition: "Breezy",
  },
  {
    id: "auckland-nz",
    name: "Auckland, NZ",
    temperature: "61 F",
    condition: "Light Rain",
  },
  {
    id: "newyork-us",
    name: "New York, NY",
    temperature: "67 F",
    condition: "Cloudy",
  },
];
</script>
