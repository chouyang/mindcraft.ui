<script lang="ts" setup>
import FileEditor from '@/components/jetbrains/FileEditor.vue'
import FileViewer from '@/components/jetbrains/FileViewer.vue'
import MarkdownViewer from '@/components/jetbrains/MarkdownViewer.vue'
import { computed, ref } from 'vue'
import { useJetBrainsStore } from '@/stores/jetbrains'

const jetBrainsStore = useJetBrainsStore()
const isMarkdown = computed(
  () => (jetBrainsStore.openedFile?.extension || '').toLowerCase() === 'md',
)

// TODO: manage edit mode state globally with a toggle button
const inEditMode = ref(false)
</script>

<template>
  <div class="editor-window">
    <MarkdownViewer :full-width="!inEditMode" v-if="isMarkdown" />
    <FileViewer :full-width="!inEditMode" v-else />
    <FileEditor v-if="inEditMode" />
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

  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: flex-start;
}
</style>
