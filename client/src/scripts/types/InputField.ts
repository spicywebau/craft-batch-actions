import { NeoInputBlock } from './InputBlock'

/**
 * A block element input field.
 */
interface InputField extends GarnishComponent {
  $container: JQuery
  blockSelect: InputBlockSelect
}

/**
 * A Neo input field.
 */
interface NeoInputField extends InputField {
  getBlocks: () => NeoInputBlock[]
  getName: () => string
  removeBlock: (block: NeoInputBlock) => void
}

/**
 * A `Garnish.Select` instance on a block element input field.
 */
interface InputBlockSelect extends GarnishComponent {
  $items: JQuery
  $selectedItems: JQuery
  deselectAll: () => void
  selectAll: () => void
  selectItem: ($item: JQuery, focus: boolean, preventScroll: boolean) => void
  settings: {
    selectedClass: string
  }
}

export { InputField, NeoInputField }
