<script setup>
import { useAuthStore } from '../stores/auth'
import Post from '../components/Post.vue'
import LetterAvatar from '../components/LetterAvatar.vue'
import { ref, onMounted } from 'vue'
import { getChain, parseChainData } from '../services/blockchain'

const authStore = useAuthStore()
const user = authStore.user
const userPosts = ref([])

const fetchUserPosts = async () => {
  try {
    const chainData = await getChain()
    // 获取所有帖子并筛选当前用户的帖子
    const allPosts = parseChainData(chainData)
    userPosts.value = allPosts.filter(post => post.username === user.publicKey)
  } catch (error) {
    console.error('获取用户帖子失败:', error)
  }
}

onMounted(fetchUserPosts)
</script>

<template>
  <div>
    <!-- 个人资料头部 -->
    <div class="relative">
      <div class="h-48 bg-gray-800"></div>
      <div class="absolute bottom-0 left-4 transform translate-y-1/2">
        <LetterAvatar
          :name="user?.name"
          size="w-32 h-32"
          class="border-4 border-black"
        />
      </div>
    </div>

    <!-- 个人信息 -->
    <div class="mt-20 px-4">
      <div class="flex justify-between items-start">
        <div>
          <h2 class="text-2xl font-bold">{{ user?.name }}</h2>
          <div class="text-gray-500">@{{ user?.username.slice(0, 8) }}</div>
        </div>
        <button class="border border-gray-500 text-white px-4 py-2 rounded-full">
          编辑资料
        </button>
      </div>

      <div class="flex gap-6 mt-4 text-gray-500">
        <div><span class="font-bold text-white">{{ userPosts.length }}</span> 帖子</div>
        <div><span class="font-bold text-white">0</span> 获赞</div>
      </div>
    </div>

    <!-- 用户推文列表 -->
    <div class="mt-4 border-t border-gray-800">
      <div v-if="userPosts.length === 0" class="p-4 text-center text-gray-500">
        还没有发布任何帖子
      </div>
      <Post 
        v-else
        v-for="post in userPosts" 
        :key="post.id" 
        :post="post"
        @like-updated="fetchUserPosts"
      />
    </div>
  </div>
</template>