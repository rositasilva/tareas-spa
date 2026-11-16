import { ref } from 'vue'
import { authApi } from '../services/api'
import { useTareas } from './useTareas'

const usuario = ref(null)
let comprobada = false
const CLAVE = 'usuario-actual'

const leerGuardado = () => {
  try { return JSON.parse(localStorage.getItem(CLAVE)) } catch { return null }
}
const guardar = (u) => {
  try {
    if (u) localStorage.setItem(CLAVE, JSON.stringify(u))
    else localStorage.removeItem(CLAVE)
  } catch { /* sin almacenamiento disponible */ }
}

function limpiarLocal() {
  usuario.value = null
  guardar(null)
  useTareas().tareas.value = []
  // Seguridad: se borra el caché de la lista para que no la vea otra persona.
  if ('caches' in window) caches.delete('api-tareas')
}

export function useSesion() {
  async function comprobar() {
    if (comprobada) return
    try {
      usuario.value = await authApi.yo()
      guardar(usuario.value)
    } catch (e) {
      // Sin conexión (status 0) se conserva el último usuario para poder ver los datos guardados.
      usuario.value = e.status === 0 ? leerGuardado() : null
      if (e.status !== 0) guardar(null)
    }
    comprobada = true
  }

  async function entrar(modo, datos) {
    useTareas().tareas.value = []
    usuario.value = await authApi[modo](datos) // modo: 'login' o 'registro'
    guardar(usuario.value)
    comprobada = true
  }

  async function salir() {
    try { await authApi.logout() } catch { /* aunque falle, se limpia lo local */ }
    limpiarLocal()
  }

  const expirar = limpiarLocal

  return { usuario, comprobar, entrar, salir, expirar }
}