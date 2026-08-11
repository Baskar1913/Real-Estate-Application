import { KeyRound } from "lucide-react";
import { useState, type SyntheticEvent } from "react";
import { Link } from "react-router-dom";

import { forgotRequest } from "../../services/auth";
import AuthShell from "./AuthShell";

export default function ResetPasswordPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (
    event: SyntheticEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setMessage("");
    setError("");

    if (password !== confirmPassword) {
      setError("The passwords do not match.");
      return;
    }

    setBusy(true);

    try {
      const response = await forgotRequest({
        email: email,
        role: "user",
        step: "reset",
        password: password,
        confirm_password: confirmPassword,
      });

      setMessage(response.message);
      setPassword("");
      setConfirmPassword("");
    } catch {
      setError(
        "Unable to reset the password. Please check your details and try again."
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <AuthShell>
      <div className="auth-card">
        <span className="eyebrow">
          Secure password reset
        </span>

        <h2>Choose a new password</h2>

        <p>
          Enter your registered email and choose a strong new password.
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
              placeholder="you@example.com"
              required
            />
          </label>

          <label>
            New password

            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </label>

          <label>
            Confirm password

            <input
              type="password"
              value={confirmPassword}
              onChange={(event) =>
                setConfirmPassword(event.target.value)
              }
              required
            />
          </label>

          <button
            type="submit"
            className="primary-button"
            disabled={busy}
          >
            <KeyRound />

            {busy ? "Resetting..." : "Reset password"}
          </button>
        </form>

        {message && (
          <p className="auth-switch">
            <Link to="/login">
              Continue to sign in
            </Link>
          </p>
        )}
      </div>
    </AuthShell>
  );
}