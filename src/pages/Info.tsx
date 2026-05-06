import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Info: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<'idle'|'sending'|'sent'|'error'>('idle');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // change this path to your temp image or replace with an imported asset
  const placeholderImage = 'me-copy.png';

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    if (!name || !email || !message) { setStatus('error'); setErrorMsg('Please fill all fields.'); return; }
    setStatus('sending');

    try {
      const res = await fetch('/api', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, message }),
      });

      // read raw text so we can show HTML or JSON
      const raw = await res.text();
      let json: any = null;
      try { json = raw ? JSON.parse(raw) : null; } catch (parseErr) { /* not JSON */ }

      if (res.ok && json?.success) {
        setStatus('sent'); setName(''); setEmail(''); setMessage('');
      } else {
        // build a helpful error message
        const bodyPreview = json ? JSON.stringify(json, null, 2) : raw.slice(0, 2000);
        console.error('Contact send failed', { status: res.status, statusText: res.statusText, body: raw });
        setStatus('error');
        setErrorMsg(`Request failed: ${res.status} ${res.statusText}\n\nResponse body:\n${bodyPreview}`);
      }
    } catch (err: any) {
      console.error('contact send failed (network)', err);
      setStatus('error');
      setErrorMsg(String(err));
    }
  };

  return (
    <main style={{ padding: '2.5rem 1.25rem', color: '#ddd', maxWidth: 1000, margin: '0 auto' }}>
      {/* Responsive styles scoped to this component */}
      <style>{`
        .info-grid {
          display: grid;
          grid-template-columns: 1fr 360px;
          gap: 28px;
          align-items: start;
        }
        .info-aside {
          background: #111;
          padding: 16px;
          border-radius: 6px;
        }
        .info-aside img {
          width: 100%;
          height: 300px;
          object-fit: cover;
          background: #222;
          display: block;
          border-radius: 4px;
        }
        .info-input, .info-textarea, .info-button {
          width: 100%;
          box-sizing: border-box;
          font-size: 14px;
        }
        .info-input, .info-textarea {
          padding: 10px;
          border-radius: 6px;
          border: 1px solid #222;
          background: #0b0b0b;
          color: #fff;
        }
        .info-button {
          margin-top: 8px;
          padding: 10px 12px;
          background: #111;
          color: #EDEDED;
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 6px;
          cursor: pointer;
        }
        .info-button[disabled] {
          opacity: 0.6;
          cursor: not-allowed;
        }
        .info-back {
          color: #EDEDED;
          text-decoration: none;
          display: inline-block;
          margin-bottom: 16px;
          font-size: 14px;
        }

        /* Mobile / tablet: collapse to single column and adjust sizes */
        @media (max-width: 820px) {
          .info-grid {
            grid-template-columns: 1fr;
          }
          .info-aside img {
            height: 200px;
            border-radius: 4px;
          }
          .info-button {
            padding: 12px;
          }
          main { padding: 20px 14px; }
        }
      `}</style>

      <Link to="/" className="info-back">
        ← Back
      </Link>

      <div className="info-grid">
        <section>
          <h1 style={{ margin: '0 0 8px 0', fontFamily: 'Playfair Display, serif', color: '#fff', fontSize: 28 }}>
            Information
          </h1>

          <p style={{ color: '#bdbdbd', marginTop: 0 }}>
            For inquiries, collaborations, or just to say hi, feel free to reach out using the contact form. I’m always open to discussing new projects, sharing ideas, or connecting with fellow creatives.
          </p>

          <div style={{ marginTop: 18, background: '#0f0f0f', padding: 18, borderRadius: 6 }}>
            <h3 style={{ marginTop: 0, color: '#bdbdbd', fontSize: 13, textTransform: 'uppercase', letterSpacing: '.12em' }}>About</h3>
            <p style={{ margin: '8px 0 0 0', color: '#ddd', lineHeight: 1.6 }}>
              Miguel Hilario Verduzco is a Mexican American filmmaker based outside of Los Angeles. He is a writer, director, editor, and producer. Above all else, he loves telling stories.
            </p>
          </div>
        </section>

        <aside className="info-aside" aria-labelledby="contact-heading">
          <div style={{ marginBottom: 12 }}>
            <img
              src={placeholderImage}
              alt="Photo placeholder"
            />
          </div>

          <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 8 }} aria-describedby="contact-heading">
            <label style={{ fontSize: 12, color: '#bdbdbd' }}>Name</label>
            <input
              className="info-input"
              value={name}
              onChange={e => setName(e.target.value)}
              aria-label="Your name"
            />

            <label style={{ fontSize: 12, color: '#bdbdbd' }}>Email</label>
            <input
              className="info-input"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              aria-label="Your email"
            />

            <label style={{ fontSize: 12, color: '#bdbdbd' }}>Message</label>
            <textarea
              className="info-textarea"
              value={message}
              onChange={e => setMessage(e.target.value)}
              rows={4}
              aria-label="Message"
            />

            <button
              type="submit"
              disabled={status === 'sending'}
              className="info-button"
              aria-busy={status === 'sending'}
            >
              {status === 'sending' ? 'Sending…' : status === 'sent' ? 'Sent' : 'Contact'}
            </button>

            {errorMsg && <div style={{ color: '#ff6b6b', marginTop: 6 }}>{errorMsg}</div>}
          </form>
        </aside>
      </div>
    </main>
  );
};

export default Info;