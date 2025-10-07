<script lang="ts" setup>
import { reactive, ref } from 'vue'
import { computed } from 'vue'
import { useJetBrainsStore } from '@/stores/jetbrains'
import Icon from '@/models/Icon.ts'
import { useDark, useToggle } from '@vueuse/core'
import Menu from '@/models/Menu.ts'

const jetBrainsStore = useJetBrainsStore()
const node = computed(() => jetBrainsStore.openedFile)

const newNodePopup = ref<HTMLInputElement | null>(null)
const menu = reactive(new Menu(newNodePopup))

// Dark mode state and toggle function
const isDarkMode = useDark()
const toggleDarkMode = useToggle(isDarkMode)

// Toggle file history dropdown and close any open top-level menu
const toggleFileHistory = () => {
  // Close any open top-level menu when toggling file history
  menu.openMenu = null
  menu.fhShowed = !menu.fhShowed
}

// Toggle edit mode in the store
const toggleEditMode = () => {
  jetBrainsStore.toggleEditMode()
}

// Computed property for file history from the store
const fileHistory = computed(() => jetBrainsStore.fileHistory)

// Navigate to a file from history and close the dropdown
const visitHistory = (file: typeof node.value) => {
  jetBrainsStore.tree.open(file)
  menu.fhShowed = false
}

// Create a new node using the store and close the popup
const createNode = () => {
  menu.showNewNodePopup = false
  if (!menu.popup) return
  jetBrainsStore.tree.createNode(menu.popup.value, menu.newNodeType)
  menu.popup = null
}
</script>

<template>
  <div class="menubar">
    <!--  menubar menu section  -->
    <div class="section menu">
      <div class="brand">MindCraft</div>
      <ul class="bar">
        <li
          v-for="(items, index) in menu.items"
          :key="index"
          class="item"
          @click.stop="menu.toggleMenu(index)"
        >
          {{ index }}
          <div class="dropdown" v-if="menu.openMenu === index">
            <div
              class="entry"
              v-for="(item, idx) in items"
              :key="`file-${idx}`"
              @click="item.effect()"
            >
              {{ item.action }}
            </div>
          </div>
        </li>
      </ul>
    </div>

    <!--  menubar history section  -->
    <div class="section history">
      <div class="current-file" @click="toggleFileHistory" v-if="node.name">
        <img :src="Icon(node.icon || '')" alt="icon" />
        {{ node.name }}
        <img :src="Icon(menu.fhShowed ? 'fold' : 'unfold')" alt="dropdown" />
      </div>
      <div class="list" v-if="menu.fhShowed">
        <div v-for="(file, index) in fileHistory" :key="index" @click="visitHistory(file)">
          <img :src="Icon(file.icon)" alt="" />
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

    <!-- new file popup modal -->
    <div class="new-file-popup" v-if="menu.showNewNodePopup">
      <div class="title">
        New {{ menu.newNodeType.charAt(0).toUpperCase() }}{{ menu.newNodeType.slice(1).toLowerCase() }}
      </div>
      <input
        class="input"
        type="text"
        placeholder="Name"
        ref="newNodePopup"
        @keyup.enter="createNode()"
        @blur="menu.showNewNodePopup = false"
      />
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

  padding: var(--menubar-padding);

  width: calc(var(--menubar-width) - 2rem);
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
      padding: 0;
      margin: 0;

      & .item {
        position: relative;
        cursor: pointer;
        padding: 0 0.5rem;
        border-radius: 0.25rem;
        line-height: var(--menubar-height);

        &:hover {
          background-color: var(--menubar-current-file-background-color);
        }

        & .dropdown {
          position: absolute;
          top: calc(100% + 0.5rem);
          left: 0;
          color: var(--menubar-dropdown-text-color);
          background-color: var(--menubar-dropdown-background-color);
          border: 1px solid var(--global-border-color);
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
          display: flex;
          flex-direction: column;
          gap: 0.25rem;

          min-width: 10rem;
          line-height: 1.7rem;

          & .entry {
            padding: 0.3rem 1rem;
            white-space: nowrap;
          }
          & .entry:hover {
            background-color: var(--menubar-dropdown-hover-background-color);
          }
        }
      }
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
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
      min-width: 10rem;
      min-height: 2rem;

      line-height: 2rem;

      & > div {
        padding: 0 1.3rem;
        cursor: pointer;
        white-space: nowrap;
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: 0.5rem;
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

  & .new-file-popup {
    position: absolute;
    top: calc(50vh - 5rem);
    left: calc(50vw - 5rem);
    transform: translateX(-50%);
    color: var(--menubar-dropdown-text-color);
    background-color: var(--menubar-popup-background-color);
    border: 1px solid var(--global-border-color);
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    padding: 1rem;
    min-width: 15rem;
    border-radius: 0.25rem;
    z-index: 10;

    & .title {
      font-weight: bold;
      font-size: 1.2rem;
    }

    & .input {
      padding: 0.5rem;
      border: 1px solid var(--menubar-popup-background-color);
      border-radius: 0.25rem;
      background-color: var(--menubar-popup-background-color);
      color: var(--menubar-text-color);
      outline: none;

      &::placeholder {
        color: var(--menubar-placeholder-color, #666);
      }

      &:focus {
        border-color: var(--menubar-input-focus-border-color, #007acc);
      }
    }
  }
}
</style>
