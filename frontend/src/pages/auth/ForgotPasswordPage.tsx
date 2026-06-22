import { useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../../api/client";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";

export const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const response = await api.post<{ message: string; resetToken?: string }>("/auth/forgot-password", {
      email
    });
    setMessage(
      response.resetToken
        ? `${response.message}. Reset token: ${response.resetToken}`
        : response.message
    );
  };

  return (
    <div className="auth-shell centered">
      <Card className="auth-card">
        <form className="stack-md" onSubmit={handleSubmit}>
          <div>
            <h2>Reset Admin Password</h2>
            <p>Generate a reset token for an admin account.</p>
          </div>
          <label className="field">
            <span>Email</span>
            <input value={email} onChange={(event) => setEmail(event.target.value)} type="email" />
          </label>
          {message ? <div className="success-banner">{message}</div> : null}
          <Button type="submit">Generate Reset Token</Button>
          <Link to="/reset-password" className="text-link">
            Already have a token?
          </Link>
        </form>
      </Card>
    </div>
  );
};
