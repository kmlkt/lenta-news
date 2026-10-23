<script setup>
const model = defineModel();

defineProps({
  options: {
    type: Array,
    required: true,
  },
});
</script>

<template>
  <div class="toggle-wrapper">
    <button
      v-for="option in options"
      :key="option.value"
      @click="model = option.value"
      class="toggle-btn"
      :class="{ active: model === option.value }"
      type="button"
    >
      {{ option.label }}
    </button>
  </div>
</template>

<style scoped>
.toggle-wrapper {
  display: flex;
  background-color: #e5e5e5;
  border-radius: 8px;
  padding: 0;
  margin-bottom: 20px;
  width: 100%;
  max-width: 500px;
  height: 40px;
}

.toggle-btn {
  flex: 1;
  height: 100%;
  border: none;
  background: transparent;
  cursor: pointer;
  font-size: 14px;
  font-weight: bold;
  color: #666;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  /* Добавляем скругления всем кнопкам по умолчанию */
  border-radius: 8px;
}

/* Стиль для активной кнопки */
.toggle-btn.active {
  background-color: #ff8000;
  color: white;
}

/* Наведение для неактивной кнопки */
.toggle-btn:not(.active):hover {
  color: #333;
}
</style>
