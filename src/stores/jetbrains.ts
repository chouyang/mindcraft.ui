import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import type Node from '@/models/Node'
import type { AxiosResponse } from 'axios'
import Tree from '@/models/Tree'

import nodeApi from '@/api/node'

import languages from '@/models/Language'

/**
 * Standard API response structure
 */
export type Response<T> = {
  code: number
  message: string
  payload: T | [T]
}

/**
 * Store to manage JetBrains-like IDE states
 */
export const useJetBrainsStore = defineStore('jetbrains', () => {
  /**
   * @var isDarkMode Global state to toggle dark mode or light mode theme.
   */
  const isDarkMode = ref(false)

  /**
   * @var inEditMode Whether the editor is in edit mode (true) or read-only mode (false)
   */
  const inEditMode = ref(false)

  /**
   * @var openedFile Currently opened file in the editor
   */
  const openedFile = ref({} as Node)

  /**
   * @var editedContent Current content being edited (separate from openedFile.content)
   */
  const editedContent = ref('')

  /**
   * @var isDirty Whether the current content has unsaved changes
   */
  const isDirty = ref(false)

  /**
   * @var tree File tree structure
   */
  const tree = ref(new Tree())

  loadRoots().then((nodes) => {
    tree.value.link(nodes, undefined)
    // Open and highlight the last child node of root by default
    if (tree.value.root?._lastChild) {
      tree.value.open(tree.value.root._lastChild)
      tree.value.highlight(tree.value.root._lastChild)
    }
  })

  /**
   * @var language Programming language of the currently opened file, for syntax highlighting
   */
  const language = computed(() => {
    const ext = openedFile.value.extension?.toLowerCase()
    if (ext && ext in languages) {
      return languages[ext]
    }

    return 'plaintext'
  })

  /**
   * @var fileHistory Ten most recently opened files
   */
  const fileHistory = ref([] as Node[])

  /**
   * Add a file to the history, maintaining a maximum of 10 entries
   *
   * @param file
   */
  function addFileToHistory(file: Node) {
    if (fileHistory.value.find((f) => f === file)) {
      return
    }
    fileHistory.value.unshift(file)
    if (fileHistory.value.length > 10) {
      fileHistory.value.pop()
    }
  }

  async function loadRoots(): Promise<Array<Node>> {
    return nodeApi.getRootNodes()
  }

  /**
   * Fetch detailed info of a file node, usually for opening in the editor
   *
   * @param file File node to fetch details for
   *
   * @return Promise resolving to the API response
   */
  async function getDetail(file: Node): Promise<AxiosResponse<Response<Node>>> {
    if (file.content) {
      openedFile.value = file
      initializeEditor()
      return Promise.resolve({
        data: {
          code: 0,
          message: 'cached',
          payload: file,
        },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {},
      } as AxiosResponse<Response<Node>>)
    }

    return nodeApi.getDetail(file)
      .then((response: AxiosResponse<Response<Node>>): AxiosResponse<Response<Node>> => {
        if (response.data.code === 0) {
          const n = response.data.payload as Node
          if (n.name) {
            Object.assign(file, n)
            openedFile.value = file
            initializeEditor()
          }
        }

        return response
      })
  }

  /**
   * Create a new file or folder node
   *
   * @param node
   */
  async function createNode(node: Node): Promise<AxiosResponse<Response<Node>>> {
    return nodeApi.createNode(node)
  }

  /**
   * Fetch children of a folder node, usually when expanding a folder in the tree
   * Should only be called once
   *
   * @param node Folder node to fetch children for
   */
  async function getChildren(node: Node): Promise<AxiosResponse<Response<Node>>> {
    return nodeApi.getChildren(node)
      .then((response: AxiosResponse<Response<Node>>): AxiosResponse<Response<Node>> => {
        if (response.data.code === 0) {
          const children = response.data.payload as Node[]
          if (children.length > 0) {
            tree.value.attach(node, children)
          }
        }

        return response
      })
  }

  /**
   * Update the edited content and mark as dirty
   *
   * @param content New content to set
   */
  function updateContent(content: string) {
    editedContent.value = content
    isDirty.value = content !== openedFile.value.content
  }

  /**
   * Save the current edited content to the file
   *
   * @return Promise resolving to the API response
   */
  async function saveContent(): Promise<AxiosResponse<Response<Node>>> {
    if (!openedFile.value.name) {
      return Promise.reject(new Error('No file opened'))
    }

    return nodeApi.saveContent(openedFile.value, editedContent.value)
      .then((response: AxiosResponse<Response<Node>>): AxiosResponse<Response<Node>> => {
        if (response.data.code === 0) {
          // Update the opened file content and mark as clean
          openedFile.value.content = editedContent.value
          isDirty.value = false
        }
        return response
      })
  }

  /**
   * Initialize editor content when a file is opened
   */
  function initializeEditor() {
    editedContent.value = openedFile.value.content || ''
    isDirty.value = false
  }

  /**
   * Toggle edit mode on or off
   *
   * @param isEdit
   */
  function toggleEditMode(isEdit?: boolean) {
    inEditMode.value = typeof isEdit === 'undefined' ? !inEditMode.value : isEdit
  }

  return {
    isDarkMode,
    inEditMode,
    openedFile,
    editedContent,
    isDirty,
    language,
    tree,
    fileHistory,
    getDetail,
    createNode,
    getChildren,
    updateContent,
    saveContent,
    initializeEditor,
    toggleEditMode,
    addFileToHistory,
  }
})
