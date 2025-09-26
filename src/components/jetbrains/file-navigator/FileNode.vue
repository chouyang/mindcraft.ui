<script setup lang="ts">
import type Node from '@/models/Node.d.ts'
import { ref } from 'vue'
import Icon from '@/models/Icon.ts'

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

const indent = ref(props.node.indent)

// Handle single and double click
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
    :id="node._id"
  >
    <span
      class="arrow"
      :style="node.type === 'folder' ? `background: url('${Icon(node._opened ? 'fold' : 'unfold')}') no-repeat center;` : ''"
    />
    <span class="name">
      <img v-if="node.icon" :src="Icon(node.icon)" alt="icon" class="icon" />
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
  overflow: hidden;
  white-space: nowrap;

  display: flex;
  align-items: center;
  justify-content: flex-start;

  user-select: none;

  width: 100%;

  &.highlighted {
    background-color: var(--file-node-highlighted-background-color);
    color: var(--file-node-highlighted-text-color);
  }

  & .name {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 20px;
    gap: 0.5rem;
  }

  & .arrow {
    display: flex;
    align-items: center;
    justify-content: center;

    height: 20px;
    width: 20px;
  }

  & .caption {
    margin-left: 0.5rem;
    color: var(--file-node-caption-text-color);
    font-size: 0.8rem;

    max-width: 50%;
  }
}
</style>
