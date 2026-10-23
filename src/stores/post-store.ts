import { ref, computed, watch } from "vue";
import { defineStore } from "pinia";
import { getUser, type User } from "@/api/user";
import { useUserStore } from "./user-store";
import { getMyPosts, getPosts, getUnpublishedPosts, type Post } from "@/api/post";

export const usePostStore = defineStore("post", () => {
  const userStore = useUserStore();
  const all = ref<Post[]>([]);
  const my = ref<Post[]>([]);
  const unpublished = ref<Post[]>([]);

  const reloadPosts = async () => {
    all.value = await getPosts();
    if (userStore.user) {
      my.value = await getMyPosts(userStore.token!);
      if (userStore.user.role == "admin") {
        unpublished.value = await getUnpublishedPosts(userStore.token!);
      }
    }
  };

  watch(() => userStore.user, reloadPosts, { immediate: true });

  return { all, my, unpublished, reloadPosts };
});
