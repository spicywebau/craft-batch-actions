import { NeoInputBlock } from './InputBlock'

/**
 * A block element input field.
 */
interface InputField extends GarnishComponent {
  $container: JQuery
}

/**
 * A Matrix input field.
 */
interface MatrixInputField extends InputField {
  $blockContainer: JQuery
  entrySelect: InputBlockSelect
}

/**
 * A Neo input field.
 */
interface NeoInputField extends InputField {
  getBlocks: (level?: number) => NeoInputBlock[]
  getBlockTypes: (topLevelOnly: boolean) => NeoBlockType[]
  getCopiedBlocks: () => Array<{
    level: number
    type: number
  }>
  getName: () => string
  getMaxBlocks: () => number|null
  getMaxTopBlocks: () => number|null
  removeBlock: (block: NeoInputBlock) => void
  '@copyBlock': (e: { block: NeoInputBlock }) => void
  '@pasteBlock': (e: { block?: NeoInputBlock }) => void
  blockSelect: InputBlockSelect
}

interface NeoBlockType {
  getId: () => number
}

/**
 * A Craft Commerce variant input field.
 */
interface VariantInputField extends InputField {
  enableSelectedVariants: () => void
  disableSelectedVariants: () => void
  deleteSelectedVariants: () => void
  $variantContainer: JQuery
  totalNewVariants: number
  variantSelect: InputBlockSelect
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

export {
  InputField,
  MatrixInputField,
  NeoInputField,
  VariantInputField,
  InputBlockSelect
}
