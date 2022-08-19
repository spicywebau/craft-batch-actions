import { NeoInputBlock } from './InputBlock'

interface InputField {
  $container: JQuery
}

interface NeoInputField extends InputField {
  getBlocks: () => NeoInputBlock[]
  removeBlock: (block: NeoInputBlock) => void
}

export { InputField, NeoInputField }
