<script setup lang="ts">
import PostCard from "@/components/post-card.vue";
import BaseButton from "@/components/base-button.vue";
import { usePostStore } from "@/stores/post-store";
import { useRouter } from "vue-router";

const router = useRouter();
const postStore = usePostStore();
</script>

<template>
  <main>
    <PostCard v-for="post in postStore.my" :key="post.id" :post="post" :buttons="[]" />
    <BaseButton
      class="btn-standard"
      style="position: fixed; right: 30px; bottom: 20px"
      @click="router.push('/new')"
      >Написать пост</BaseButton
    >
  </main>
</template>
