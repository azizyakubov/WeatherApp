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
import { ref } from "vue";
import CityCard from "./components/CityCard.vue";
import CurrentCity from "./components/CurrentCity.vue";

const selectedCities = ref([
  {
    id: "la-us",
    name: "Los Angeles, CA, US",
    query: "Los Angeles,CA,US",
  },
  {
    id: "sf-us",
    name: "San Francisco, CA, US",
    query: "San Francisco,CA,US",
  },
  {
    id: "austin-us",
    name: "Austin, TX, US",
    query: "Austin,TX,US",
  },
  {
    id: "lisbon-pt",
    name: "Lisbon, PT",
    query: "Lisbon,PT",
  },
  {
    id: "auckland-nz",
    name: "Auckland, NZ",
    query: "Auckland,NZ",
  },
  {
    id: "newyork-us",
    name: "New York, NY",
    query: "New York,NY,US",
  },
]);
</script>
