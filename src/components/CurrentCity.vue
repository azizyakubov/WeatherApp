<template>
  <div class="weather-card card">
    <h3>Current Location</h3>

    <Spinner
      v-if="isRequestingLocation"
      label="Requesting location permission..."
      class="status-text"
    />
    <Spinner
      v-else-if="isLoadingWeather"
      label="Retrieving weather for your location..."
      class="status-text"
    />
    <p v-else-if="permissionDenied" class="status-text warning">
      Please allow current location permissions to view the current city's
      weather.
    </p>
    <p v-else-if="errorMessage" class="status-text warning">
      {{ errorMessage }}
    </p>

    <div v-else-if="weatherData && locationData">
      <p class="temp temperature">{{ weatherData.temperature }}</p>
      <p class="condition">{{ weatherData.condition }}</p>
      <p class="updated-at">Updated: {{ weatherData.updatedAt }}</p>
      <div class="details">
        <p><strong>City:</strong> {{ weatherData.city }}</p>
        <p><strong>Feels like:</strong> {{ weatherData.feelsLike }}</p>
        <p><strong>Humidity:</strong> {{ weatherData.humidity }}</p>
        <p><strong>Wind:</strong> {{ weatherData.wind }}</p>
        <p><strong>High / Low:</strong> {{ weatherData.highLow }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from "vue";
import Spinner from "./Spinner.vue";
import {
  formatWeatherPayload,
  getCurrentWeatherByCoords,
} from "../services/weatherApi";

const isRequestingLocation = ref(true);
const isLoadingWeather = ref(false);
const permissionDenied = ref(false);
const errorMessage = ref("");
const locationData = ref(null);
const weatherData = ref(null);

const formattedLocation = computed(() =>
  JSON.stringify(locationData.value, null, 2),
);

onMounted(() => {
  if (!navigator.geolocation) {
    isRequestingLocation.value = false;
    errorMessage.value = "Geolocation is not supported in this browser.";
    return;
  }

  navigator.geolocation.getCurrentPosition(
    async (position) => {
      locationData.value = {
        coords: {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
        },
        timestamp: position.timestamp,
      };
      isRequestingLocation.value = false;
      isLoadingWeather.value = true;

      try {
        const weatherPayload = await getCurrentWeatherByCoords(
          locationData.value.coords.latitude,
          locationData.value.coords.longitude,
        );
        weatherData.value = formatWeatherPayload(weatherPayload);
      } catch (error) {
        errorMessage.value =
          "Unable to retrieve weather for your current location.";
      } finally {
        isLoadingWeather.value = false;
      }
    },
    (error) => {
      isRequestingLocation.value = false;
      if (error.code === error.PERMISSION_DENIED) {
        permissionDenied.value = true;
        return;
      }
      errorMessage.value = "Unable to retrieve your location right now.";
    },
  );
});
</script>

<style scoped>
.card {
  padding: 20px;
}

.temperature {
  font-size: 2rem;
}

.details {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 8px 16px;
  margin-top: 12px;
}

.details p {
  margin: 0;
  color: #334155;
}

.updated-at {
  margin: 0;
  color: #64748b;
  font-size: 0.9rem;
}

.status-text {
  margin: 8px 0 0;
  color: #334155;
}

.warning {
  color: #b91c1c;
}

.success {
  color: #166534;
}

@media (max-width: 640px) {
  .details {
    grid-template-columns: 1fr;
  }
}
</style>
