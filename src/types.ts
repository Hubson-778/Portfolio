export interface WorkItem {
  id: string
  src: string
  thumb: string
  alt: string
  category: 'illustration' | 'cad'
  /** For CAD items: technical drawing images */
  drawings?: string[]
  /** For poster/illustration items: variant images shown in expand panel */
  variants?: string[]
}

export type Theme = 'dark' | 'light'

export interface LightboxState {
  src: string | null
  alt: string
}
