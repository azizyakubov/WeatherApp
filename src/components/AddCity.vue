<template>
  <div class="add-city">
    <form class="add-city-form" @submit.prevent="addCity">
      <div class="input-wrap">
        <input
          v-model="newCityQuery"
          type="text"
          placeholder="Search city (e.g. Paris, FR)"
          v-on:input="displaySuggestedCities"
        />
        <button v-if="newCityQuery.length" type="button" class="clear-btn" @click="clearSearch">X</button>
      </div>
      <button type="submit" class="btn-primary" :disabled="isAddingCity">
        {{ isAddingCity ? "Adding..." : "Add City" }}
      </button>
    </form>
    <div v-if="newCityQuery.length" class="dropdown">
      <ul>
        <li v-if="isFetchingSuggestions" class="suggested-city">
          <Spinner />
        </li>
        <template v-else>
          <li v-for="city in suggestedCities" @click="addCity(city.name)" class="suggested-city">
            {{ city.name }}, {{ city?.state }}, {{ city.country }}
          </li>
          <li v-if="!suggestedCities.length" class="suggested-city">No cities found, please check spelling</li>
        </template>
      </ul>
    </div>
    <Spinner v-if="isAddingCity" label="Fetching city data..." />
    <p v-if="addCityError" class="add-city-error">{{ addCityError }}</p>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import Spinner from "./Spinner.vue";
import { getCoordinatesByCityQuery, getSuggestedCities } from "../services/weatherApi";
import { useCitiesStore } from "../stores/cities";

const props = defineProps({
  existingCities: {
    type: Array,
    required: true,
  },
});

const suggestedCities = ref([])
const isFetchingSuggestions = ref(false)

const newCityQuery = ref("");
const isAddingCity = ref(false);
const addCityError = ref("");
const citiesStore = useCitiesStore();

const existingKeys = computed(
  () => new Set(props.existingCities.map((city) => city.key)),
);

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

async function addCity(cityName) {
  const trimmedQuery = cityName ? cityName : newCityQuery.value.trim();
  addCityError.value = "";

  if (!trimmedQuery) {
    addCityError.value = "Please enter a city name.";
    return;
  }

  isAddingCity.value = true;

  try {
    const match = await getCoordinatesByCityQuery(trimmedQuery);
    const newKey = buildCityKey(match);

    // if (existingKeys.value.has(newKey)) {
    //   addCityError.value = "City already added.";
    //   return;
    // }

    citiesStore.addCity({
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

function debounce(func, delay) {
  let timeout;
  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
}

const debouncedFetch = debounce(async (query) => {
  try {
    suggestedCities.value = await getSuggestedCities(query);
  } finally {
    isFetchingSuggestions.value = false;
  }
}, 500);

function clearSearch() {
  newCityQuery.value = "";
  suggestedCities.value = [];
  isFetchingSuggestions.value = false;
}

function displaySuggestedCities() {
  if (!newCityQuery.value.trim()) {
    suggestedCities.value = [];
    isFetchingSuggestions.value = false;
    return;
  }
  isFetchingSuggestions.value = true;
  debouncedFetch(newCityQuery.value);
}
</script>

<style scoped>
.add-city {
  display: flex;
  flex-direction: column;
  gap: 6px;
  position: relative;
}

.add-city-form {
  display: flex;
  gap: 8px;
  align-items: center;
}

.input-wrap {
  position: relative;
  display: flex;
  align-items: center;
}

.add-city-form input {
  min-width: 220px;
  padding: 8px 10px;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
}

.clear-btn {
  position: absolute;
  right: 6px;
  cursor: pointer;
  color: grey;
  padding: 5px;
}

.clear-btn:hover {
  color: #475569;
}

.dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  width: 300px;
  background-color: white;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  max-height: 250px;
  z-index: 10;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

ul {
  list-style-type: none;
  margin: 0;
  padding: 4px 0;
}

.suggested-city {
  cursor: pointer;
  padding: 8px 12px;
}

.suggested-city:hover {
  background-color: #cbd5e1;
}

.suggested-city:active {
  background-color: #cbd5e1;
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
