<template>
  <div class="weather-card city-card">
    <div class="card-header">
      <h3>{{ city.name }}</h3>
      <button type="button" @click="emit('remove', city.id)">Remove</button>
    </div>
    <Spinner
      v-if="isLoading"
      label="Retrieving weather..."
      class="city-status"
    />
    <p v-else-if="errorMessage" class="city-status city-error">
      {{ errorMessage }}
    </p>
    <template v-else-if="weatherData">
      <div class="city-temp-row">
        <p class="temp city-temp">{{ weatherData.temperature }}</p>
        <img
          v-if="weatherData.icon"
          :src="weatherData.icon"
          :alt="weatherData.condition"
          class="city-icon"
        />
      </div>
      <p class="condition">{{ weatherData.condition }}</p>
      <p><strong>High / Low:</strong> {{ weatherData.highLow }}</p>
      <p class="city-meta">Humidity: {{ weatherData.humidity }}</p>
    </template>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import Spinner from "./Spinner.vue";
import {
  formatWeatherPayload,
  getCoordinatesByCityQuery,
  getCurrentWeatherByCoords,
} from "../services/weatherApi";

const props = defineProps({
  city: {
    type: Object,
    required: true,
  },
});
const emit = defineEmits(["remove"]);

const isLoading = ref(true);
const errorMessage = ref("");
const weatherData = ref(null);

async function fetchWeather() {
  isLoading.value = true;
  errorMessage.value = "";
  try {
    const coords = await getCoordinatesByCityQuery(props.city.query);
    const weatherPayload = await getCurrentWeatherByCoords(
      coords.lat,
      coords.lon,
    );
    weatherData.value = formatWeatherPayload(weatherPayload);
  } catch (error) {
    errorMessage.value = "Unable to load weather.";
  } finally {
    isLoading.value = false;
  }
}

onMounted(() => {
  fetchWeather();
});
</script>

<style scoped>
.city-card {
  padding: 10px 12px;
}

.city-card h3 {
  font-size: 1rem;
}

.city-temp-row {
  display: flex;
  align-items: center;
  gap: 4px;
}

.city-icon {
  width: 50px;
  height: 50px;
}

.city-temp {
  font-size: 1.2rem;
  margin-bottom: 4px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
}

.city-status {
  margin: 8px 0 0;
  color: #334155;
}

.city-error {
  color: #b91c1c;
}

.city-meta {
  margin: 0;
  color: #64748b;
  font-size: 0.9rem;
}
</style>
