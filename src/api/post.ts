import { API_BASE, fetchApi } from "./common";

export interface Post {
  id: string;
  title: string;
  text: string;
  images: string[];
  topic: string;
  published_at: string;
  published: boolean;
  reactions: {
    emoji: string;
    count: number;
    my: boolean;
  }[];
}

export async function getPosts(): Promise<Post[]> {
  return await fetchApi("GET", "posts", null);
}

export async function getMyPosts(token: string): Promise<Post[]> {
  return await fetchApi("GET", "posts/my", token);
}

export async function getUnpublishedPosts(token: string): Promise<Post[]> {
  return await fetchApi("GET", "posts/unpublished", token);
}

export async function createPost(token: string, post: Post) {
  await fetchApi("POST", "posts", token, post);
}

export async function editPost(token: string, post: Post) {
  await fetchApi("PUT", `posts/${post.id}`, token, post);
}

export async function deletePost(token: string, id: string) {
  await fetchApi("DELETE", `posts/${id}`, token);
}

export function imageUrl(img: string): string {
  return `${API_BASE}images/${img}`;
}

export async function uploadImage(token: string, filename: string, image: File) {
  const form = new FormData();
  form.append("file", image);
  await fetch(API_BASE + "images/" + filename, {
    method: "POST",
    body: form,
    headers: {
      Authorization: "Bearer " + token,
    },
  });
}

export async function setReaction(token: string, id: string, reaction: string | null) {
  await fetchApi("PUT", `posts/${id}/reactions`, token, { reaction });
}
