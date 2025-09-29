<script lang="ts" setup>
import { useJetBrainsStore } from '@/stores/jetbrains.ts'
import { computed } from 'vue'
import Icon from '@/models/Icon.ts'

const store = useJetBrainsStore()

const openedFile = computed(() => store.openedFile)
const crumbs = computed(() => {
  let path = openedFile.value?.path?.split('/') || []
  if (path[0] === '') path.shift()
  if (path.length > 5) {
    path = ['...', ...path.slice(path.length - 2)]
  }

  return path
})
</script>

<template>
  <div class="statusbar">
    <div class="crumbs">
      <div class="crumb" v-if="openedFile?.name">
        <img :src="Icon('nodes/source-root')" alt="" class="source-root" />
      </div>
      <div v-for="(crumb, index) in crumbs" :key="index" class="crumb">
        {{ crumb }} <img :src="Icon('unfold')" alt="" />
      </div>
      <div class="crumb" v-if="openedFile?.name">
        <img :src="Icon(openedFile?.icon)" alt="" class="icon" />
        {{ openedFile?.name }}
      </div>
    </div>
    <div class="tray">Line 10, Column 5</div>
  </div>
</template>

<style lang="scss" scoped>
.statusbar {
  width: var(--statusbar-width);
  height: var(--statusbar-height);
  position: fixed;
  bottom: 0;
  left: 0;
  color: var(--statusbar-text-color);
  background-color: var(--statusbar-background-color);
  border-top: 1px solid var(--global-border-color);
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;

  padding: 0 0.7rem;

  .crumbs {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 0.5rem;

    .crumb {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
      gap: 0.2rem;

      font-size: 0.8rem;

      img {
        width: 0.7rem;
        height: 0.7rem;
      }

      & .source-root {
        width: 2rem;
        height: 2rem;
        margin-right: -1.2rem;
        margin-top: 1rem;
      }

      & .icon {
        width: 1rem;
        height: 1rem;
      }
    }
  }
}
</style>
