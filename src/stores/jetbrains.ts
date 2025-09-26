import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import type Node from '@/models/Node'
import api from '@/api/request.ts'
import type { AxiosResponse } from 'axios'
import Tree from '@/models/Tree'

import languages from '@/models/Language'
import roots from '@/stores/roots.ts'

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
  const tree = ref(
    // Create the Tree with some root nodes
    new Tree(roots),
  )

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
    return api
      .request({
        url: `/v1/node${file.path}/${file.name}`.replace('//', '/'),
        method: 'GET',
        params: {},
      })
      .then((response: AxiosResponse<Response<Node>>): AxiosResponse<Response<Node>> => {
        if (response.data.code === 0) {
          const n = response.data.payload as Node
          if (n.name) {
            openedFile.value = n
            file.content = n.content
            file.extension = n.extension
            file.caption = n.caption
            initializeEditor()
          }
        }

        return response
      })
  }

  /**
   * Fetch children of a folder node, usually when expanding a folder in the tree
   * Should only be called once
   *
   * @param node Folder node to fetch children for
   */
  async function getChildren(node: Node): Promise<AxiosResponse<Response<Node>>> {
    return api
      .request({
        url: `/v1/nodes${node.path}/${node.name}`.replace('//', '/'),
        method: 'GET',
      })
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

    return api
      .request({
        url: `/v1/node${openedFile.value.path}/${openedFile.value.name}`.replace('//', '/'),
        method: 'PUT',
        data: {
          content: editedContent.value,
        },
      })
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

  return {
    openedFile,
    editedContent,
    isDirty,
    language,
    tree,
    getDetail,
    getChildren,
    updateContent,
    saveContent,
    initializeEditor,
  }
})
