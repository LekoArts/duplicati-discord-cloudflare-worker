import { Hono } from 'hono'
import { html } from 'hono/html'
import { validator } from 'hono/validator'
import type { DuplicatiResponse } from './types'
import { createEmbed } from './embed'

const app = new Hono()

app.get('/', (c) => {
  return c.html(html`<!doctype html><body><p>Please use the instructions at <a href="https://github.com/LekoArts/duplicati-discord-cloudflare-worker">duplicati-discord-cloudflare-worker</a> to self-host this worker.</a></body>`)
})

app.post('/:channel_id/:webhook_id', validator('json', (value) => value), async (c) => {
  const { channel_id, webhook_id } = c.req.param()
  const thread_id = c.req.query('thread_id')
  let discordWebhookUrl = `https://discord.com/api/webhooks/${channel_id}/${webhook_id}`

  if (thread_id) {
    // See https://discord.com/developers/docs/resources/webhook#execute-webhook
    discordWebhookUrl += `?thread_id=${encodeURIComponent(thread_id)}`
  }

  const body = c.req.valid('json') as DuplicatiResponse
  const discordEmbed = createEmbed(body)

  const res = await fetch(discordWebhookUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(discordEmbed)
  })

  if (!res.ok) {
    return c.json({ status: res.status , error: res.statusText })
  }

  return c.json({ message: 'Discord webhook successfully triggered' }, 200)
})

export default app
