<script setup>
import { ref, computed } from "vue";
import BaseInput from "@/components/base-input.vue";
import BaseButton from "@/components/base-button.vue";
import BaseToggle from "@/components/base-toggle.vue";
import { createUser, sendCode, login } from "@/api/user";
import { useUserStore } from "@/stores/user-store";
import { useRouter } from "vue-router";

const userStore = useUserStore();
const router = useRouter();

// --- Состояния (данные) ---
const activeTab = ref("login"); // 'login' или 'register'
const email = ref("");
const name = ref("");
const surname = ref("");
const code = ref("");

// Состояние: отправлен ли уже код
const isCodeSent = ref(false);
const isUserNotFound = ref(false);
const isUserExists = ref(false);
const isCodeInvalid = ref(false);

// --- Валидация ---
const isValidEmail = computed(() => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email.value);
});

// Проверка: можно ли нажать "Отправить код"
const canSendCode = computed(() => {
  if (!isValidEmail.value) return false;
  if (activeTab.value === "register") {
    // При регистрации обязательно нужны имя и фамилия
    return name.value.length >= 2 && surname.value.length >= 2;
  }
  return true; // Для входа достаточно только email
});

// Проверка: можно ли нажать "Подтвердить" (код введен)
const canSubmitCode = computed(() => {
  return code.value.length === 6;
});

// --- Действия ---
const registerOrSendCode = async () => {
  if (!canSendCode.value) return;

  if (activeTab.value === "register") {
    try {
      await createUser({ email: email.value, name: name.value, surname: surname.value });
    } catch {
      isUserExists.value = true;
      return;
    }
  }
  try {
    await sendCode(email.value);
    isCodeSent.value = true;
  } catch {
    isUserNotFound.value = true;
  }
};

const submitCode = async () => {
  if (!canSubmitCode.value) return;
  try {
    userStore.token = await login(code.value);
  } catch {
    isCodeInvalid.value = true;
    return;
  }
  router.push("/");
};

// Если переключить вкладку, сбрасываем состояние отправки кода
const resetState = () => {
  isUserNotFound.value = false;
  isCodeSent.value = false;
  isUserExists.value = false;
  code.value = "";
};
</script>

<template>
  <div class="login-page">
    <div class="form-container">
      <!-- Переключатель -->
      <BaseToggle
        v-model="activeTab"
        @update:modelValue="resetState"
        :options="[
          { label: 'Вход', value: 'login' },
          { label: 'Регистрация', value: 'register' },
        ]"
      />

      <form @submit.prevent="isCodeSent ? submitCode() : registerOrSendCode()" class="login-form">
        <!-- ЭТАП 1: Ввод данных -->
        <div class="stage-1">
          <!-- Поля для регистрации -->
          <template v-if="activeTab === 'register'">
            <BaseInput v-model="name" label="Имя" placeholder="Ваше имя" id="name" />
            <BaseInput v-model="surname" label="Фамилия" placeholder="Ваша фамилия" id="surname" />
          </template>

          <!-- Email (для обеих вкладок) -->
          <BaseInput
            v-model="email"
            label="Эл. почта"
            type="email"
            placeholder="example@mail.ru"
            id="email"
          />

          <div class="submit-wrapper" v-if="!isCodeSent">
            <!-- Кнопка "Отправить код" (класс btn-standard - 234x35) -->
            <BaseButton type="submit" class="btn-standard" :disabled="!canSendCode">
              Отправить код
            </BaseButton>
          </div>

          <p class="hint-text" v-if="!isCodeSent">
            Отправим код на подтверждение почты, чтобы в целях безопасности подтвердить, что это вы.
          </p>
        </div>

        <p v-if="isUserNotFound" class="hint-text error-text">
          Пользователь <b>{{ email }}</b> не найден. Зарегистрируйтесь, чтобы использовать систему
        </p>
        <p v-if="isUserExists" class="hint-text error-text">
          Пользователь <b>{{ email }}</b> уже зарегистрирован. Войдите, чтобы использовать систему
        </p>

        <div v-if="isCodeSent" class="stage-2">
          <p class="hint-text success-text">
            Код отправлен на <b>{{ email }}</b>
          </p>

          <BaseInput
            v-model="code"
            label="Код"
            type="text"
            placeholder="Введите код из письма"
            id="code"
          />

          <div class="submit-wrapper">
            <!-- Кнопка "Войти" (класс btn-register) -->
            <BaseButton type="submit" class="btn-register" :disabled="!canSubmitCode">
              Подтвердить
            </BaseButton>
          </div>

          <button type="button" class="resend-btn" @click="resetState">
            Запросить код повторно
          </button>
        </div>
        <p v-if="isCodeInvalid" class="hint-text error-text">Неверный или устаревший код</p>
      </form>
    </div>
  </div>
</template>

<style scoped>
.login-page {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 20px;
}

.form-container {
  background: white;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  width: 100%;
  max-width: 500px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.login-form {
  width: 100%;
}

.submit-wrapper {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

.hint-text {
  font-size: 12px;
  color: #888;
  text-align: center;
  margin-top: 15px;
  line-height: 1.4;
}

.success-text {
  color: #16a34a;
  font-size: 14px;
  margin-bottom: 20px;
}

.error-text {
  color: red;
  font-size: 14px;
  margin-bottom: 20px;
}

.resend-btn {
  background: none;
  border: none;
  color: #888;
  font-size: 12px;
  margin-top: 20px;
  cursor: pointer;
  text-decoration: underline;
  display: block;
  margin-left: auto;
  margin-right: auto;
}

/* Анимация появления */
.stage-1,
.stage-2 {
  animation: fadeIn 0.3s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
</style>
