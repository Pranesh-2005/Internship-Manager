import { useState, useEffect, useRef } from "react";

const API = "https://nternship-anager-pranesh-20059066-nugas0bw.apn.leapcell.dev";

// ─── Styles ──────────────────────────────────────────────────────────────────
const css = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;1,9..40,300&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg:        #080c14;
    --surface:   #0d1422;
    --glass:     rgba(255,255,255,0.04);
    --border:    rgba(255,255,255,0.08);
    --teal:      #00e5c3;
    --teal-dim:  rgba(0,229,195,0.12);
    --amber:     #ffb83f;
    --amber-dim: rgba(255,184,63,0.12);
    --rose:      #ff5f7e;
    --rose-dim:  rgba(255,95,126,0.12);
    --text:      #e8edf5;
    --muted:     #5a6a82;
    --font-head: 'Syne', sans-serif;
    --font-body: 'DM Sans', sans-serif;
    --radius:    16px;
    --shadow:    0 24px 64px rgba(0,0,0,0.5);
  }

  body {
    background: var(--bg);
    color: var(--text);
    font-family: var(--font-body);
    min-height: 100vh;
    overflow-x: hidden;
  }

  /* Ambient blobs */
  .blob {
    position: fixed;
    border-radius: 50%;
    filter: blur(120px);
    pointer-events: none;
    z-index: 0;
    animation: drift 18s ease-in-out infinite alternate;
  }
  .blob-1 { width:600px;height:600px;background:rgba(0,229,195,0.07);top:-200px;left:-200px; }
  .blob-2 { width:500px;height:500px;background:rgba(255,184,63,0.06);bottom:-150px;right:-100px;animation-delay:-9s; }
  .blob-3 { width:400px;height:400px;background:rgba(255,95,126,0.05);top:40%;left:40%;animation-delay:-4s; }

  @keyframes drift {
    from { transform: translate(0,0) scale(1); }
    to   { transform: translate(40px,30px) scale(1.05); }
  }

  /* ─── Page wrapper ─── */
  .page {
    position: relative;
    z-index: 1;
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 32px 16px;
    animation: fadeUp 0.5s ease both;
  }
  @keyframes fadeUp {
    from { opacity:0; transform:translateY(24px); }
    to   { opacity:1; transform:translateY(0); }
  }

  /* ─── Auth Card ─── */
  .auth-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 24px;
    padding: 48px 40px;
    width: 100%;
    max-width: 420px;
    box-shadow: var(--shadow), inset 0 1px 0 rgba(255,255,255,0.06);
    position: relative;
    overflow: hidden;
  }
  .auth-card::before {
    content:'';
    position:absolute;
    top:0;left:0;right:0;
    height:2px;
    background: linear-gradient(90deg, var(--teal), var(--amber));
    border-radius:24px 24px 0 0;
  }
  .auth-logo {
    font-family: var(--font-head);
    font-size: 13px;
    font-weight: 700;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    color: var(--teal);
    margin-bottom: 32px;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .auth-logo svg { flex-shrink:0; }
  .auth-title {
    font-family: var(--font-head);
    font-size: 32px;
    font-weight: 800;
    line-height: 1.1;
    margin-bottom: 8px;
  }
  .auth-sub {
    color: var(--muted);
    font-size: 14px;
    margin-bottom: 36px;
    font-weight: 300;
  }

  /* ─── Inputs ─── */
  .field { margin-bottom: 18px; }
  .field label {
    display: block;
    font-size: 12px;
    font-weight: 500;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--muted);
    margin-bottom: 8px;
  }
  .field input {
    width: 100%;
    padding: 14px 16px;
    background: var(--glass);
    border: 1px solid var(--border);
    border-radius: 10px;
    color: var(--text);
    font-family: var(--font-body);
    font-size: 15px;
    transition: border-color 0.2s, background 0.2s, box-shadow 0.2s;
    outline: none;
  }
  .field input:focus {
    border-color: var(--teal);
    background: rgba(0,229,195,0.04);
    box-shadow: 0 0 0 3px rgba(0,229,195,0.1);
  }
  .field input::placeholder { color: var(--muted); }

  /* ─── Buttons ─── */
  .btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 14px 24px;
    border-radius: 10px;
    font-family: var(--font-head);
    font-size: 14px;
    font-weight: 700;
    letter-spacing: 0.04em;
    cursor: pointer;
    border: none;
    transition: transform 0.15s, box-shadow 0.15s, opacity 0.15s;
    position: relative;
    overflow: hidden;
  }
  .btn:active { transform: scale(0.97); }
  .btn:disabled { opacity: 0.5; cursor: not-allowed; }

  .btn-primary {
    background: linear-gradient(135deg, var(--teal) 0%, #00b8a2 100%);
    color: #080c14;
    width: 100%;
    box-shadow: 0 8px 24px rgba(0,229,195,0.25);
  }
  .btn-primary:hover:not(:disabled) { box-shadow: 0 12px 32px rgba(0,229,195,0.4); transform: translateY(-1px); }

  .btn-ghost {
    background: var(--glass);
    border: 1px solid var(--border);
    color: var(--text);
  }
  .btn-ghost:hover { background: rgba(255,255,255,0.07); border-color: rgba(255,255,255,0.15); }

  .btn-amber {
    background: linear-gradient(135deg, var(--amber), #e09800);
    color: #080c14;
    box-shadow: 0 6px 20px rgba(255,184,63,0.25);
  }
  .btn-amber:hover:not(:disabled) { box-shadow: 0 10px 28px rgba(255,184,63,0.4); transform: translateY(-1px); }

  .btn-rose {
    background: linear-gradient(135deg, var(--rose), #d94060);
    color: #fff;
    box-shadow: 0 6px 20px rgba(255,95,126,0.25);
  }
  .btn-rose:hover:not(:disabled) { box-shadow: 0 10px 28px rgba(255,95,126,0.4); transform: translateY(-1px); }

  .btn-sm { padding: 8px 16px; font-size: 12px; border-radius: 8px; }

  .auth-switch {
    margin-top: 24px;
    text-align: center;
    font-size: 13px;
    color: var(--muted);
  }
  .auth-switch a {
    color: var(--teal);
    cursor: pointer;
    font-weight: 500;
    text-decoration: none;
  }
  .auth-switch a:hover { text-decoration: underline; }

  /* ─── Toast ─── */
  .toast-wrap {
    position: fixed;
    top: 24px;
    right: 24px;
    z-index: 1000;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  .toast {
    padding: 14px 20px;
    border-radius: 12px;
    font-size: 14px;
    font-weight: 500;
    border: 1px solid;
    backdrop-filter: blur(20px);
    animation: slideIn 0.3s ease both;
    max-width: 320px;
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .toast-success { background: rgba(0,229,195,0.12); border-color: rgba(0,229,195,0.3); color: var(--teal); }
  .toast-error   { background: rgba(255,95,126,0.12); border-color: rgba(255,95,126,0.3); color: var(--rose); }
  .toast-info    { background: rgba(255,184,63,0.12); border-color: rgba(255,184,63,0.3); color: var(--amber); }
  @keyframes slideIn {
    from { opacity:0; transform: translateX(24px); }
    to   { opacity:1; transform: translateX(0); }
  }

  /* ─── Dashboard shell ─── */
  .dash-shell {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    position: relative;
    z-index: 1;
    animation: fadeUp 0.4s ease both;
  }
  .topbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 20px 32px;
    border-bottom: 1px solid var(--border);
    background: rgba(8,12,20,0.8);
    backdrop-filter: blur(20px);
    position: sticky;
    top: 0;
    z-index: 100;
  }
  .topbar-logo {
    font-family: var(--font-head);
    font-size: 18px;
    font-weight: 800;
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .topbar-logo span { color: var(--teal); }
  .topbar-right {
    display: flex;
    align-items: center;
    gap: 12px;
  }
  .user-pill {
    display: flex;
    align-items: center;
    gap: 8px;
    background: var(--glass);
    border: 1px solid var(--border);
    border-radius: 100px;
    padding: 6px 14px 6px 6px;
    font-size: 13px;
    font-weight: 500;
  }
  .user-avatar {
    width: 28px;
    height: 28px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: var(--font-head);
    font-size: 12px;
    font-weight: 800;
    background: linear-gradient(135deg, var(--teal), var(--amber));
    color: #080c14;
    flex-shrink: 0;
  }
  .role-badge {
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    padding: 2px 8px;
    border-radius: 100px;
  }
  .role-admin { background: var(--amber-dim); color: var(--amber); border: 1px solid rgba(255,184,63,0.2); }
  .role-student { background: var(--teal-dim); color: var(--teal); border: 1px solid rgba(0,229,195,0.2); }

  /* ─── Tabs ─── */
  .tab-bar {
    display: flex;
    gap: 4px;
    padding: 24px 32px 0;
    border-bottom: 1px solid var(--border);
    background: transparent;
  }
  .tab {
    padding: 10px 20px;
    border-radius: 10px 10px 0 0;
    font-family: var(--font-head);
    font-size: 13px;
    font-weight: 700;
    letter-spacing: 0.04em;
    color: var(--muted);
    cursor: pointer;
    border: none;
    background: transparent;
    transition: color 0.2s, background 0.2s;
    display: flex;
    align-items: center;
    gap: 7px;
    position: relative;
    bottom: -1px;
    border-bottom: 2px solid transparent;
  }
  .tab:hover { color: var(--text); }
  .tab.active {
    color: var(--teal);
    border-bottom: 2px solid var(--teal);
    background: var(--teal-dim);
  }
  .tab-count {
    background: var(--glass);
    border: 1px solid var(--border);
    border-radius: 100px;
    padding: 1px 7px;
    font-size: 10px;
    font-weight: 700;
  }
  .tab.active .tab-count { background: var(--teal-dim); border-color: rgba(0,229,195,0.3); color: var(--teal); }

  /* ─── Content ─── */
  .dash-content { padding: 32px; flex: 1; }

  /* ─── Upload panel ─── */
  .upload-panel {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    padding: 28px;
    margin-bottom: 32px;
    position: relative;
    overflow: hidden;
  }
  .upload-panel::before {
    content:'';
    position:absolute;
    top:0;left:0;right:0;
    height:2px;
    background: linear-gradient(90deg, var(--teal), transparent);
  }
  .panel-title {
    font-family: var(--font-head);
    font-size: 16px;
    font-weight: 700;
    margin-bottom: 20px;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .upload-grid {
    display: grid;
    grid-template-columns: 1fr 1fr auto;
    gap: 12px;
    align-items: end;
  }
  @media (max-width: 640px) {
    .upload-grid { grid-template-columns: 1fr; }
  }
  .file-drop {
    position: relative;
    border: 2px dashed var(--border);
    border-radius: 10px;
    padding: 20px;
    text-align: center;
    cursor: pointer;
    transition: border-color 0.2s, background 0.2s;
    background: var(--glass);
  }
  .file-drop:hover, .file-drop.drag-over {
    border-color: var(--teal);
    background: var(--teal-dim);
  }
  .file-drop input[type=file] {
    position: absolute; inset: 0; opacity: 0; cursor: pointer; width: 100%; height: 100%;
  }
  .file-drop-label { font-size: 13px; color: var(--muted); pointer-events: none; }
  .file-drop-label strong { color: var(--teal); }
  .file-chosen { font-size: 12px; color: var(--teal); margin-top: 4px; font-weight: 500; }

  /* ─── Cards grid ─── */
  .cards-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
    gap: 20px;
  }
  .intern-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    padding: 24px;
    transition: transform 0.2s, box-shadow 0.2s, border-color 0.2s;
    animation: fadeUp 0.4s ease both;
    position: relative;
    overflow: hidden;
  }
  .intern-card:hover {
    transform: translateY(-3px);
    box-shadow: 0 16px 48px rgba(0,0,0,0.4);
    border-color: rgba(255,255,255,0.12);
  }
  .intern-card::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 3px;
  }
  .card-approved::before { background: linear-gradient(90deg, var(--teal), transparent); }
  .card-pending::before  { background: linear-gradient(90deg, var(--amber), transparent); }
  .card-rejected::before { background: linear-gradient(90deg, var(--rose), transparent); }
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 16px;
  }
  .card-company {
    font-family: var(--font-head);
    font-size: 18px;
    font-weight: 700;
    line-height: 1.2;
  }
  .card-user { font-size: 12px; color: var(--muted); margin-top: 4px; font-weight: 300; }
  .status-chip {
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    padding: 4px 12px;
    border-radius: 100px;
    flex-shrink: 0;
  }
  .chip-approved { background: var(--teal-dim); color: var(--teal); border: 1px solid rgba(0,229,195,0.25); }
  .chip-pending  { background: var(--amber-dim); color: var(--amber); border: 1px solid rgba(255,184,63,0.25); }
  .chip-rejected { background: var(--rose-dim); color: var(--rose); border: 1px solid rgba(255,95,126,0.25); }

  .card-meta {
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin-bottom: 16px;
  }
  .meta-row {
    display: flex;
    gap: 8px;
    font-size: 13px;
  }
  .meta-label {
    color: var(--muted);
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    flex-shrink: 0;
    padding-top: 1px;
    min-width: 52px;
  }
  .meta-value { color: var(--text); line-height: 1.5; font-weight: 300; }
  .ai-good { color: var(--teal); font-weight: 500; }
  .ai-bad  { color: var(--rose); font-weight: 500; }

  .card-divider { border: none; border-top: 1px solid var(--border); margin: 16px 0; }
  .card-actions { display: flex; gap: 8px; }

  /* Extracted text block */
  .extracted-block {
    background: rgba(0,0,0,0.3);
    border: 1px solid var(--border);
    border-radius: 8px;
    padding: 10px 14px;
    font-size: 12px;
    color: var(--muted);
    font-family: 'DM Mono', monospace;
    max-height: 80px;
    overflow: hidden;
    position: relative;
    line-height: 1.6;
    margin-bottom: 12px;
  }
  .extracted-block::after {
    content: '';
    position: absolute;
    bottom: 0; left: 0; right: 0;
    height: 30px;
    background: linear-gradient(transparent, rgba(13,20,34,0.95));
  }

  /* ─── Empty state ─── */
  .empty-state {
    text-align: center;
    padding: 80px 20px;
    color: var(--muted);
  }
  .empty-state svg { opacity: 0.3; margin-bottom: 16px; }
  .empty-state h3 { font-family: var(--font-head); font-size: 20px; color: var(--text); margin-bottom: 8px; }
  .empty-state p { font-size: 14px; font-weight: 300; }

  /* ─── Loading ─── */
  .spinner {
    width: 32px; height: 32px;
    border: 3px solid var(--border);
    border-top-color: var(--teal);
    border-radius: 50%;
    animation: spin 0.7s linear infinite;
    margin: 60px auto;
  }
  @keyframes spin { to { transform: rotate(360deg); } }

  /* ─── Stats bar ─── */
  .stats-bar {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 16px;
    margin-bottom: 28px;
  }
  .stat-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    padding: 20px 24px;
    position: relative;
    overflow: hidden;
  }
  .stat-num {
    font-family: var(--font-head);
    font-size: 36px;
    font-weight: 800;
    line-height: 1;
    margin-bottom: 6px;
  }
  .stat-label { font-size: 12px; color: var(--muted); font-weight: 500; letter-spacing: 0.05em; }
  .stat-card:nth-child(1) .stat-num { color: var(--teal); }
  .stat-card:nth-child(2) .stat-num { color: var(--amber); }
  .stat-card:nth-child(3) .stat-num { color: var(--rose); }
  .stat-glow {
    position: absolute;
    width: 80px; height: 80px;
    border-radius: 50%;
    right: -20px; top: -20px;
    filter: blur(30px);
    opacity: 0.3;
  }
  .stat-card:nth-child(1) .stat-glow { background: var(--teal); }
  .stat-card:nth-child(2) .stat-glow { background: var(--amber); }
  .stat-card:nth-child(3) .stat-glow { background: var(--rose); }

  /* Animation delays */
  .intern-card:nth-child(1){animation-delay:0s}
  .intern-card:nth-child(2){animation-delay:.05s}
  .intern-card:nth-child(3){animation-delay:.1s}
  .intern-card:nth-child(4){animation-delay:.15s}
  .intern-card:nth-child(5){animation-delay:.2s}
  .intern-card:nth-child(6){animation-delay:.25s}
`;

// ─── Toast system ─────────────────────────────────────────────────────────────
let _toastId = 0;
function useToast() {
  const [toasts, setToasts] = useState([]);
  const add = (msg, type = "info") => {
    const id = ++_toastId;
    setToasts(t => [...t, { id, msg, type }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 3500);
  };
  return { toasts, toast: { success: m => add(m,"success"), error: m => add(m,"error"), info: m => add(m,"info") } };
}
const ToastIcon = { success:"✓", error:"✕", info:"!" };

// ─── Icons ────────────────────────────────────────────────────────────────────
const Logo = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
const UploadIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
  </svg>
);
const LogoutIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
  </svg>
);
const FileIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{display:'block',margin:'0 auto 8px'}}>
    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/>
  </svg>
);
const EmptyIcon = () => (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" style={{display:'block',margin:'0 auto'}}>
    <rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/>
  </svg>
);

// ─── Helpers ──────────────────────────────────────────────────────────────────
const statusChip = s => {
  const map = { approved:"chip-approved", rejected:"chip-rejected", pending:"chip-pending" };
  return <span className={`status-chip ${map[s] || "chip-pending"}`}>{s || "pending"}</span>;
};
const cardClass = s => `intern-card card-${s||"pending"}`;
const aiClass = v => v?.toLowerCase().includes("genuine") || v?.toLowerCase().includes("valid") || v?.toLowerCase().includes("real") ? "ai-good" : "ai-bad";

// ─── LOGIN ─────────────────────────────────────────────────────────────────────
function LoginPage({ onLogin, onRegister, toast }) {
  const [u, setU] = useState(""); const [p, setP] = useState(""); const [loading, setLoading] = useState(false);
  const submit = async () => {
    if (!u || !p) { toast.error("Fill in all fields"); return; }
    setLoading(true);
    try {
      const res = await fetch(`${API}/auth/login`, { method:"POST", headers:{"Content-Type":"application/json"}, body: JSON.stringify({username:u,password:p}) });
      const data = await res.json();
      if (data.username) { toast.success(`Welcome back, ${data.username}!`); onLogin(data); }
      else { toast.error("Invalid credentials"); }
    } catch { toast.error("Server unreachable"); }
    setLoading(false);
  };
  return (
    <div className="page">
      <div className="auth-card">
        <div className="auth-logo"><Logo /> InternManager</div>
        <div className="auth-title">Sign in to your<br/>account</div>
        <div className="auth-sub">Manage internship submissions with ease.</div>
        <div className="field"><label>Roll No / Admin ID</label><input value={u} onChange={e=>setU(e.target.value)} placeholder="e.g. 22CS001 or admin" onKeyDown={e=>e.key==="Enter"&&submit()}/></div>
        <div className="field"><label>Password</label><input type="password" value={p} onChange={e=>setP(e.target.value)} placeholder="••••••••" onKeyDown={e=>e.key==="Enter"&&submit()}/></div>
        <button className="btn btn-primary" onClick={submit} disabled={loading} style={{marginTop:8}}>
          {loading ? "Signing in…" : "Sign In →"}
        </button>
        <div className="auth-switch">Don't have an account? <a onClick={onRegister}>Register here</a></div>
      </div>
    </div>
  );
}

// ─── REGISTER ─────────────────────────────────────────────────────────────────
function RegisterPage({ onBack, toast }) {
  const [u, setU] = useState(""); const [p, setP] = useState(""); const [loading, setLoading] = useState(false);
  const submit = async () => {
    if (!u || !p) { toast.error("Fill in all fields"); return; }
    setLoading(true);
    try {
      await fetch(`${API}/auth/register`, { method:"POST", headers:{"Content-Type":"application/json"}, body: JSON.stringify({username:u,password:p}) });
      toast.success("Account created! Please login."); onBack();
    } catch { toast.error("Registration failed"); }
    setLoading(false);
  };
  return (
    <div className="page">
      <div className="auth-card">
        <div className="auth-logo"><Logo /> InternManager</div>
        <div className="auth-title">Create your<br/>student account</div>
        <div className="auth-sub">Register with your college roll number.</div>
        <div className="field"><label>Roll Number</label><input value={u} onChange={e=>setU(e.target.value)} placeholder="e.g. 22CS001" onKeyDown={e=>e.key==="Enter"&&submit()}/></div>
        <div className="field"><label>Password</label><input type="password" value={p} onChange={e=>setP(e.target.value)} placeholder="Choose a password" onKeyDown={e=>e.key==="Enter"&&submit()}/></div>
        <button className="btn btn-primary" onClick={submit} disabled={loading} style={{marginTop:8}}>
          {loading ? "Creating…" : "Create Account →"}
        </button>
        <div className="auth-switch">Already have an account? <a onClick={onBack}>Sign in</a></div>
      </div>
    </div>
  );
}

// ─── STUDENT DASH ─────────────────────────────────────────────────────────────
function StudentDash({ user, onLogout, toast }) {
  const [tab, setTab] = useState("list");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [company, setCompany] = useState("");
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [drag, setDrag] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/student/my/${user.username}`);
      const d = await res.json(); setData(d);
    } catch { toast.error("Failed to load data"); }
    setLoading(false);
  };
  useEffect(() => { loadData(); }, []);

  const upload = async () => {
    if (!company.trim()) { toast.error("Enter company name"); return; }
    if (!file) { toast.error("Select a document"); return; }
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("username", user.username); fd.append("company_name", company); fd.append("file", file);
      const res = await fetch(`${API}/student/upload`, { method:"POST", body: fd });
      await res.json();
      toast.success("Internship uploaded successfully!");
      setCompany(""); setFile(null); setTab("list"); loadData();
    } catch { toast.error("Upload failed"); }
    setUploading(false);
  };

  const total = data.length;
  const approved = data.filter(d=>d.status==="approved").length;
  const pending = data.filter(d=>!d.status||d.status==="pending").length;

  return (
    <div className="dash-shell">
      <div className="topbar">
        <div className="topbar-logo"><span style={{color:"var(--teal)"}}><Logo/></span> <span>Intern<span style={{color:"var(--teal)"}}>Manager</span></span></div>
        <div className="topbar-right">
          <div className="user-pill">
            <div className="user-avatar">{user.username[0].toUpperCase()}</div>
            {user.username}
            <span className="role-badge role-student">Student</span>
          </div>
          <button className="btn btn-ghost btn-sm" onClick={onLogout}><LogoutIcon/> Logout</button>
        </div>
      </div>

      <div className="tab-bar">
        <button className={`tab ${tab==="list"?"active":""}`} onClick={()=>setTab("list")}>
          📋 My Internships <span className="tab-count">{total}</span>
        </button>
        <button className={`tab ${tab==="upload"?"active":""}`} onClick={()=>setTab("upload")}>
          ⬆ Upload New
        </button>
      </div>

      <div className="dash-content">
        {tab === "list" ? (
          <>
            <div className="stats-bar">
              <div className="stat-card"><div className="stat-glow"/><div className="stat-num">{total}</div><div className="stat-label">Total Submissions</div></div>
              <div className="stat-card"><div className="stat-glow"/><div className="stat-num">{approved}</div><div className="stat-label">Approved</div></div>
              <div className="stat-card"><div className="stat-glow"/><div className="stat-num">{pending}</div><div className="stat-label">Pending Review</div></div>
            </div>
            {loading ? <div className="spinner"/> :
             data.length === 0 ? (
              <div className="empty-state"><EmptyIcon/><h3>No submissions yet</h3><p>Upload your first internship document to get started.</p></div>
            ) : (
              <div className="cards-grid">
                {data.map((item,i) => (
                  <div key={i} className={cardClass(item.status)}>
                    <div className="card-header">
                      <div>
                        <div className="card-company">{item.company_name}</div>
                      </div>
                      {statusChip(item.status)}
                    </div>
                    <div className="card-meta">
                      {item.ai_verdict && <div className="meta-row"><span className="meta-label">AI</span><span className={`meta-value ${aiClass(item.ai_verdict)}`}>{item.ai_verdict}</span></div>}
                      {item.ai_reason && <div className="meta-row"><span className="meta-label">Reason</span><span className="meta-value">{item.ai_reason}</span></div>}
                      {item.rejection_reason && <div className="meta-row"><span className="meta-label">Note</span><span className="meta-value" style={{color:"var(--rose)"}}>{item.rejection_reason}</span></div>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="upload-panel" style={{maxWidth:600}}>
            <div className="panel-title"><UploadIcon/> Upload Internship Certificate</div>
            <div className="field"><label>Company Name</label><input value={company} onChange={e=>setCompany(e.target.value)} placeholder="e.g. Google, Infosys, TCS…"/></div>
            <div className="field">
              <label>Document (PDF / Image)</label>
              <div className={`file-drop ${drag?"drag-over":""}`}
                onDragOver={e=>{e.preventDefault();setDrag(true)}}
                onDragLeave={()=>setDrag(false)}
                onDrop={e=>{e.preventDefault();setDrag(false);setFile(e.dataTransfer.files[0])}}>
                <input type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={e=>setFile(e.target.files[0])}/>
                <FileIcon/>
                <div className="file-drop-label">{file ? <span className="file-chosen">✓ {file.name}</span> : <><strong>Browse files</strong> or drag & drop</>}</div>
              </div>
            </div>
            <button className="btn btn-primary" onClick={upload} disabled={uploading} style={{marginTop:8}}>
              {uploading ? "Uploading…" : <><UploadIcon/> Upload Internship</>}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── ADMIN DASH ───────────────────────────────────────────────────────────────
function AdminDash({ user, onLogout, toast }) {
  const [tab, setTab] = useState("all");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const load = async (filter="all") => {
    setLoading(true);
    const map = { all:"all", approved:"approved", pending:"pending" };
    try {
      const res = await fetch(`${API}/admin/${map[filter]}`);
      const d = await res.json(); setData(d);
    } catch { toast.error("Failed to load"); }
    setLoading(false);
  };
  useEffect(() => { load(tab); }, [tab]);

  const approve = async id => {
    try {
      await fetch(`${API}/admin/approve/${id}`, {method:"POST"});
      toast.success("Approved!"); load(tab);
    } catch { toast.error("Failed to approve"); }
  };
  const reject = async id => {
    const reason = prompt("Enter rejection reason:");
    if (!reason) return;
    try {
      await fetch(`${API}/admin/reject/${id}?reason=${encodeURIComponent(reason)}`, {method:"POST"});
      toast.info("Submission rejected."); load(tab);
    } catch { toast.error("Failed to reject"); }
  };

  const total = data.length;
  const approved = data.filter(d=>d.status==="approved").length;
  const pending = data.filter(d=>!d.status||d.status==="pending").length;

  return (
    <div className="dash-shell">
      <div className="topbar">
        <div className="topbar-logo"><span style={{color:"var(--amber)"}}><Logo/></span> <span>Intern<span style={{color:"var(--amber)"}}>Manager</span></span></div>
        <div className="topbar-right">
          <div className="user-pill">
            <div className="user-avatar" style={{background:"linear-gradient(135deg,var(--amber),var(--rose))"}}>{user.username[0].toUpperCase()}</div>
            {user.username}
            <span className="role-badge role-admin">Admin</span>
          </div>
          <button className="btn btn-ghost btn-sm" onClick={onLogout}><LogoutIcon/> Logout</button>
        </div>
      </div>

      <div className="tab-bar">
        {["all","approved","pending"].map(t => (
          <button key={t} className={`tab ${tab===t?"active":""}`} onClick={()=>setTab(t)}>
            {t==="all"?"📂 All":t==="approved"?"✅ Approved":"⏳ Pending"}
            <span className="tab-count">{t==="all"?total:t==="approved"?approved:pending}</span>
          </button>
        ))}
      </div>

      <div className="dash-content">
        <div className="stats-bar">
          <div className="stat-card"><div className="stat-glow"/><div className="stat-num">{total}</div><div className="stat-label">Total Submissions</div></div>
          <div className="stat-card"><div className="stat-glow"/><div className="stat-num">{approved}</div><div className="stat-label">Approved</div></div>
          <div className="stat-card"><div className="stat-glow"/><div className="stat-num">{pending}</div><div className="stat-label">Awaiting Review</div></div>
        </div>

        {loading ? <div className="spinner"/> :
         data.length === 0 ? (
          <div className="empty-state"><EmptyIcon/><h3>Nothing here</h3><p>No submissions match this filter.</p></div>
         ) : (
          <div className="cards-grid">
            {data.map((item,i) => (
              <div key={i} className={cardClass(item.status)}>
                <div className="card-header">
                  <div>
                    <div className="card-company">{item.company_name}</div>
                    <div className="card-user">👤 {item.username}</div>
                  </div>
                  {statusChip(item.status)}
                </div>
                <div className="card-meta">
                  {item.ai_verdict && <div className="meta-row"><span className="meta-label">AI</span><span className={`meta-value ${aiClass(item.ai_verdict)}`}>{item.ai_verdict}</span></div>}
                  {item.ai_reason && <div className="meta-row"><span className="meta-label">Reason</span><span className="meta-value">{item.ai_reason}</span></div>}
                </div>
                {item.extracted_text && <div className="extracted-block">{item.extracted_text}</div>}
                {item.status === "pending" || !item.status ? (
                  <>
                    <hr className="card-divider"/>
                    <div className="card-actions">
                      <button className="btn btn-amber btn-sm" onClick={()=>approve(item._id)}>✓ Approve</button>
                      <button className="btn btn-rose btn-sm" onClick={()=>reject(item._id)}>✕ Reject</button>
                    </div>
                  </>
                ) : null}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── ROOT APP ─────────────────────────────────────────────────────────────────
export default function App() {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem("user")); } catch { return null; }
  });
  const [view, setView] = useState("login");
  const { toasts, toast } = useToast();

  const handleLogin = u => { localStorage.setItem("user", JSON.stringify(u)); setUser(u); };
  const handleLogout = () => { localStorage.removeItem("user"); setUser(null); setView("login"); };

  return (
    <>
      <style>{css}</style>
      <div className="blob blob-1"/><div className="blob blob-2"/><div className="blob blob-3"/>

      <div className="toast-wrap">
        {toasts.map(t => (
          <div key={t.id} className={`toast toast-${t.type}`}>
            <strong>{ToastIcon[t.type]}</strong> {t.msg}
          </div>
        ))}
      </div>

      {user ? (
        user.role === "admin"
          ? <AdminDash user={user} onLogout={handleLogout} toast={toast}/>
          : <StudentDash user={user} onLogout={handleLogout} toast={toast}/>
      ) : view === "login" ? (
        <LoginPage onLogin={handleLogin} onRegister={()=>setView("register")} toast={toast}/>
      ) : (
        <RegisterPage onBack={()=>setView("login")} toast={toast}/>
      )}
    </>
  );
}
