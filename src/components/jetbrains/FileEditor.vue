<script lang="ts" setup>
import { computed } from 'vue'
import { useJetBrainsStore } from '@/stores/jetbrains'

import highlighter from 'highlight.js'
import 'highlight.js/styles/atom-one-dark.css'

const jetBrainsStore = useJetBrainsStore()

// Highlight the content, then split into lines
const lines = computed(() => {
  if (!jetBrainsStore.openedFile?.content) return []
  const content = highlighter.highlight(jetBrainsStore.openedFile.content, {
    language: jetBrainsStore.language || 'plaintext',
  })

  return content.value.split('\n')
})
</script>
<template>
  <div class="file-editor">
    <div class="line" v-for="(line, index) in lines" :key="index">
      <div class="index">{{ index + 1 }}</div>
      <pre class="code-wrapper"><code class="code" v-html="line" /></pre>
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

  & .line {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    gap: 1rem;

    & .index {
      user-select: none;

      width: 2rem;
      padding-right: 0.2rem;
      text-align: right;
      font-size: 0.8rem;
      color: var(--file-editor-index-text-color);
    }

    & .code-wrapper {
      line-height: 1rem;
      height: 1rem;

      tab-size: 4;

      padding: 0 0.75rem;
    }
  }
}
</style>
