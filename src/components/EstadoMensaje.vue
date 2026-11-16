<script setup>
// Muestra los estados de carga, vacío y error de forma uniforme.
defineProps({
  tipo: { type: String, required: true, validator: (v) => ['cargando', 'vacio', 'error'].includes(v) },
  mensaje: { type: String, default: '' }
})
defineEmits(['reintentar'])
</script>

<template>
  <div class="estado" :class="tipo" :role="tipo === 'error' ? 'alert' : 'status'">
    <template v-if="tipo === 'cargando'">
      <span class="spinner" aria-hidden="true"></span> Cargando tareas…
    </template>
    <template v-else-if="tipo === 'vacio'">
      {{ mensaje || 'No hay tareas todavía.' }}
    </template>
    <template v-else>
      <p>{{ mensaje || 'Ocurrió un error.' }}</p>
      <button type="button" class="btn" @click="$emit('reintentar')">Reintentar</button>
    </template>
  </div>
</template>
