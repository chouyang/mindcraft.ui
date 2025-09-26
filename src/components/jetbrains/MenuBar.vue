<script lang="ts" setup>
import { ref } from 'vue'
import { computed } from 'vue'
import { useJetBrainsStore } from '@/stores/jetbrains'
import Icon from '@/models/Icon.ts'
import { useDark, useToggle } from '@vueuse/core'

const jetBrainsStore = useJetBrainsStore()
const node = computed(() => jetBrainsStore.openedFile)

const fhDropped = ref(false)

const isDarkMode = useDark()
const toggleDarkMode = useToggle(isDarkMode)

const toggleFileHistory = () => {
  fhDropped.value = !fhDropped.value
}

const toggleEditMode = () => {
  jetBrainsStore.toggleEditMode()
}

const fileHistory = computed(() => jetBrainsStore.fileHistory)

const visitHistory = (file: typeof node.value) => {
  jetBrainsStore.tree.open(file)
  fhDropped.value = false
}
</script>

<template>
  <div class="menubar">
    <!--  menubar menu section  -->
    <div class="section menu">
      <div class="brand">MindCraft</div>
      <ul class="bar">
        <li class="item">File</li>
        <li class="item">Tools</li>
        <li class="item">Window</li>
        <li class="item">Help</li>
      </ul>
    </div>

    <!--  menubar history section  -->
    <div class="section history">
      <div class="current-file" @click="toggleFileHistory" v-if="node.name">
        <img :src="Icon(node.icon || '')" alt="icon" />
        {{ node.name }}
        <img :src="Icon(fhDropped ? 'fold' : 'unfold')" alt="dropdown" />
      </div>
      <div class="list" v-if="fhDropped">
        <div v-for="(file, index) in fileHistory" :key="index" @click="visitHistory(file)">
          <img :src="Icon(file.icon)" alt="">
          {{ file.name }}
        </div>
      </div>
    </div>

    <!--  menubar quick access section  -->
    <div class="section quick-access">
      <div class="dark-mode" @click="toggleDarkMode()">
        {{ isDarkMode ? '🌙' : '☀️' }}
        <img :src="Icon(isDarkMode ? 'toggle-on' : 'toggle-off')" alt="dark mode" />
      </div>
      <div class="edit-mode" @click="toggleEditMode()">
        <img :src="Icon('edit')" alt="edit" />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.menubar {
  user-select: none;

  color: var(--menubar-text-color);
  background-color: var(--menubar-background-color);
  border: 1px solid var(--global-border-color);

  position: fixed;
  top: 0;
  left: 0;

  padding: 0 1rem;

  width: var(--menubar-width);
  height: var(--menubar-height);
  line-height: var(--menubar-height);

  display: flex;
  flex-direction: row;
  justify-content: space-between;

  & .section {
    width: 33%;
  }

  & .menu {
    display: flex;
    flex-direction: row;
    gap: 0.5rem;

    & .brand {
      font-weight: bold;
    }

    & .bar {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
      gap: 1rem;

      list-style: none;
    }
  }

  & .history {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    position: relative;

    & .current-file {
      cursor: pointer;
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
      gap: 0.5rem;
      font-weight: bold;
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
      max-width: 100%;
      padding: 0 0.5rem;
      border-radius: 0.25rem;

      &:hover {
        background-color: var(--menubar-current-file-background-color);
      }
    }

    & .list {
      position: absolute;
      top: calc(100% + 0.5rem);
      left: 50%;
      transform: translateX(-50%);
      color: var(--menubar-dropdown-text-color);
      background-color: var(--menubar-dropdown-background-color);
      border: 1px solid var(--global-border-color);
      box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
      width: max-content;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
      & > div {
        padding: 0.3rem 1rem;
        cursor: pointer;
        white-space: nowrap;
      }
      & > div:hover {
        background-color: var(--menubar-dropdown-hover-background-color);
      }
    }
  }

  & .quick-access {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    gap: 1rem;

    & .dark-mode {
      cursor: pointer;
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
      gap: 0.5rem;
    }

    & .edit-mode {
      cursor: pointer;
    }
  }
}
</style>
