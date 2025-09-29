<script setup lang="ts">
import JetBrainsView from '@/views/JetBrainsView.vue'
import { useJetBrainsStore } from '@/stores/jetbrains.ts'
import { useDark } from '@vueuse/core'
import { onMounted } from 'vue'

const store = useJetBrainsStore()
const isDark = useDark({
  selector: 'body',
  attribute: 'color-scheme',
  valueDark: 'dark',
  valueLight: 'light',
  onChanged: (dark) => {
    store.isDarkMode = dark
  },
})

onMounted(() => {
  store.isDarkMode = isDark.value
})
</script>

<template>
  <JetBrainsView />
</template>
