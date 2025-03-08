<script setup>
import { 
  HeartIcon, 
  ChatBubbleLeftIcon
} from '@heroicons/vue/24/outline'
import { HeartIcon as HeartSolidIcon } from '@heroicons/vue/24/solid'
import { useRouter } from 'vue-router'
import LetterAvatar from './LetterAvatar.vue'
import { likePost } from '../services/blockchain'
import { useAuthStore } from '../stores/auth'
import { formatTimeAgo } from '../utils/time'

const router = useRouter()

const props = defineProps({
  post: {
    type: Object,
    required: true
  },
  showFull: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['like-updated'])
const authStore = useAuthStore()

const handleLike = async (event) => {
  event.stopPropagation()
  if (!authStore.isAuthenticated) return
  
  try {
    await likePost(props.post.id)
    emit('like-updated')
  } catch (error) {
    console.error('点赞失败:', error)
  }
}

const goToDetail = () => {
  if (!props.showFull) {
    router.push(`/post/${props.post.id}`)
  }
}
</script>

<template>
  <article 
    class="p-4 hover:bg-dark-100/50 cursor-pointer border-b border-dark-50"
    @click="goToDetail"
  >
    <div class="flex gap-4">
      <LetterAvatar 
        :name="post.name"
        class="shrink-0"
      />
      <div class="flex-grow">
        <div class="flex items-center gap-2">
          <span class="font-bold">{{ post.name }}</span>
          <span class="text-gray-500">@{{ post.username.slice(0, 8) }}</span>
          <span class="text-gray-500">·</span>
          <span class="text-gray-500">{{ formatTimeAgo(post.timestamp) }}</span>
        </div>
        <p class="mt-2">{{ post.content }}</p>
        <div class="flex items-center gap-8 mt-4">
          <button 
            class="flex items-center gap-2 text-gray-500 hover:text-primary"
            @click.stop="handleLike"
          >
            <HeartIcon class="w-5 h-5" />
            <span>{{ post.likes || 0 }}</span>
          </button>
          <div 
            class="flex items-center gap-2 text-gray-500"
          >
            <ChatBubbleLeftIcon class="w-5 h-5" />
            <span>{{ post.comments || 0 }}</span>
          </div>
        </div>
      </div>
    </div>
  </article>
</template>