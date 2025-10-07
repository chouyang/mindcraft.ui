import type Node from '@/models/Node'
import type { AxiosResponse } from 'axios'
import api from '@/api/request.ts'
import type { Response } from '@/stores/jetbrains.ts'

/**
 * Fetch detailed info of a file node
 *
 * @param file File node to fetch details for
 *
 * @return Promise resolving to the API response
 */
async function getDetail(file: Node): Promise<AxiosResponse<Response<Node>>> {
  return api.request({
    url: `/v1/nodes/${file.id}`,
    method: 'GET',
    params: {},
  })
}

/**
 * Create a new file or folder node
 *
 * @param node
 */
async function createNode(node: Node): Promise<AxiosResponse<Response<Node>>> {
  // Avoid sending reactive proxies/circular structures to axios
  const payload = {
    name: node.name,
    type: node.type,
    path: node.path,
  } as Partial<Node>

  return api.request({
    url: `/v1/nodes`,
    method: 'POST',
    data: payload,
  })
}

/**
 * Fetch children of a folder node, usually when expanding a folder in the tree
 * Should only be called once
 *
 * @param node Folder node to fetch children for
 */
async function getChildren(node: Node): Promise<AxiosResponse<Response<Node>>> {
  return api.request({
    url: `/v1/nodes`,
    method: 'GET',
    params: {
      path: `${node.path}/${node.name}`.replace(/\/+/g, '/'),
    },
  })
}

/**
 * Save the current edited content to the file
 *
 * @return Promise resolving to the API response
 */
async function saveContent(node: Node, content: string): Promise<AxiosResponse<Response<Node>>> {
  if (!node.name) {
    return Promise.reject(new Error('No file opened'))
  }

  return api
    .request({
      url: `/v1/nodes/${node.id}`,
      method: 'PUT',
      data: {
        name: node.name,
        icon: node.icon,
        path: node.path,
        type: node.type,
        extension: node.extension,
        tags: node.tags,
        caption: node.caption,
        weight: node.weight,
        content,
      },
    })
}

async function getRootNodes(): Promise<Array<Node>> {
  const res = await api.request({ url: `/v1/nodes`, method: 'GET', params: {} })
  if (res.data.code !== 0) {
    return []
  }

  const n = res.data.payload as Node[]
  if (n.length === 0) {
    return []
  }

  return n as Node[]
}

export default {
  getDetail,
  createNode,
  getChildren,
  saveContent,
  getRootNodes,
}
