<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const form = ref({
  publicKey: '',
  privateKey: ''
})

const error = ref('')

const handleLogin = async () => {
  try {
    const success = await authStore.login(form.value)
    if (success) {
      router.push('/')
    } else {
      error.value = '验证失败，请检查密钥对是否正确'
    }
  } catch (e) {
    error.value = '登录失败：' + e.message
  }
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center">
    <div class="bg-gray-900 p-8 rounded-lg w-96">
      <h1 class="text-2xl font-bold mb-6">登录到 Twichain</h1>
      <form @submit.prevent="handleLogin" class="space-y-4">
        <div>
          <input
            v-model="form.publicKey"
            type="text"
            placeholder="公钥"
            class="w-full p-3 rounded bg-gray-800 border border-gray-700"
          />
        </div>
        <div>
          <input
            v-model="form.privateKey"
            type="password"
            placeholder="私钥"
            class="w-full p-3 rounded bg-gray-800 border border-gray-700"
          />
        </div>
        <div v-if="error" class="text-red-500 text-sm">
          {{ error }}
        </div>
        <button
          type="submit"
          class="w-full bg-blue-500 text-white rounded-full py-3 hover:bg-blue-600"
        >
          登录
        </button>
      </form>
    </div>
  </div>
</template>