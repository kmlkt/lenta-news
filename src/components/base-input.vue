<script setup>
const model = defineModel();

defineProps({
  label: String, // Текст над полем (например, "Email")
  type: {
    type: String,
    default: "text", // Может быть 'text', 'email', 'password'
  },
  placeholder: String,
  id: String, // нужен для связки label и input
});
</script>

<template>
  <div class="input-wrapper">
    <!-- Если передан label, показываем его -->
    <label v-if="label" :for="id" class="input-label">{{ label }}</label>

    <input :id="id" v-model="model" :type="type" :placeholder="placeholder" class="base-input" />
  </div>
</template>

<style scoped>
.input-wrapper {
  display: flex;
  flex-direction: column;
  gap: 5px;
  margin-bottom: 15px;
}

.input-label {
  font-size: 14px;
  color: #666;
}

.base-input {
  background-color: #e5e5e5; /* Серый фон как на макете */
  border: none;
  border-radius: 8px;
  padding: 12px 15px;
  font-size: 16px;
  outline: none;
  width: 100%;
}

.base-input:focus {
  box-shadow: 0 0 0 2px #a855f7; /* Фиолетовая обводка при клике (цвет хедера) */
}
</style>
