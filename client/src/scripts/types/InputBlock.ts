interface InputBlock {
  $container: JQuery
  expand: () => void
  collapse: () => void
  enable: () => void
  disable: () => void
}

interface MatrixInputBlock extends InputBlock {
  selfDestruct: () => boolean
}

interface NeoInputBlock extends InputBlock {
  isEnabled: () => boolean
  isSelected: () => boolean
}

export { InputBlock, MatrixInputBlock, NeoInputBlock }
