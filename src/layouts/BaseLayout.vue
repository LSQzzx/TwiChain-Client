<script setup>
import Sidebar from '../components/Sidebar.vue'
</script>

<template>
  <div class="min-h-screen bg-black text-white">
    <div class="container mx-auto">
      <Sidebar />
      <main class="ml-[300px]">
        <slot></slot>
      </main>
    </div>
  </div>
</template>