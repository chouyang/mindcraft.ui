<script setup lang="ts">
import type Node from '@/models/Node.d.ts'
import { ref, watch, computed } from 'vue'
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

// Indentation based on tree depth - make it reactive to node changes
const indent = computed(() => props.node.indent || 0)

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

// Autofocus when highlighted with keyboard
const focusable = ref<HTMLElement | null>(null)
watch(
  () => props.node._highlighted,
  (newVal) => {
    if (newVal && focusable.value) {
      focusable.value.focus({
        preventScroll: true,
      })
    }
  },
)
</script>

<template>
  <div
    @click.stop.prevent="selectNode"
    :class="{ highlighted: node._highlighted, 'file-node': true }"
    :id="`${node.id}`"
    :tabindex="node._highlighted ? 0 : -1"
    ref="focusable"
  >
    <span
      @click.stop.prevent="emit('opened', node)"
      class="arrow"
      :style="
        node.type === 'folder'
          ? `background: url('${Icon(node._opened ? 'fold' : 'unfold')}') no-repeat center;`
          : ''
      "
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
  white-space: nowrap;

  display: flex;
  align-items: center;
  justify-content: flex-start;

  user-select: none;

  &.highlighted {
    background-color: var(--file-node-highlighted-background-color);
    &:focus {
      outline: none;
      box-shadow: inset 0 0 0 2px var(--file-navigator-focus-border-color);
      background-color: var(--file-node-highlighted-focused-background-color);
    }
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
