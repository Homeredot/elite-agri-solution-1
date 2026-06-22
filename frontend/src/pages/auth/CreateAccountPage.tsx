import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../../api/client";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";

export const CreateAccountPage = () => {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);
    setMessage(null);
    setError(null);

    try {
      const response = await api.post<{ message: string }>("/auth/setup-account", {
        firstName,
        lastName: lastName || null,
        email,
        phone: phone || null,
        password
      });
      setMessage(response.message);
      setTimeout(() => navigate("/login"), 1000);
    } catch (submissionError) {
      setError(submissionError instanceof Error ? submissionError.message : "Account creation failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-shell centered">
      <Card className="auth-card">
        <form className="stack-md" onSubmit={handleSubmit}>
          <div>
            <h2>Create First Admin Account</h2>
            <p>Use this page to create the initial super admin account for the store.</p>
          </div>
          <label className="field">
            <span>First Name</span>
            <input value={firstName} onChange={(event) => setFirstName(event.target.value)} />
          </label>
          <label className="field">
            <span>Last Name</span>
            <input value={lastName} onChange={(event) => setLastName(event.target.value)} />
          </label>
          <label className="field">
            <span>Email</span>
            <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} />
          </label>
          <label className="field">
            <span>Phone</span>
            <input value={phone} onChange={(event) => setPhone(event.target.value)} />
          </label>
          <label className="field">
            <span>Password</span>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </label>
          {error ? <div className="error-banner">{error}</div> : null}
          {message ? <div className="success-banner">{message}</div> : null}
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Creating..." : "Create Account"}
          </Button>
          <Link to="/login" className="text-link">
            Back to login
          </Link>
        </form>
      </Card>
    </div>
  );
};
