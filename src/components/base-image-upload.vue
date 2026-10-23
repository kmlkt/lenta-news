<script setup lang="ts">
import { imageUrl, uploadImage } from "@/api/post";
import { useUserStore } from "@/stores/user-store";
import { ref } from "vue";

const userStore = useUserStore();
const model = defineModel<string[]>({ default: () => [] });

const fileInput = ref<HTMLInputElement | null>(null);

const triggerFileInput = () => {
  fileInput.value!.click();
};

const onFileChange = async (event: Event) => {
  // @ts-expect-error asas
  const files: File[] = Array.from(event.target.files);
  if (!files.length) return;
  const newValue = [...model.value];
  for (const img of files) {
    const filename = crypto.randomUUID() + "." + img.name.split(".").at(-1);
    await uploadImage(userStore.token!, filename, img);
    newValue.push(filename);
  }
  model.value = newValue;
};

const removeImage = (index: number) => {
  const newValue = [...model.value];
  newValue.splice(index, 1);
  model.value = newValue;
};
</script>

<template>
  <div class="image-gallery">
    <input
      type="file"
      ref="fileInput"
      @change="onFileChange"
      accept="image/*"
      multiple
      class="hidden-input"
    />

    <div class="gallery-grid">
      <!-- Загруженные картинки -->
      <div v-for="(image, index) in model" :key="index" class="image-card">
        <img :src="imageUrl(image)" alt="Обложка" class="preview-img" />
        <button type="button" class="remove-btn" @click="removeImage(index)">✕</button>
      </div>

      <!-- Кнопка добавления -->
      <div class="add-button-wrapper" @click="triggerFileInput" title="Добавить картинку">
        <div class="add-button">
          <span class="plus-sign">+</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.hidden-input {
  display: none;
}

.gallery-grid {
  display: grid;
  /* Сетка из 2 колонок */
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
  width: 300px; /* Задаем ширину контейнера */
}

/* Карточка с картинкой */
.image-card {
  position: relative;
  width: 100%;
  aspect-ratio: 1 / 1;
  border-radius: 8px;
  background-color: #f5f5f5;
  border: 1px solid #eee;
  overflow: hidden;
}

.preview-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Крестик */
.remove-btn {
  position: absolute;
  top: 5px;
  right: 5px;
  background: transparent;
  color: #000;
  border: none;
  font-size: 24px;
  font-weight: bold;
  cursor: pointer;
  line-height: 1;
  padding: 0;
  transition: color 0.2s;
}

.remove-btn:hover {
  color: #ef4444;
}

/* Обертка для кнопки (занимает ячейку в сетке, чтобы двигать плюсик) */
.add-button-wrapper {
  width: 100%;
  aspect-ratio: 1 / 1;
  display: flex;
  align-items: center;
  justify-content: flex-start;
}

.add-button {
  width: 35px;
  height: 35px;
  border-radius: 8px;
  background-color: #ff8000;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.2s;
}

.add-button:hover {
  background-color: #ea580c;
}

.plus-sign {
  font-size: 24px;
  font-weight: bold;
  margin-top: -2px;
}
</style>
