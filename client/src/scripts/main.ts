import { MatrixBatchActionBar, NeoBatchActionBar } from './BlockBatchActionBar'
import { InputField, NeoInputField } from './types/InputField'
import '../styles/main.scss'

interface MatrixAfterInitEvent {
  target: InputField
}

interface NeoAfterInitEvent {
  target: NeoInputField
}

const actionBars = []

if (typeof Craft.MatrixInput !== 'undefined') {
  Garnish.on(Craft.MatrixInput, 'afterInit', (e: MatrixAfterInitEvent) => {
    actionBars.push(new MatrixBatchActionBar(e.target))
  })
}

if (typeof Neo !== 'undefined' && typeof Neo.Input !== 'undefined') {
  Garnish.on(Neo.Input, 'afterInit', (e: NeoAfterInitEvent) => {
    // Neo's block select was private prior to Neo 3.3.4
    // TODO: remove this check on Craft 5
    if (typeof e.target.blockSelect !== 'undefined') {
      actionBars.push(new NeoBatchActionBar(e.target))
    }
  })
}
