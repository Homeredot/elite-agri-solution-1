import { useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../../api/client";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";

export const ResetPasswordPage = () => {
  const [token, setToken] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const response = await api.post<{ message: string }>("/auth/reset-password", {
      token,
      password
    });
    setMessage(response.message);
  };

  return (
    <div className="auth-shell centered">
      <Card className="auth-card">
        <form className="stack-md" onSubmit={handleSubmit}>
          <div>
            <h2>Set New Password</h2>
            <p>Apply a password reset token and set a new admin password.</p>
          </div>
          <label className="field">
            <span>Reset token</span>
            <input value={token} onChange={(event) => setToken(event.target.value)} />
          </label>
          <label className="field">
            <span>New password</span>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </label>
          {message ? <div className="success-banner">{message}</div> : null}
          <Button type="submit">Update Password</Button>
          <Link to="/login" className="text-link">
            Return to login
          </Link>
        </form>
      </Card>
    </div>
  );
};
