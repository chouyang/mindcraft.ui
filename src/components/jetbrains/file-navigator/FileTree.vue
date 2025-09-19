<script setup lang="ts">
import FileNode from '@/components/jetbrains/file-navigator/FileNode.vue'
import Tree from '@/models/Tree'

defineProps({
  fileTree: {
    type: Object as () => Tree,
    required: true,
  },
})
</script>

<template>
  <div class="file-tree">
    <div class="section">Project ></div>
    <template v-for="node in fileTree" :key="node.path + node.name">
      <FileNode :node="node" @selected="(n) => fileTree.highlight(n)" />
    </template>
  </div>
</template>

<style scoped lang="scss">
.file-tree {
  width: 100%;
  height: 100%;

  & .section {
    margin-bottom: 1rem;
  }
}
</style>
