<template>
  <div class="weather-card city-card">
    <div class="card-header">
      <h3>{{ city.name }}</h3>
      <button type="button" disabled>Remove</button>
    </div>
    <p class="temp city-temp">{{ city.temperature }}</p>
    <p class="condition">{{ city.condition }}</p>
  </div>
</template>

<script setup>
defineProps({
  city: {
    type: Object,
    required: true,
  },
});
</script>
