import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import App from './App.vue'
import router from './router'
import axios from 'axios'


const app = createApp(App)

app.config.productionTip = false

app.use(ElementPlus)

const service = axios.create({
  baseURL: "http://36.133.97.26:12345",
  timeout: 15000,
  withCredentials: true
})

app.config.globalProperties.$axios = service

app.use(router).mount('#app')
