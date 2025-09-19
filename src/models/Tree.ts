import type Node from './Node'
import { useJetBrainsStore } from '@/stores/jetbrains.ts'

/**
 * Tree structure to manage nodes
 *
 * Implemented as a doubly linked list for better management
 *   and Iterable to allow for-of traversal
 */
export default class Tree implements Iterable<Node> {
  /**
   * Iterator to traverse the tree nodes
   */
  [Symbol.iterator](): Iterator<Node> {
    let current: Node | undefined = this.head
    return {
      next(): IteratorResult<Node> {
        if (current) {
          const value = current
          current = current._next
          return { value, done: false }
        }
        return { value: undefined, done: true }
      },
    }
  }

  /** Head of the tree */
  head?: Node

  /** Currently highlighted node */
  highlighted?: Node

  /** Initialize the tree with nodes data */
  constructor(nodes: Array<Node>) {
    this.traverse(nodes, undefined)
    if (this.head?._lastChild) {
      this.open(this.head._lastChild)
      this.highlight(this.head._lastChild)
    }
  }

  /** Traverse nodes recursively to set up relationships */
  public traverse(nodes: Array<Node>, parent?: Node): void {
    // Previous node in the traversal,
    // the first child will be linked to the parent
    let prev = parent

    // Current node in the traversal
    let node: Node | undefined
    for (node of nodes) {
      // Set head
      if (!this.head) {
        this.head = node
      }

      // Set parent's first child
      if (parent && !parent._firstChild) {
        parent._firstChild = node
      }

      // Set up relationships
      node._prev = prev
      node._parent = parent
      node.indentation = parent ? (parent.indentation || 0) + 1 : 0
      if (prev) {
        prev._next = node
      }
      // Set prev for next iteration
      prev = node

      // Recurse into children
      if (node.children && node.children.length) {
        this.traverse(node.children, node)
      }
    }

    // Set parent's last child
    if (parent && !parent._lastChild) {
      parent._lastChild = node
    }
  }

  /** Highlight a node and unhighlight all others */
  public highlight(node: Node) {
    for (const n of this) {
      if (n == node) {
        // Set highlighted node
        n._highlighted = true
        this.highlighted = n
      } else {
        // Unset all other nodes
        n._highlighted = false
      }
    }
  }

  /** Close a folder node */
  public close(node: Node) {
    if (node.type !== 'folder') {
      return
    }
    node._opened = false
    if (!node.children?.length) return
    node._next = node._lastChild?._next
    if (node._next) {
      node._next._prev = node
    }
  }

  /** Open a folder or file node */
  public open(node: Node) {
    if (node.type !== 'folder') {
      useJetBrainsStore().open(node)
      return
    }
    node._opened = true
    if (!node.children?.length) return

    const next = node._next
    // Link to first child
    node._next = node._firstChild
    // Link first child back to parent
    if (node._next) {
      node._next._prev = node
    }

    if (!next) {
      return
    }
    // Link next node to last child
    next._prev = node._lastChild
    // Link last child back to next node
    if (node._lastChild) {
      node._lastChild._next = next
    }
  }

  public tryOpen(node: Node) {
    if (node.type === 'folder') {
      if (node._opened) {
        this.close(node)
      } else {
        this.open(node)
      }
    } else {
      useJetBrainsStore().open(node)
    }
  }
}
