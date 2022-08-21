/**
 * A block element field input block.
 */
interface InputBlock extends GarnishComponent {
  $container: JQuery
  expand: () => void
  collapse: () => void
  enable: () => void
  disable: () => void
}

/**
 * A Matrix input block.
 */
interface MatrixInputBlock extends InputBlock {
  selfDestruct: () => boolean
  actionDisclosure: GarnishComponent
}

/**
 * A Neo input block.
 */
interface NeoInputBlock extends InputBlock {
  isEnabled: () => boolean
  isSelected: () => boolean
}

export { InputBlock, MatrixInputBlock, NeoInputBlock }
