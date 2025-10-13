import Antd from 'ant-design-vue'
import { createApp } from 'vue'
import { globalRegister } from '@/global'
import pinia from '@/store'
import App from './App.vue'
import router from './router'
import { useGlobalState } from './store/globalState.ts'
import '@/style/index.css'
import '@/style/app.scss'
import 'ant-design-vue/dist/reset.css'

// import 'uno.css'
import 'virtual:svg-icons-register'

const app = createApp(App)

app.use(pinia)

// 初始化 Token 监听
const globalStore = useGlobalState()
globalStore.initTokenListener()

app.use(Antd).use(router).use(globalRegister).mount('#app')
