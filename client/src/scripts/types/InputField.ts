import { NeoInputBlock } from './InputBlock'

interface InputField {
  $container: JQuery
  blockSelect: any
  on: any
}

interface NeoInputField extends InputField {
  getBlocks: () => NeoInputBlock[]
  removeBlock: (block: NeoInputBlock) => void
}

export { InputField, NeoInputField }
