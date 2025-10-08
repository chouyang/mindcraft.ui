<script lang="ts" setup>
import FileEditor from '@/components/jetbrains/FileEditor.vue'
import FileViewer from '@/components/jetbrains/FileViewer.vue'
import HtmlViewer from '@/components/jetbrains/HtmlViewer.vue'
import MarkdownViewer from '@/components/jetbrains/MarkdownViewer.vue'
import { computed } from 'vue'
import { useJetBrainsStore } from '@/stores/jetbrains'

const jetBrainsStore = useJetBrainsStore()
const isMarkdown = computed(
  () => (jetBrainsStore.openedFile?.extension || '').toLowerCase() === 'md',
)
const isHtml = computed(
  () => {
    const ext = (jetBrainsStore.openedFile?.extension || '').toLowerCase()

    return ext === 'html' || ext === 'htm'
  },
)

const inEditMode = computed(() => jetBrainsStore.inEditMode)
</script>

<template>
  <div class="editor-window">
    <MarkdownViewer :full-width="!inEditMode" v-if="isMarkdown" />
    <HtmlViewer :full-width="!inEditMode" v-if="isHtml" />
    <FileViewer :full-width="true" v-if="!isMarkdown && !isHtml && !inEditMode" />
    <FileEditor :full-width="!isMarkdown && !isHtml" v-if="inEditMode" />
  </div>
</template>

<style lang="scss" scoped>
.editor-window {
  position: fixed;
  top: var(--editor-window-top);
  left: var(--editor-window-left);

  overflow: hidden;

  width: var(--editor-window-width);
  height: var(--editor-window-height);
  color: var(--file-viewer-text-color);
  background-color: var(--file-viewer-background-color);

  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: flex-start;
}
</style>
