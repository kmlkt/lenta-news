<script setup lang="ts">
import { useSidebarStore } from "@/stores/sidebar-store";
import { useUserStore } from "@/stores/user-store";
import { useRouter } from "vue-router";

const router = useRouter();

const userStore = useUserStore();
const sidebarStore = useSidebarStore();
</script>

<template>
  <header>
    <div class="logo">
      <img src="@/assets/logo.svg" />
      <div>УФИМСКИЙ<br />УНИВЕРСИТЕТ</div>
    </div>
    <div class="hamburger" @click="sidebarStore.sidebarOpen = !sidebarStore.sidebarOpen">
      <img src="@/assets/hamburger.svg" />
    </div>

    <div class="title" style="text-align: center">LENTA <br />НОВОСТЕЙ</div>
    <div
      class="account"
      style="cursor: pointer"
      v-on:click="userStore.user ? 0 : router.push('/login')"
    >
      <div style="text-align: right" v-if="userStore.user === undefined"></div>
      <RouterLink to="/login" style="text-align: right" v-else-if="userStore.user === null"
        >ВОЙТИ<br />В АККАУНТ</RouterLink
      >
      <div style="text-align: right" v-else>
        {{ userStore.user.surname.toUpperCase() }}<br />{{ userStore.user.name.toUpperCase() }}
      </div>
      <img src="@/assets/account.svg" />
    </div>

    <div class="hamburger">
      <img src="@/assets/hamburger.svg" style="opacity: 0" />
    </div>
  </header>
  <div class="fake-header"><div></div></div>
</template>

<style scoped>
header {
  z-index: 100;
  height: 80px;
  background-color: var(--blue);
  position: sticky;
  top: 0;
  padding: 0 50px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  color: white;
  font-weight: 600;
  font-size: 16px;
  line-height: 18px;

  div,
  a {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 6px;
  }

  .hamburger {
    display: none;
  }
}
.fake-header {
  z-index: -1;
  position: sticky;
  top: 80px;
  background-color: var(--blue);
  height: 57px;
  div {
    border-radius: 22px 22px 0 0;
    background-color: white;
    height: 57px;
  }
}

@media (max-width: 768px) {
  header {
    height: 40px;
    padding: 0 12px;
    .logo,
    .account {
      display: none;
    }
    .title {
      br {
        display: none;
      }
    }
    .hamburger {
      display: flex;
    }
  }
  .fake-header {
    height: 22px;
    div {
      height: 22px;
      border-radius: 0;
    }
  }
}
</style>
