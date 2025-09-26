<script setup lang="ts">
import JetBrainsView from '@/views/JetBrainsView.vue'
import { useJetBrainsStore } from '@/stores/jetbrains.ts'
import { useDark } from '@vueuse/core'

const store = useJetBrainsStore()
useDark({
  selector: 'body',
  attribute: 'color-scheme',
  valueDark: 'dark',
  valueLight: 'light',
  onChanged: (dark) => (store.isDarkMode = dark),
})
</script>

<template>
  <JetBrainsView />
</template>
