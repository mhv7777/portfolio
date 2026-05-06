import { Resend } from 'resend';

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;
const DEFAULT_RECIPIENT = 'miguelhverduzco@gmail.com';
const CONTACT_TO = process.env.CONTACT_TO_EMAIL || DEFAULT_RECIPIENT;
const FROM = process.env.RESEND_FROM_EMAIL || `Contact Form <no-reply@miguelhverduzco.com>`;

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

    const sendResult = await resend.emails.send({
      from: FROM,
      to: CONTACT_TO,
      subject,
      replyTo: email,
      text: `Name: ${name}\nEmail: ${email}\n${projectId ? `Project: ${projectId}\n` : ''}\n${message}`,
      html: `<p><strong>Name:</strong> ${name}</p>
             <p><strong>Email:</strong> ${email}</p>
             ${projectId ? `<p><strong>Project:</strong> ${projectId}</p>` : ''}
             <hr/>
             <p>${String(message).replace(/\n/g, '<br/>')}</p>`,
    });

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