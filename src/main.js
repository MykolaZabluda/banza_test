import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import { createVuetify } from 'vuetify'
import 'vuetify/styles'
import { VApp, VMain, VContainer } from 'vuetify/components'

const vuetify = createVuetify({
    components: {
        VApp,
        VMain,
        VContainer,
    },
})

createApp(App).use(store).use(router).use(vuetify).mount('#app')
