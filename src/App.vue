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
        <AddCity :existing-cities="selectedCities" @city-added="handleCityAdded" />
      </div>

      <div class="city-grid">
        <CityCard
          v-for="city in selectedCities"
          :key="city.id"
          :city="city"
          @remove="removeCity"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import AddCity from "./components/AddCity.vue";
import CityCard from "./components/CityCard.vue";
import CurrentCity from "./components/CurrentCity.vue";

const selectedCities = ref([
  {
    id: "la-us",
    name: "Los Angeles, CA, US",
    query: "Los Angeles,CA,US",
    key: "los angeles||us",
  },
  {
    id: "sf-us",
    name: "San Francisco, CA, US",
    query: "San Francisco,CA,US",
    key: "san francisco||us",
  },
  {
    id: "austin-us",
    name: "Austin, TX, US",
    query: "Austin,TX,US",
    key: "austin|tx|us",
  },
  {
    id: "lisbon-pt",
    name: "Lisbon, PT",
    query: "Lisbon,PT",
    key: "lisbon||pt",
  },
  {
    id: "auckland-nz",
    name: "Auckland, NZ",
    query: "Auckland,NZ",
    key: "auckland||nz",
  },
  {
    id: "newyork-us",
    name: "New York, NY",
    query: "New York,NY,US",
    key: "new york|ny|us",
  },
]);

function removeCity(cityId) {
  selectedCities.value = selectedCities.value.filter((city) => city.id !== cityId);
}

function handleCityAdded(city) {
  selectedCities.value.push(city);
}
</script>
