<script setup>
defineProps({
  isOpen: {
    type: Boolean,
    default: false,
  },
  title: {
    type: String,
    default: "Подтверждение",
  },
});

const emit = defineEmits(["close", "confirm"]);
</script>

<template>
  <!-- Затемнение фона -->
  <div v-if="isOpen" class="modal-overlay" @click.self="emit('close')">
    <!-- Само окно -->
    <div class="modal-content">
      <h3 class="modal-title">{{ title }}</h3>

      <div class="modal-body">
        <slot></slot>
        <!-- Сюда передается текст вопроса -->
      </div>

      <div class="modal-actions">
        <button class="btn-cancel" @click="emit('close')">Отмена</button>
        <button class="btn-confirm" @click="emit('confirm')">Выйти</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 3000; /* Поверх всего, включая меню */
}

.modal-content {
  background: white;
  padding: 24px;
  border-radius: 12px;
  width: 90%;
  max-width: 350px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  font-family: "Montserrat", sans-serif;
  z-index: 20;
}

.modal-title {
  margin: 0 0 15px 0;
  font-size: 18px;
  color: #333;
}

.modal-body {
  font-size: 14px;
  color: #666;
  margin-bottom: 25px;
  line-height: 1.5;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.btn-cancel,
.btn-confirm {
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  border: none;
  transition: background 0.2s;
}

.btn-cancel {
  background: #e5e5e5;
  color: #333;
}

.btn-cancel:hover {
  background: #d4d4d4;
}

.btn-confirm {
  background: #ff8000;
  color: white;
}

.btn-confirm:hover {
  background: #e67300;
}
</style>
