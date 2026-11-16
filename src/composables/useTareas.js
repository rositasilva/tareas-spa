import { ref, computed } from 'vue'
import { tareasApi } from '../services/api'

export const ESTADOS = ['pendiente', 'en_progreso', 'completada']
export const ETIQUETAS = {
  pendiente: 'Pendiente',
  en_progreso: 'En progreso',
  completada: 'Completada'
}

// Estado compartido (lo usan la lista y el formulario).
const tareas = ref([])
const estado = ref('idle') // idle | cargando | ok | error
const error = ref('')
const ocupadas = ref(new Set()) // ids con una operación en curso
let controlador = null

// La API puede devolver un arreglo o un objeto que contiene el arreglo.
function extraerLista(datos) {
  if (Array.isArray(datos)) return datos
  if (datos && typeof datos === 'object') {
    const clave = ['datos', 'items', 'tareas', 'resultados'].find((k) => Array.isArray(datos[k]))
    if (clave) return datos[clave]
    const cualquiera = Object.values(datos).find(Array.isArray)
    if (cualquiera) return cualquiera
  }
  return []
}

export function useTareas() {
  async function cargar() {
    // Evita condiciones de carrera: cancela la petición anterior.
    controlador?.abort()
    const actual = (controlador = new AbortController())
    estado.value = 'cargando'
    error.value = ''
    try {
      const datos = await tareasApi.listar(actual.signal)
      if (actual.signal.aborted) return
      tareas.value = extraerLista(datos)
      estado.value = 'ok'
    } catch (e) {
      if (e.name === 'AbortError') return
      error.value = e.message
      estado.value = 'error'
    }
  }

  async function conOcupado(id, fn) {
    if (ocupadas.value.has(id)) return
    ocupadas.value = new Set(ocupadas.value).add(id)
    try {
      return await fn()
    } finally {
      const copia = new Set(ocupadas.value)
      copia.delete(id)
      ocupadas.value = copia
    }
  }

  async function crear(datos) {
    const nueva = await tareasApi.crear(datos)
    tareas.value = [nueva, ...tareas.value]
    estado.value = 'ok'
    return nueva
  }

  const cambiarEstado = (tarea, nuevoEstado) =>
    conOcupado(tarea.id, async () => {
      try {
        // La API pide la versión que leímos para detectar cambios de otra persona.
        const act = await tareasApi.actualizar(tarea.id, {
          estado: nuevoEstado,
          version: tarea.version
        })
        // La respuesta trae la versión nueva, que se guarda para el siguiente cambio.
        tareas.value = tareas.value.map((t) => (t.id === tarea.id ? { ...t, ...act } : t))
      } catch (e) {
        if (e.status === 409) {
          // Conflicto: la tarea cambió en otro lado. Se recarga la lista actualizada.
          await cargar()
          throw new Error('La tarea fue modificada en otro lugar. Se actualizó la lista, intenta de nuevo.')
        }
        throw e
      }
    })

  const eliminar = (tarea) =>
    conOcupado(tarea.id, async () => {
      await tareasApi.eliminar(tarea.id)
      tareas.value = tareas.value.filter((t) => t.id !== tarea.id)
    })

  const pendientes = computed(() => tareas.value.filter((t) => t.estado !== 'completada').length)

  return { tareas, estado, error, ocupadas, pendientes, cargar, crear, cambiarEstado, eliminar }
}