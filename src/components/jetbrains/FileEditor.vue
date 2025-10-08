<script lang="ts" setup>
import { watch, onMounted, ref, computed } from 'vue'
import { useJetBrainsStore } from '@/stores/jetbrains'

const jetBrainsStore = useJetBrainsStore()

// Whether to use full width (1/1) or half width (1/2)
const props = defineProps({
  fullWidth: {
    type: Boolean,
    default: true,
  },
})

const widthDivider = computed(() => (props.fullWidth ? 1 : 2))

// References for syncing scroll between editor and gutter
const editorArea = ref<HTMLTextAreaElement | null>(null)
const lineNumbersRef = ref<HTMLDivElement | null>(null)

// Watch for content changes and update the store
const handleContentChange = (event: Event) => {
  const target = event.target as HTMLTextAreaElement
  jetBrainsStore.updateContent(target.value)
}

// Handle keyboard shortcuts
const handleKeyDown = (event: KeyboardEvent) => {
  // Handle Tab key to insert tab character instead of shifting focus
  if (event.key === 'Tab') {
    event.preventDefault()
    const target = event.target as HTMLTextAreaElement
    const start = target.selectionStart
    const end = target.selectionEnd
    const value = target.value
    
    // Insert tab character at cursor position
    const newValue = value.substring(0, start) + '\t' + value.substring(end)
    jetBrainsStore.updateContent(newValue)
    
    // Set cursor position after the inserted tab
    setTimeout(() => {
      target.selectionStart = target.selectionEnd = start + 1
    }, 0)
    return
  }
  
  // Ctrl+S or Cmd+S to save
  if ((event.ctrlKey || event.metaKey) && event.key === 's') {
    event.preventDefault()
    jetBrainsStore.saveContent()
  }
}

// Sync gutter scroll with textarea scroll
const syncScroll = () => {
  if (editorArea.value && lineNumbersRef.value) {
    lineNumbersRef.value.scrollTop = editorArea.value.scrollTop
  }
}

// Handle mouse wheel on gutter to scroll editor
const handleGutterWheel = (event: WheelEvent) => {
  if (editorArea.value) {
    editorArea.value.scrollTop += event.deltaY
    syncScroll()
  }
}

// Initialize editor when component mounts
onMounted(() => {
  if (jetBrainsStore.openedFile.name) {
    jetBrainsStore.initializeEditor()
  }
})

// Watch for file changes to reinitialize editor
watch(
  () => jetBrainsStore.openedFile.name,
  () => {
    if (jetBrainsStore.openedFile.name) {
      jetBrainsStore.initializeEditor()
    }
  },
)
</script>
<template>
  <div class="file-editor">
    <div class="editor-container">
      <div class="gutter" ref="lineNumbersRef" @wheel.prevent="handleGutterWheel">
        <div
          v-for="(line, index) in jetBrainsStore.editedContent.split('\n')"
          :key="index"
          class="line-number"
        >
          {{ index + 1 }}
        </div>
      </div>
      <textarea
        ref="editorArea"
        name="code-editor"
        v-model="jetBrainsStore.editedContent"
        @input="handleContentChange"
        @keydown="handleKeyDown"
        @scroll="syncScroll"
        class="code-editor"
        :placeholder="
          jetBrainsStore.openedFile.name
            ? `Edit ${jetBrainsStore.openedFile.name}`
            : 'No file opened'
        "
        spellcheck="false"
      />
    </div>
    <div class="editor-status" v-if="jetBrainsStore.isDirty">
      <span class="dirty-indicator">● Unsaved changes</span>
      <button @click="jetBrainsStore.saveContent()" class="save-button">Save (Ctrl+S)</button>
    </div>
  </div>
</template>

<style scoped lang="scss">
.file-editor {
  color: var(--file-viewer-text-color);
  background-color: var(--file-viewer-background-color);

  width: calc(var(--editor-window-width) / v-bind(widthDivider));
  height: var(--editor-window-height);
  overflow: hidden;

  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-end;
  font-size: var(--editor-window-font-size);
  line-height: var(--editor-window-line-height);

  font-variant-numeric: tabular-nums;

  & .editor-container {
    display: flex;
    flex: 1;
    width: calc(var(--editor-window-width) / v-bind(widthDivider));
    height: var(--editor-window-height);
    overflow: hidden;

    & .gutter {
      user-select: none;
      overflow-y: auto;
      overflow-x: hidden;
      scrollbar-width: none;
      -ms-overflow-style: none;
      &::-webkit-scrollbar {
        width: 0;
        height: 0;
      }

      & .line-number {
        user-select: none;
        width: var(--editor-window-gutter-width);
        padding-right: 2rem;
        text-align: right;
        color: var(--file-editor-index-text-color);
        border-right: 1px solid var(--file-editor-border-color);
      }
    }

    & .code-editor {
      flex: 1;
      background-color: transparent;
      color: var(--file-editor-text-color);
      border: none;
      outline: none;
      margin: 0;
      font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
      resize: none;
      tab-size: 4;
      padding: 0 0 0 0.2rem;

      font-size: var(--editor-window-font-size);
      line-height: var(--editor-window-line-height);

      &::placeholder {
        color: var(--file-editor-placeholder-color, #666);
      }

      &:focus {
        outline: none;
      }
    }

  }

  & .editor-status {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.25rem 0.5rem;
    background-color: var(--file-editor-status-background-color, #1e1e1e);
    border-top: 1px solid var(--file-editor-border-color, #f5f5f5);
    font-size: 0.8rem;
    width: 50%;

    & .dirty-indicator {
      color: var(--file-editor-dirty-color, #ffa500);
    }

    & .save-button {
      background-color: var(--file-editor-save-button-background, #007acc);
      color: white;
      border: none;
      padding: 0.25rem 0.5rem;
      border-radius: 3px;
      cursor: pointer;
      font-size: 0.8rem;

      &:hover {
        background-color: var(--file-editor-save-button-hover, #005a9e);
      }
    }
  }
}
</style>
