import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Info: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<'idle'|'sending'|'sent'|'error'>('idle');

  // change this path to your temp image or replace with an imported asset
  const placeholderImage = 'me-copy.png';

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) { setStatus('error'); return; }
    setStatus('sending');
    try {
      await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, message }),
      });
      setStatus('sent'); setName(''); setEmail(''); setMessage('');
    } catch {
      setStatus('error');
    }
  };

  return (
    <main style={{ padding: '2.5rem 3rem', color: '#ddd', maxWidth: 1000, margin: '0 auto' }}>
      <Link to="/" style={{ color: '#EDEDED', textDecoration: 'none', display: 'inline-block', marginBottom: 16 }}>
        ← Back
      </Link>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 28, alignItems: 'start' }}>
        <section>
          <h1 style={{ margin: '0 0 8px 0', fontFamily: 'Playfair Display, serif', color: '#fff' }}>Information</h1>
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

        <aside style={{ background: '#111', padding: 16, borderRadius: 6 }}>
          <div style={{ marginBottom: 12 }}>
            <img
              src={placeholderImage}
              alt="Photo placeholder"
              style={{
                width: '100%',
                height: 300,
                objectFit: 'cover',
                background: '#222',
                display: 'block',
                borderRadius: 4,
              }}
            />
          </div>

          <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <label style={{ fontSize: 12, color: '#bdbdbd' }}>Name</label>
            <input value={name} onChange={e => setName(e.target.value)} style={{ padding: 8, borderRadius: 4, border: '1px solid #222', background: '#0b0b0b', color: '#fff' }} />

            <label style={{ fontSize: 12, color: '#bdbdbd' }}>Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} style={{ padding: 8, borderRadius: 4, border: '1px solid #222', background: '#0b0b0b', color: '#fff' }} />

            <label style={{ fontSize: 12, color: '#bdbdbd' }}>Message</label>
            <textarea value={message} onChange={e => setMessage(e.target.value)} rows={4} style={{ padding: 8, borderRadius: 4, border: '1px solid #222', background: '#0b0b0b', color: '#fff' }} />

            <button type="submit" disabled={status === 'sending'} style={{ marginTop: 6, padding: '8px 10px', background: '#111', color: '#EDEDED', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 4, cursor: 'pointer' }}>
              {status === 'sending' ? 'Sending…' : status === 'sent' ? 'Sent' : 'Contact'}
            </button>

            {status === 'error' && <div style={{ color: '#ff6b6b', marginTop: 6 }}>Please fill all fields or try again.</div>}
          </form>
        </aside>
      </div>
    </main>
  );
};

export default Info;