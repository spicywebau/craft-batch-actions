import { InputBlock, MatrixInputBlock, NeoInputBlock } from './types/InputBlock'
import { InputField, MatrixInputField, NeoInputField } from './types/InputField'

/**
 * Settings for a `BatchActionBar`.
 */
interface BatchActionBarSettings {
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
 * The mobile menu button for a `BatchActionBar`.
 */
interface MenuButton extends JQuery {
  menubtn: () => void
}

/**
 * The data used when refreshing the `BatchActionBar` buttons.
 */
interface ButtonRefreshData {
  icon: string
  condition: Function
  enable: boolean
  initialState: boolean
}

interface SmithMenu {
  $pasteBtn: JQuery
  checkPaste: () => void
  copyBlock: (e?: object) => void
  pasteBlock: (e?: object, data?: object) => void
}

/**
 * Represents a batch action.
 */
interface BatchAction {
  label: string
  icon: string
  condition: (data: any) => boolean
  initialState: boolean
}

const createAction: (
  label: string,
  icon: string,
  condition: (data: any) => boolean,
  initialState?: boolean
) => BatchAction = (label, icon, condition, initialState = false) => {
  return {
    label,
    icon,
    condition,
    initialState
  }
}

/**
 * A bar added to block element input fields for selecting all blocks and performing batch actions.
 */
abstract class BatchActionBar {
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
   * @param settings - A `BatchActionBarSettings` object.
   * @public
   */
  constructor (
    public readonly input: InputField,
    public readonly settings: BatchActionBarSettings
  ) {
    this.$bar = $('<div class="batch-action-bar"/>').prependTo(input.$container)
    this._initSelect()
    this._initButtons()
    this._initMenu()

    const $actions = this.$bar.add(this.$menu)

    // Register event handlers for each action button
    this.actions().forEach((action) => {
      const lowerCaseLabel = action.label.toLowerCase()
      this._$buttons[lowerCaseLabel] = $actions.find(`[data-bba-bn="button.${lowerCaseLabel}"]`)
      this._$buttons[lowerCaseLabel].on('activate', (e: JQuery.Event) => {
        e.preventDefault()
        const actionMethod = this[lowerCaseLabel as keyof BatchActionBar]

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
   * @returns an array of `BatchAction`s.
   * @protected
   * @since 1.2.0
   */
  protected actions (): BatchAction[] {
    const actions = [
      createAction('Expand', 'expand', this.isBlockCollapsed.bind(this)),
      createAction('Collapse', 'collapse', this.isBlockExpanded.bind(this)),
      createAction('Enable', 'enabled', this.isBlockDisabled.bind(this)),
      createAction('Disable', 'disabled', this.isBlockEnabled.bind(this)),
      createAction('Delete', 'remove', (_?: any) => this.getSelectedBlocks().length > 0)
    ]

    return actions
  }

  /**
   * Gets the supported batch actions for the block element input field.
   * @returns an array of tuples containing the label, icon name, and function to check whether the
   * action should be enabled.
   * @protected
   * @deprecated in 1.2.0; use `actions()` instead
   */
  protected supportedActions (): Array<[string, string, Function]> {
    return this.actions()
      .map((action) => [action.label, action.icon, action.condition])
  }

  /**
   * Checks whether a block is expanded.
   * @param $block - A `JQuery` object representing an input block
   * @returns whether `$block` is expanded.
   * @protected
   */
  protected abstract isBlockExpanded ($block?: JQuery): boolean

  /**
   * Checks whether a block is collapsed.
   * @param $block - A `JQuery` object representing an input block
   * @returns whether `$block` is collapsed.
   * @protected
   */
  protected isBlockCollapsed ($block?: JQuery): boolean {
    return typeof $block !== 'undefined' ? !this.isBlockExpanded($block) : false
  }

  /**
   * Checks whether a block is enabled.
   * @param $block - A `JQuery` object representing an input block
   * @returns whether `$block` is enabled.
   * @protected
   */
  protected abstract isBlockEnabled ($block?: JQuery): boolean

  /**
   * Checks whether a block is disabled.
   * @param $block - A `JQuery` object representing an input block
   * @returns whether `$block` is disabled.
   * @protected
   */
  protected isBlockDisabled ($block?: JQuery): boolean {
    return typeof $block !== 'undefined' ? !this.isBlockEnabled($block) : false
  }

  /**
   * Initialises the select all checkbox.
   * @private
   */
  private _initSelect (): void {
    this.$selectContainer = $('<div/>', {
      class: 'batch-action-bar_select',
      role: 'checkbox',
      tabindex: 0,
      'aria-label': Craft.t('batch-actions', 'Select all'),
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
            handlingCheckbox = true
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

    this.actions().forEach((action) => {
      labels.push(action.label)
      actions[action.label] = {
        icon: action.icon,
        condition: action.condition,
        enable: action.initialState,
        initialState: action.initialState
      }
    })

    const checkConditions: (data?: any) => void = (data?: any) => {
      labels.forEach((label) => {
        if (actions[label].initialState) {
          actions[label].enable &&= actions[label].condition(data)
        } else {
          actions[label].enable ||= actions[label].condition(data)
        }
      })
    }

    checkConditions()
    this.input.blockSelect.$selectedItems.each((_: number, block: HTMLElement) => {
      checkConditions($(block))
    })

    labels.forEach((label) => {
      this._$buttons[label.toLowerCase()].toggleClass('disabled', !actions[label].enable)
    })
  }

  /**
   * Registers listeners for events where `BatchActionBar` actions should be executed.
   * @protected
   */
  protected registerEventListeners (): void {}

  /**
   * Initialises the action buttons.
   * @private
   */
  private _initButtons (): void {
    this.$buttonsContainer = $('<div class="batch-action-bar_buttons btngroup"/>').appendTo(this.$bar)
    this.actions().forEach((action) => {
      this._generateAction(action.label, action.icon, 'btn').appendTo(this.$buttonsContainer)
    })
  }

  /**
   * Initialises the mobile menu.
   * @private
   */
  private _initMenu (): void {
    this.$menuContainer = $('<div class="batch-action-bar_menu hidden"/>').appendTo(this.$bar)
    const $button = $('<button type="button" class="btn settings icon menubtn">Actions</button>')
      .appendTo(this.$menuContainer) as MenuButton
    this.$menu = $('<div class="menu"/>')
      .appendTo(this.$menuContainer)
    const $ul = $('<ul class="padded"/>')
      .appendTo(this.$menu)

    this.actions().forEach((action) => {
      $('<li/>').append(this._generateAction(action.label, action.icon)).appendTo($ul)
    })

    $button.menubtn()
    const selectWidth = (this.$selectContainer.outerWidth() as number) + 2
    let buttonsWidth = this.$buttonsContainer.width() as number
    const updateResponsiveness: () => void = () => {
      buttonsWidth ||= this.$buttonsContainer.width() as number
      const isMobile = (this.$bar.width() as number) - selectWidth < buttonsWidth
      this.$buttonsContainer.toggleClass('hidden', isMobile)
      this.$menuContainer.toggleClass('hidden', !isMobile)
    }
    updateResponsiveness()
    this.$bar.on('resize', updateResponsiveness)
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
      .text(Craft.t('batch-actions', label))

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
class MatrixBatchActionBar extends BatchActionBar {
  /**
   * The Smith menu, if Smith is installed.
   * @see https://plugins.craftcms.com/smith
   * @private
   */
  private _smithMenu: SmithMenu|null = null

  /**
   * Dummy block so our Smith menu pastes blocks at the top
   * @private
   */
  private _$dummyBlock: JQuery|null = null

  /**
   * The constructor.
   * @param input - The `MatrixInputField`.
   * @public
   */
  constructor (public readonly input: MatrixInputField) {
    super(input, {
      addBlockEvent: 'blockAdded'
    })
  }

  /**
   * @inheritDoc
   */
  protected actions (): BatchAction[] {
    if (typeof Craft.Smith === 'undefined') {
      // Not using Smith, can't support copying/pasting
      return super.actions()
    } else if (this._smithMenu === null || typeof this._smithMenu === 'undefined') {
      this._$dummyBlock = $('<div/>', {
        class: 'hidden',
        data: {
          block: {
            $actionMenu: $()
          }
        }
      }).prependTo(this.input.$blockContainer)
      this._smithMenu = new Craft.Smith.Menu(
        this.input.$container,
        this._$dummyBlock,
        $() // Supposed to be all Matrix blocks for the field, but doesn't appear to actually be used by Smith
      )
    }

    return super.actions().concat([
      createAction('Copy', 'field', (_?: any) => this.getSelectedBlocks().length > 0),
      createAction('Paste', 'brush', (_?: any) => {
        this._smithMenu?.checkPaste()
        return !(this._smithMenu?.$pasteBtn.hasClass('disabled') ?? true)
      }, true)
    ])
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
  protected isBlockExpanded ($block?: JQuery): boolean {
    return typeof $block !== 'undefined' ? !$block.hasClass('collapsed') : false
  }

  /**
   * @inheritDoc
   */
  protected isBlockEnabled ($block?: JQuery): boolean {
    return typeof $block !== 'undefined' ? !$block.hasClass('disabled') : false
  }

  /**
   * @inheritDoc
   */
  protected getSelectedBlocks (): MatrixInputBlock[] {
    return this.input.blockSelect.$selectedItems
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
    if (window.confirm(Craft.t('batch-actions', 'Are you sure you want to delete the selected blocks?'))) {
      this.getSelectedBlocks().forEach((block) => block.selfDestruct())
    }
  }

  protected copy (): void {
    this._ensureSmithInstalled('copy')
    const selectedBlocks = this.getSelectedBlocks()

    if (selectedBlocks.length > 0) {
      this._smithMenu?.copyBlock()
    }
  }

  protected paste (): void {
    this._ensureSmithInstalled('paste')
    this._smithMenu?.pasteBlock()
  }

  private _ensureSmithInstalled (action: string): void {
    if (typeof Craft.Smith === 'undefined') {
      throw new Error(`Tried to ${action} Matrix blocks but Smith isn't installed.`)
    }
  }
}

/**
 * A bar added to Neo input fields for selecting all blocks and performing batch actions.
 */
class NeoBatchActionBar extends BatchActionBar {
  /**
   * The constructor.
   * @param input - The `NeoInputField`.
   * @public
   */
  constructor (public readonly input: NeoInputField) {
    super(input, {
      addBlockEvent: 'addBlock'
    })
  }

  /**
   * @inheritDoc
   */
  protected actions (): BatchAction[] {
    if (typeof this.input.getCopiedBlocks === 'undefined') {
      // Not using Neo 3.4.0+, can't support copying/pasting
      return super.actions()
    }

    const pasteCondition: (_?: any) => boolean = (_?) => {
      const copiedBlocks = this.input.getCopiedBlocks()

      if (copiedBlocks.length === 0) {
        return false
      }

      // Ensure there are valid blocks to paste at the top level
      const baseLevel = copiedBlocks[0].level
      const topLevelBlockTypeIds = this.input.getBlockTypes(true).map((bt) => bt.getId())
      const validTopLevelBlockCount = copiedBlocks
        .filter((block) => block.level === baseLevel && topLevelBlockTypeIds.includes(block.type))
        .length
      if (validTopLevelBlockCount === 0) {
        return false
      }

      // Ensure we won't exceed the field's max top level blocks setting
      const fieldMaxTopBlocks = this.input.getMaxTopBlocks()
      if (
        fieldMaxTopBlocks !== null &&
        fieldMaxTopBlocks > 0 &&
        validTopLevelBlockCount + this.input.getBlocks(1).length > fieldMaxTopBlocks
      ) {
        return false
      }

      // Ensure we won't exceed the field's max blocks setting
      const fieldMaxBlocks = this.input.getMaxBlocks()
      if (
        fieldMaxBlocks !== null &&
        fieldMaxBlocks > 0 &&
        copiedBlocks.length + this.input.getBlocks().length > fieldMaxBlocks
      ) {
        return false
      }

      // Now we should be fine
      return true
    }

    return super.actions().concat([
      createAction('Copy', 'field', (_?: any) => this.getSelectedBlocks().length > 0),
      createAction('Paste', 'brush', pasteCondition, true)
    ])
  }

  /**
   * @inheritDoc
   */
  protected registerEventListeners (): void {
    const blockEventListener: (block: NeoInputBlock) => void = (block) => {
      block.on('copyBlock toggleExpansion toggleEnabled', () => this.refreshButtons())
    }
    this.input.getBlocks().forEach(blockEventListener)
    this.input.on(this.settings.addBlockEvent, (e: AddBlockEvent) => {
      this.refreshButtons()
      blockEventListener(e.block)
    })
    this.input.on('removeBlock', () => this.refreshButtons())
  }

  /**
   * @inheritDoc
   */
  protected isBlockExpanded ($block?: JQuery): boolean {
    return $block?.hasClass('is-expanded') ?? false
  }

  /**
   * @inheritDoc
   */
  protected isBlockCollapsed ($block?: JQuery): boolean {
    return typeof $block !== 'undefined' ? !this.isBlockExpanded($block) : false
  }

  /**
   * @inheritDoc
   */
  protected isBlockEnabled ($block?: JQuery): boolean {
    return $block?.hasClass('is-enabled') ?? false
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
    if (window.confirm(Craft.t('batch-actions', 'Are you sure you want to delete the selected blocks?'))) {
      this.getSelectedBlocks().forEach((block) => this.input.removeBlock(block))
    }
  }

  protected copy (): void {
    const selectedBlocks = this.getSelectedBlocks()

    if (selectedBlocks.length > 0) {
      this.input['@copyBlock']({ block: selectedBlocks[0] })
    }
  }

  protected paste (): void {
    this.input['@pasteBlock']({})
  }
}

export { BatchActionBar, MatrixBatchActionBar, NeoBatchActionBar }
