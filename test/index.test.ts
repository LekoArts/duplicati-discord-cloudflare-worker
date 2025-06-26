import { env, fetchMock } from 'cloudflare:test'
import { afterEach, beforeAll, describe, expect, it } from 'vitest'
import app from '../src/index'
import { success as duplicatiSuccess } from './fixtures/duplicati'

describe('worker', () => {
  beforeAll(() => {
    // Enable outbound request mocking...
    fetchMock.activate()
    // ...and throw errors if an outbound request isn't mocked
    fetchMock.disableNetConnect()
  })
  // Ensure we matched every mock we defined
  afterEach(() => fetchMock.assertNoPendingInterceptors())

  it('should show instructions on root route', async () => {
    const res = await app.request('/', {}, env)
    const body = await res.text()

    expect(res.status).toBe(200)
    expect(body).toContain('Please use the instructions')
  })
  it('should return 404 on invalid routes', async () => {
    const res = await app.request('/invalid', {}, env)
    expect(res.status).toBe(404)
  })
  it('should return 200 on valid request', async () => {
    fetchMock
      .get('https://discord.com')
      .intercept({ path: '/api/webhooks/channel/webhook-id', method: 'POST' })
      .reply(200)

    const res = await app.request('/channel/webhook-id', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(duplicatiSuccess),
    }, env)

    const body = await res.json()

    expect(res.status).toBe(200)
    expect(body).toEqual({ message: 'Discord webhook successfully triggered' })
  })
  it('should handle thread_id request parameter', async () => {
    fetchMock
      .get('https://discord.com')
      .intercept({ path: '/api/webhooks/channel/webhook-id?thread_id=123', method: 'POST' })
      .reply(200)

    const res = await app.request('/channel/webhook-id?thread_id=123', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(duplicatiSuccess),
    }, env)

    const body = await res.json()

    expect(res.status).toBe(200)
    expect(body).toEqual({ message: 'Discord webhook successfully triggered' })
  })
})
