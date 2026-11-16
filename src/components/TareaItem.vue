<script setup>
import { ESTADOS, ETIQUETAS } from '../composables/useTareas'

defineProps({
  tarea: { type: Object, required: true },
  ocupada: { type: Boolean, default: false }
})
defineEmits(['cambiar-estado', 'eliminar'])
</script>

<template>
  <li class="item" :class="{ hecha: tarea.estado === 'completada' }">
    <div class="texto">
      <strong>{{ tarea.titulo }}</strong>
      <p v-if="tarea.descripcion" class="desc">{{ tarea.descripcion }}</p>
    </div>

    <div class="acciones">
      <label class="sr" :for="`estado-${tarea.id}`">Estado de {{ tarea.titulo }}</label>
      <select
        :id="`estado-${tarea.id}`"
        :value="tarea.estado"
        :disabled="ocupada"
        @change="$emit('cambiar-estado', tarea, $event.target.value)"
      >
        <option v-for="e in ESTADOS" :key="e" :value="e">{{ ETIQUETAS[e] }}</option>
      </select>
      <button
        type="button"
        class="btn peligro"
        :disabled="ocupada"
        :aria-label="`Eliminar tarea: ${tarea.titulo}`"
        @click="$emit('eliminar', tarea)"
      >
        Eliminar
      </button>
    </div>
  </li>
</template>