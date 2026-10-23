<script setup lang="ts">
import { ref, computed } from "vue";
import BaseInput from "../components/base-input.vue";
import BaseButton from "../components/base-button.vue";
import BaseImageUpload from "../components/base-image-upload.vue";
import { usePostStore } from "@/stores/post-store";
import { createPost, editPost, type Post } from "@/api/post";
import { useUserStore } from "@/stores/user-store";
import { useRouter } from "vue-router";

const props = defineProps<{ id?: string }>();
const userStore = useUserStore();
const postStore = usePostStore();

const router = useRouter();

const post = ref<Post>(
  postStore.my.find((x) => x.id == props.id) ??
    postStore.unpublished.find((x) => x.id == props.id) ??
    ({
      title: "",
      topic: "",
      text: "",
      images: [],
    } as unknown as Post),
);

const isFormValid = computed(() => {
  return post.value.title.trim().length > 3 && post.value.text.trim().length > 10;
});

const savePost = async () => {
  if (!isFormValid.value) return;

  if (post.value.id) {
    await editPost(userStore.token!, post.value);
  } else {
    await createPost(userStore.token!, post.value);
  }
  await postStore.reloadPosts();
  router.back();
};
</script>

<template>
  <div class="edit-page">
    <div class="form-container">
      <div class="form-group">
        <BaseInput v-model="post.title" label="Название" id="title" />
      </div>

      <div class="form-group">
        <BaseInput v-model="post.topic" label="Тема" id="topic" />
      </div>

      <div class="form-group">
        <label class="label-text">Иллюстрации</label>
        <!-- Компонент загрузки картинок -->
        <BaseImageUpload v-model="post.images" />
      </div>

      <div class="form-group">
        <label class="label-text">Текст</label>
        <textarea v-model="post.text" class="base-textarea" rows="6"></textarea>
      </div>

      <div class="submit-wrapper">
        <!-- Кнопка "Сохранить" -->
        <BaseButton class="btn-standard" :disabled="!isFormValid" @click="savePost">
          Сохранить
        </BaseButton>
      </div>
    </div>
  </div>
</template>

<style scoped>
.edit-page {
  padding: 40px 20px;
  display: flex;
  justify-content: center;
}

.form-container {
  background: white;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  width: 100%;
  max-width: 500px;
}

.form-group {
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
}

.label-text {
  font-size: 14px;
  color: #666;
  margin-bottom: 8px;
  font-weight: bold;
}

/* Стилизация textarea под общий дизайн */
.base-textarea {
  background-color: #e5e5e5;
  border: none;
  border-radius: 8px;
  padding: 12px 15px;
  font-size: 16px;
  outline: none;
  width: 100%;
  resize: vertical;
  font-family: inherit;
  color: #333;
}

.base-textarea:focus {
  box-shadow: 0 0 0 2px #a855f7; /* Фиолетовая обводка при клике */
}

.submit-wrapper {
  display: flex;
  justify-content: center;
  margin-top: 10px;
}
</style>
