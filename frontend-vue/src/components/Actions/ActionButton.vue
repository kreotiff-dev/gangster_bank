<template>
  <div 
    class="flex flex-col items-center text-gray-700 hover:text-blue-600 cursor-pointer transition"
    @click="$emit('action-click')"
  >
    <div class="text-3xl mb-1">{{ icon }}</div>
    <div class="text-sm font-semibold">{{ label }}</div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  icon: string
  label: string
}>()

// Добавляем эмиттер для события клика
defineEmits(['action-click'])
</script>