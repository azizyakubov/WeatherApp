<template>
  <div class="app-shell">
    <header class="hero">
      <h1>Weather Dashboard</h1>
      <p>Welcome to WeatherApp</p>
    </header>

    <div class="panel">
      <CurrentCity />
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
import CurrentCity from "./components/CurrentCity.vue";

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
