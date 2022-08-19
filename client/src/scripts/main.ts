import { MatrixBatchActionBar, NeoBatchActionBar } from './BlockBatchActionBar'
import { InputField } from './types/InputField'

interface Event {
  target: InputField
}

const actionBars = []

Garnish.on(Craft.MatrixInput, 'afterInit', (e: Event) => {
  actionBars.push(new MatrixBatchActionBar(e.target))
})

if (typeof Neo?.Input !== 'undefined') {
  Garnish.on(Neo.Input, 'afterInit', (e: Event) => {
    actionBars.push(new NeoBatchActionBar(e.target))
  })
}
