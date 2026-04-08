<template>
  <div class="weather-card current-card">
    <h3>Current Location</h3>

    <p v-if="isLoading" class="status-text">
      Requesting location permission...
    </p>
    <p v-else-if="permissionDenied" class="status-text warning">
      Please allow current location permissions to view the current city's
      weather.
    </p>
    <p v-else-if="errorMessage" class="status-text warning">
      {{ errorMessage }}
    </p>

    <div v-else-if="locationData">
      <p class="status-text success">Current location object captured:</p>
      <pre>{{ formattedLocation }}</pre>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from "vue";

const isLoading = ref(true);
const permissionDenied = ref(false);
const errorMessage = ref("");
const locationData = ref(null);

const formattedLocation = computed(() =>
  JSON.stringify(locationData.value, null, 2),
);

onMounted(() => {
  if (!navigator.geolocation) {
    isLoading.value = false;
    errorMessage.value = "Geolocation is not supported in this browser.";
    return;
  }

  navigator.geolocation.getCurrentPosition(
    (position) => {
      console.log(position);
      locationData.value = {
        coords: {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        },
      };
      isLoading.value = false;
    },
    (error) => {
      isLoading.value = false;
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
</style>
