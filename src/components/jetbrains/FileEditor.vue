<script lang="ts" setup>
import { computed } from 'vue'
import { useJetBrainsStore } from '@/stores/jetbrains'

const jetBrainsStore = useJetBrainsStore()
const lines = computed(() => {
  if (!jetBrainsStore.openedFile?.content) return []

  return jetBrainsStore.openedFile.content.split('\n')
})
</script>
<template>
  <div class="file-editor">
    <div class="line" v-for="(line, index) in lines" :key="index">
      <div class="index">{{ index }}</div>
      <div class="code">{{ line }}</div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.file-editor {
  color: var(--file-editor-text-color);
  background-color: var(--file-editor-background-color);

  position: fixed;
  top: var(--file-editor-top);
  left: var(--file-editor-left);

  width: var(--file-editor-width);
  height: var(--file-editor-height);

  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;

  overflow: auto;

  padding: 0.5rem;

  & .line {
    display: flex;
    flex-direction: row;
    gap: 1rem;

    & .index {
      color: var(--file-editor-index-text-color);
      user-select: none;
    }

    & .code {
      color: var(--file-editor-code-text-color);
    }
  }
}
</style>
