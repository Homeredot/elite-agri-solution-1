import { ArrowRight, KeyRound, LogIn, Mail, UserPlus } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../api/client";
import { useAuth } from "../context/AuthContext";
import type { StoreCustomerProfile } from "../types/store";

export const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const mutation = useMutation({
    mutationFn: () =>
      api.post<{ token: string; customer: StoreCustomerProfile }>("/store/customers/login", {
        email,
        password
      }),
    onSuccess: (response) => {
      login(response);
      navigate("/account");
    }
  });

  return (
    <section className="glass auth-panel">
      <p className="eyebrow">Welcome back</p>
      <h1 className="title-with-icon">
        <span className="title-icon">
          <LogIn size={20} />
        </span>
        Sign in
      </h1>
      <label className="field">
        <span>Email</span>
        <input value={email} onChange={(event) => setEmail(event.target.value)} type="email" />
      </label>
      <label className="field">
        <span>Password</span>
        <input value={password} onChange={(event) => setPassword(event.target.value)} type="password" />
      </label>
      <button className="primary-btn" onClick={() => mutation.mutate()}>
        <ArrowRight size={16} />
        Sign in
      </button>
      {mutation.error ? <div className="error-chip">{mutation.error.message}</div> : null}
      <Link to="/register" className="text-link">Create account</Link>
      <Link to="/forgot-password" className="text-link">Forgot password</Link>
    </section>
  );
};

export const RegisterPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: ""
  });
  const mutation = useMutation({
    mutationFn: () =>
      api.post("/store/customers/register", {
        firstName: form.firstName,
        lastName: form.lastName || null,
        email: form.email,
        phone: form.phone || null,
        password: form.password
      }),
    onSuccess: () => navigate("/login")
  });

  return (
    <section className="glass auth-panel">
      <p className="eyebrow">Create account</p>
      <h1 className="title-with-icon">
        <span className="title-icon">
          <UserPlus size={20} />
        </span>
        Join the market
      </h1>
      {Object.entries(form).map(([key, value]) => (
        <label className="field" key={key}>
          <span>{key}</span>
          <input
            value={value}
            type={key === "password" ? "password" : key === "email" ? "email" : "text"}
            onChange={(event) => setForm((current) => ({ ...current, [key]: event.target.value }))}
          />
        </label>
      ))}
      <button className="primary-btn" onClick={() => mutation.mutate()}>
        <ArrowRight size={16} />
        Register
      </button>
      {mutation.error ? <div className="error-chip">{mutation.error.message}</div> : null}
      <Link to="/login" className="text-link">Already have an account?</Link>
    </section>
  );
};

export const ForgotPasswordPage = () => {
  return (
    <section className="glass auth-panel">
      <p className="eyebrow">Account recovery</p>
      <h1 className="title-with-icon">
        <span className="title-icon">
          <KeyRound size={20} />
        </span>
        Forgot password
      </h1>
      <p>This customer reset flow should connect to a dedicated customer password reset endpoint in the next backend iteration.</p>
      <Link to="/login" className="primary-btn">
        <Mail size={16} />
        Back to sign in
      </Link>
    </section>
  );
};
