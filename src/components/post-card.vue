<script setup lang="ts">
import { deletePost, editPost, imageUrl, setReaction, type Post } from "@/api/post";
import { computed, ref } from "vue";
import BaseButton from "./base-button.vue";
import { useUserStore } from "@/stores/user-store";
import { usePostStore } from "@/stores/post-store";
import { useRouter } from "vue-router";

const props = defineProps<{
  post: Post;
  buttons: { title: string; color: string; action: () => unknown }[];
}>();

const router = useRouter();
const userStore = useUserStore();
const postStore = usePostStore();

const MONTHS = [
  "января",
  "февраля",
  "марта",
  "апреля",
  "мая",
  "июня",
  "июля",
  "августа",
  "сентября",
  "октября",
  "ноября",
  "декабря",
];

const published_at = computed(() => {
  if (!props.post.published_at) {
    return "Не опубликован";
  }
  const date = new Date(props.post.published_at);
  return `${date.getDate()} ${MONTHS[date.getMonth()]}`;
});

const currentImage = ref(0);

const EMOJIS = ["👍", "👎", "😄", "🍾", "❤️"];

const reactions = ref<{ [s: string]: number }>({});
const my = ref<string | null>(null);
for (const emoji of EMOJIS) {
  reactions.value[emoji] = 0;
}
for (const reaction of props.post.reactions) {
  reactions.value[reaction.emoji]! += reaction.count;
  if (reaction.my) {
    my.value = reaction.emoji;
  }
}

function toggleReaction(emoji: string) {
  if (my.value) {
    reactions.value[my.value]!--;
  }
  reactions.value[emoji]!++;
  if (my.value == emoji) {
    setReaction(userStore.token!, props.post.id, null);
    my.value = null;
  } else {
    setReaction(userStore.token!, props.post.id, emoji);
    my.value = emoji;
  }
}
</script>

<template>
  <article>
    <div style="font-size: 17px">
      <span :style="{ color: post.published_at ? 'var(--red)' : 'var(--blue)', fontWeight: 600 }">{{
        published_at
      }}</span>
      <span style="font-weight: 500">{{ props.post.topic }}</span>
    </div>
    <div style="height: 17px" />
    <h1>{{ post.title }}</h1>
    <div style="height: 15px" />
    <div>
      <BaseButton
        class="btn-standard"
        v-if="
          userStore.user?.role == 'admin' ||
          (postStore.my.some((x) => x.id == post.id) && !post.published)
        "
        @click="router.push('/edit/' + post.id)"
      >
        Редактировать
      </BaseButton>
      <BaseButton
        class="btn-publish"
        v-if="userStore.user?.role == 'admin' && !post.published"
        @click="
          editPost(userStore.token!, { ...post, published: true }).then(postStore.reloadPosts)
        "
      >
        Опубликовать
      </BaseButton>
      <BaseButton
        class="btn-publish"
        v-if="userStore.user?.role == 'admin' && post.published"
        @click="
          editPost(userStore.token!, { ...post, published: false }).then(postStore.reloadPosts)
        "
      >
        Скрыть
      </BaseButton>
      <BaseButton
        class="btn-delete"
        v-if="
          userStore.user?.role == 'admin' ||
          (postStore.my.some((x) => x.id == post.id) && !post.published)
        "
        @click="deletePost(userStore.token!, post.id).then(postStore.reloadPosts)"
      >
        Удалить
      </BaseButton>
    </div>
    <div style="height: 15px" />
    <div class="photo" v-if="post.images.length">
      <button class="left" :hidden="currentImage == 0" @click="currentImage--"></button>
      <button
        class="right"
        :hidden="currentImage == post.images.length - 1"
        @click="currentImage++"
      ></button>
      <div class="filter"></div>
      <div
        class="images"
        :style="{ width: `${post.images.length}00%`, left: `${-currentImage}00%` }"
      >
        <img v-for="(img, i) in post.images" :key="i" :src="imageUrl(img)" />
      </div>
      <div class="backgrounds">
        <img
          v-for="(img, i) in post.images"
          :key="i"
          :src="imageUrl(img)"
          :style="{ opacity: i == currentImage ? '100%' : '0%' }"
        />
      </div>
    </div>
    <div style="height: 10px" v-if="post.images.length" />
    <div class="picker" v-if="post.images.length > 1">
      <img
        v-for="(img, i) in post.images"
        :key="i"
        :src="imageUrl(img)"
        :style="{
          outline: i == currentImage ? '5px solid var(--blue)' : '0',
        }"
        @click="currentImage = i"
      />
    </div>
    <div style="height: 24px" v-if="post.images.length > 1" />
    <p>{{ post.text }}</p>
    <div style="height: 24px" />
    <div style="justify-content: start; gap: 10px">
      <button
        v-for="emoji of EMOJIS"
        class="reaction"
        :key="emoji"
        :class="{ my: my == emoji }"
        @click="toggleReaction(emoji)"
      >
        {{ emoji }} {{ reactions[emoji] }}
      </button>
    </div>
  </article>
</template>
<style scoped>
article {
  width: 660px;
  div {
    display: flex;
    justify-content: space-between;
  }
}
h1 {
  font-size: 40px;
  font-weight: 600;
}
p {
  white-space: pre-wrap;
  font-size: 17px;
  font-weight: 400;
}
.reaction {
  text-align: center;
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
  &:hover,
  &.my {
    background: #ff8000;
    color: white;
  }
}

.photo {
  width: 100%;
  height: 380px;
  border-radius: 20px;
  overflow: hidden;
  position: relative;

  button {
    position: absolute;
    top: 0;
    bottom: 0;
    width: 70px;
    background-color: #ffffff80;
    background-position: center;
    background-repeat: no-repeat;
    backdrop-filter: blur(4px);
    z-index: 4;

    opacity: 0;
    transition: opacity 0.5s;
  }
  .filter {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 3;
    backdrop-filter: blur(40px);
  }
  img {
    width: 660px;
    height: 380px;
    transition:
      left 0.5s linear,
      opacity 0.5s;
    opacity: 1;
  }
  .images {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: row;
    z-index: 3;
    transition: left 0.5s linear;
    img {
      object-fit: contain;
    }
  }
  .backgrounds {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 1;
    img {
      position: absolute;
      top: 0;
      left: 0;
      opacity: 0;
      object-fit: cover;
      transition: opacity 0.5s;
    }
  }
  &:hover {
    button {
      opacity: 1;
    }
  }
  .left {
    background-image: url("@/assets/arrow-left.svg");
    left: 0;
  }
  .right {
    background-image: url("@/assets/arrow-right.svg");
    right: 0;
  }
}
.picker {
  justify-content: center;
  gap: 20px;
  row-gap: 10px;
  flex-wrap: wrap;

  img {
    height: 70px;
    border-radius: 10px;
    cursor: pointer;
  }
}
@media (max-width: 768px) {
  article {
    width: 100%;
    padding: 0 12px;

    .photo {
      height: 200px;
      img {
        width: calc(100vw - 24px);
        height: 200px;
      }
      button {
        width: 40px;
        background-size: 13px 27px;
      }
    }
  }
}
</style>
