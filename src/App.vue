<script setup lang="ts">
import { RouterView } from "vue-router";
import AppHeader from "@/components/app-header.vue";
import SidebarMenu from "@/components/sidebar-menu.vue";
</script>

<template>
  <AppHeader />
  <SidebarMenu />
  <RouterView />
</template>

<style scoped>
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 999;
}
</style>
