import { App } from 'vue'
import VisualScrollList from './components/visual-scroll-list.vue'
const components = [
    VisualScrollList
]
// import VisualScrollList from 
export default VisualScrollList
// import {} from 
export {
    VisualScrollList
}
// vue.use
export function install(app: App) {
    components.forEach(component => { app.component(component.name, component) })
}