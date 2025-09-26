/**
 * Node represents a file or folder in the file tree
 * A file can be an article, a media file, source code or any kind of files
 */
type Node = {
  // File or folder name
  name: string
  // 'folder', 'text', 'binary', 'image', 'video', 'audio', etc.
  type: string
  // Within an exhaustive set of file types
  icon: string
  // Full path from the root
  path: string
  // Extra metadata
  caption?: string
  // File extension (for files only)
  extension?: string
  // Level of indent (for rendering purposes)
  indent?: number
  // For files, the content of the file
  content?: string

  // metadata
  _id?: string
  _prev?: Node
  _next?: Node
  _opened?: boolean
  _highlighted?: boolean
  _parent?: Node
  _firstChild?: Node
  _lastChild?: Node
}

export default Node
