<script setup lang="ts">
import '@/assets/global.css'

import FileNavigator from '@/components/jetbrains/file-navigator/FileNavigator.vue'
import MenuBar from '@/components/jetbrains/MenuBar.vue'
import EditorWindow from '@/components/jetbrains/EditorWindow.vue'
import { useJetBrainsStore } from '@/stores/jetbrains.ts'
import { computed } from 'vue'

const store = useJetBrainsStore()

const isDark = computed(() => store.isDarkMode)
</script>

<template>
  <header :class="{ 'dark-mode': isDark, 'light-mode': !isDark, 'header': true }">
    <MenuBar />
  </header>
  <main :class="{ 'dark-mode': isDark, 'light-mode': !isDark, 'main': true }">
    <FileNavigator />
    <EditorWindow />
  </main>
</template>

<style scoped>
.header {
  z-index: 1;
}

.main {
  z-index: 0;
}

header {
  line-height: 1.5;
  max-height: 100vh;
  overflow: visible; /* Allow dropdown to extend beyond header boundaries */
}

nav {
  width: 100%;
  font-size: 12px;
  text-align: center;
  margin-top: 2rem;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }

  nav {
    text-align: left;
    margin-left: -1rem;
    font-size: 1rem;

    padding: 1rem 0;
    margin-top: 1rem;
  }
}
</style>
