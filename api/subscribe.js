import { Resend } from 'resend'
import { createClient } from '@supabase/supabase-js'

const FROM = 'FitNyx <support@fitnyx.in>'
const ADMIN_TO = 'support@fitnyx.in'
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const resend = new Resend(process.env.RESEND_API_KEY)
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { persistSession: false } }
)

function userEmailHtml() {
  return `<!doctype html>
<html>
  <body style="margin:0;padding:0;background:#0b0b0b;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;color:#eaeaea;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#0b0b0b;padding:40px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="560" cellpadding="0" cellspacing="0" style="max-width:560px;background:#141414;border:1px solid #262626;border-radius:16px;overflow:hidden;">
            <tr>
              <td style="padding:32px 32px 8px;">
                <div style="display:inline-block;padding:6px 12px;background:rgba(97,200,148,0.12);color:#61c894;border-radius:999px;font-size:12px;letter-spacing:0.04em;text-transform:uppercase;font-weight:600;">Early Access</div>
                <h1 style="margin:20px 0 12px;font-size:24px;line-height:1.3;color:#fff;">Thanks for joining FitNyx</h1>
                <p style="margin:0 0 16px;font-size:15px;line-height:1.65;color:#bdbdbd;">
                  We're excited you've shown interest in FitNyx. You're officially on the early-access list.
                </p>
                <p style="margin:0 0 16px;font-size:15px;line-height:1.65;color:#bdbdbd;">
                  We're polishing the iOS and Android apps right now. The moment we go live, you'll be among the first to get the download link.
                </p>
                <p style="margin:0 0 24px;font-size:15px;line-height:1.65;color:#bdbdbd;">
                  Until then — train hard, rest harder.
                </p>
                <div style="height:1px;background:#262626;margin:8px 0 20px;"></div>
                <p style="margin:0;font-size:13px;color:#7a7a7a;">— Team FitNyx</p>
              </td>
            </tr>
          </table>
          <p style="margin:16px 0 0;font-size:11px;color:#555;">You received this because you signed up at fitnyx.in. No spam — just a launch notification.</p>
        </td>
      </tr>
    </table>
  </body>
</html>`
}

function adminEmailHtml(email) {
  return `<div style="font-family:-apple-system,sans-serif;">
    <h2 style="margin:0 0 8px;">New early-access signup</h2>
    <p style="margin:0 0 4px;"><strong>Email:</strong> ${email}</p>
    <p style="margin:0;color:#666;font-size:13px;"><strong>At:</strong> ${new Date().toISOString()}</p>
  </div>`
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: 'Method not allowed' })
  }

  // Honeypot — bots fill hidden field, humans don't
  if (req.body?.website) {
    return res.status(200).json({ ok: true })
  }

  const email = String(req.body?.email || '').trim().toLowerCase()
  if (!email || email.length > 254 || !EMAIL_RE.test(email)) {
    return res.status(400).json({ error: 'Invalid email' })
  }

  // Insert first — UNIQUE constraint enforces one-email-per-address
  const { error: dbError } = await supabase
    .from('early_access')
    .insert({ email })

  if (dbError) {
    // 23505 = unique_violation → silent success (already registered)
    if (dbError.code === '23505') {
      return res.status(200).json({ ok: true })
    }
    console.error('[subscribe] supabase insert failed:', dbError)
    return res.status(500).json({ error: 'Could not register. Try again.' })
  }

  // Send emails best-effort — never block user response on email provider hiccup
  const results = await Promise.allSettled([
    resend.emails.send({
      from: FROM,
      to: email,
      subject: 'Thanks for joining FitNyx early access',
      html: userEmailHtml(),
    }),
    resend.emails.send({
      from: FROM,
      to: ADMIN_TO,
      subject: `New early-access signup: ${email}`,
      html: adminEmailHtml(email),
      reply_to: email,
    }),
  ])

  results.forEach((r, i) => {
    if (r.status === 'rejected') {
      console.error(`[subscribe] resend send #${i} failed:`, r.reason)
    }
  })

  return res.status(200).json({ ok: true })
}
