<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useSesion } from '../composables/useSesion'
import { useAviso } from '../composables/useAviso'

const { entrar } = useSesion()
const { mostrar } = useAviso()
const router = useRouter()

const modo = ref('login')
const nombre = ref('')
const clave = ref('')
const enviando = ref(false)
const error = ref('')
const esLogin = computed(() => modo.value === 'login')

async function enviar() {
  error.value = ''
  if (!nombre.value.trim() || !clave.value) {
    error.value = 'Escribe tu usuario y tu clave.'
    return
  }
  enviando.value = true
  try {
    await entrar(modo.value, { nombre: nombre.value.trim(), clave: clave.value })
    mostrar(esLogin.value ? 'Sesión iniciada.' : 'Cuenta creada con éxito.')
    router.push('/')
  } catch (e) {
    error.value = e.message
  } finally {
    enviando.value = false
  }
}

function cambiarModo() {
  modo.value = esLogin.value ? 'registro' : 'login'
  error.value = ''
}
</script>

<template>
  <section aria-labelledby="h-login">
    <h2 id="h-login">{{ esLogin ? 'Iniciar sesión' : 'Crear cuenta' }}</h2>

    <form class="form" novalidate @submit.prevent="enviar">
      <label for="nombre">Usuario</label>
      <input id="nombre" v-model="nombre" type="text" autocomplete="username" />

      <label for="clave">Clave</label>
      <input
        id="clave"
        v-model="clave"
        type="password"
        :autocomplete="esLogin ? 'current-password' : 'new-password'"
      />

      <p v-if="error" class="estado error" role="alert">{{ error }}</p>

      <button class="btn primario" type="submit" :disabled="enviando">
        {{ enviando ? 'Enviando…' : esLogin ? 'Entrar' : 'Registrarme' }}
      </button>
    </form>

    <button type="button" class="btn enlace" @click="cambiarModo">
      {{ esLogin ? '¿No tienes cuenta? Regístrate' : '¿Ya tienes cuenta? Inicia sesión' }}
    </button>
  </section>
</template>