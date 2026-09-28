import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Input } from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import ThemeToggle from '../../components/shared/ThemeToggle';
import { Lock, User, AlertCircle, ArrowLeft } from 'lucide-react';
import './LoginPage.css';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!username.trim() || !password.trim()) {
      setErrorMsg('Please enter both username and password.');
      return;
    }

    setIsLoading(true);
    const res = await login(username, password);
    setIsLoading(false);

    if (res.success) {
      navigate('/admin');
    } else {
      // Backend returns standard error shape or message
      setErrorMsg(res.message);
    }
  };

  return (
    <div className="login-page-wrapper">
      <div className="login-top-bar">
        <a href="/" className="back-to-site-link">
          <ArrowLeft size={16} />
          <span>Back to Portfolio</span>
        </a>
        <ThemeToggle />
      </div>

      <div className="login-card">
        <div className="login-card-header">
          <div className="login-icon-box">
            <Lock size={26} />
          </div>
          <h1 className="login-title">Admin Portal</h1>
          <p className="login-subtitle">Sign in to manage your portfolio content</p>
        </div>

        {errorMsg && (
          <div className="login-error-banner" role="alert">
            <AlertCircle size={18} />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleLogin} noValidate className="login-form">
          <Input
            label="Username"
            id="admin-username"
            name="username"
            placeholder="admin"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            autoComplete="username"
          />

          <Input
            label="Password"
            id="admin-password"
            name="password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
          />

          <Button
            type="submit"
            variant="primary"
            size="lg"
            isLoading={isLoading}
            style={{ width: '100%', marginTop: 'var(--space-2)' }}
          >
            Sign In
          </Button>
        </form>
      </div>
    </div>
  );
}
