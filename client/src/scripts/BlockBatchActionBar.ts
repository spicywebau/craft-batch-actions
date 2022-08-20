import { InputBlock, MatrixInputBlock, NeoInputBlock } from './types/InputBlock'
import { InputField, NeoInputField } from './types/InputField'

interface ActivateEvent {
  preventDefault: () => void
}

abstract class BlockBatchActionBar {
  public $bar: JQuery
  public $selectCheckbox: JQuery
  public $buttons: JQuery
  public $menuContainer: JQuery
  public $menu: JQuery
  protected addBlockEvent: string

  constructor (
    public readonly input: InputField,
    protected readonly blockClass: string,
    protected readonly blockSelectedClass: string
  ) {
    this.$bar = $('<div class="block-batch-action-bar"/>').prependTo(input.$container)
    this.$selectCheckbox = this._generateSelectCheckbox().appendTo(this.$bar)
    this.$buttons = this._generateButtons().appendTo(this.$bar)
    this.$menuContainer = this._generateMenu().appendTo(this.$bar)

    const $actions = this.$bar.add(this.$menu)
    $actions.find('[data-bba-bn="button.expand"]').on('activate', (e: ActivateEvent) => {
      e.preventDefault()
      this.expand(this.getSelectedBlocks())
    })
    $actions.find('[data-bba-bn="button.collapse"]').on('activate', (e: ActivateEvent) => {
      e.preventDefault()
      this.collapse(this.getSelectedBlocks())
    })
    $actions.find('[data-bba-bn="button.enable"]').on('activate', (e: ActivateEvent) => {
      e.preventDefault()
      this.enable(this.getSelectedBlocks())
    })
    $actions.find('[data-bba-bn="button.disable"]').on('activate', (e: ActivateEvent) => {
      e.preventDefault()
      this.disable(this.getSelectedBlocks())
    })
    $actions.find('[data-bba-bn="button.delete"]').on('activate', (e: ActivateEvent) => {
      e.preventDefault()
      this.delete(this.getSelectedBlocks())
    })
  }

  protected supportedActions (): Array<[string, string]> {
    return [
      ['Expand', 'expand'],
      ['Collapse', 'collapse'],
      ['Enable', 'enabled'],
      ['Disable', 'disabled'],
      ['Delete', 'remove']
    ]
  }

  private _generateSelectCheckbox (): JQuery {
    const $checkbox = $('<div class="checkbox">')
    let handlingCheckbox = false
    let initialised = false

    $checkbox.on('mousedown', (e) => {
      if (e.which === Garnish.PRIMARY_CLICK) {
        if (!initialised) {
          // Initialise the add block event
          this.input.on(this.addBlockEvent, (e: any) => {
            const $block = e.$block ?? e.block.$container
            $block.addClass(this.input.blockSelect.settings.selectedClass)
          })
          initialised = true
        }

        handlingCheckbox = true
        $checkbox.toggleClass('checked')
        const selectAll = $checkbox.hasClass('checked')

        if (selectAll) {
          this.input.blockSelect.selectAll()
        } else {
          this.input.blockSelect.deselectAll()
        }
      }
    })

    this.input.blockSelect.on('selectionChange', (_: Event) => {
      if (!handlingCheckbox) {
        // Any manual change to block selection invalidates the select all state
        $checkbox.removeClass('checked')
      } else {
        // Set our checkbox handling as being complete
        handlingCheckbox = false
      }
    })

    return $checkbox
  }

  private _generateButtons (): JQuery {
    const $bar = $('<div class="btngroup"/>')
    this.supportedActions()
      .forEach(([label, icon]) => this._generateAction(label, icon, 'btn').appendTo($bar))

    return $bar
  }

  private _generateMenu (): JQuery {
    const $container = $('<div class="block-batch-action-bar_menu hidden"/>')
    const $button: any = $('<button type="button" class="btn settings icon menubtn">Actions</button>')
      .appendTo($container)
    this.$menu = $('<div class="menu"/>')
      .appendTo($container)
    const $ul = $('<ul class="padded"/>')
      .appendTo(this.$menu)

    this.supportedActions()
      .forEach(([label, icon]) => $('<li/>').append(this._generateAction(label, icon)).appendTo($ul))

    $button.menubtn()
    let buttonsWidth = this.$buttons.width() ?? 0
    this.$bar.on('resize', () => {
      buttonsWidth ||= this.$buttons.width() ?? 0
      const isMobile = (this.$bar.width() ?? 0) < buttonsWidth
      this.$buttons.toggleClass('hidden', isMobile)
      $container.toggleClass('hidden', !isMobile)
    })

    return $container
  }

  private _generateAction (label: string, icon: string|null, buttonClasses?: string): JQuery {
    const isButton = typeof buttonClasses !== 'undefined'
    const lowerCaseLabel = label.toLowerCase()
    icon ??= lowerCaseLabel
    const $action = $(`<${isButton ? 'button' : 'a'}/>`)
      .attr({
        'aria-label': label,
        'data-bba-bn': `button.${lowerCaseLabel}`,
        'data-icon': icon
      })
      .text(label)

    if (isButton) {
      $action.addClass(buttonClasses)
    }

    return $action
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
    super.addBlockEvent = 'blockAdded'
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
    super.addBlockEvent = 'addBlock'
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
