<template>
  <div class="detail-view">
    <div class="detail-header">
      <button type="button" class="back-btn" @click="emit('close')">
        ← Back
      </button>
      <h2>{{ city.name }}</h2>
    </div>

    <Spinner
      v-if="isLoading"
      label="Loading forecast..."
      class="detail-status"
    />
    <p v-else-if="errorMessage" class="detail-error">{{ errorMessage }}</p>

    <template v-else>
      <section class="forecast-section">
        <h3>Next 6 Hours</h3>
        <div class="hourly-grid">
          <div v-for="entry in hourlyData" :key="entry.dt" class="hourly-card">
            <p class="forecast-time">{{ entry.time }}</p>
            <img
              v-if="entry.icon"
              :src="entry.icon"
              :alt="entry.condition"
              class="forecast-icon"
            />
            <p class="forecast-temp">{{ entry.temperature }}</p>
            <p v-if="entry.pop" class="forecast-pop">{{ entry.pop }} precip.</p>
          </div>
        </div>
      </section>

      <section class="forecast-section">
        <h3>5-Day Forecast</h3>
        <div class="daily-list">
          <div v-for="entry in dailyData" :key="entry.dt" class="daily-row">
            <p class="daily-day">{{ entry.day }}</p>
            <img
              v-if="entry.icon"
              :src="entry.icon"
              :alt="entry.condition"
              class="forecast-icon"
            />
            <p class="daily-condition">{{ entry.condition }}</p>
            <p class="daily-highlow">{{ entry.high }} / {{ entry.low }}</p>
          </div>
        </div>
      </section>
    </template>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import Spinner from "./Spinner.vue";
import {
  getCoordinatesByCityQuery,
  getFiveDayForecast,
  formatHourlyEntry,
  groupForecastByDay,
} from "../services/weatherApi";

const props = defineProps({
  city: {
    type: Object,
    required: true,
  },
});
const emit = defineEmits(["close"]);

const isLoading = ref(true);
const errorMessage = ref("");
const hourlyData = ref([]);
const dailyData = ref([]);

onMounted(async () => {
  try {
    const coords = await getCoordinatesByCityQuery(props.city.query);
    const forecast = await getFiveDayForecast(coords.lat, coords.lon);
    // First 2 entries = next ~6 hours (3-hour intervals)
    hourlyData.value = forecast.list.slice(0, 2).map(formatHourlyEntry);
    dailyData.value = groupForecastByDay(forecast.list);
  } catch {
    errorMessage.value = "Unable to load forecast data.";
  } finally {
    isLoading.value = false;
  }
});
</script>

<style scoped>
.detail-view {
  max-width: 860px;
  margin: 0 auto;
  padding: 24px 16px;
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.detail-header {
  display: flex;
  align-items: center;
  gap: 16px;
}

.detail-header h2 {
  margin: 0;
  font-size: 1.4rem;
  color: #ffffff;
  text-shadow: 0 1px 6px rgba(0, 0, 0, 0.2);
}

.back-btn {
  background: rgba(255, 255, 255, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.35);
  border-radius: 6px;
  padding: 6px 12px;
  cursor: pointer;
  font-size: 0.9rem;
  color: #ffffff;
  white-space: nowrap;
  backdrop-filter: blur(4px);
}

.back-btn:hover {
  background: rgba(255, 255, 255, 0.25);
}

.detail-status {
  margin-top: 16px;
}

.detail-error {
  color: #b91c1c;
  margin-top: 16px;
}

.forecast-section h3 {
  margin: 0 0 12px;
  font-size: 1rem;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

/* Hourly */
.hourly-grid {
  display: flex;
  gap: 8px;
  overflow-x: auto;
  padding-bottom: 4px;
}

.hourly-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  padding: 10px 14px;
  min-width: 80px;
  text-align: center;
}

.forecast-time {
  margin: 0;
  font-size: 0.8rem;
  color: #64748b;
}

.forecast-icon {
  width: 44px;
  height: 44px;
}

.forecast-temp {
  margin: 0;
  font-weight: 600;
  font-size: 0.95rem;
}

.forecast-pop {
  margin: 0;
  font-size: 0.75rem;
  color: #3b82f6;
}

/* Daily */
.daily-list {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.daily-row {
  display: grid;
  grid-template-columns: 48px 48px 1fr auto;
  min-width: 400px;
  align-items: center;
  gap: 12px;
  padding: 8px 12px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
}

.daily-day {
  margin: 0;
  font-weight: 600;
  font-size: 0.9rem;
}

.daily-condition {
  margin: 0;
  color: #475569;
  font-size: 0.9rem;
  text-transform: capitalize;
}

.daily-highlow {
  margin: 0;
  font-weight: 600;
  font-size: 0.9rem;
  white-space: nowrap;
}
</style>
