import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import App from './App.vue'
import router from './router'
import axios from 'axios'
import { createPinia } from 'pinia'

const app = createApp(App)

app.config.productionTip = false

app.use(ElementPlus)
app.use(createPinia())
app.use(router)
const service = axios.create({
  baseURL: 'http://127.0.0.1:12345',
  timeout: 15000,
  withCredentials: true
})

app.config.globalProperties.$axios = service

app.mount('#app')
