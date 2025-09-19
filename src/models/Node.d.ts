/**
 * Node represents a file or folder in the file tree
 * A file can be an article, a media file, or any kind of files
 */
type Node = {
  // File or folder name
  name: string
  // 'file' or 'folder'
  type: 'file' | 'folder'
  // Within an exhaustive set of file types
  icon: string
  // Full path from the root
  path: string
  // Extra metadata
  caption?: string
  // File extension (for files only)
  extension?: string
  // Level of indentation (for rendering purposes)
  indentation?: number
  // Child nodes (for folders only)
  children?: Array<Node>

  _prev?: Node
  _next?: Node
  _opened?: boolean
  _highlighted?: boolean
  _parent?: Node
  _firstChild?: Node
  _lastChild?: Node
}

export default Node
