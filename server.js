const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;
const RECIPIENT = process.env.CONTACT_RECIPIENT || process.env.SMTP_USER;

async function createTransport() {
  if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_SECURE === 'true',
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    });
  }
  // fallback - Ethereal (dev only)
  const testAccount = await nodemailer.createTestAccount();
  return nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: { user: testAccount.user, pass: testAccount.pass },
  });
}

app.post('/api/contact', async (req, res) => {
  const { name, email, message, projectId } = req.body || {};
  if (!name || !email || !message) {
    return res.status(400).json({ ok: false, error: 'Missing fields' });
  }

  try {
    const transporter = await createTransport();
    const subject = projectId ? `Contact about project ${projectId}` : 'Website contact form';
    const html = `
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      ${projectId ? `<p><strong>Project:</strong> ${projectId}</p>` : ''}
      <hr/>
      <p>${message.replace(/\n/g, '<br/>')}</p>
    `;

    const info = await transporter.sendMail({
      from: `"Website Contact" <${process.env.SMTP_FROM || email}>`,
      to: process.env.CONTACT_RECIPIENT || process.env.SMTP_USER,
      subject,
      text: `${name} <${email}>:\n\n${message}`,
      html,
    });

    // If using Ethereal, return preview URL in response for dev debugging
    const preview = nodemailer.getTestMessageUrl(info) || null;
    return res.json({ ok: true, info: process.env.SMTP_HOST ? null : preview });
  } catch (err) {
    console.error('contact send error', err);
    return res.status(500).json({ ok: false, error: 'Failed to send' });
  }
});

app.listen(PORT, () => {
  console.log(`Contact server listening on ${PORT}`);
});