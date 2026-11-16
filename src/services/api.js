// Único punto de acceso HTTP de la aplicación.
const BASE = import.meta.env.VITE_API_URL ?? '/api'

export class ApiError extends Error {
  constructor(mensaje, { status = 0, detalle = null } = {}) {
    super(mensaje)
    this.name = 'ApiError'
    this.status = status
    this.detalle = detalle
  }
}

// Función que se ejecuta cuando la API responde 401 (sesión vencida o ausente).
let alNoAutorizado = null
export const registrarNoAutorizado = (fn) => { alNoAutorizado = fn }

function listarErrores(lista) {
  return lista
    .map((e) =>
      typeof e === 'string' ? e : [e.campo, e.mensaje || e.msg || e.message].filter(Boolean).join(': ')
    )
    .join('; ')
}

// Convierte cualquier forma de error de la API en un texto legible.
function extraerMensaje(detalle, status) {
  const crudo = detalle?.error ?? detalle
  let texto = ''
  if (typeof crudo === 'string') {
    texto = crudo
  } else if (crudo && typeof crudo === 'object') {
    texto = crudo.mensaje || crudo.message || ''
    const lista = Object.values(crudo).find(Array.isArray)
    if (lista?.length) texto += (texto ? ': ' : '') + listarErrores(lista)
  }
  return texto ? `${texto} (código ${status})` : `Error del servidor (código ${status})`
}

async function request(path, { method = 'GET', body, signal } = {}) {
  let res
  try {
    res = await fetch(`${BASE}${path}`, {
      method,
      signal,
      credentials: 'include', // envía la cookie de express-session
      headers: body ? { 'Content-Type': 'application/json' } : undefined,
      body: body ? JSON.stringify(body) : undefined
    })
  } catch (e) {
    if (e.name === 'AbortError') throw e
    throw new ApiError('No se pudo conectar con el servidor. Revisa tu conexión.')
  }

  if (!res.ok) {
    let detalle = null
    try { detalle = await res.json() } catch { /* sin cuerpo JSON */ }
    if (res.status === 401 && !path.startsWith('/auth/')) alNoAutorizado?.()
    throw new ApiError(extraerMensaje(detalle, res.status), { status: res.status, detalle })
  }
  return res.status === 204 ? null : res.json()
}

export const authApi = {
  registro: (datos) => request('/auth/registro', { method: 'POST', body: datos }),
  login: (datos) => request('/auth/login', { method: 'POST', body: datos }),
  yo: () => request('/auth/yo'),
  logout: () => request('/auth/logout', { method: 'POST' })
}

export const tareasApi = {
  // La API pagina de 10 en 10 por defecto; se piden hasta 50 (su máximo).
  listar: (signal) => request('/tareas?limite=50', { signal }),
  crear: (datos) => request('/tareas', { method: 'POST', body: datos }),
  // PATCH permite mandar solo lo que cambia (por ejemplo, el estado).
  actualizar: (id, datos) => request(`/tareas/${id}`, { method: 'PATCH', body: datos }),
  eliminar: (id) => request(`/tareas/${id}`, { method: 'DELETE' })
}