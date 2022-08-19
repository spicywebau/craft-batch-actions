import { MatrixBatchActionBar, NeoBatchActionBar } from './BlockBatchActionBar'
import { InputField, NeoInputField } from './types/InputField'

interface MatrixAfterInitEvent {
  target: InputField
}

interface NeoAfterInitEvent {
  target: NeoInputField
}

const actionBars = []

Garnish.on(Craft.MatrixInput, 'afterInit', (e: MatrixAfterInitEvent) => {
  actionBars.push(new MatrixBatchActionBar(e.target))
})

if (typeof Neo?.Input !== 'undefined') {
  Garnish.on(Neo.Input, 'afterInit', (e: NeoAfterInitEvent) => {
    actionBars.push(new NeoBatchActionBar(e.target))
  })
}
