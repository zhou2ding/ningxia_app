import { createRouter, createWebHashHistory } from 'vue-router'
import RoadDetect from '../views/RoadDetect.vue'
import SettingsPanel from '..//views/SettingsPanel.vue'

const routes = [
  {
    path: '/',
    redirect: '/roadDetect'
  },
  {
    path: '/roadDetect',
    name: 'roadDetect',
    component: RoadDetect
  },
  {
    path: '/setting',
    name: 'setting',
    component: SettingsPanel
  }
]

// 创建路由实例
const router = createRouter({
  history: createWebHashHistory(), // 替代 mode: 'hash'
  routes
})

export default router
