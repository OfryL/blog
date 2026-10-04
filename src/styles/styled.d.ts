import 'styled-components'
import type { Theme } from './theme'

declare module 'styled-components' {
  // Module augmentation needs an interface, even an empty one.
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  export interface DefaultTheme extends Theme {}
}
