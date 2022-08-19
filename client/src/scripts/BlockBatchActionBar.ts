import { BlockInput } from './types/BlockInput'

abstract class BlockBatchActionBar {
  constructor (public readonly input: BlockInput) {
    this.generateBar().prependTo(input.$container)
  }

  protected generateBar (): JQuery {
    return $('<div class="block-batch-action-bar"/>')
  }
}

class MatrixBatchActionBar extends BlockBatchActionBar {
  constructor (public readonly input: BlockInput) {
    super(input)
  }

  protected generateBar (): JQuery {
    const handle: string = this.input.$container.closest('[data-attribute]').data('attribute')
    return super.generateBar().text(`Matrix field ${handle} initialised`)
  }
}

class NeoBatchActionBar extends BlockBatchActionBar {
  constructor (public readonly input: BlockInput) {
    super(input)
  }

  protected generateBar (): JQuery {
    const handle: string = this.input.$container.closest('[data-attribute]').data('attribute')
    return super.generateBar().text(`Neo field ${handle} initialised`)
  }
}

export { MatrixBatchActionBar, NeoBatchActionBar }
