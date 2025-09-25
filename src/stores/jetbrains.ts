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
 * Store to manage JetBrains-like file navigator and editor state
 */
export const useJetBrainsStore = defineStore('jetbrains', () => {
  /**
   * @var openedFile Currently opened file in the editor
   */
  const openedFile = ref({} as Node)

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

  return {
    openedFile,
    language,
    tree,
    getDetail,
    getChildren,
  }
})
