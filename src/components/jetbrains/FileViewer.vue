<script lang="ts" setup>
import { computed } from 'vue'
import { useJetBrainsStore } from '@/stores/jetbrains'

import highlighter from 'highlight.js'
import 'highlight.js/styles/atom-one-dark.css'

const jetBrainsStore = useJetBrainsStore()

const node = computed(() => jetBrainsStore.openedFile)
// Highlight the content, then split into lines. Prefer editedContent for live updates
const lines = computed(() => {
  if (node.value?.type != 'text') return []
  const raw = jetBrainsStore.editedContent || node.value?.content || ''
  if (!raw) return []
  const content = highlighter.highlight(raw, {
    language: jetBrainsStore.language || 'plaintext',
  })
  return content.value.split('\n')
})

// Whether to use full width (1/1) or half width (1/2)
const props = defineProps({
  fullWidth: {
    type: Boolean,
    default: true,
  },
})

const widthDivider = computed(() => (props.fullWidth ? 1 : 2))
</script>
<template>
  <div class="file-viewer" v-if="node?.type === 'text'">
    <div class="index-box" />
    <div class="line" v-for="(line, index) in lines" :key="index">
      <div class="index">{{ index + 1 }}</div>
      <pre class="code-wrapper"><code class="code" v-html="line" /></pre>
    </div>
  </div>
  <div class="binary-viewer" v-else-if="node?.type === 'image'">
    <img :src="node.content" :alt="node.name" />
  </div>
  <div class="binary-viewer" v-else-if="node?.type === 'svg'">
    <div v-html="node.content" />
  </div>
  <div v-else-if="node?.type" class="binary-viewer">
    <p>Cannot preview this file type.</p>
  </div>
</template>

<style scoped lang="scss">
.binary-viewer {
  display: flex;
  justify-content: center;
  align-items: center;

  width: calc(var(--editor-window-width) / v-bind(widthDivider));
  height: var(--editor-window-height);

  background-color: var(--file-viewer-background-color);
}
.file-viewer {
  color: var(--file-viewer-text-color);
  background-color: var(--file-viewer-background-color);

  width: calc(var(--editor-window-width) / v-bind(widthDivider));
  height: var(--editor-window-height);

  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;

  position: relative;

  overflow: auto;

  font-variant-numeric: tabular-nums;

  & .line {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    gap: 0.2rem;

    & .index {
      user-select: none;

      width: 4rem;
      padding-right: 2rem;
      text-align: right;
      font-size: 0.8rem;
      color: var(--file-viewer-index-text-color);
      border-right: 1px solid var(--file-editor-border-color);
    }

    & .code-wrapper {
      line-height: 1rem;
      height: 1rem;

      tab-size: 4;
    }
  }
}
</style>
