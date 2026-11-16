import { describe, it, expect, vi, afterEach } from 'vitest'
import { tareasApi, ApiError } from './api'

const respuesta = (ok, status, cuerpo) => ({
  ok, status, json: async () => cuerpo
})

afterEach(() => vi.unstubAllGlobals())

describe('servicio HTTP', () => {
  it('devuelve los datos cuando response.ok es true', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(respuesta(true, 200, [{ id: 1 }])))
    expect(await tareasApi.listar()).toEqual([{ id: 1 }])
  })

  it('lanza ApiError con el mensaje del servidor si response.ok es false', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(respuesta(false, 400, { error: 'Título requerido' })))
    await expect(tareasApi.crear({})).rejects.toMatchObject({
      status: 400,
      message: expect.stringContaining('Título requerido')
    })
  })

  it('lee el mensaje cuando el error viene dentro de un objeto', async () => {
    const cuerpo = { error: { codigo: 'VALIDACION', mensaje: 'Datos inválidos' } }
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(respuesta(false, 422, cuerpo)))
    await expect(tareasApi.crear({})).rejects.toMatchObject({
      message: expect.stringContaining('Datos inválidos')
    })
  })

  it('traduce un fallo de red a un mensaje claro', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new TypeError('fail')))
    await expect(tareasApi.listar()).rejects.toBeInstanceOf(ApiError)
  })

  it('devuelve null en respuestas 204', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(respuesta(true, 204)))
    expect(await tareasApi.eliminar(1)).toBeNull()
  })
})