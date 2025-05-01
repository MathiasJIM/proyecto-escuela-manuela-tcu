declare module 'vue-cal' {
  import { DefineComponent } from 'vue'
  
  interface VueCalEvent {
    id?: number | string
    start: string | Date
    end: string | Date
    title: string
    content?: string
    class?: string
    [key: string]: any
  }
  
  interface VueCalProps {
    events?: VueCalEvent[]
    [key: string]: any
  }
  
  const VueCal: DefineComponent<VueCalProps>
  export default VueCal
}
