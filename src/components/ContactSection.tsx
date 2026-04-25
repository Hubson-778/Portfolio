import { useState, type FormEvent } from 'react'

const FORMSPREE_ID = 'xjgjzvdo'

export default function ContactSection() {
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setStatus('sending')
    const form = e.currentTarget
    try {
      const res = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
        method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' },
      })
      if (res.ok) { setStatus('sent'); form.reset() } else setStatus('error')
    } catch { setStatus('error') }
  }

  return (
    <section id="contact" style={{ maxWidth: 1100, margin: '0 auto', padding: '4rem 1.25rem 5rem' }}>
      <div className="reveal" style={{ marginBottom: '2rem' }}>
        <p className="label">Contact</p>
      </div>

      <div className="reveal" style={{ marginBottom: '2.5rem' }}>
        <h2 className="font-serif" style={{ fontSize: 'clamp(2rem, 8vw, 4rem)', fontWeight: 900, lineHeight: 1.05 }}>
          Let's work<br /><span className="g-text">together.</span>
        </h2>
      </div>

      {status === 'sent' ? (
        <p className="body-muted reveal">Thanks — I'll get back to you soon.</p>
      ) : (
        <form onSubmit={handleSubmit} className="reveal contact-form">
          <input    className="form-field" type="text"  name="name"    placeholder="Your name"                  required autoComplete="name"  disabled={status === 'sending'} />
          <input    className="form-field" type="email" name="email"   placeholder="Email address"              required autoComplete="email" disabled={status === 'sending'} />
          <textarea className="form-field" name="message" placeholder="Tell me about your project..." rows={4}  required                       disabled={status === 'sending'} />

          {status === 'error' && (
            <p style={{ fontSize: '0.8rem', color: '#ff6b6b', marginTop: '0.75rem' }}>
              Something went wrong — please try again.
            </p>
          )}

          <div style={{ marginTop: '1.5rem' }}>
            <button type="submit" disabled={status === 'sending'} className="send-btn">
              {status === 'sending' ? 'Sending…' : 'Send message'}
            </button>
          </div>
        </form>
      )}
    </section>
  )
}
