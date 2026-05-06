import { Resend } from 'resend';

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;
const DEFAULT_RECIPIENT = 'miguelhverduzco@gmail.com';
const CONTACT_TO = process.env.CONTACT_TO_EMAIL || DEFAULT_RECIPIENT;
const FROM = process.env.RESEND_FROM_EMAIL || `Contact Form <no-reply@miguelhverduzco.com>`;

console.log('RESEND configured?', !!process.env.RESEND_API_KEY, 'CONTACT_TO set?', !!process.env.CONTACT_TO_EMAIL);

export async function POST(req: Request) {
  if (!resend) {
    console.error('Resend not configured: RESEND_API_KEY missing');
    return new Response(JSON.stringify({ success: false, error: 'Email provider not configured' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const body = await req.json();
    console.log('/api POST body:', body);

    const name = String(body?.name || '').trim();
    const email = String(body?.email || '').trim();
    const message = String(body?.message || '').trim();
    const projectId = body?.projectId ? String(body.projectId) : undefined;

    if (!name || !email || !message) {
      console.warn('Missing fields in contact form', { name, email, message });
      return new Response(JSON.stringify({ success: false, error: 'Missing name, email or message' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const subject = projectId ? `Website contact — project ${projectId}` : `Website contact from ${name}`;

    // sanitize inputs
    const safeName = String(name).replace(/<[^>]*>/g, '').trim();
    const safeEmail = String(email).trim();
    const safeMessage = String(message).replace(/<[^>]*>/g, '').trim();

    // build a reliable From: header
    // prefer explicit RESEND_FROM_EMAIL and optional RESEND_FROM_NAME env vars
    const envFromEmail = (process.env.RESEND_FROM_EMAIL || '').trim();
    const envFromName = (process.env.RESEND_FROM_NAME || '').trim() || 'Contact Form';
    const fromEmail = envFromEmail || 'no-reply@miguelhverduzco.com';
    const formattedFrom = `${envFromName} <${fromEmail}>`;

    // ensure email looks valid
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(safeEmail)) {
      return new Response(JSON.stringify({ success: false, error: 'Invalid email address' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const payload: any = {
      from: formattedFrom,
      to: CONTACT_TO,
      subject,
      // include both reply_to and explicit header for compatibility
      reply_to: safeEmail,
      headers: { 'Reply-To': safeEmail },
      text: `Name: ${safeName}\nEmail: ${safeEmail}\n${projectId ? `Project: ${projectId}\n` : ''}\n${safeMessage}`,
      html: `<p><strong>Name:</strong> ${safeName}</p>
             <p><strong>Email:</strong> ${safeEmail}</p>
             ${projectId ? `<p><strong>Project:</strong> ${projectId}</p>` : ''}
             <hr/>
             <p>${safeMessage.replace(/\n/g, '<br/>')}</p>`,
    };

    // cast resend.emails.send to any to avoid TS type mismatch for reply_to/header fields
    const sendResult = await (resend as any).emails.send(payload);

    console.log('Resend send result:', sendResult);
    return new Response(JSON.stringify({ success: true, id: (sendResult as any)?.id || null }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err: any) {
    console.error('contact send error', err);
    const msg = String(err?.message || err);
    const stack = err?.stack ? String(err.stack).slice(0, 2000) : undefined;
    return new Response(JSON.stringify({ success: false, error: msg, stack }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}