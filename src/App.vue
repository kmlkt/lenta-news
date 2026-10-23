<script setup lang="ts">
import { RouterView } from "vue-router";
import AppHeader from "@/components/app-header.vue";
import SidebarMenu from "@/components/sidebar-menu.vue";
</script>

<template>
  <SidebarMenu />
  <AppHeader />
  <RouterView />
</template>

<style scoped></style>
