import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      await login(email, password);
      navigate("/");
    } catch (submissionError) {
      setError(submissionError instanceof Error ? submissionError.message : "Login failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{
      display: 'flex',
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
      color: '#f8fafc',
      fontFamily: '"Inter", "Segoe UI", sans-serif',
    }}>
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '4rem',
        background: 'radial-gradient(circle at top left, rgba(226, 123, 26, 0.15), transparent 50%), radial-gradient(circle at bottom right, rgba(27, 109, 47, 0.15), transparent 50%)',
      }}>
        <div style={{ maxWidth: '480px' }}>
          <img src="/logo.png" alt="Company Logo" style={{ height: '70px', width: 'auto', marginBottom: '2rem', objectFit: 'contain' }} />
          <p style={{ color: '#e27b1a', textTransform: 'uppercase', letterSpacing: '2px', fontSize: '0.8rem', fontWeight: 700, marginBottom: '1rem' }}>E-Commerce Command Center</p>
          <h1 style={{ fontSize: '3.5rem', fontWeight: 800, lineHeight: 1.1, marginBottom: '1.5rem', background: 'linear-gradient(to right, #ffffff, #94a3b8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Elevate Your Store Management.
          </h1>
          <p style={{ fontSize: '1.1rem', color: '#94a3b8', lineHeight: 1.6 }}>
            Seamlessly oversee products, process orders, and manage your entire business operation from a single, beautifully crafted dashboard.
          </p>
        </div>
      </div>
      
      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
        backdropFilter: 'blur(10px)',
        borderLeft: '1px solid rgba(255, 255, 255, 0.05)',
        background: 'rgba(255, 255, 255, 0.02)'
      }}>
        <div style={{
          width: '100%',
          maxWidth: '440px',
          background: 'rgba(15, 23, 42, 0.6)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          padding: '3rem',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
        }}>
          <form style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }} onSubmit={handleSubmit}>
            <div style={{ marginBottom: '1rem' }}>
              <h2 style={{ fontSize: '2rem', margin: '0 0 0.5rem 0', fontWeight: 600 }}>Admin Sign In</h2>
              <p style={{ margin: 0, color: '#94a3b8' }}>Securely access your administrative tools.</p>
            </div>
            
            <label style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <span style={{ fontSize: '0.9rem', color: '#cbd5e1', fontWeight: 500 }}>Email Address</span>
              <input 
                value={email} 
                onChange={(event) => setEmail(event.target.value)} 
                type="email" 
                style={{
                  padding: '1rem',
                  background: 'rgba(0, 0, 0, 0.2)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  color: '#f8fafc',
                  fontSize: '1rem',
                  outline: 'none',
                  transition: 'border-color 0.3s, box-shadow 0.3s'
                }}
                onFocus={(e) => { e.target.style.borderColor = '#e27b1a'; e.target.style.boxShadow = '0 0 0 1px #e27b1a'; }}
                onBlur={(e) => { e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)'; e.target.style.boxShadow = 'none'; }}
              />
            </label>
            
            <label style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <span style={{ fontSize: '0.9rem', color: '#cbd5e1', fontWeight: 500 }}>Password</span>
              <input
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                type="password"
                style={{
                  padding: '1rem',
                  background: 'rgba(0, 0, 0, 0.2)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  color: '#f8fafc',
                  fontSize: '1rem',
                  outline: 'none',
                  transition: 'border-color 0.3s, box-shadow 0.3s'
                }}
                onFocus={(e) => { e.target.style.borderColor = '#e27b1a'; e.target.style.boxShadow = '0 0 0 1px #e27b1a'; }}
                onBlur={(e) => { e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)'; e.target.style.boxShadow = 'none'; }}
              />
            </label>
            
            {error && (
              <div style={{ padding: '1rem', background: 'rgba(220, 38, 38, 0.15)', border: '1px solid rgba(220, 38, 38, 0.3)', color: '#fca5a5', fontSize: '0.9rem' }}>
                {error}
              </div>
            )}
            
            <button 
              type="submit" 
              disabled={isSubmitting}
              style={{
                marginTop: '1rem',
                padding: '1rem',
                background: 'linear-gradient(135deg, #e27b1a, #c06010)',
                color: '#ffffff',
                border: 'none',
                fontSize: '1rem',
                fontWeight: 600,
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
                opacity: isSubmitting ? 0.7 : 1,
                transition: 'transform 0.2s, box-shadow 0.2s',
                textTransform: 'uppercase',
                letterSpacing: '1px'
              }}
              onMouseOver={(e) => { if(!isSubmitting) { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 10px 20px -10px rgba(226, 123, 26, 0.6)'; } }}
              onMouseOut={(e) => { if(!isSubmitting) { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; } }}
            >
              {isSubmitting ? "Authenticating..." : "Login to Dashboard"}
            </button>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1.5rem', fontSize: '0.85rem' }}>
              <Link to="/create-account" style={{ color: '#94a3b8', textDecoration: 'none', transition: 'color 0.3s' }} onMouseOver={(e) => e.currentTarget.style.color = '#e27b1a'} onMouseOut={(e) => e.currentTarget.style.color = '#94a3b8'}>
                Create an Account
              </Link>
              <Link to="/forgot-password" style={{ color: '#94a3b8', textDecoration: 'none', transition: 'color 0.3s' }} onMouseOver={(e) => e.currentTarget.style.color = '#e27b1a'} onMouseOut={(e) => e.currentTarget.style.color = '#94a3b8'}>
                Forgot Password?
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
