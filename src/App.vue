<template>
  <div class="app-shell">
    <template v-if="selectedCity">
      <CityDetailView :city="selectedCity" @close="selectedCity = null" />
    </template>

    <template v-else>
      <header class="hero">
        <h1>Weather Dashboard</h1>
        <p>Welcome to WeatherApp</p>
      </header>

      <div class="panel">
        <CurrentCity @select="selectedCity = $event" />
      </div>

      <div class="panel">
        <div class="panel-heading">
          <h2>Selected Cities</h2>
          <AddCity :existing-cities="selectedCities" />
        </div>

        <div class="city-grid">
          <CityCard
            v-for="city in selectedCities"
            :key="city.id"
            :city="city"
            @remove="removeCity"
            @select="selectedCity = $event"
          />
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { storeToRefs } from "pinia";
import AddCity from "./components/AddCity.vue";
import CityCard from "./components/CityCard.vue";
import CityDetailView from "./components/CityDetailView.vue";
import CurrentCity from "./components/CurrentCity.vue";
import { useCitiesStore } from "./stores/cities";

const citiesStore = useCitiesStore();
const { selectedCities } = storeToRefs(citiesStore);
const selectedCity = ref(null);

function removeCity(cityId) {
  citiesStore.removeCity(cityId);
}

onMounted(() => {
  citiesStore.initializeCities();
});
</script>
