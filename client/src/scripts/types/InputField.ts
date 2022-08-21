import { NeoInputBlock } from './InputBlock'

interface InputField extends GarnishComponent {
  $container: JQuery
  blockSelect: any
}

interface NeoInputField extends InputField {
  getBlocks: () => NeoInputBlock[]
  removeBlock: (block: NeoInputBlock) => void
}

export { InputField, NeoInputField }
