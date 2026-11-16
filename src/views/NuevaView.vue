<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import TareaForm from '../components/TareaForm.vue'
import { useTareas } from '../composables/useTareas'
import { useAviso } from '../composables/useAviso'

const { crear } = useTareas()
const { mostrar } = useAviso()
const router = useRouter()
const enviando = ref(false)
const errorEnvio = ref('')

async function guardar(datos, limpiar) {
  enviando.value = true
  errorEnvio.value = ''
  try {
    await crear(datos)
    limpiar()
    mostrar('Tarea creada con éxito.')
    router.push('/')
  } catch (e) {
    errorEnvio.value = e.message
  } finally {
    enviando.value = false
  }
}
</script>

<template>
  <section aria-labelledby="h-nueva">
    <h2 id="h-nueva">Nueva tarea</h2>
    <TareaForm :enviando="enviando" @guardar="guardar" />
    <p v-if="errorEnvio" class="estado error" role="alert">{{ errorEnvio }}</p>
  </section>
</template>
