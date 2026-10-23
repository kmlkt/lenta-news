import { createRouter, createWebHistory } from "vue-router";
import HomeView from "@/views/home-view.vue";
import TopicView from "@/views/topic-view.vue";
import LoginView from "@/views/login-view.vue";
import PostEditView from "@/views/post-edit-view.vue";
import MyView from "@/views/my-view.vue";
import MyPostView from "@/views/my-post-view.vue";
import ModerView from "@/views/moder-view.vue";
import ModerPostView from "@/views/moder-post-view.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
    },
    {
      path: "/topic/:topic",
      name: "topic",
      component: TopicView,
      props: true,
    },
    {
      path: "/my",
      name: "my",
      component: MyView,
    },
    {
      path: "/my/:id",
      name: "my_post",
      component: MyPostView,
      props: true,
    },
    {
      path: "/moder",
      name: "moder",
      component: ModerView,
    },
    {
      path: "/moder/:id",
      name: "moder_post",
      component: ModerPostView,
      props: true,
    },
    {
      path: "/login",
      name: "login",
      component: LoginView,
    },
    {
      path: "/edit/:id",
      name: "post edit",
      component: PostEditView,
      props: true,
    },
    {
      path: "/new/",
      name: "new post",
      component: PostEditView,
    },
  ],
});

export default router;
