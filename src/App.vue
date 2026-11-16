<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAviso } from './composables/useAviso'
import { useSesion } from './composables/useSesion'

const { aviso } = useAviso()
const { usuario, salir } = useSesion()
const router = useRouter()

const enLinea = ref(navigator.onLine)
const actualizar = () => (enLinea.value = navigator.onLine)

async function cerrarSesion() {
  await salir()
  router.push('/login')
}

onMounted(() => {
  window.addEventListener('online', actualizar)
  window.addEventListener('offline', actualizar)
})
onUnmounted(() => {
  window.removeEventListener('online', actualizar)
  window.removeEventListener('offline', actualizar)
})
</script>

<template>
  <a class="saltar" href="#contenido">Saltar al contenido</a>
  <header class="cabecera">
    <h1>Tareas</h1>
    <nav aria-label="Principal">
      <template v-if="usuario">
        <RouterLink to="/">Lista</RouterLink>
        <RouterLink to="/nueva">Nueva</RouterLink>
      </template>
      <RouterLink to="/acerca">Acerca de</RouterLink>
    </nav>
    <div v-if="usuario" class="usuario">
      <span>{{ usuario.nombre }}</span>
      <button type="button" class="btn claro" @click="cerrarSesion">Salir</button>
    </div>
  </header>

  <p v-if="!enLinea" class="banner" role="status">
    Sin conexión: se muestran los últimos datos guardados y no se pueden hacer cambios.
  </p>

  <main id="contenido" class="contenedor">
    <RouterView />
  </main>

  <div class="aviso" role="status" aria-live="polite">{{ aviso }}</div>
</template>