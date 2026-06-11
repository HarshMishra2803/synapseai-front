import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Brain, Eye, EyeOff, CheckCircle } from 'lucide-react';
import { signup } from '../api';
import { showToast } from '../components/ui/Toast';
import { getErrorMessage } from '../utils/errors';

const REQS = [
  { label: 'At least 6 characters', ok: (p: string) => p.length >= 6 },
  { label: 'Contains a number',      ok: (p: string) => /\d/.test(p) },
];

export function SignupPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPw,   setShowPw]   = useState(false);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (username.trim().length < 3) { setError('Username must be at least 3 characters'); return; }
    if (password.length < 6)        { setError('Password must be at least 6 characters'); return; }
    setLoading(true); setError('');
    try {
      await signup(username.trim(), password);
      showToast('Account created! Sign in now. 🎉', 'success');
      navigate('/login');
    } catch (err) {
      const msg = getErrorMessage(err, 'Signup failed. Please try again.');
      setError(msg);
      showToast(msg, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrap">
      {/* Ambient glow */}
      <div style={{ position:'fixed', bottom:'20%', right:'10%', width:450, height:450, borderRadius:'50%', background:'radial-gradient(circle,rgba(16,185,129,0.07),transparent)', filter:'blur(80px)', pointerEvents:'none' }} />

      <div className="auth-container anim-scale-in">

        {/* ── LEFT PANEL (Form) ─────────────────────────────────── */}
        <div className="auth-panel-form" style={{ order: 1 }}>
          <div style={{ width:'100%', maxWidth:340 }}>
            <h1 style={{ fontSize:22, fontWeight:800, color:'#f1f5f9', marginBottom:6, letterSpacing:'-0.02em' }}>
              Create an <span style={{ color:'#10b981' }}>Account</span>
            </h1>
            <p style={{ fontSize:13, color:'#4b5563', marginBottom:26 }}>
              Already have one?{' '}
              <Link to="/login" style={{ color:'#10b981', textDecoration:'none', fontWeight:500 }}>Sign in →</Link>
            </p>

            <form onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap:14 }}>
              {/* Username */}
              <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
                <label style={{ fontSize:12, fontWeight:600, color:'#6b7280', textTransform:'uppercase', letterSpacing:'0.06em' }}>Username</label>
                <input
                  id="signup-username"
                  className="inp"
                  type="text"
                  placeholder="Choose a username"
                  value={username}
                  onChange={e => { setUsername(e.target.value); setError(''); }}
                  autoComplete="username"
                  autoFocus
                />
              </div>

              {/* Password */}
              <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
                <label style={{ fontSize:12, fontWeight:600, color:'#6b7280', textTransform:'uppercase', letterSpacing:'0.06em' }}>Password</label>
                <div style={{ position:'relative' }}>
                  <input
                    id="signup-password"
                    className="inp"
                    type={showPw ? 'text' : 'password'}
                    placeholder="Create a password"
                    value={password}
                    onChange={e => { setPassword(e.target.value); setError(''); }}
                    autoComplete="new-password"
                    style={{ paddingRight: 42 }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw(v => !v)}
                    style={{ position:'absolute', right:12, top:'50%', transform:'translateY(-50%)', background:'transparent', border:'none', color:'#4b5563', cursor:'pointer', display:'flex', padding:4, transition:'color 0.2s' }}
                    onMouseEnter={e => (e.currentTarget.style.color = '#10b981')}
                    onMouseLeave={e => (e.currentTarget.style.color = '#4b5563')}
                  >
                    {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>

                {/* Password strength */}
                {password && (
                  <div style={{ display:'flex', flexDirection:'column', gap:4, marginTop:4 }}>
                    {REQS.map(r => (
                      <div key={r.label} style={{ display:'flex', alignItems:'center', gap:6 }}>
                        <CheckCircle size={12} color={r.ok(password) ? '#10b981' : '#374151'} />
                        <span style={{ fontSize:11, color: r.ok(password) ? '#34d399' : '#4b5563' }}>{r.label}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Error */}
              {error && (
                <div style={{ padding:'10px 14px', borderRadius:9, background:'rgba(239,68,68,0.08)', border:'1px solid rgba(239,68,68,0.2)', color:'#f87171', fontSize:13 }}>
                  {error}
                </div>
              )}

              {/* Submit */}
              <button
                id="signup-btn"
                type="submit"
                disabled={loading}
                className="btn btn-primary btn-md"
                style={{ width:'100%', marginTop:6, padding:'13px', fontSize:14, letterSpacing:'0.04em', textTransform:'uppercase' }}
              >
                {loading
                  ? <span className="spin" style={{ width:18, height:18, border:'2px solid rgba(255,255,255,0.3)', borderTopColor:'white', borderRadius:'50%', display:'inline-block' }} />
                  : 'Sign Up'
                }
              </button>
            </form>
          </div>
        </div>

        {/* ── RIGHT PANEL (Green) ────────────────────────────────── */}
        <div className="auth-panel-green" style={{ order: 2 }}>
          <div style={{ position:'relative', zIndex:1, textAlign:'center' }}>
            {/* Logo */}
            <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:10, marginBottom:40 }}>
              <div style={{ width:38, height:38, borderRadius:10, background:'rgba(255,255,255,0.2)', border:'1px solid rgba(255,255,255,0.3)', display:'flex', alignItems:'center', justifyContent:'center' }}>
                <Brain size={20} color="white" />
              </div>
              <span style={{ fontSize:16, fontWeight:700, color:'white', letterSpacing:'-0.01em' }}>SynapseAI</span>
            </div>

            <h2 style={{ fontSize:28, fontWeight:800, color:'white', lineHeight:1.2, marginBottom:14, letterSpacing:'-0.02em' }}>
              Hello,<br />Friend!
            </h2>
            <p style={{ fontSize:14, color:'rgba(255,255,255,0.75)', lineHeight:1.6, marginBottom:40, maxWidth:220 }}>
              Enter your personal info and start your journey with SynapseAI
            </p>

            {/* Switch to Login */}
            <Link
              to="/login"
              id="go-login"
              className="btn btn-outline-white btn-md"
              style={{ textDecoration:'none', display:'inline-flex', fontSize:13, letterSpacing:'0.08em', textTransform:'uppercase', fontWeight:700 }}
            >
              Sign In
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
