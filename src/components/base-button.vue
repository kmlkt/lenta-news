<script setup>
defineProps({
  type: { type: String, default: "button" },
  disabled: { type: Boolean, default: false },
});
</script>

<template>
  <button :type="type" :disabled="disabled" class="base-button">
    <slot></slot>
  </button>
</template>

<style scoped>
.base-button {
  background-color: #ff8000;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0;
}

/* Наведение и неактивное состояние */
.base-button:hover:not(:disabled) {
  background-color: #ea580c;
}

.base-button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

/* =========================================
   КЛАССЫ ДЛЯ КОНКРЕТНЫХ КНОПОК (по размерам из фигмы)
   ========================================= */

/* Кнопка "Регистрация" (189x40 на мобилке, 250x40 на ПК) */
.btn-register {
  width: 189px;
  height: 40px;
}
@media (min-width: 768px) {
  .btn-register {
    width: 250px;
  }
}

/* Кнопка "Отправить код" и другие (234x35) */
.btn-standard {
  width: 234px;
  height: 35px;
}

.btn-publish {
  width: 234px;
  height: 35px;
  background-color: var(--blue);
  &:hover:not(:disabled) {
    background-color: var(--blue);
  }
}

/* Кнопка "Удалить" (131x35) */
.btn-delete {
  width: 131px;
  height: 35px;
  background-color: #000000;
}
.btn-delete:hover:not(:disabled) {
  background-color: #000000;
}
</style>
