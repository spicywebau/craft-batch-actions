import { NeoInputBlock } from './InputBlock'

interface InputField extends GarnishComponent {
  $container: JQuery
  blockSelect: InputBlockSelect
}

interface NeoInputField extends InputField {
  getBlocks: () => NeoInputBlock[]
  removeBlock: (block: NeoInputBlock) => void
}

interface InputBlockSelect extends GarnishComponent {
  $selectedItems: JQuery
  deselectAll: () => void
  selectAll: () => void
  settings: {
    selectedClass: string
  }
}

export { InputField, NeoInputField }
