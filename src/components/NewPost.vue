<script setup>
import { ref } from 'vue'
import { createPost } from '../services/blockchain'
import { useAuthStore } from '../stores/auth'

const authStore = useAuthStore()
const content = ref('')
const emit = defineEmits(['post-created'])

const handleSubmit = async () => {
  if (!content.value.trim()) return
  
  try {
    await createPost(content.value)
    content.value = ''
    emit('post-created')
  } catch (error) {
    console.error('发帖失败:', error)
  }
}
</script>

<template>
  <div v-if="authStore.isAuthenticated" class="p-4 border-b border-dark-50">
    <textarea
      v-model="content"
      placeholder="有什么新鲜事？"
      class="w-full bg-transparent border-none outline-none resize-none"
      rows="3"
    />
    <div class="flex justify-end">
      <button
        @click="handleSubmit"
        class="bg-primary px-4 py-2 rounded-full font-bold hover:bg-primary-dark"
        :disabled="!content.trim()"
      >
        发布
      </button>
    </div>
  </div>
</template>