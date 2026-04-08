<template>
  <div class="add-city">
    <form class="add-city-form" @submit.prevent="addCity">
      <input
        v-model="newCityQuery"
        type="text"
        placeholder="Search city (e.g. Paris, FR)"
      />
      <button type="submit" :disabled="isAddingCity">
        {{ isAddingCity ? "Adding..." : "Add City" }}
      </button>
    </form>
    <p v-if="addCityError" class="add-city-error">{{ addCityError }}</p>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { getCoordinatesByCityQuery } from "../services/weatherApi";

const props = defineProps({
  existingCities: {
    type: Array,
    required: true,
  },
});

const emit = defineEmits(["city-added"]);

const newCityQuery = ref("");
const isAddingCity = ref(false);
const addCityError = ref("");

function buildCityLabel(city) {
  const parts = [city.name];
  if (city.state) {
    parts.push(city.state);
  }
  if (city.country) {
    parts.push(city.country);
  }
  return parts.join(", ");
}

function buildCityKey(city) {
  return `${city.name.toLowerCase()}|${(city.state || "").toLowerCase()}|${(
    city.country || ""
  ).toLowerCase()}`;
}

async function addCity() {
  const trimmedQuery = newCityQuery.value.trim();
  addCityError.value = "";

  if (!trimmedQuery) {
    addCityError.value = "Please enter a city name.";
    return;
  }

  isAddingCity.value = true;

  try {
    const match = await getCoordinatesByCityQuery(trimmedQuery);
    const existingKeys = new Set(props.existingCities.map((city) => city.key));
    const newKey = buildCityKey(match);

    if (existingKeys.has(newKey)) {
      addCityError.value = "City already added.";
      return;
    }

    emit("city-added", {
      id: `${newKey}-${Date.now()}`,
      name: buildCityLabel(match),
      query: buildCityLabel(match),
      key: newKey,
    });
    newCityQuery.value = "";
  } catch (error) {
    if (error?.message === "City coordinates not found.") {
      addCityError.value = "City not found. Check spelling and try again.";
    } else {
      addCityError.value = "Could not add city right now. Please try again.";
    }
  } finally {
    isAddingCity.value = false;
  }
}
</script>

<style scoped>
.add-city {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.add-city-form {
  display: flex;
  gap: 8px;
  align-items: center;
}

.add-city-form input {
  min-width: 220px;
  padding: 8px 10px;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
}

.add-city-form button {
  padding: 8px 10px;
}

.add-city-error {
  margin: 0;
  color: #b91c1c;
}

@media (max-width: 720px) {
  .add-city-form {
    width: 100%;
  }

  .add-city-form input {
    flex: 1;
    min-width: 0;
  }
}
</style>
