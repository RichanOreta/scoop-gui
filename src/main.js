import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import StoragePlugin from 'vue-web-storage';

const app = createApp(App)
app.use(router)
app.use(StoragePlugin, {
	drivers: ['session']
})
app.mount('#app')
