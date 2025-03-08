<script setup>
import { computed } from 'vue'

const props = defineProps({
  name: {
    type: String,
    required: true
  },
  size: {
    type: String,
    default: 'w-12 h-12'
  }
})

const colors = [
  'bg-blue-500',
  'bg-green-500',
  'bg-yellow-500',
  'bg-red-500',
  'bg-purple-500',
  'bg-pink-500',
  'bg-indigo-500'
]

const letter = computed(() => {
  return props.name ? props.name.charAt(0).toUpperCase() : '?'
})

const backgroundColor = computed(() => {
  // 基于名字生成固定的颜色索引，这样同一用户总是获得相同的颜色
  const index = props.name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % colors.length
  return colors[index]
})
</script>

<template>
  <div 
    :class="[size, backgroundColor]"
    class="rounded-full flex items-center justify-center text-white font-bold"
  >
    {{ letter }}
  </div>
</template>