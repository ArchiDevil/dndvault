<script setup lang="ts">
import type {BackendArrayResponse} from '#shared/types/backendTypes'
import Post from '~/components/Post.vue'
import '~/assets/css/styles.css'

interface PostData {
  id: number
  title: string
  content: string
}

const response = await useFetch<BackendArrayResponse<PostData>>(
  '/api/items/posts',
  {
    query: {
      sort: '-date_created',
    },
  }
)

if (response.error) {
  console.error(response.error)
}

const posts = response.data.value!.data
</script>

<template>
  <PageTitle>Блог</PageTitle>
  <Post
    v-for="post in posts"
    :key="post.id"
    :title="post.title"
    :content="post.content" />
</template>
