<script setup lang="ts">
import FileNode from '@/components/jetbrains/file-navigator/FileNode.vue'
import Tree from '@/models/Tree'
import type Node from '@/models/Node'

defineProps({
  fileTree: {
    type: Object as () => Tree,
    required: true,
  },
})
</script>

<template>
  <div class="file-tree">
    <template v-for="node in fileTree" :key="node.path + node.name">
      <FileNode
        :node="node"
        @selected="(n: Node) => fileTree.highlight(n)"
        @opened="(n: Node) => fileTree.tryOpen(n)"
      />
    </template>
  </div>
</template>

<style scoped lang="scss">
.file-tree {
  width: var(--file-navigator-width);
  height: auto;
}
</style>
