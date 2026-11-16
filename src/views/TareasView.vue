<script setup>
import { ref, computed, onMounted } from 'vue'
import TareaList from '../components/TareaList.vue'
import EstadoMensaje from '../components/EstadoMensaje.vue'
import { useTareas, ESTADOS, ETIQUETAS } from '../composables/useTareas'
import { useAviso } from '../composables/useAviso'

const { tareas, estado, error, ocupadas, pendientes, cargar, cambiarEstado, eliminar } = useTareas()
const { mostrar } = useAviso()

const filtro = ref('todas')
const FILTROS = [
  { valor: 'todas', texto: 'Todas' },
  ...ESTADOS.map((e) => ({ valor: e, texto: ETIQUETAS[e] }))
]

const visibles = computed(() =>
  filtro.value === 'todas' ? tareas.value : tareas.value.filter((t) => t.estado === filtro.value)
)

async function accion(fn, textoOk) {
  try {
    await fn()
    mostrar(textoOk)
  } catch (e) {
    mostrar(`No se pudo completar la acción: ${e.message}`)
  }
}

onMounted(cargar)
</script>

<template>
  <section aria-labelledby="h-tareas">
    <h2 id="h-tareas">Mis tareas</h2>
    <p v-if="estado === 'ok'" class="resumen">{{ pendientes }} sin completar de {{ tareas.length }}</p>

    <div class="filtros" role="group" aria-label="Filtrar tareas por estado">
      <button
        v-for="f in FILTROS"
        :key="f.valor"
        type="button"
        class="btn"
        :aria-pressed="filtro === f.valor"
        @click="filtro = f.valor"
      >
        {{ f.texto }}
      </button>
    </div>

    <EstadoMensaje v-if="estado === 'cargando'" tipo="cargando" />
    <EstadoMensaje v-else-if="estado === 'error'" tipo="error" :mensaje="error" @reintentar="cargar" />
    <EstadoMensaje
      v-else-if="estado === 'ok' && visibles.length === 0"
      tipo="vacio"
      :mensaje="tareas.length === 0 ? 'Aún no tienes tareas. ¡Crea la primera!' : 'Ninguna tarea coincide con el filtro.'"
    />
    <TareaList
      v-else-if="estado === 'ok'"
      :tareas="visibles"
      :ocupadas="ocupadas"
      @cambiar-estado="(t, nuevo) => accion(() => cambiarEstado(t, nuevo), 'Estado actualizado.')"
      @eliminar="(t) => accion(() => eliminar(t), 'Tarea eliminada.')"
    />
  </section>
</template>