import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

/* ─── tiny hook: intersection observer for scroll reveals ─── */
function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.15 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return { ref, visible };
}

/* ─── Floating card components for Hero ─── */
function NoteCard() {
  return (
    <div className="landing-float-card landing-note-card">
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
        <span style={{ fontSize: 18 }}>📝</span>
        <span style={{ fontSize: 12, fontWeight: 600, color: '#34d399' }}>Quick Note</span>
      </div>
      <p style={{ fontSize: 11, color: '#9ca3af', lineHeight: 1.6 }}>
        "Store ideas, insights, and<br />knowledge — all in one place."
      </p>
      <div style={{ marginTop: 10, display: 'flex', gap: 5 }}>
        {['#ideas', '#brain', '#ai'].map(t => (
          <span key={t} className="tag" style={{ fontSize: 9, padding: '2px 7px' }}>{t}</span>
        ))}
      </div>
    </div>
  );
}

function AiSummaryCard() {
  return (
    <div className="landing-float-card landing-ai-card">
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
        <div style={{
          width: 26, height: 26, borderRadius: 8,
          background: 'linear-gradient(135deg,#10b981,#059669)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13
        }}>🤖</div>
        <div>
          <div style={{ fontSize: 11, fontWeight: 600, color: '#f1f5f9' }}>AI Summary</div>
          <div style={{ fontSize: 9, color: '#6b7280' }}>Groq · Llama 3.1</div>
        </div>
      </div>
      <p style={{ fontSize: 10, color: '#9ca3af', lineHeight: 1.6 }}>
        ✨ Summarized in 0.8s — key insights extracted from your saved content automatically.
      </p>
    </div>
  );
}

function ContentTypesCard() {
  const types = [
    { icon: '🐦', label: 'Tweet',    color: '#38bdf8' },
    { icon: '🎬', label: 'YouTube',  color: '#f87171' },
    { icon: '📄', label: 'Document', color: '#34d399' },
    { icon: '🔗', label: 'Link',     color: '#fbbf24' },
  ];
  return (
    <div className="landing-float-card landing-types-card">
      <div style={{ fontSize: 11, fontWeight: 600, color: '#6b7280', marginBottom: 10 }}>
        Content Types
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 7 }}>
        {types.map(t => (
          <div key={t.label} style={{
            display: 'flex', alignItems: 'center', gap: 6,
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: 8, padding: '6px 9px',
          }}>
            <span style={{ fontSize: 14 }}>{t.icon}</span>
            <span style={{ fontSize: 10, color: t.color, fontWeight: 500 }}>{t.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function BrainShareCard() {
  return (
    <div className="landing-float-card landing-share-card">
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
        <span style={{ fontSize: 16 }}>🔗</span>
        <span style={{ fontSize: 11, fontWeight: 600, color: '#f1f5f9' }}>Share Brain</span>
        <span style={{
          marginLeft: 'auto', fontSize: 9, background: 'rgba(16,185,129,0.15)',
          color: '#34d399', border: '1px solid rgba(16,185,129,0.25)',
          padding: '2px 7px', borderRadius: 20, fontWeight: 600
        }}>LIVE</span>
      </div>
      <div style={{
        background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.15)',
        borderRadius: 7, padding: '5px 9px',
        fontSize: 9, color: '#6b7280', fontFamily: 'monospace', letterSpacing: '0.03em'
      }}>
        synapseai.app/brain/a3f9d2…
      </div>
      <p style={{ fontSize: 10, color: '#6b7280', marginTop: 7, lineHeight: 1.5 }}>
        Public read-only link · No sign-in needed
      </p>
    </div>
  );
}

/* ─── Stats ─── */
const STATS = [
  { value: '5+',    label: 'Content Types' },
  { value: '2',     label: 'AI Models' },
  { value: '∞',     label: 'Shareable Brains' },
  { value: '100%',  label: 'Open Source' },
];

/* ═══════════════════════════════ MAIN PAGE ═══════════════════════════════ */
export function LandingPage() {
  const navigate = useNavigate();

  const featuresReveal = useReveal();
  const statsReveal    = useReveal();
  const ctaReveal      = useReveal();

  return (
    <div style={{ background: '#000', minHeight: '100vh', fontFamily: "'Inter', system-ui, sans-serif", overflowX: 'hidden' }}>

      {/* ── NAVBAR ── */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        background: 'rgba(0,0,0,0.75)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 40px', height: 62,
      }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 32, height: 32, borderRadius: 9,
            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 17, boxShadow: '0 0 16px rgba(16,185,129,0.35)',
          }}>🧠</div>
          <span style={{ fontSize: 16, fontWeight: 700, color: '#f1f5f9', letterSpacing: '-0.02em' }}>
            Synapse<span style={{ color: '#10b981' }}>AI</span>
          </span>
        </div>

        {/* Nav links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 32 }} className="landing-nav-links">
          {['Features', 'How it Works', 'GitHub'].map(l => (
            <a key={l} href={`#${l.toLowerCase().replace(/ /g, '-')}`} style={{
              fontSize: 13, color: '#9ca3af', textDecoration: 'none', fontWeight: 500,
              transition: 'color 0.2s',
            }}
            onMouseEnter={e => (e.currentTarget.style.color = '#f1f5f9')}
            onMouseLeave={e => (e.currentTarget.style.color = '#9ca3af')}>
              {l}
            </a>
          ))}
        </div>

        {/* CTA buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button
            className="btn btn-ghost btn-sm"
            onClick={() => navigate('/login')}
          >
            Sign in
          </button>
          <button
            className="btn btn-primary btn-sm"
            onClick={() => navigate('/signup')}
            style={{ borderRadius: 8 }}
          >
            Get Started →
          </button>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section style={{
        minHeight: '100vh',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        position: 'relative',
        paddingTop: 62,
        overflow: 'hidden',
      }}>
        {/* Dotted grid background */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.07) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
          maskImage: 'radial-gradient(ellipse 80% 80% at 50% 50%, black 40%, transparent 100%)',
          WebkitMaskImage: 'radial-gradient(ellipse 80% 80% at 50% 50%, black 40%, transparent 100%)',
        }} />

        {/* Green radial glow */}
        <div style={{
          position: 'absolute', top: '30%', left: '50%',
          transform: 'translateX(-50%)',
          width: 600, height: 600,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(16,185,129,0.1) 0%, transparent 65%)',
          pointerEvents: 'none',
        }} />

        {/* Floating cards – left */}
        <div style={{ position: 'absolute', left: '5%', top: '18%' }} className="anim-float">
          <NoteCard />
        </div>
        <div style={{ position: 'absolute', left: '7%', bottom: '18%', animationDelay: '1.5s' }} className="anim-float">
          <ContentTypesCard />
        </div>

        {/* Floating cards – right */}
        <div style={{ position: 'absolute', right: '5%', top: '15%' }} className="anim-float">
          <AiSummaryCard />
        </div>
        <div style={{ position: 'absolute', right: '6%', bottom: '20%' }} className="anim-float">
          <BrainShareCard />
        </div>

        {/* Hero center content */}
        <div style={{ position: 'relative', textAlign: 'center', maxWidth: 680, padding: '0 24px', zIndex: 2 }}>
          {/* Badge */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 7,
            background: 'rgba(16,185,129,0.08)',
            border: '1px solid rgba(16,185,129,0.2)',
            borderRadius: 50, padding: '5px 14px',
            marginBottom: 28,
            animation: 'fadeUp 0.6s ease both',
          }}>
            <span style={{ fontSize: 12 }}>✨</span>
            <span style={{ fontSize: 12, color: '#34d399', fontWeight: 500 }}>
              AI-Powered Second Brain
            </span>
          </div>

          {/* Headline */}
          <h1 style={{
            fontSize: 'clamp(2.6rem, 6vw, 4.2rem)',
            fontWeight: 800,
            lineHeight: 1.08,
            letterSpacing: '-0.04em',
            color: '#f1f5f9',
            marginBottom: 8,
            animation: 'fadeUp 0.6s 0.1s ease both',
          }}>
            Capture, organise,
          </h1>
          <h1 style={{
            fontSize: 'clamp(2.6rem, 6vw, 4.2rem)',
            fontWeight: 800,
            lineHeight: 1.08,
            letterSpacing: '-0.04em',
            color: '#6b7280',
            marginBottom: 28,
            animation: 'fadeUp 0.6s 0.18s ease both',
          }}>
            and think smarter
          </h1>

          {/* Subtext */}
          <p style={{
            fontSize: 16, color: '#6b7280', lineHeight: 1.7,
            maxWidth: 500, margin: '0 auto 40px',
            animation: 'fadeUp 0.6s 0.26s ease both',
          }}>
            SynapseAI is your personal knowledge hub — save tweets, videos,
            articles, and notes, then let AI summarize and surface what matters.
          </p>

          {/* CTA buttons */}
          <div style={{
            display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap',
            animation: 'fadeUp 0.6s 0.34s ease both',
          }}>
            <button
              className="btn btn-primary btn-lg"
              onClick={() => navigate('/signup')}
              style={{ borderRadius: 12, minWidth: 180 }}
            >
              🧠 Start for free
            </button>
            <button
              className="btn btn-ghost btn-lg"
              onClick={() => navigate('/login')}
              style={{ borderRadius: 12 }}
            >
              Sign in →
            </button>
          </div>
        </div>
      </section>

      {/* ── STATS STRIP ── */}
      <div ref={statsReveal.ref} className={`blur-reveal ${statsReveal.visible ? 'visible' : ''}`} style={{
        borderTop: '1px solid rgba(255,255,255,0.05)',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
        background: 'rgba(255,255,255,0.01)',
        padding: '36px 40px',
        display: 'flex', justifyContent: 'center', gap: '8%',
        flexWrap: 'wrap',
      }}>
        {STATS.map((s) => (
          <div key={s.label} style={{ textAlign: 'center', minWidth: 100 }}>
            <div style={{ fontSize: 36, fontWeight: 800, color: '#10b981', letterSpacing: '-0.03em' }}>
              {s.value}
            </div>
            <div style={{ fontSize: 12, color: '#6b7280', marginTop: 4, textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>
              {s.label}
            </div>
          </div>
        ))}
      </div>

      {/* ── BENTO FEATURES GRID ── */}
      <section id="features" style={{ padding: '100px 40px', maxWidth: 1200, margin: '0 auto' }}>
        <div ref={featuresReveal.ref} className={`blur-reveal ${featuresReveal.visible ? 'visible' : ''}`} style={{
          textAlign: 'center', marginBottom: 60
        }}>
          <p style={{ fontSize: 12, color: '#10b981', fontWeight: 600, letterSpacing: '0.1em', marginBottom: 12, textTransform: 'uppercase' }}>
            Everything you need
          </p>
          <h2 style={{ fontSize: 'clamp(1.8rem,4vw,2.8rem)', fontWeight: 800, color: '#f1f5f9', letterSpacing: '-0.03em', marginBottom: 14 }}>
            Your brain, supercharged
          </h2>
          <p style={{ fontSize: 15, color: '#6b7280', maxWidth: 480, margin: '0 auto' }}>
            A premium toolkit designed to build, organize, and seamlessly share your personal knowledge base.
          </p>
        </div>

        <div className="bento-container">
          {/* Main Feature - Span 2 */}
          <div className="bento-card bento-span-2">
            <div style={{ position: 'relative', zIndex: 2 }}>
              <div style={{
                width: 48, height: 48, borderRadius: 12,
                background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.3)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, marginBottom: 20
              }}>🤖</div>
              <h3 style={{ fontSize: 22, fontWeight: 700, color: '#f1f5f9', marginBottom: 10, letterSpacing: '-0.01em' }}>
                AI-Powered Summaries
              </h3>
              <p style={{ fontSize: 14, color: '#9ca3af', lineHeight: 1.6, maxWidth: '80%' }}>
                Instantly summarize any saved content using Groq (Llama 3.1) with Gemini as a lightning-fast fallback. Cut through the noise and get straight to the essence of your articles and videos.
              </p>
            </div>
            {/* Visual element */}
            <div style={{ position: 'absolute', bottom: -30, right: -20, opacity: 0.6, transform: 'rotate(-5deg)', pointerEvents: 'none' }}>
               <AiSummaryCard />
            </div>
          </div>

          {/* Feature 2 */}
          <div className="bento-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
            <div style={{
              width: 48, height: 48, borderRadius: 12,
              background: 'rgba(52,211,153,0.15)', border: '1px solid rgba(52,211,153,0.3)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, marginBottom: 16
            }}>📌</div>
            <h3 style={{ fontSize: 18, fontWeight: 700, color: '#f1f5f9', marginBottom: 10, letterSpacing: '-0.01em' }}>
              Pin & Organize
            </h3>
            <p style={{ fontSize: 13, color: '#9ca3af', lineHeight: 1.6 }}>
              Keep your most crucial insights pinned to the top. Filter effortlessly by tags and types.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="bento-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <div style={{
              width: 48, height: 48, borderRadius: 12,
              background: 'rgba(56,189,248,0.15)', border: '1px solid rgba(56,189,248,0.3)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, marginBottom: 16
            }}>🐦</div>
            <h3 style={{ fontSize: 18, fontWeight: 700, color: '#f1f5f9', marginBottom: 10, letterSpacing: '-0.01em' }}>
              5 Content Types
            </h3>
            <p style={{ fontSize: 13, color: '#9ca3af', lineHeight: 1.6 }}>
              Save Tweets, YouTube videos, long-form documents, links, and quick text notes natively.
            </p>
          </div>

          {/* Feature 4 - Span 2 */}
          <div className="bento-card bento-span-2" style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
            <div style={{ flex: 1, position: 'relative', zIndex: 2, paddingRight: 40 }}>
              <div style={{
                width: 48, height: 48, borderRadius: 12,
                background: 'rgba(251,191,36,0.15)', border: '1px solid rgba(251,191,36,0.3)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, marginBottom: 16
              }}>🔗</div>
              <h3 style={{ fontSize: 22, fontWeight: 700, color: '#f1f5f9', marginBottom: 10, letterSpacing: '-0.01em' }}>
                Share Your Brain
              </h3>
              <p style={{ fontSize: 14, color: '#9ca3af', lineHeight: 1.6 }}>
                Generate a secure, read-only public link to your entire curated second brain. Share your knowledge with the world — no signup required for your readers.
              </p>
            </div>
            <div style={{ flex: 1, position: 'relative', display: 'flex', justifyContent: 'center' }}>
               <BrainShareCard />
            </div>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="how-it-works" style={{
        padding: '100px 40px',
        background: 'rgba(255,255,255,0.01)',
        borderTop: '1px solid rgba(255,255,255,0.05)',
      }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 80 }}>
            <p style={{ fontSize: 12, color: '#10b981', fontWeight: 600, letterSpacing: '0.1em', marginBottom: 12, textTransform: 'uppercase' }}>
              Simple workflow
            </p>
            <h2 style={{ fontSize: 'clamp(1.8rem,4vw,2.6rem)', fontWeight: 800, color: '#f1f5f9', letterSpacing: '-0.03em' }}>
              How it works
            </h2>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 0, maxWidth: 600, width: '100%' }}>
              {STEPS.map((step, i) => (
                <StepRow key={step.title} step={step} index={i} isLast={i === STEPS.length - 1} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section style={{
        padding: '120px 40px',
        background: 'radial-gradient(ellipse 70% 60% at 50% 50%, rgba(16,185,129,0.06) 0%, transparent 70%)',
        borderTop: '1px solid rgba(255,255,255,0.05)',
      }}>
        <div ref={ctaReveal.ref} className={`blur-reveal ${ctaReveal.visible ? 'visible' : ''}`} style={{
          textAlign: 'center'
        }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: 'rgba(16,185,129,0.08)',
            border: '1px solid rgba(16,185,129,0.18)',
            borderRadius: 50, padding: '6px 16px', marginBottom: 28,
          }}>
            <span style={{ fontSize: 13 }}>🧠</span>
            <span style={{ fontSize: 12, color: '#34d399', fontWeight: 500 }}>
              Start building your second brain today
            </span>
          </div>

          <h2 style={{
            fontSize: 'clamp(2.2rem,5vw,3.6rem)', fontWeight: 800,
            color: '#f1f5f9', letterSpacing: '-0.04em',
            lineHeight: 1.1, marginBottom: 20,
          }}>
            Ready to think smarter?
          </h2>

          <p style={{ fontSize: 16, color: '#9ca3af', maxWidth: 480, margin: '0 auto 40px', lineHeight: 1.7 }}>
            Join SynapseAI and turn your scattered bookmarks and notes into a beautifully connected, AI-powered knowledge base.
          </p>

          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              className="btn btn-primary btn-lg"
              onClick={() => navigate('/signup')}
              style={{ borderRadius: 12, minWidth: 200, fontSize: 15 }}
            >
              🧠 Create your Brain →
            </button>
            <a
              href="https://github.com/HarshMishra2803/synapseai"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-ghost btn-lg"
              style={{ borderRadius: 12, textDecoration: 'none' }}
            >
              ⭐ Star on GitHub
            </a>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{
        borderTop: '1px solid rgba(255,255,255,0.05)',
        padding: '32px 40px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        flexWrap: 'wrap', gap: 16,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 17 }}>🧠</span>
          <span style={{ fontSize: 14, fontWeight: 600, color: '#4b5563' }}>
            Synapse<span style={{ color: '#10b981' }}>AI</span>
          </span>
        </div>
        <div style={{ fontSize: 12, color: '#374151' }}>
          MIT License · Built by{' '}
          <a href="https://github.com/HarshMishra2803" target="_blank" rel="noopener noreferrer"
            style={{ color: '#10b981', textDecoration: 'none' }}>
            Harsh Mishra
          </a>
        </div>
        <div style={{ display: 'flex', gap: 20 }}>
          <a href="https://github.com/HarshMishra2803/synapseai" target="_blank" rel="noopener noreferrer"
            style={{ fontSize: 12, color: '#6b7280', textDecoration: 'none' }}
            onMouseEnter={e => (e.currentTarget.style.color = '#34d399')}
            onMouseLeave={e => (e.currentTarget.style.color = '#6b7280')}
          >GitHub</a>
        </div>
      </footer>

      {/* ── Inline styles for floating cards ── */}
      <style>{`
        .landing-float-card {
          background: rgba(10,10,10,0.85);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 16px;
          padding: 16px;
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          box-shadow: 0 20px 60px rgba(0,0,0,0.5);
          animation: float 5s ease-in-out infinite;
        }
        .landing-note-card  { width: 200px; animation-delay: 0s; }
        .landing-ai-card    { width: 210px; animation-delay: 0.8s; }
        .landing-types-card { width: 196px; animation-delay: 1.4s; }
        .landing-share-card { width: 210px; animation-delay: 0.4s; }

        @media (max-width: 900px) {
          .landing-float-card { display: none !important; }
          .landing-nav-links  { display: none !important; }
        }
        @media (max-width: 600px) {
          nav { padding: 0 20px !important; }
        }
      `}</style>
    </div>
  );
}

/* ─── Steps data ─── */
const STEPS = [
  {
    num: '01',
    icon: '🔐',
    title: 'Create your account',
    desc: 'Sign up in seconds. No credit card, no friction. JWT auth keeps your brain secure.',
  },
  {
    num: '02',
    icon: '➕',
    title: 'Save any content',
    desc: 'Drop in a tweet, YouTube link, article URL, document, or a quick note. SynapseAI stores it all.',
  },
  {
    num: '03',
    icon: '🤖',
    title: 'Let AI summarize',
    desc: 'Hit the AI button on any saved item. Groq (Llama 3.1) instantly extracts the key insights.',
  },
  {
    num: '04',
    icon: '🔗',
    title: 'Share your brain',
    desc: 'Generate a public link to your entire brain — anyone can read it, no sign-in required.',
  },
];

function StepRow({ step, index, isLast }: { step: typeof STEPS[0]; index: number; isLast: boolean }) {
  const { ref, visible } = useReveal();
  return (
    <div ref={ref} className={`blur-reveal ${visible ? 'visible' : ''}`} style={{
      display: 'flex', gap: 24, alignItems: 'flex-start',
      transitionDelay: `${index * 0.15}s`,
      paddingBottom: isLast ? 0 : 40,
      position: 'relative',
    }}>
      {/* Left: number + connector line */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
        <div style={{
          width: 48, height: 48, borderRadius: 14,
          background: 'rgba(16,185,129,0.1)',
          border: '1px solid rgba(16,185,129,0.25)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 22,
        }}>{step.icon}</div>
        {!isLast && (
          <div style={{ width: 2, flex: 1, marginTop: 12, background: 'rgba(16,185,129,0.15)', minHeight: 48 }} />
        )}
      </div>
      {/* Right: text */}
      <div style={{ paddingTop: 8 }}>
        <div style={{ fontSize: 11, color: '#10b981', fontWeight: 700, letterSpacing: '0.1em', marginBottom: 6 }}>
          STEP {step.num}
        </div>
        <h4 style={{ fontSize: 18, fontWeight: 700, color: '#f1f5f9', marginBottom: 8, letterSpacing: '-0.01em' }}>
          {step.title}
        </h4>
        <p style={{ fontSize: 14, color: '#9ca3af', lineHeight: 1.7, maxWidth: 500 }}>{step.desc}</p>
      </div>
    </div>
  );
}
