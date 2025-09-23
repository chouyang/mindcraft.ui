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
    let current: Node | undefined = this.root
    return {
      next(): IteratorResult<Node> {
        if (current) {
          const value = current
          if (current === current._next) {
            throw new Error('Circular reference detected in tree')
          }
          current = current._next
          return { value, done: false }
        }

        return { value: undefined, done: true }
      },
    }
  }

  /**
   * @var root The first node in the tree
   */
  root?: Node = undefined

  /**
   * Currently highlighted node
   */
  highlighted?: Node

  /**
   * Construct the tree with nodes data
   *
   * @param nodes Array of root nodes to initialize the tree
   */
  constructor(nodes: Array<Node>) {
    if (!nodes || !nodes.length) {
      return
    }

    this.link(nodes, undefined)
    // Open and highlight the last child node of root by default
    if (this.root?._lastChild) {
      this.open(this.root._lastChild)
      this.highlight(this.root._lastChild)
    }
  }

  /**
   * Link nodes to their parent or tree root, and set up relationships
   *
   * @param nodes Array of nodes to link
   * @param parent Optional parent node to attach the nodes to;
   *     if omitted, nodes are treated as root nodes;
   *     and if root is set, the linked list will be orphaned from the existing tree
   *
   * @returns void
   */
  public link(nodes: Array<Node>, parent?: Node): void {
    /** @var prev Previous node in the traversal, the first child will be linked to parent */
    let prev = parent

    /** @var node Current node for traversal */
    let node: Node | undefined
    for (node of nodes) {
      // Set tree root if not already
      if (!this.root) {
        this.root = parent || node
      }

      // Set parent's first child
      if (parent && !parent._firstChild) {
        parent._firstChild = node
      }

      // Set up relationships
      node._prev = prev
      node._parent = parent
      node.indent = parent ? (parent.indent || 0) + 1 : 0
      node._id = `id-${node.name.split('.').join('')}-${Math.random().toString(36).slice(2, 9)}`
      if (prev) {
        prev._next = node
      }

      // Set prev for next iteration
      prev = node
    }

    // Set parent's last child
    if (parent && node) {
      parent._lastChild = node
    }
  }

  /**
   * Highlight a node and unhighlight all others
   *
   * @param node Node to highlight
   *
   * @returns void
   */
  public highlight(node: Node) {
    for (const n of this) {
      if (n == node) {
        // Set highlighted node
        n._highlighted = true
        this.highlighted = n

        // Keep highlighted node within visible area
        // TODO: Avoid accessing DOM directly
        const el = document.getElementById(n._id || '')
        if (el) {
          el.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
        }
      } else {
        // Unset all other nodes
        n._highlighted = false
      }
    }
  }

  /**
   * Close a folder node
   *
   * @param node Folder node to close
   *
   * @returns void
   */
  public close(node: Node) {
    // skip file
    if (node.type !== 'folder') {
      return
    }

    node._opened = false
    // skip empty folder
    if (!node._firstChild) return

    // recursively find last child node of opened parent
    // if child folder is closed, children will be skipped
    let next: Node | undefined = node._next
    while ((next?._next?.indent || 0) > (node.indent || 0)) {
      next = next?._next
    }

    // re-link to skip its children
    if (next?._next) {
      next._next._prev = node
      node._next = next._next
    } else {
      node._next = undefined
    }
  }

  /**
   * Open a folder or file node
   *
   * @param node Node to open
   *
   * @returns void
   */
  public async open(node: Node) {
    // Avoid re-opening node
    if (node._opened) {
      return
    }

    // For file, open it in editor component
    if (node.type !== 'folder') {
      useJetBrainsStore()
        .getDetail(node)
        .then(() => (node._opened = true))
      return
    }

    // For folder, fetch children if not already loaded
    if (!node._firstChild) {
      await useJetBrainsStore().getChildren(node)
    }

    // recursively find last child node of closed parent
    // if child folder is closed, children will be skipped
    node._opened = true
    let next: Node | undefined = node._firstChild
    while ((next?._next?.indent || 0) > (node.indent || 0)) {
      next = next?._next
    }

    // skip empty folder
    if (!next) return

    // re-link to insert its children
    node._next = node._firstChild
    if (next?._next) {
      next._next._prev = next
    }
  }

  /**
   * Try to open a node: if folder, toggle open/close; if file, open in editor
   *
   * @param node
   *
   * @returns void
   */
  public async tryOpen(node: Node) {
    if (node.type === 'folder') {
      if (node._opened) {
        this.close(node)
      } else {
        await this.open(node)
      }
    } else {
      await useJetBrainsStore().getDetail(node)
    }
  }

  /**
   * Attach children nodes to a parent node
   *
   * @param node
   * @param children
   *
   * @returns void
   */
  public attach(node: Node, children: Node[]) {
    const next = node._next

    // make a double linked list with children
    this.link(children, node)

    // link the list to the tree
    if (node._lastChild) {
      node._lastChild._next = next
    }
    if (next) {
      next._prev = node._lastChild
    }
  }

  /**
   * Handle keyboard navigation
   *
   * @param event Keyboard event
   *
   * @returns void
   */
  public async navigateNode(event: KeyboardEvent) {
    const node = this.highlighted
    if (!node) return
    switch (event.key) {
      // ArrowUp goes to previous node
      case 'ArrowUp':
        if (node._prev) {
          this.highlight(node._prev)
        }
        break

      // ArrowDown goes to next node
      case 'ArrowDown':
        if (node._next) {
          this.highlight(node._next)
        }
        break

      // ArrowRight opens folder or goes to next node
      case 'ArrowRight':
        if (node.type === 'folder') {
          if (!node._opened) {
            await this.open(node)
            return
          }
        }
        if (node._next) {
          this.highlight(node._next)
        }
        break

      // ArrowLeft closes folder or goes to parent
      case 'ArrowLeft':
        if (node.type === 'folder') {
          if (node._opened) {
            this.close(node)
            return
          }
        }
        if (node._parent) {
          this.highlight(node._parent)
          return
        }
        if (node._prev) {
          this.highlight(node._prev)
        }
        break

      // Enter toggles folder open/close or opens file in editor
      case 'Enter':
        if (node._opened) {
          return this.close(node)
        }

        await this.open(node)
        break
    }
  }
}
