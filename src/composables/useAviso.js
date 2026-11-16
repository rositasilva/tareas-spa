import { ref } from 'vue'

const aviso = ref('')
let temporizador = null

export function useAviso() {
  function mostrar(texto) {
    aviso.value = texto
    clearTimeout(temporizador)
    temporizador = setTimeout(() => (aviso.value = ''), 4000)
  }
  return { aviso, mostrar }
}
