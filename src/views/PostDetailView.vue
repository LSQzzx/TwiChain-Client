<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import Post from '../components/Post.vue'
import { getChain, parseChainData, createPost } from '../services/blockchain'

const route = useRoute()
const authStore = useAuthStore()
const postId = route.params.id

const post = ref(null)
const comments = ref([])
const newComment = ref('')
const loading = ref(true)

// 获取帖子和评论数据
const fetchPostAndComments = async () => {
  try {
    loading.value = true
    const chainData = await getChain()
    const allPosts = parseChainData(chainData)
    
    // 查找当前帖子
    post.value = allPosts.find(p => p.id === postId)
    if (!post.value) {
      throw new Error('帖子不存在')
    }

    // 获取所有评论（target_post_id 匹配当前帖子 ID 的非点赞交易）
    const postComments = chainData.chain
      .flatMap(block => block.transactions)
      .filter(tx => 
        tx.target_post_id === postId && 
        !tx.is_like
      )
      .map(tx => ({
        id: tx.id,
        content: tx.message,
        timestamp: tx.timestamp,
        name: tx.sender.slice(0, 8),
        username: tx.sender,
        likes: 0 // 可以在这里统计评论的点赞数
      }))
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))

    comments.value = postComments
  } catch (error) {
    console.error('获取帖子详情失败:', error)
  } finally {
    loading.value = false
  }
}

// 提交评论
const submitComment = async () => {
  if (!newComment.value.trim() || !authStore.isAuthenticated) return
  
  try {
    await createPost(newComment.value, postId)
    newComment.value = ''
    await fetchPostAndComments() // 重新加载数据
  } catch (error) {
    console.error('发送评论失败:', error)
  }
}

onMounted(fetchPostAndComments)
</script>

<template>
  <div>
    <div class="sticky top-0 z-10 bg-black/80 backdrop-blur-md border-b border-gray-800">
      <div class="p-4">
        <h2 class="text-xl font-bold">帖子详情</h2>
      </div>
    </div>

    <div v-if="loading" class="p-4 text-center text-gray-500">
      加载中...
    </div>

    <template v-else-if="post">
      <div class="border-b border-gray-800">
        <Post :post="post" :show-full="true" @like-updated="fetchPostAndComments" />
      </div>

      <div v-if="authStore.isAuthenticated" class="border-b border-gray-800 p-4">
        <textarea
          v-model="newComment"
          class="w-full bg-transparent outline-none resize-none"
          placeholder="发送你的回复"
          rows="3"
        ></textarea>
        <div class="flex justify-end">
          <button
            @click="submitComment"
            :disabled="!newComment.trim()"
            class="bg-blue-500 text-white rounded-full px-4 py-2 disabled:opacity-50"
          >
            回复
          </button>
        </div>
      </div>

      <div>
        <div v-if="comments.length === 0" class="p-4 text-center text-gray-500">
          还没有评论
        </div>
        <Post
          v-for="comment in comments"
          :key="comment.id"
          :post="comment"
          @like-updated="fetchPostAndComments"
        />
      </div>
    </template>

    <div v-else class="p-4 text-center text-gray-500">
      帖子不存在
    </div>
  </div>
</template>