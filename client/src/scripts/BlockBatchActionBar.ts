import { InputBlock, MatrixInputBlock, NeoInputBlock } from './types/InputBlock'
import { InputField, NeoInputField } from './types/InputField'

/**
 * Settings for a `BlockBatchActionBar`.
 */
interface BlockBatchActionBarSettings {
  blockClass: string
  blockSelectedClass: string
  addBlockEvent: string
}

/**
 * The event triggered when a new block is added to a block element field.
 */
interface AddBlockEvent {
  $block?: JQuery
  block: NeoInputBlock
}

/**
 * The mobile menu button for a `BlockBatchActionBar`.
 */
interface MenuButton extends JQuery {
  menubtn: () => void
}

/**
 * The data used when refreshing the `BlockBatchActionBar` buttons.
 */
interface ButtonRefreshData {
  icon: string
  check: Function
  enable: boolean
}

/**
 * A bar added to block element input fields for selecting all blocks and performing batch actions.
 */
abstract class BlockBatchActionBar {
  /**
   * The container for the select/buttons/menu components.
   * @public
   */
  public $bar: JQuery

  /**
   * The container for the select all checkbox.
   * @public
   */
  public $selectContainer: JQuery

  /**
   * The select all checkbox.
   * @public
   */
  public $select: JQuery

  /**
   * The container for the action buttons.
   * @public
   */
  public $buttonsContainer: JQuery

  /**
   * The container for the mobile menu.
   * @public
   */
  public $menuContainer: JQuery

  /**
   * The mobile menu.
   * @public
   */
  public $menu: JQuery

  /**
   * The action buttons.
   * @private
   */
  private _$buttons: Record<string, JQuery> = {}

  /**
   * The constructor.
   * @param input - The block element `InputField`.
   * @param settings - A `BlockBatchActionBarSettings` object.
   * @public
   */
  constructor (
    public readonly input: InputField,
    public readonly settings: BlockBatchActionBarSettings
  ) {
    this.$bar = $('<div class="block-batch-action-bar"/>').prependTo(input.$container)
    this._initSelect()
    this._initButtons()
    this._initMenu()

    const $actions = this.$bar.add(this.$menu)

    // Register event handlers for each action button
    this.supportedActions().forEach(([label, _icon, _check]) => {
      const lowerCaseLabel = label.toLowerCase()
      this._$buttons[lowerCaseLabel] = $actions.find(`[data-bba-bn="button.${lowerCaseLabel}"]`)
      this._$buttons[lowerCaseLabel].on('activate', (e: JQuery.Event) => {
        e.preventDefault()
        const actionMethod = this[lowerCaseLabel as keyof BlockBatchActionBar]

        if (typeof actionMethod === 'function') {
          actionMethod.bind(this)()
          this.refreshButtons()
        }
      })
    })

    this.refreshButtons()
    this.registerEventListeners()
  }

  /**
   * Gets the supported batch actions for the block element input field.
   * @returns an array of tuples containing the label, icon name, and function to check whether the
   * action should be enabled.
   * @protected
   */
  protected supportedActions (): Array<[string, string, Function]> {
    return [
      ['Expand', 'expand', this.isBlockCollapsed.bind(this)],
      ['Collapse', 'collapse', this.isBlockExpanded.bind(this)],
      ['Enable', 'enabled', this.isBlockDisabled.bind(this)],
      ['Disable', 'disabled', this.isBlockEnabled.bind(this)],
      ['Delete', 'remove', (_: JQuery) => true]
    ]
  }

  /**
   * Checks whether a block is expanded.
   * @param $block - A `JQuery` object representing an input block
   * @returns whether `$block` is expanded.
   * @protected
   */
  protected abstract isBlockExpanded ($block: JQuery): boolean

  /**
   * Checks whether a block is collapsed.
   * @param $block - A `JQuery` object representing an input block
   * @returns whether `$block` is collapsed.
   * @protected
   */
  protected isBlockCollapsed ($block: JQuery): boolean {
    return !this.isBlockExpanded($block)
  }

  /**
   * Checks whether a block is enabled.
   * @param $block - A `JQuery` object representing an input block
   * @returns whether `$block` is enabled.
   * @protected
   */
  protected abstract isBlockEnabled ($block: JQuery): boolean

  /**
   * Checks whether a block is disabled.
   * @param $block - A `JQuery` object representing an input block
   * @returns whether `$block` is disabled.
   * @protected
   */
  protected isBlockDisabled ($block: JQuery): boolean {
    return !this.isBlockEnabled($block)
  }

  /**
   * Initialises the select all checkbox.
   * @private
   */
  private _initSelect (): void {
    this.$selectContainer = $('<div/>', {
      class: 'block-batch-action-bar_select',
      role: 'checkbox',
      tabindex: 0,
      'aria-label': 'Select all',
      'aria-checked': 'false'
    }).appendTo(this.$bar)
    this.$select = $('<div class="checkbox">').appendTo(this.$selectContainer)
    let handlingCheckbox = false
    let initialised = false

    const selectHandler: (e: JQuery.Event) => void = (e) => {
      if (!initialised) {
        // The add block event is only initialised on the first check of the select checkbox, since
        // if it isn't checked then any new block doesn't need to be checked
        this.input.on(this.settings.addBlockEvent, (e: AddBlockEvent) => {
          const $block = e.$block ?? e.block.$container

          if (this.$select.hasClass('checked')) {
            $block.addClass(this.input.blockSelect.settings.selectedClass)
            this.input.blockSelect.selectItem($block, false, true)
            this.refreshButtons()
          }
        })
        initialised = true
      }

      handlingCheckbox = true
      this.$select.toggleClass('checked').removeClass('indeterminate')
      const selectAll = this.$select.hasClass('checked')

      if (selectAll) {
        this.input.blockSelect.selectAll()
        this.$selectContainer.attr('aria-checked', 'true')
      } else {
        this.input.blockSelect.deselectAll()
        this.$selectContainer.attr('aria-checked', 'false')
      }
    }

    this.$selectContainer.on('mousedown', (e) => {
      if (e.which === Garnish.PRIMARY_CLICK) {
        selectHandler(e)
      }
    })
    this.$selectContainer.on('keydown', (e) => {
      if (e.keyCode === Garnish.SPACE_KEY) {
        e.preventDefault()
        selectHandler(e)
      }
    })

    this.input.blockSelect.on('selectionChange', (_: Event) => {
      if (!handlingCheckbox) {
        // Any manual change to block selection invalidates the select all state
        this.$select.removeClass('checked')

        const anyBlocksChecked = this.input.blockSelect.$selectedItems.length > 0
        this.$select.toggleClass('indeterminate', anyBlocksChecked)
        this.$selectContainer.attr('aria-checked', anyBlocksChecked ? 'mixed' : 'false')
      } else {
        // Set our checkbox handling as being complete
        handlingCheckbox = false
      }

      this.refreshButtons()
    })
  }

  /**
   * Refreshes the enabled/disabled state of the action buttons, based on the selected block(s).
   * @protected
   */
  protected refreshButtons (): void {
    const actions: Record<string, ButtonRefreshData> = {}
    const labels: string[] = []

    this.supportedActions().forEach(([label, icon, check]) => {
      labels.push(label)
      actions[label] = {
        icon,
        check,
        enable: false
      }
    })

    this.input.blockSelect.$selectedItems.each((_: number, block: HTMLElement) => {
      const $block = $(block)
      labels.forEach((label) => {
        actions[label].enable ||= actions[label].check($block)
      })
    })

    labels.forEach((label) => {
      this._$buttons[label.toLowerCase()].toggleClass('disabled', !actions[label].enable)
    })
  }

  /**
   * Registers listeners for events where `BlockBatchActionBar` actions should be executed.
   * @protected
   */
  protected registerEventListeners (): void {}

  /**
   * Initialises the action buttons.
   * @private
   */
  private _initButtons (): void {
    this.$buttonsContainer = $('<div class="block-batch-action-bar_buttons btngroup"/>').appendTo(this.$bar)
    this.supportedActions()
      .forEach(([label, icon, _]) => this._generateAction(label, icon, 'btn').appendTo(this.$buttonsContainer))
  }

  /**
   * Initialises the mobile menu.
   * @private
   */
  private _initMenu (): void {
    this.$menuContainer = $('<div class="block-batch-action-bar_menu hidden"/>').appendTo(this.$bar)
    const $button = $('<button type="button" class="btn settings icon menubtn">Actions</button>')
      .appendTo(this.$menuContainer) as MenuButton
    this.$menu = $('<div class="menu"/>')
      .appendTo(this.$menuContainer)
    const $ul = $('<ul class="padded"/>')
      .appendTo(this.$menu)

    this.supportedActions()
      .forEach(([label, icon]) => $('<li/>').append(this._generateAction(label, icon)).appendTo($ul))

    $button.menubtn()
    const selectWidth = (this.$selectContainer.outerWidth() as number) + 2
    let buttonsWidth = this.$buttonsContainer.width() as number
    this.$bar.on('resize', () => {
      buttonsWidth ||= this.$buttonsContainer.width() as number
      const isMobile = (this.$bar.width() as number) - selectWidth < buttonsWidth
      this.$buttonsContainer.toggleClass('hidden', isMobile)
      this.$menuContainer.toggleClass('hidden', !isMobile)
    })
  }

  /**
   * Generates an action button.
   * @param label - the label to use on the button
   * @param icon - the name of the icon to show on the button
   * @param buttonClasses - the classes to use on the button element
   * @returns a `JQuery` object representing the button
   * @private
   */
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

  /**
   * @returns the selected `InputBlock`s on the block element field
   * @protected
   */
  protected abstract getSelectedBlocks (): InputBlock[]

  /**
   * Expands the selected blocks.
   * @public
   */
  public expand (): void {
    this.getSelectedBlocks().forEach((block) => block.expand())
  }

  /**
   * Collapses the selected blocks.
   * @protected
   */
  protected collapse (): void {
    this.getSelectedBlocks().forEach((block) => block.collapse())
  }

  /**
   * Enables the selected blocks.
   * @protected
   */
  protected abstract enable (): void

  /**
   * Disables the selected blocks.
   * @protected
   */
  protected abstract disable (): void

  /**
   * Deletes the selected blocks.
   * @protected
   */
  protected abstract delete (): void
}

/**
 * A bar added to Matrix input fields for selecting all blocks and performing batch actions.
 */
class MatrixBatchActionBar extends BlockBatchActionBar {
  /**
   * The constructor.
   * @param input - The Matrix `InputField`.
   * @public
   */
  constructor (public readonly input: InputField) {
    super(input, {
      blockClass: 'matrixblock',
      blockSelectedClass: 'sel',
      addBlockEvent: 'blockAdded'
    })
  }

  /**
   * @inheritDoc
   */
  protected registerEventListeners (): void {
    const settingsMenuListener: (block: MatrixInputBlock) => void = (block) => {
      block.actionDisclosure.on('hide', () => this.refreshButtons())
    }
    this.input.blockSelect.$items.each((_, block: HTMLElement) => settingsMenuListener($(block).data('block')))
    this.input.on(this.settings.addBlockEvent, (e: AddBlockEvent) => {
      // Craft triggers the `blockAdded` event after attaching the HTML element to the DOM, but
      // before actually creating the `MatrixBlock` instance
      setTimeout(() => settingsMenuListener(e.$block?.data('block')), 250)
    })
  }

  /**
   * @inheritDoc
   */
  protected isBlockExpanded ($block: JQuery): boolean {
    return !$block.hasClass('collapsed')
  }

  /**
   * @inheritDoc
   */
  protected isBlockEnabled ($block: JQuery): boolean {
    return !$block.hasClass('disabled')
  }

  /**
   * @inheritDoc
   */
  protected getSelectedBlocks (): MatrixInputBlock[] {
    return this.input.$container
      .find(`.${this.settings.blockClass}.${this.settings.blockSelectedClass}`)
      .map((_, blockEl) => $(blockEl).data('block'))
      .get()
  }

  /**
   * @inheritDoc
   */
  protected enable (): void {
    this.getSelectedBlocks().forEach((block) => block.enable())
  }

  /**
   * @inheritDoc
   */
  protected disable (): void {
    this.getSelectedBlocks().forEach((block) => block.disable())
  }

  /**
   * @inheritDoc
   */
  protected delete (): void {
    if (window.confirm('Are you sure you want to delete the selected blocks?')) {
      this.getSelectedBlocks().forEach((block) => block.selfDestruct())
    }
  }
}

/**
 * A bar added to Neo input fields for selecting all blocks and performing batch actions.
 */
class NeoBatchActionBar extends BlockBatchActionBar {
  /**
   * The constructor.
   * @param input - The `NeoInputField`.
   * @public
   */
  constructor (public readonly input: NeoInputField) {
    super(input, {
      blockClass: 'ni_block',
      blockSelectedClass: 'is-selected',
      addBlockEvent: 'addBlock'
    })
  }

  /**
   * @inheritDoc
   */
  protected registerEventListeners (): void {
    const blockEventListener: (block: NeoInputBlock) => void = (block) => {
      block.on('toggleExpansion toggleEnabled', () => this.refreshButtons())
    }
    this.input.getBlocks().forEach(blockEventListener)
    this.input.on(this.settings.addBlockEvent, (e: AddBlockEvent) => blockEventListener(e.block))
    this.input.on('removeBlock', () => this.refreshButtons())
  }

  /**
   * @inheritDoc
   */
  protected isBlockExpanded ($block: JQuery): boolean {
    return $block.hasClass('is-expanded')
  }

  /**
   * @inheritDoc
   */
  protected isBlockEnabled ($block: JQuery): boolean {
    return $block.hasClass('is-enabled')
  }

  /**
   * @inheritDoc
   */
  protected getSelectedBlocks (): NeoInputBlock[] {
    return this.input.getBlocks().filter((block) => block.isSelected())
  }

  /**
   * @inheritDoc
   */
  protected enable (): void {
    this.getSelectedBlocks().find((block) => !block.isEnabled())?.enable()
  }

  /**
   * @inheritDoc
   */
  protected disable (): void {
    this.getSelectedBlocks().find((block) => block.isEnabled())?.disable()
  }

  /**
   * @inheritDoc
   */
  protected delete (): void {
    if (window.confirm('Are you sure you want to delete the selected blocks?')) {
      this.getSelectedBlocks().forEach((block) => this.input.removeBlock(block))
    }
  }
}

export { MatrixBatchActionBar, NeoBatchActionBar }
