<script lang="ts" setup>
import { computed } from 'vue'
import { useJetBrainsStore } from '@/stores/jetbrains'
import MarkdownIt from 'markdown-it'
import highlighter from 'highlight.js'
import 'highlight.js/styles/atom-one-dark.min.css'

const jetBrainsStore = useJetBrainsStore()

// Initialize Markdown instance
const md = new MarkdownIt('default', {
  html: true,
  linkify: true,
  breaks: true,
  highlight: (str: string, lang: string): string => {
    try {
      if (lang && highlighter.getLanguage(lang)) {
        return highlighter.highlight(str, { language: lang }).value
      }

      return highlighter.highlightAuto(str).value
    } catch {
      return ''
    }
  },
})

// Render markdown from editedContent if present, else from openedFile.content
const html = computed(() => {
  const raw = jetBrainsStore.editedContent || jetBrainsStore.openedFile?.content || ''
  return md.render(raw)
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
  <div class="markdown-viewer">
    <div class="markdown-body" v-html="html" />
  </div>
</template>

<style scoped lang="scss">
.markdown-viewer {
  color: var(--file-viewer-text-color);
  background-color: var(--file-viewer-background-color);

  width: calc(var(--editor-window-width) / v-bind(widthDivider));
  height: var(--editor-window-height);

  padding-left: var(--editor-window-gutter-width);

  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;

  overflow: auto;

  & .markdown-body {
    width: 100%;
    line-height: var(--editor-window-line-height);
    font-size: var(--editor-window-font-size);

    word-break: break-word;
  }
}
</style>
