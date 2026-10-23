<script setup>
import { computed, ref } from "vue";
import BaseModal from "./base-modal.vue";
import { useUserStore } from "@/stores/user-store";
import { usePostStore } from "@/stores/post-store";
import { useSidebarStore } from "@/stores/sidebar-store";
import { useRouter } from "vue-router";

const router = useRouter();

const userStore = useUserStore();
const postStore = usePostStore();
const sidebarStore = useSidebarStore();

const path = computed(() => router.currentRoute.value.fullPath);

const isLogoutModalOpen = ref(false);

const handleLogout = () => {
  userStore.token = null;
  isLogoutModalOpen.value = false;
};

const topics = computed(() => [...new Set(postStore.all.map((x) => x.topic))]);
</script>

<template>
  <aside :class="{ sidebar: true, open: sidebarStore.sidebarOpen }">
    <div class="menu-content">
      <!-- Раздел 1: Все посты -->
      <div class="menu-section">
        <RouterLink class="section-title" to="/" :class="{ active: path == '/' }">
          Все посты
        </RouterLink>
        <ul v-if="path == '/' || path.startsWith('/topic/')" class="sub-menu">
          <li v-for="topic in topics" :key="topic" class="sub-item">
            <RouterLink :class="{ active: path == `/topic/${topic}` }" :to="`/topic/${topic}`">{{
              topic
            }}</RouterLink>
          </li>
        </ul>
      </div>

      <div v-if="userStore.user" class="menu-section">
        <RouterLink to="/my/" class="section-title" :class="{ active: path == '/my/' }">
          Мои посты
        </RouterLink>
        <ul v-if="path.startsWith('/my/')" class="sub-menu">
          <li v-for="post in postStore.my" :key="post.id" class="sub-item">
            <RouterLink :class="{ active: path == `/my/${post.id}` }" :to="`/my/${post.id}`">{{
              post.title
            }}</RouterLink>
          </li>
        </ul>
      </div>

      <div v-if="userStore.user?.role == 'admin'" class="menu-section">
        <RouterLink to="/moder/" class="section-title" :class="{ active: path == '/moder/' }">
          Модерация постов
        </RouterLink>
        <ul v-if="path.startsWith('/moder/')" class="sub-menu">
          <li v-for="post in postStore.unpublished" :key="post.id" class="sub-item">
            <RouterLink
              :class="{ active: path == `/moder/${post.id}` }"
              :to="`/moder/${post.id}`"
              >{{ post.title }}</RouterLink
            >
          </li>
        </ul>
      </div>

      <button v-if="userStore.user" class="logout-btn" @click="isLogoutModalOpen = true">
        Выйти из аккаунта
      </button>
      <RouterLink to="/login" v-else class="login-btn">Войти в аккаунт</RouterLink>
    </div>

    <!-- Окно подтверждения -->
    <BaseModal
      :is-open="isLogoutModalOpen"
      title="Выход из аккаунта"
      @close="isLogoutModalOpen = false"
      @confirm="handleLogout"
    >
      Вы действительно хотите выйти из своего аккаунта?
    </BaseModal>
  </aside>
  <div v-if="sidebarStore.sidebarOpen" class="overlay" @click="isMenuOpen = false" />
</template>

<style scoped>
.sidebar {
  position: fixed;
  top: 80px;
  left: 0;
  width: 250px;
  font-family: "Montserrat", sans-serif;
  height: calc(100vh-80px);
}

.menu-content {
  padding: 20px;
}

/* Стили разделов (без изменений) */
.menu-section {
  margin-bottom: 15px;
}
.section-title {
  font-size: 16px;
  font-weight: 700;
  color: #333;
  cursor: pointer;
  padding: 8px 0;
  margin: 0;
  transition: color 0.2s;
}
.section-title:hover,
.active {
  color: #ff8000;
}
.sub-menu {
  list-style: none;
  padding: 0;
  margin: 5px 0 0 0;
}
.sub-item {
  font-size: 14px;
  color: #666;
  padding: 6px 0 6px 15px;
  cursor: pointer;
  border-left: 2px solid transparent;
  transition: all 0.2s;
}
.sub-item:hover {
  color: #ff8000;
  border-left-color: #ff8000;
}
.placeholder {
  color: #aaa;
  font-style: italic;
  cursor: default;
}
.placeholder:hover {
  color: #aaa;
  border-left-color: transparent;
}

.logout-btn,
.login-btn {
  text-align: center;
  position: fixed;
  bottom: 30px;
  left: 20px;
  width: 209px;
  padding: 10px;
  background: transparent;
  border: 1px solid #ff8000;
  color: #ff8000;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.logout-btn:hover,
.login-btn:hover {
  background: #ff8000;
  color: white;
}

/* --- АДАПТИВНОСТЬ --- */
@media (min-width: 768px) {
  .sidebar {
    display: block;
    border-right: 1px solid #eee;
    height: 100vh;
  }
  .login-btn {
    display: none;
  }
}

@media (max-width: 767px) {
  .sidebar {
    background-color: #fff;
    position: fixed;
    top: 40px;
    left: 0;
    height: calc(100vh - 40px);
    z-index: 1000;
    transform: translateX(-100%);
    transition: transform 0.3s ease;
    box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);
  }
  .sidebar.open {
    transform: translateX(0);
  }
}
</style>
