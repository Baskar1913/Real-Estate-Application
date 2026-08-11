import { Mail } from "lucide-react";
import { useState, type SyntheticEvent } from "react";
import { Link } from "react-router-dom";

import { forgotRequest } from "../../services/auth";
import AuthShell from "./AuthShell";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (
    event: SyntheticEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setMessage("");
    setError("");
    setBusy(true);

    try {
      const response = await forgotRequest({
        email: email,
        role: "user",
        step: "verify",
      });

      setMessage(response.message);
    } catch {
      setError(
        "Unable to generate the reset link. Please check your email and try again."
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <AuthShell>
      <div className="auth-card">
        <span className="eyebrow">
          Account recovery
        </span>

        <h2>Forgot your password?</h2>

        <p>
          Enter your registered email to generate a secure reset link.
        </p>

        {message && (
          <div className="form-success">
            {message}
          </div>
        )}

        {error && (
          <div className="form-error">
            {error}
          </div>
        )}

        <form onSubmit={submit}>
          <label>
            Email address

            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              placeholder="you@example.com"
            />
          </label>

          <button
            type="submit"
            className="primary-button"
            disabled={busy}
          >
            <Mail />

            {busy ? "Generating..." : "Send reset link"}
          </button>
        </form>

        <p className="auth-switch">
          <Link to="/login">
            Back to sign in
          </Link>
        </p>
      </div>
    </AuthShell>
  );
}