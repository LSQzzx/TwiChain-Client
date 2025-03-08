<script setup>
import { ref } from 'vue'
import { MagnifyingGlassIcon } from '@heroicons/vue/24/outline'
import twichain from '../assets/twichain_w.png'

const searchQuery = ref('')
const navItems = [
  { label: '首页', path: '/' },
  { label: '个人主页', path: '/profile' },
]
</script>

<template>
  <aside class="fixed h-screen p-4 w-[300px] border-r border-gray-800">
    <div class="flex flex-col gap-4">
      <!-- Logo -->
      <div class="px-3">
        <img 
          :src="twichain" 
          alt="twichain" 
          class="h-8 w-auto"
        />
      </div>

      <!-- 搜索框 -->
      <div class="relative">
        <MagnifyingGlassIcon class="w-5 h-5 absolute left-4 top-3 text-gray-500" />
        <input
          v-model="searchQuery"
          type="text"
          placeholder="搜索"
          class="input-primary pl-12 w-full bg-dark-100"
        />
      </div>

      <!-- 导航链接 -->
      <router-link 
        v-for="item in navItems" 
        :key="item.label"
        :to="item.path"
        class="text-xl hover:bg-gray-800 p-3 rounded-full"
      >
        {{ item.label }}
      </router-link>
    </div>
  </aside>
</template>