<script lang="ts" setup>
import FileTree from '@/components/jetbrains/file-navigator/FileTree.vue'
import { useJetBrainsStore } from '@/stores/jetbrains'
import type Node from '@/models/Node'

import { reactive } from 'vue'
import Icon from '@/models/Icon.ts'

const jetBrainsStore = useJetBrainsStore()

// Build and initialize the file tree
const fileTree = reactive(jetBrainsStore.tree)
jetBrainsStore.getChildren(fileTree.root as Node).then(() => {
  fileTree.highlight(fileTree.root?._lastChild as Node)
  fileTree.tryOpen(fileTree.root?._lastChild as Node)
})
</script>

<template>
  <div class="file-navigator" tabindex="0" @keydown.stop.prevent="fileTree.navigateNode">
    <div class="section">
      Project
      <img :src="Icon('fold')" alt="arrow" />
    </div>
    <FileTree :file-tree="fileTree" />
  </div>
</template>

<style scoped lang="scss">
.file-navigator {
  user-select: none;
  display: flex;
  flex-direction: column;
  align-items: flex-start;

  line-height: var(--global-light-height);
  color: var(--file-navigator-text-color);
  background-color: var(--file-navigator-background-color);
  overflow: auto;

  position: fixed;
  top: var(--file-navigator-top);
  left: 0;

  width: var(--file-navigator-width);
  height: var(--file-navigator-height);
  padding: 1rem;

  & .section {
    font-weight: bold;
  }

  &:focus {
    outline: none;
    box-shadow: inset 0 0 0 2px var(--file-navigator-focus-border-color);
  }
}
</style>
