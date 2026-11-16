# Tareas SPA

Aplicación de una sola página hecha con Vue 3 que consume la API `tareas-api` (Unidad 2). Se puede instalar como PWA y la lista de tareas se puede consultar sin conexión.

## Requisitos

- Node.js instalado
- La API `tareas-api` corriendo en `http://localhost:3000`

## Cómo ejecutarla

1. Instalar las dependencias: `npm install`
2. Iniciar la API en su propia carpeta: `npm start`
3. Modo desarrollo: `npm run dev` y abrir `http://localhost:5173`
4. Pruebas: `npm test`
5. Probar la PWA (instalación y modo sin conexión): `npm run build` y luego `npm run preview`, y abrir `http://localhost:4173`

El service worker solo funciona con la versión compilada, no con `npm run dev`.

## Estructura

- `src/services/api.js`: único lugar donde se hacen las peticiones HTTP
- `src/composables/`: estado compartido (tareas, sesión y avisos)
- `src/components/`: componentes de la lista, cada tarea, el formulario y los mensajes de estado
- `src/views/`: pantallas (lista, nueva tarea, login y acerca de)
- `src/router/`: rutas y protección de las pantallas privadas

## Decisiones

- Las peticiones pasan por un proxy de Vite hacia `localhost:3000`, así la cookie de sesión funciona sin configurar CORS.
- La lista cancela la petición anterior antes de lanzar una nueva para evitar condiciones de carrera.
- La API usa control de versiones en cada tarea: la aplicación envía la versión que leyó y, si hay conflicto (409), recarga la lista.
- El service worker guarda en caché los archivos de la aplicación y solo la lectura de `/api/tareas` (primero red, luego caché). Nunca se guardan las peticiones que modifican datos. Al cerrar sesión se borra ese caché.