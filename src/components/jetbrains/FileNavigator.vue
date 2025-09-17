<script lang="ts" setup>
</script>

<template>
  <div class="file-navigator">File Navigator</div>
</template>

<style scoped lang="scss">
.file-navigator {
  user-select: none;

  color: var(--file-navigator-text-color);
  background-color: var(--file-navigator-background-color);

  position: fixed;
  top: var(--file-navigator-top);
  left: 0;

  width: var(--file-navigator-width);
  height: var(--file-navigator-height);

  display: flex;
  flex-direction: row;
}
</style>
