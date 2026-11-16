import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { registrarNoAutorizado } from './services/api'
import { useSesion } from './composables/useSesion'
import { useAviso } from './composables/useAviso'
import './style.css'

// Si la API responde 401 en cualquier momento, se limpia la sesión y se vuelve al login.
const { expirar } = useSesion()
const { mostrar } = useAviso()
registrarNoAutorizado(() => {
  expirar()
  mostrar('Tu sesión terminó. Inicia sesión de nuevo.')
  router.push('/login')
})

createApp(App).use(router).mount('#app')