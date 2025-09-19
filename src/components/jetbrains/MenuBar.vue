<script lang="ts" setup>
import { ref } from 'vue'

const fileHistoryDroppedDown = ref(false)
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
      <div>File name</div>
      <ul class="list" v-if="fileHistoryDroppedDown">
        <li class="item">History</li>
        <li class="item">History</li>
        <li class="item">History</li>
        <li class="item">History</li>
        <li class="item">History</li>
      </ul>
    </div>

    <!--  menubar quick access section  -->
    <div class="section quick-access">
      <div>Setting</div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.menubar {
  user-select: none;

  color: var(--menubar-text-color);
  background-color: var(--menubar-background-color);

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
    flex-direction: row;
    justify-content: center;
  }

  & .quick-access {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
  }
}
</style>
