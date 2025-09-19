<script lang="ts" setup>
import FileTree from '@/components/jetbrains/file-navigator/FileTree.vue'
import jsonNodes from '@/assets/mock/file-tree-nodes.json'
import Tree from '@/models/Tree.ts'
import type Node from '@/models/Node'

import { reactive } from 'vue'

const nodes: Array<Node> = jsonNodes as Node[]
const fileTree = reactive(new Tree(nodes))

/** Handle keyboard navigation */
function navigateNode(event: KeyboardEvent) {
  const node = fileTree.highlighted
  if (!node) return
  switch (event.key) {
    // ArrowUp goes to previous node
    case 'ArrowUp':
      if (node._prev) {
        fileTree.highlight(node._prev)
      }
      break

    // ArrowDown goes to next node
    case 'ArrowDown':
      if (node._next) {
        fileTree.highlight(node._next)
      }
      break

    // ArrowRight opens folder or goes to next node
    case 'ArrowRight':
      if (node.type === 'folder') {
        if (!node._opened) {
          fileTree.open(node)
          return
        }
      }
      if (node._next) {
        fileTree.highlight(node._next)
      }
      break

    // ArrowLeft closes folder or goes to parent
    case 'ArrowLeft':
      if (node.type === 'folder') {
        if (node._opened) {
          fileTree.close(node)
          return
        }
      }
      if (node._parent) {
        fileTree.highlight(node._parent)
        return
      }
      if (node._prev) {
        fileTree.highlight(node._prev)
      }
      break

    // Enter toggles folder open/close or opens file in editor
    case 'Enter':
      if (node._opened) {
        return fileTree.close(node)
      }

      fileTree.open(node)
      break
  }
}
</script>

<template>
  <div class="file-navigator" tabindex="0" @keydown.stop="navigateNode">
    <FileTree :file-tree="fileTree" />
  </div>
</template>

<style scoped lang="scss">
.file-navigator {
  user-select: none;

  &:focus {
    outline: none;
    box-shadow: inset 0 0 0 2px var(--file-navigator-focus-border-color);
  }

  line-height: var(--global-light-height);
  color: var(--file-navigator-text-color);
  background-color: var(--file-navigator-background-color);

  position: fixed;
  top: var(--file-navigator-top);
  left: 0;

  width: var(--file-navigator-width);
  height: var(--file-navigator-height);
  padding: 1rem;

  display: flex;
  flex-direction: row;
}
</style>
