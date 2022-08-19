import { InputBlock, MatrixInputBlock, NeoInputBlock } from './types/InputBlock'
import { InputField, NeoInputField } from './types/InputField'

interface ActivateEvent {
  preventDefault: () => void
}

abstract class BlockBatchActionBar {
  constructor (
    public readonly input: InputField,
    protected readonly blockClass: string,
    protected readonly blockSelectedClass: string
  ) {
    const $buttons = this.generateButtons().prependTo(input.$container)
    $buttons.find('[data-bba-bn="button.expand"]').on('activate', (e: ActivateEvent) => {
      e.preventDefault()
      this.expand(this.getSelectedBlocks())
    })
    $buttons.find('[data-bba-bn="button.collapse"]').on('activate', (e: ActivateEvent) => {
      e.preventDefault()
      this.collapse(this.getSelectedBlocks())
    })
    $buttons.find('[data-bba-bn="button.enable"]').on('activate', (e: ActivateEvent) => {
      e.preventDefault()
      this.enable(this.getSelectedBlocks())
    })
    $buttons.find('[data-bba-bn="button.disable"]').on('activate', (e: ActivateEvent) => {
      e.preventDefault()
      this.disable(this.getSelectedBlocks())
    })
    $buttons.find('[data-bba-bn="button.delete"]').on('activate', (e: ActivateEvent) => {
      e.preventDefault()
      this.delete(this.getSelectedBlocks())
    })
  }

  protected generateButtons (): JQuery {
    const generateButton: (label: string, icon?: string) => JQuery = (label, icon) => {
      const lowerCaseLabel = label.toLowerCase()
      icon ??= lowerCaseLabel

      return $('<button/>')
        .attr({
          'aria-label': label,
          'data-bba-bn': `button.${lowerCaseLabel}`,
          'data-icon': icon
        })
        .addClass('btn')
        .text(label)
    }

    const $expand = generateButton('Expand')
    const $collapse = generateButton('Collapse')
    const $enable = generateButton('Enable', 'enabled')
    const $disable = generateButton('Disable', 'disabled')
    const $delete = generateButton('Delete', 'remove')
    const $bar = $('<div class="block-batch-action-bar btngroup"/>')
      .append($expand)
      .append($collapse)
      .append($enable)
      .append($disable)
      .append($delete)

    return $bar
  }

  protected abstract getSelectedBlocks (): InputBlock[]

  public expand (blocks: InputBlock[]): void {
    blocks.forEach((block) => block.expand())
  }

  public collapse (blocks: InputBlock[]): void {
    blocks.forEach((block) => block.collapse())
  }

  public abstract enable (blocks: InputBlock[]): void

  public abstract disable (blocks: InputBlock[]): void

  public abstract delete (blocks: InputBlock[]): void
}

class MatrixBatchActionBar extends BlockBatchActionBar {
  constructor (public readonly input: InputField) {
    super(input, 'matrixblock', 'sel')
  }

  protected getSelectedBlocks (): MatrixInputBlock[] {
    return this.input.$container
      .find(`.${this.blockClass}.${this.blockSelectedClass}`)
      .map((_, blockEl) => $(blockEl).data('block'))
      .get()
  }

  public enable (blocks: MatrixInputBlock[]): void {
    blocks.forEach((block) => block.enable())
  }

  public disable (blocks: MatrixInputBlock[]): void {
    blocks.forEach((block) => block.disable())
  }

  public delete (blocks: MatrixInputBlock[]): void {
    if (window.confirm('Are you sure you want to delete the selected blocks?')) {
      blocks.forEach((block) => block.selfDestruct())
    }
  }
}

class NeoBatchActionBar extends BlockBatchActionBar {
  constructor (public readonly input: NeoInputField) {
    super(input, 'ni_block', 'is-selected')
  }

  protected getSelectedBlocks (): NeoInputBlock[] {
    return this.input.getBlocks().filter((block) => block.isSelected())
  }

  public enable (blocks: NeoInputBlock[]): void {
    blocks.find((block) => !block.isEnabled())?.enable()
  }

  public disable (blocks: NeoInputBlock[]): void {
    blocks.find((block) => block.isEnabled())?.disable()
  }

  public delete (blocks: NeoInputBlock[]): void {
    if (window.confirm('Are you sure you want to delete the selected blocks?')) {
      blocks.forEach((block) => this.input.removeBlock(block))
    }
  }
}

export { MatrixBatchActionBar, NeoBatchActionBar }
