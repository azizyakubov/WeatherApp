import { defineStore } from "pinia";

const STORAGE_KEY = "weatherapp:selectedCities:v1";

const defaultCities = [
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
];

function loadFromStorage() {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return null;
    return parsed;
  } catch {
    return null;
  }
}

function persistToStorage(cities) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(cities));
  } catch {}
}

export const useCitiesStore = defineStore("cities", {
  state: () => ({
    selectedCities: [],
  }),
  actions: {
    initializeCities() {
      const saved = loadFromStorage();
      this.selectedCities = saved && saved.length ? saved : defaultCities;
    },
    addCity(city) {
      this.selectedCities.push(city);
      persistToStorage(this.selectedCities);
    },
    removeCity(cityId) {
      this.selectedCities = this.selectedCities.filter(
        (city) => city.id !== cityId,
      );
      persistToStorage(this.selectedCities);
    },
  },
});
