import { ref } from 'vue'
import { defineStore } from 'pinia'
import type Node from '../models/Node'

export const useJetBrainsStore = defineStore('jetbrains', () => {
  const openedFile = ref({} as Node)

  function open(file: Node) {
    openedFile.value = file
  }

  return { openedFile, open }
})
