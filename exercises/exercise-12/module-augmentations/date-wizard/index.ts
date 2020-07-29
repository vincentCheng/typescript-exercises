// This enabled module augmentation mode.
import * as dataWizard from 'date-wizard'

/**
 * declare 后面不加 module 就是全局的包。
 * 加了就要根据import引入的包来判定。
 */
declare module 'date-wizard' {
  // Add your module extensions here.
  interface DateDetails extends dataWizard.DateDetails {
    hours: number
  }
  function pad(index: number): number
}
