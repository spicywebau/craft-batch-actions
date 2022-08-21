/**
 * An instance of Garnish.
 */
declare const Garnish: {
  on: (target: GarnishComponent, events: string|string[], data: object|Function, handler?: Function) => void
  PRIMARY_CLICK: number
  SPACE_KEY: number
}

/**
 * An interface representing a Garnish component.
 */
declare interface GarnishComponent {
  on: (events: string, handler: Function) => void
}
