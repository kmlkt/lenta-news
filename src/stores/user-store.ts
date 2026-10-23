import { ref, computed, watch } from "vue";
import { defineStore } from "pinia";
import { getUser, type User } from "@/api/user";

export const useUserStore = defineStore("user", () => {
  const _rawToken = ref(localStorage.getItem("user_token"));
  const user = ref<User | null | undefined>(undefined);
  const token = computed({
    get() {
      return _rawToken.value;
    },
    set(newToken) {
      _rawToken.value = newToken;
      if (newToken) {
        localStorage.setItem("user_token", newToken);
      } else {
        localStorage.removeItem("user_token");
      }
    },
  });

  async function fetchUserProfile() {
    if (!token.value) {
      user.value = null;
      return;
    }
    try {
      user.value = await getUser(token.value);
    } catch (error) {
      user.value = null;
      throw error;
    }
  }

  // 3. Keep the watch block targeting the computed property
  watch(token, fetchUserProfile, { immediate: true });

  return { token, user };
});
