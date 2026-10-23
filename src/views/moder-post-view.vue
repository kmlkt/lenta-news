<script setup lang="ts">
import PostCard from "@/components/post-card.vue";
import { usePostStore } from "@/stores/post-store";

const props = defineProps<{ id: string }>();

const postStore = usePostStore();
</script>

<template>
  <main>
    <PostCard
      v-for="post in postStore.unpublished
        .filter((x) => x.id == props.id)
        .map((x) => ({ ...x, published: false }))"
      :key="post.id"
      :post="post"
      :buttons="[]"
    />
  </main>
</template>
