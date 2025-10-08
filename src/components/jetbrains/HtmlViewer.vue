<script lang="ts" setup>
import { computed } from 'vue'
import { useJetBrainsStore } from '@/stores/jetbrains'

const jetBrainsStore = useJetBrainsStore()

// Render HTML from editedContent if present, else from openedFile.content
const html = computed(
  () => jetBrainsStore.editedContent || jetBrainsStore.openedFile?.content || '',
)

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
  <div class="html-viewer">
    <iframe :srcdoc="html" frameborder="0" />
  </div>
</template>

<style scoped lang="scss">
.html-viewer {
  color: var(--file-viewer-text-color);
  background-color: var(--file-viewer-background-color);

  width: calc(var(--editor-window-width) / v-bind(widthDivider));
  height: var(--editor-window-height);

  padding: 1rem;

  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;

  overflow: auto;

  & iframe {
    width: 100%;
    height: calc(100% - 2rem);
    border: none;
    overflow: scroll;
  }

  & .html-body {
    width: 100%;
    line-height: var(--editor-window-line-height);
    font-size: var(--editor-window-font-size);

    word-break: break-word;
  }
}
</style>

