import { ref, computed, watch } from "vue";
import { defineStore } from "pinia";
import { getUser, type User } from "@/api/user";
import { useUserStore } from "./user-store";
import { getMyPosts, getPosts, getUnpublishedPosts, type Post } from "@/api/post";

export const useSidebarStore = defineStore("sidebar", () => {
  const sidebarOpen = ref(false);
  return { sidebarOpen };
});
