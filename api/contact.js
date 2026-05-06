const nodemailer = require('nodemailer');

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ ok: false, error: 'Method not allowed' });

  const { name, email, message, projectId } = req.body || {};
  if (!name || !email || !message) return res.status(400).json({ ok: false, error: 'Missing fields' });

  try {
    if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
      return res.status(500).json({ ok: false, error: 'SMTP not configured' });
    }

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 587),
      secure: String(process.env.SMTP_SECURE || 'false') === 'true',
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    });

    const subject = projectId ? `Website contact — project ${projectId}` : 'Website contact';
    const html = `
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      ${projectId ? `<p><strong>Project:</strong> ${projectId}</p>` : ''}
      <hr/>
      <p>${String(message).replace(/\n/g, '<br/>')}</p>
    `;

    const info = await transporter.sendMail({
      from: process.env.SMTP_FROM || `"Website" <${process.env.SMTP_USER}>`,
      to: process.env.CONTACT_RECIPIENT || 'miguelhverduzco@gmail.com',
      subject,
      text: `${name} <${email}>:\n\n${message}`,
      html,
    });

    return res.json({ ok: true, info: info.messageId || null });
  } catch (err) {
    console.error('contact send error', err);
    return res.status(500).json({ ok: false, error: 'Failed to send' });
  }
};