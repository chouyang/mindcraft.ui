import { nextTick, type Ref, ref } from 'vue'

/**
 * Class representing the menu structure and actions
 */
export default class Menu {
  /**
   * @var fhShowed State for showing/hiding the file history dropdown
   */
  fhShowed = ref(false)

  /**
   * @var openMenu Track which top-level menu is open
   */
  openMenu = ref<string | null>(null)

  /**
   * @var showNewNodePopup Controls visibility of the new file/folder popup
   */
  showNewNodePopup = ref(false)

  /**
   * @var newNodeType Type of node to create ('file' or 'folder')
   */
  newNodeType = ref<'file' | 'folder'>('file')

  /**
   * @var popup Reference to the input element in the popup
   */
  popup = ref<HTMLInputElement | null>(null)

  /**
   * Constructor for the Menu class
   *
   * @param popup
   */
  constructor(popup: Ref<HTMLInputElement | null>) {
    this.popup = popup
  }

  /**
   * @var items Menu items categorized by sections with associated actions and effects
   */
  items: Record<string, { action: string; effect: (callback?: () => void) => void }[]> = {
    File: [
      {
        action: 'New File',
        effect: () => this.showPopup('file'),
      },
      {
        action: 'New Folder',
        effect: () => this.showPopup('folder'),
      },
      {
        action: 'Save',
        effect: () => {},
      },
      {
        action: 'Close',
        effect: () => {},
      },
    ],
    Tools: [
      {
        action: 'Settings',
        effect: () => {},
      },
    ],
    Help: [
      {
        action: 'About',
        effect: () => {},
      },
      {
        action: 'Contact',
        effect: () => {},
      },
    ],
  }

  public showPopup(type: 'file' | 'folder') {
    this.newNodeType.value = type
    this.showNewNodePopup.value = true
    nextTick().then(() => this.popup?.value?.focus())
  }

  public toggleMenu = (name: string) => {
    // Close file history when opening a top-level menu
    this.fhShowed.value = false
    this.openMenu.value = this.openMenu.value === name ? null : name
  }
}

