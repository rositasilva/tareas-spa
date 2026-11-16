<script setup>
import TareaItem from './TareaItem.vue'

defineProps({
  tareas: { type: Array, required: true },
  ocupadas: { type: Set, default: () => new Set() }
})
defineEmits(['cambiar-estado', 'eliminar'])
</script>

<template>
  <ul class="lista">
    <!-- clave estable: el id que entrega la API -->
    <TareaItem
      v-for="t in tareas"
      :key="t.id"
      :tarea="t"
      :ocupada="ocupadas.has(t.id)"
      @cambiar-estado="(tarea, nuevo) => $emit('cambiar-estado', tarea, nuevo)"
      @eliminar="$emit('eliminar', $event)"
    />
  </ul>
</template>