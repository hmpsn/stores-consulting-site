import type { APIRoute } from 'astro';
import { createHash, randomUUID } from 'node:crypto';
import { Resend } from 'resend';

export const prerender = false;

const limits = { name: 120, email: 254, company: 160, phone: 40, message: 5000, website: 200 } as const;
type Field = keyof typeof limits;

function clean(value: FormDataEntryValue | null, field: Field) {
  return String(value || '').replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '').trim().slice(0, limits[field]);
}

function wantsJson(request: Request) {
  return request.headers.get('accept')?.includes('application/json') || request.headers.get('content-type')?.includes('application/json');
}

function reply(request: Request, status: number, code: string, message: string) {
  if (wantsJson(request)) return Response.json({ ok: status < 400, code, message }, { status });
  const redirectStatus = status < 400 ? 'success' : code === 'invalid' ? 'invalid' : 'unavailable';
  return new Response(null, { status: 303, headers: { location: `/contact-us/?status=${redirectStatus}` } });
}

function escapeHtml(value: string) {
  return value.replace(/[&<>'"]/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' })[character] || character);
}

export const POST: APIRoute = async ({ request }) => {
  const allowedOrigin = import.meta.env.CONTACT_ALLOWED_ORIGIN;
  const origin = request.headers.get('origin');
  const requestOrigin = new URL(request.url).origin;
  const acceptedOrigins = new Set([requestOrigin, allowedOrigin].filter(Boolean));
  if (origin && !acceptedOrigins.has(origin)) {
    return reply(request, 403, 'invalid', 'The submission origin was not accepted.');
  }

  let input: FormData;
  try {
    if (request.headers.get('content-type')?.includes('application/json')) {
      const json = await request.json() as Record<string, unknown>;
      input = new FormData();
      for (const [key, value] of Object.entries(json)) input.set(key, String(value ?? ''));
    } else {
      input = await request.formData();
    }
  } catch {
    return reply(request, 400, 'invalid', 'The form payload was not valid.');
  }

  const fields = {
    name: clean(input.get('name'), 'name'),
    email: clean(input.get('email'), 'email').toLowerCase(),
    company: clean(input.get('company'), 'company'),
    phone: clean(input.get('phone'), 'phone'),
    message: clean(input.get('message'), 'message'),
    website: clean(input.get('website'), 'website'),
  };
  if (fields.website) return reply(request, 200, 'success', 'Thank you. Your message has been sent.');
  if (!fields.name || !fields.email || !fields.message || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email)) {
    return reply(request, 422, 'invalid', 'Name, a valid email address, and message are required.');
  }

  const apiKey = import.meta.env.RESEND_API_KEY;
  const from = import.meta.env.CONTACT_FROM_EMAIL;
  const to = import.meta.env.CONTACT_TO_EMAIL || 'contact@storesconsulting.com';
  if (!apiKey || !from) return reply(request, 503, 'unavailable', 'The form is temporarily unavailable. Please email contact@storesconsulting.com.');

  const submissionId = randomUUID();
  const bucket = new Date().toISOString().slice(0, 13);
  const idempotencyKey = `contact/${createHash('sha256').update(`${fields.email}|${fields.message}|${bucket}`).digest('hex').slice(0, 48)}`;
  const text = [`Submission: ${submissionId}`, `Name: ${fields.name}`, `Email: ${fields.email}`, `Company: ${fields.company || 'Not provided'}`, `Phone: ${fields.phone || 'Not provided'}`, '', fields.message].join('\n');
  const html = `<h1>New website inquiry</h1><p><strong>Submission:</strong> ${escapeHtml(submissionId)}</p><dl><dt>Name</dt><dd>${escapeHtml(fields.name)}</dd><dt>Email</dt><dd>${escapeHtml(fields.email)}</dd><dt>Company</dt><dd>${escapeHtml(fields.company || 'Not provided')}</dd><dt>Phone</dt><dd>${escapeHtml(fields.phone || 'Not provided')}</dd></dl><h2>Message</h2><p>${escapeHtml(fields.message).replace(/\n/g, '<br>')}</p>`;

  try {
    const resend = new Resend(apiKey);
    const result = await resend.emails.send({ from, to, replyTo: fields.email, subject: `Website inquiry from ${fields.name}`, text, html }, { idempotencyKey });
    if (result.error) throw new Error(result.error.message);
  } catch (error) {
    console.error('Contact delivery failed', { submissionId, error: error instanceof Error ? error.message : 'Unknown error' });
    return reply(request, 502, 'unavailable', 'The form could not be delivered. Please email contact@storesconsulting.com.');
  }
  return reply(request, 200, 'delivered', 'Thank you. Your message has been sent.');
};

export const ALL: APIRoute = ({ request }) => reply(request, 405, 'invalid', 'Method not allowed.');
