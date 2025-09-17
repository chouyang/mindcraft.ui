<script lang="ts" setup>
</script>

<template>
  <div class="file-editor">
    <div class="line">
      <div class="index">01</div>
      <div class="code">Hello World</div>
    </div>

    <div class="line">
      <div class="index">02</div>
      <div class="code">
        Hello World<br />
        Hello World<br />
      </div>
    </div>

    <div class="line">
      <div class="index">03</div>
      <div class="code">Hello World</div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.file-editor {
  color: var(--file-editor-text-color);
  background-color: var(--file-editor-background-color);

  position: fixed;
  top: var(--file-editor-top);
  left: var(--file-editor-left);

  width: var(--file-editor-width);
  height: var(--file-editor-height);

  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;

  padding: .5rem;

  & .line {
    display: flex;
    flex-direction: row;
    gap: 1rem;

    & .index {
      color: var(--file-editor-index-text-color);
      user-select: none;
    }

    & .code {
      color: var(--file-editor-code-text-color);
    }
  }
}
</style>
