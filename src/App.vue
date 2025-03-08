<script setup>
import { useAuthStore } from './stores/auth'
import { useRouter } from 'vue-router'
import Sidebar from './components/Sidebar.vue'

const authStore = useAuthStore()
const router = useRouter()

const handleLogout = () => {
  authStore.logout()
  router.push('/login')
}
</script>

<template>
  <div class="min-h-screen bg-dark text-white">
    <Sidebar />
    <main class="ml-[300px]">
      <!-- 添加退出按钮 -->
      <div v-if="authStore.isAuthenticated" class="fixed top-4 right-4">
        <button
          @click="handleLogout"
          class="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-full text-sm"
        >
          退出登录
        </button>
      </div>
      <div class="max-w-2xl mx-auto">
        <router-view />
      </div>
    </main>
  </div>
</template>