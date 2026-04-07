<template>
  <div class="app-shell">
    <header class="hero">
      <h1>Weather Dashboard</h1>
      <p>Welcome to WeatherApp</p>
    </header>

    <div class="panel">
      <h2>Current Location</h2>
      <div class="weather-card">
        <h3>{{ currentLocation.city }}</h3>
        <p class="temp">{{ currentLocation.temperature }}</p>
        <p>{{ currentLocation.condition }}</p>
      </div>
    </div>

    <div class="panel">
      <div class="panel-heading">
        <h2>Selected Cities</h2>
        <button type="button" disabled>Add City</button>
      </div>

      <div class="city-grid">
        <div v-for="city in selectedCities" :key="city.id" class="weather-card">
          <div class="card-header">
            <h3>{{ city.name }}</h3>
            <button type="button" disabled>Remove</button>
          </div>
          <p class="temp">{{ city.temperature }}</p>
          <p>{{ city.condition }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const currentLocation = {
  city: "Current Location (Placeholder)",
  temperature: "72 F",
  condition: "Partly Cloudy",
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
];
</script>
