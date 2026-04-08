<template>
  <div class="spinner-wrap" role="status">
    <span class="spinner"></span>
    <span v-if="label" class="spinner-label">{{ label }}</span>
  </div>
</template>

<script setup>
defineProps({
  label: {
    type: String,
    default: "",
  },
});
</script>

<style scoped>
.spinner-wrap {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: #334155;
}

.spinner {
  width: 16px;
  height: 16px;
  border: 2px solid #cbd5e1;
  border-top-color: #2563eb;
  border-radius: 999px;
  animation: spin 0.8s linear infinite;
}

.spinner-label {
  font-size: 0.95rem;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
