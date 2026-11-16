<script setup>
import { ref } from 'vue'

defineProps({ enviando: { type: Boolean, default: false } })
const emit = defineEmits(['guardar'])

const titulo = ref('')
const descripcion = ref('')
const errorTitulo = ref('')
const errorDescripcion = ref('')

function enviar() {
  const t = titulo.value.trim()
  errorTitulo.value = t.length < 3 || t.length > 100 ? 'El título debe tener entre 3 y 100 caracteres.' : ''
  errorDescripcion.value = descripcion.value.length > 500 ? 'La descripción admite hasta 500 caracteres.' : ''
  if (errorTitulo.value || errorDescripcion.value) return

  emit('guardar', { titulo: t, descripcion: descripcion.value.trim() }, () => {
    titulo.value = ''
    descripcion.value = ''
  })
}
</script>

<template>
  <form class="form" novalidate @submit.prevent="enviar">
    <label for="titulo">Título de la tarea</label>
    <input
      id="titulo"
      v-model="titulo"
      type="text"
      maxlength="100"
      autocomplete="off"
      :aria-invalid="!!errorTitulo"
      aria-describedby="titulo-error"
    />
    <p id="titulo-error" class="error-campo" role="alert">{{ errorTitulo }}</p>

    <label for="descripcion">Descripción (opcional)</label>
    <textarea
      id="descripcion"
      v-model="descripcion"
      rows="3"
      maxlength="500"
      :aria-invalid="!!errorDescripcion"
      aria-describedby="desc-error"
    ></textarea>
    <p id="desc-error" class="error-campo" role="alert">{{ errorDescripcion }}</p>

    <button class="btn primario" type="submit" :disabled="enviando">
      {{ enviando ? 'Guardando…' : 'Guardar tarea' }}
    </button>
  </form>
</template>