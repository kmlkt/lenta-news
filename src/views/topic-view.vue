<script setup lang="ts">
import PostCard from "@/components/post-card.vue";
import { usePostStore } from "@/stores/post-store";

const props = defineProps<{ topic: string }>();

const postStore = usePostStore();
</script>

<template>
  <main>
    <PostCard
      v-for="post in postStore.all
        .filter((x) => x.topic == props.topic)
        .map((x) => ({ ...x, published: true }))"
      :key="post.id"
      :post="post"
      :buttons="[]"
    />
  </main>
</template>
