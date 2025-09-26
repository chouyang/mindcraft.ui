import { useDark } from '@vueuse/core'

const isDark = useDark()

const Icon = (name: string, ext: string = 'svg') => {
  if (!name) {
    return `/assets/icons/text.${ext}`
  }
  if (name.includes('.')) {
    const parts = name.split('.')
    ext = parts.pop() || ext
    name = parts.pop() || name
  }
  if (isDark.value) {
    return `/assets/icons/${name}_dark.${ext}`
  }

  return `/assets/icons/${name}.${ext}`
}

export default Icon
