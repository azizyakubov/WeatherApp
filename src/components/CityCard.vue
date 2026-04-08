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

<style scoped>
.city-card {
  padding: 10px 12px;
}

.city-card h3 {
  font-size: 1rem;
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
