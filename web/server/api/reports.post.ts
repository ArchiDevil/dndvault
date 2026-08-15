import {createHash} from 'node:crypto'

/**
 * Anonymous error reports from site readers.
 *
 * Collections schema (Directus `error_reports`, configured manually):
 * - page_url         string, required
 * - comment          text, required
 * - quote            text, nullable
 * - contact          string, nullable
 * - reporter_ip_hash string, nullable
 */

const RATE_WINDOW_MS = 60 * 60 * 1000
const RATE_MAX_REPORTS = 3

const hitsByIp = new Map<string, number[]>()

function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim() !== ''
}

export default defineEventHandler(async (event): Promise<{ok: true}> => {
  // Accept strict JSON only: script spammers usually post form data
  const contentType = getRequestHeader(event, 'content-type') ?? ''
  if (!contentType.includes('application/json')) {
    throw createError({statusCode: 400, message: 'JSON body expected'})
  }

  const body = await readBody<Record<string, unknown>>(event).catch(
    () => undefined
  )
  if (body === undefined || body === null || typeof body !== 'object') {
    throw createError({statusCode: 400, message: 'Invalid body'})
  }

  // Honeypot: humans never see the field, bots fill everything.
  // Answer 200 and drop silently so the bot considers it a success.
  const honeypot = typeof body.website === 'string' ? body.website.trim() : ''
  if (honeypot !== '') {
    return {ok: true}
  }

  const pageUrl = isNonEmptyString(body.page_url) ? body.page_url.trim() : ''
  const comment = isNonEmptyString(body.comment) ? body.comment.trim() : ''
  const quote = isNonEmptyString(body.quote) ? body.quote.trim() : ''
  const contact = isNonEmptyString(body.contact) ? body.contact.trim() : ''

  // Relative in-site URL only, it is enough to restore the entity
  if (!pageUrl.startsWith('/') || pageUrl.length > 2048) {
    throw createError({statusCode: 400, message: 'Invalid page_url'})
  }
  if (comment.length < 10 || comment.length > 2000) {
    throw createError({
      statusCode: 400,
      message: 'Comment must be between 10 and 2000 characters',
    })
  }
  if (quote.length > 500) {
    throw createError({statusCode: 400, message: 'Quote is too long'})
  }
  if (contact.length > 100) {
    throw createError({statusCode: 400, message: 'Contact is too long'})
  }

  // In-memory per-IP rate limit (enough for the expected volume)
  const ip = getRequestIP(event, {xForwardedFor: true}) ?? 'unknown'
  const now = Date.now()
  const hits = (hitsByIp.get(ip) ?? []).filter(
    (t) => now - t < RATE_WINDOW_MS
  )
  if (hits.length >= RATE_MAX_REPORTS) {
    setResponseHeader(event, 'Retry-After', '3600')
    throw createError({statusCode: 429, message: 'Too many reports'})
  }
  hits.push(now)
  hitsByIp.set(ip, hits)

  const {staticToken, backendAddress, reportsIpSalt} = useRuntimeConfig()
  const reporterIpHash = createHash('sha256')
    .update(ip + reportsIpSalt)
    .digest('hex')

  await $fetch(`${backendAddress}/items/error_reports`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${staticToken}`,
    },
    body: {
      page_url: pageUrl,
      comment,
      quote: quote === '' ? null : quote,
      contact: contact === '' ? null : contact,
      reporter_ip_hash: reporterIpHash,
    },
  })

  return {ok: true}
})
