import { createApp } from 'vue'
import type { App as AppType } from 'vue'
import App from './App.vue'
import router from './router'
import './styles/global.css'

const app: AppType = createApp(App)
app.use(router)
app.mount('#app')
