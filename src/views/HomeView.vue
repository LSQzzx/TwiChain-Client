<script setup>
import { ref, onMounted } from 'vue'
import Post from '../components/Post.vue'
import NewPost from '../components/NewPost.vue'
import { getChain, parseChainData } from '../services/blockchain'

const posts = ref([])

const fetchPosts = async () => {
  try {
    const chainData = await getChain()
    posts.value = parseChainData(chainData)
  } catch (error) {
    console.error('获取帖子失败:', error)
  }
}

onMounted(fetchPosts)
</script>

<template>
  <div>
    <div class="border-b border-gray-800 p-4">
      <h2 class="text-xl font-bold">首页</h2>
    </div>
    <NewPost @post-created="fetchPosts" />
    <Post 
      v-for="post in posts" 
      :key="post.id" 
      :post="post"
      @like-updated="fetchPosts"
    />
  </div>
</template>