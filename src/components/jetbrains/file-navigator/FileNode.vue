<script setup lang="ts">
import type Node from '@/models/Node.d.ts'
import { ref } from 'vue'

const props = defineProps({
  node: {
    required: true,
    type: Object as () => Node,
  },
})

const emit = defineEmits<{
  (e: 'selected', node: Node): void
  (e: 'opened', node: Node): void
}>()

const indent = ref(props.node.indentation)
const firstClick = ref(false)

const selectNode = () => {
  emit('selected', props.node)
  if (firstClick.value) {
    emit('opened', props.node)
    firstClick.value = false
    return
  }
  firstClick.value = true
  setTimeout(() => {
    firstClick.value = false
  }, 400)
}
</script>

<template>
  <div
    @click.stop.prevent="selectNode"
    :class="{ highlighted: node._highlighted, 'file-node': true }"
  >
    <span class="arrow">
      {{ node.type === 'folder' ? (node._opened ? 'v' : '>') : '' }}
    </span>
    <span class="name">
      {{ node.type === 'folder' ? (node._opened ? '📂' : '📁') : '📄' }}
      {{ node.name }}
    </span>
    <span class="caption">
      {{ node.caption }}
    </span>
  </div>
</template>

<style scoped lang="scss">
.file-node {
  padding: 0.25rem 1rem 0.25rem calc(1.2rem * v-bind(indent));
  cursor: pointer;

  width: 100%;

  &.highlighted {
    background-color: var(--file-node-highlighted-background-color);
    color: var(--file-node-highlighted-text-color);
  }

  & .arrow {
    display: inline-block;
    width: 20px;
    user-select: none;
  }

  & .caption {
    margin-left: 0.5rem;
    color: var(--file-node-caption-text-color);
    font-size: 0.8rem;
    user-select: none;
  }
}
</style>
