<script lang="ts" setup>
import { computed } from 'vue'
import { useJetBrainsStore } from '@/stores/jetbrains'
import MarkdownIt from 'markdown-it'
import highlighter from 'highlight.js'
import 'highlight.js/styles/atom-one-dark.css'

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

  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;

  overflow: auto;

  & .markdown-body {
    padding: 1rem 1.5rem 1rem 4rem;
    width: 100%;
    line-height: 1.6;
    word-break: break-word;

    & h1,
    & h2,
    & h3,
    & h4,
    & h5,
    & h6 {
      margin: 1.2rem 0 0.6rem 0;
      font-weight: 700;
      line-height: 1.25;
    }

    & h1 {
      font-size: 1.8rem;
      border-bottom: 1px solid rgba(255, 255, 255, 0.08);
      padding-bottom: 0.3rem;
    }
    & h2 {
      font-size: 1.5rem;
      border-bottom: 1px solid rgba(255, 255, 255, 0.06);
      padding-bottom: 0.2rem;
    }
    & h3 {
      font-size: 1.3rem;
    }
    & h4 {
      font-size: 1.15rem;
    }
    & h5 {
      font-size: 1rem;
    }
    & h6 {
      font-size: 0.9rem;
      color: #aaa;
    }

    & p {
      margin: 0.8rem 0;
    }

    & ul,
    & ol {
      margin: 0.6rem 0 0.6rem 1.4rem;
      padding-left: 1rem;
    }

    & li {
      margin: 0.25rem 0;
    }

    & a {
      color: #79b8ff;
      text-decoration: none;
    }
    & a:hover {
      text-decoration: underline;
    }

    & blockquote {
      margin: 0.8rem 0;
      padding: 0.4rem 0.8rem;
      border-left: 4px solid rgba(125, 125, 125, 0.5);
      color: #cfcfcf;
      background: rgba(255, 255, 255, 0.03);
    }

    & code {
      background: rgba(255, 255, 255, 0.08);
      padding: 0.15rem 0.35rem;
      border-radius: 4px;
      font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
      font-size: 0.85rem;
    }

    & pre {
      background: rgba(20, 20, 20, 0.7);
      padding: 0.75rem 1rem;
      border-radius: 6px;
      overflow: auto;
      margin: 0.9rem 0;
      border: 1px solid rgba(255, 255, 255, 0.08);
    }

    & pre code {
      background: transparent;
      padding: 0;
      font-size: 0.85rem;
    }

    & table {
      border-collapse: collapse;
      width: 100%;
      margin: 0.8rem 0;
    }
    & th,
    & td {
      border: 1px solid rgba(255, 255, 255, 0.15);
      padding: 0.4rem 0.6rem;
    }
    & th {
      background: rgba(255, 255, 255, 0.06);
    }

    & img {
      max-width: 100%;
    }
  }
}
</style>
