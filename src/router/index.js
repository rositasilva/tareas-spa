import { createRouter, createWebHistory } from 'vue-router'
import TareasView from '../views/TareasView.vue'
import NuevaView from '../views/NuevaView.vue'
import AcercaView from '../views/AcercaView.vue'
import LoginView from '../views/LoginView.vue'
import { useSesion } from '../composables/useSesion'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'tareas', component: TareasView, meta: { privada: true } },
    { path: '/nueva', name: 'nueva', component: NuevaView, meta: { privada: true } },
    { path: '/acerca', name: 'acerca', component: AcercaView },
    { path: '/login', name: 'login', component: LoginView },
    { path: '/:pathMatch(.*)*', redirect: '/' }
  ]
})

// Guardia de navegación: las rutas privadas exigen sesión.
router.beforeEach(async (to) => {
  const { usuario, comprobar } = useSesion()
  await comprobar()
  if (to.meta.privada && !usuario.value) return { name: 'login' }
  if (to.name === 'login' && usuario.value) return { name: 'tareas' }
})

export default router