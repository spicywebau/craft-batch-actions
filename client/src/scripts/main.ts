import { MatrixBatchActionBar, NeoBatchActionBar } from './BlockBatchActionBar'
import { BlockInput } from './types/BlockInput'

interface Event {
  target: BlockInput
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
