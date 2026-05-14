import { useState, useEffect, useRef } from 'react';
import { supabase } from './supabaseClient';
import RSVPForm from './RSVPForm';
import { fairyDustCursor } from 'cursor-effects';

// Particles imports
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import Butterfly from './Butterfly';

// --- REUSABLE STYLES ---
const styles = {
  mainWrapper: {
  minHeight: '100vh',
  width: '100vw',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  position: 'relative',
  padding: '20px',
  boxSizing: 'border-box',
  // New Lighter Pastel Palette
  background: `
    radial-gradient(circle at 70% 20%, #f3e5f5 0%, transparent 40%),
    radial-gradient(circle at 10% 80%, #ede7f6 0%, transparent 60%),
    linear-gradient(135deg, #f8f0fb 0%, #e1bee7 50%, #d1c4e9 100%)
  `,
},
  card: {
  background: 'rgba(255, 255, 255, 0.85)',
  padding: '50px 30px',
  borderRadius: '30px',
  textAlign: 'center',
  backdropFilter: 'blur(15px)',
  boxShadow: '0 20px 50px rgba(0,0,0,0.15)',
  maxWidth: '650px',
  width: '100%',
  position: 'relative', 
  zIndex: 10,           // Higher than background canvases
  pointerEvents: 'auto' // Ensures the card captures the mouse
},
  input: {
    padding: '16px',
    borderRadius: '12px',
    border: '2px solid #c1a5d1',
    fontSize: '18px',
    textAlign: 'center',
    marginBottom: '15px',
    width: '100%',
    boxSizing: 'border-box',
    outline: 'none',
    fontFamily: 'inherit'
  },
  button: {
    padding: '16px',
    background: 'linear-gradient(45deg, #a389b3, #836197)',
    color: 'white',
    border: 'none',
    borderRadius: '12px',
    cursor: 'pointer',
    fontWeight: 'bold',
    width: '100%',
    fontSize: '18px',
    fontFamily: '"Cinzel Decorative", cursive',
    transition: 'all 0.3s ease'
  }
};

function App() {
  const [access, setAccess] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [particlesInit, setParticlesInit] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);
  const passcodeRef = useRef(null);

  // Initialize Particles
  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => setParticlesInit(true));
  }, []);

  // Initialize Glitter on the passcode input
useEffect(() => {
  // Initialize the glitter globally
  const effect = fairyDustCursor({
    colors: ['#ffffff', '#d4bce2', '#836197'],
    // If the library supports it, you can sometimes adjust particle rate here
  });

  return () => {
    if (effect && typeof effect.destroy === 'function') {
      effect.destroy();
    }
  };
}, []); // Empty array = Permanent magic throughout the app

  // Check for session
  useEffect(() => {
    const saved = sessionStorage.getItem('birthday_access');
    if (saved === 'true') setAccess(true);
    setCheckingSession(false);
  }, []);

  const handleUnlock = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { data } = await supabase
        .from('app_config')
        .select('key_value')
        .eq('key_name', 'invite_passcode')
        .eq('key_value', passcode.trim())
        .single();

      if (data) {
        setAccess(true);
        sessionStorage.setItem('birthday_access', 'true');
      } else {
        setError('The mystical portal remains closed. Try again! ✨');
      }
    } catch (err) {
      setError('Connection with the fairy realm lost.');
    } finally {
      setLoading(false);
    }
  };

  const particlesOptions = {
    fullScreen: {
      enable: true,
      zIndex: 0 // Keep particles behind the card
    },
    background: { color: { value: "transparent" } },
    interactivity: {
      detectsOn: "window", // Ensure it doesn't "capture" the mouse
    },
    particles: {
      color: { value: ["#ffffff", "#d4bce2"] },
      move: { direction: "top", enable: true, speed: 0.7, random: true },
      number: { value: 120, density: { enable: true } },
      opacity: { value: { min: 0.2, max: 0.8 }, animation: { enable: true, speed: 1 } },
      size: { value: { min: 1, max: 4 } },
      shadow: { enable: true, color: "#fff", blur: 10 }
    }
  };

  if (checkingSession) return null;

  return (
    <div style={styles.mainWrapper}>
      {/* 1. LAYER 0: The Butterfly & Particle Backgrounds (Pointer events DISABLED) */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none' }}>
        <Butterfly />
        {particlesInit && <Particles options={particlesOptions} />}
      </div>

      {/* 2. LAYER 10: The Interactive Content (Pointer events ENABLED) */}
      {!access ? (
        <div
          ref={passcodeRef} // The glitter cursor attaches here
          style={{ ...styles.card, maxWidth: '400px', position: 'relative', zIndex: 10 }}
        >
          <span style={{ fontSize: '70px' }}>🧚‍♀️</span>
          <h1 style={{ fontFamily: '"Cinzel Decorative", cursive', color: '#836197' }}>
            A Royal Invitation
          </h1>
          <form onSubmit={handleUnlock} style={{ position: 'relative', zIndex: 11 }}>
            <input
              type="text"
              placeholder="Magic Code"
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
              style={styles.input}
              className="glitter-input"
            />
            <button type="submit" style={styles.button} disabled={loading}>
              {loading ? 'Consulting the Oracle...' : 'Unlock the Magic'}
            </button>
          </form>
          {error && <p style={{ color: '#d9534f', marginTop: '15px' }}>{error}</p>}
        </div>
      ) : (
        <div style={{ ...styles.card, position: 'relative', zIndex: 10 }}>
          <header style={{ marginBottom: '40px' }}>
            <span style={{ fontSize: '80px', display: 'block' }}>✨🎂✨</span>
            <h1 style={{ color: '#836197', fontSize: 'clamp(2rem, 8vw, 3rem)', fontFamily: '"Cinzel Decorative", cursive', margin: '15px 0' }}>
              Our Little Fairy's 1st Birthday
            </h1>
            <p style={{ fontSize: '1.3rem', color: '#555' }}>You are cordially invited to celebrate a year of magic!</p>
          </header>
          <main>
            <RSVPForm />
          </main>
        </div>
      )}
    </div>
  );
}

export default App;