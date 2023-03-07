import { BatchActionBar, MatrixBatchActionBar, NeoBatchActionBar, VariantBatchActionBar } from './BatchActionBar'
import { MatrixInputField, NeoInputField } from './types/InputField'
import '../styles/main.scss'

declare global {
  interface Window {
    BatchActions: {
      initBars: (settings: Settings) => void
      bars: () => BatchActionBar[]
    }
  }
}

interface Settings {
  barsDisallowedFields: string[]
}

interface MatrixAfterInitEvent {
  target: MatrixInputField
}

interface NeoAfterInitEvent {
  target: NeoInputField
}

const actionBars: BatchActionBar[] = []
const initBarFunctions: Function[] = []
let barsInitialised = false
let barsSettings: Settings = {
  barsDisallowedFields: []
}

window.BatchActions = {
  initBars: (settings: Settings) => {
    barsSettings = settings
    initBarFunctions.forEach((initFunction) => initFunction())
    barsInitialised = true
  },

  bars: () => Array.from(actionBars)
}

// Only listen for Matrix input initialisation if there are actually any Matrix fields
if (typeof Craft.MatrixInput !== 'undefined') {
  Garnish.on(Craft.MatrixInput, 'afterInit', (e: MatrixAfterInitEvent) => {
    const fieldHandle = e.target.$container.closest('[data-type=craft\\\\fields\\\\Matrix]').data('attribute')
    const initBarFunction: () => void = () => {
      if (!barsSettings.barsDisallowedFields.includes(fieldHandle)) {
        actionBars.push(new MatrixBatchActionBar(e.target))
      }
    }

    if (barsInitialised) {
      initBarFunction()
    } else {
      initBarFunctions.push(initBarFunction)
    }
  })
}

// Only listen for Neo input initialisation if Neo is installed, and there are any Neo fields
if (typeof Neo !== 'undefined' && typeof Neo.Input !== 'undefined') {
  Garnish.on(Neo.Input, 'afterInit', (e: NeoAfterInitEvent) => {
    // Neo's block select was private prior to Neo 3.3.4
    // TODO: remove this check on Craft 5
    // Also, the bar shouldn't be initialised when viewing a revision
    if (typeof e.target.blockSelect !== 'undefined' && !e.target.$container.hasClass('is-static')) {
      const fieldHandle = e.target.getName()
      const initBarFunction: () => void = () => {
        if (!barsSettings.barsDisallowedFields.includes(fieldHandle)) {
          actionBars.push(new NeoBatchActionBar(e.target))
        }
      }

      if (barsInitialised) {
        initBarFunction()
      } else {
        initBarFunctions.push(initBarFunction)
      }
    }
  })
}

if (typeof Craft.Commerce !== 'undefined' && typeof Craft.Commerce.VariantMatrix !== 'undefined') {
  // Incredibly hacky stuff to work around variants' lack of events
  const VariantMatrix = Craft.Commerce.VariantMatrix
  const VariantMatrixInit = VariantMatrix.prototype.init
  const VariantMatrixAddVariant = VariantMatrix.prototype.addVariant
  const initBarFunction: (variantMatrix: any) => void = (variantMatrix) => {
    actionBars.push(new VariantBatchActionBar(variantMatrix))
  }

  VariantMatrix.prototype.init = function () {
    VariantMatrixInit.apply(this, arguments)

    if (barsInitialised) {
      initBarFunction(this)
    } else {
      initBarFunctions.push(() => initBarFunction(this))
    }
  }

  VariantMatrix.prototype.addVariant = function () {
    VariantMatrixAddVariant.apply(this, arguments)
    setTimeout(() => this.trigger('blockAdded'), 200)
  }
}
