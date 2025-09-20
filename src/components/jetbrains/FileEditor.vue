<script lang="ts" setup>
import { computed } from 'vue'
import { useJetBrainsStore } from '@/stores/jetbrains'
import highlighter from 'highlight.js/lib/core'
import typescript from 'highlight.js/lib/languages/typescript'
import 'highlight.js/styles/vs.min.css'

highlighter.registerLanguage('typescript', typescript)

const jetBrainsStore = useJetBrainsStore()
const lines = computed(() => {
  if (!jetBrainsStore.openedFile?.content) return []
  const content = highlighter.highlight(jetBrainsStore.openedFile.content, {
    language: 'typescript',
  })

  return content.value.split('\n')
})
</script>
<template>
  <div class="file-editor">
    <div class="line" v-for="(line, index) in lines" :key="index">
      <div class="index">{{ index }}</div>
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

  padding: 0.5rem;

  & .line {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    gap: 1rem;

    & .index {
      color: var(--file-editor-index-text-color);
      user-select: none;
    }

    & .code-wrapper {
      line-height: 1rem;
      height: 1rem;
    }
  }
}
</style>
