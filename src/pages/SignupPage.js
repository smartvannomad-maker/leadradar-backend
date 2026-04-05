import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { authStyles as styles } from "../styles/authStyles";
import { useAuth } from "../hooks/useAuth";

export default function SignupPage() {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const [searchParams] = useSearchParams();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const invitedEmail = (searchParams.get("email") || "").trim().toLowerCase();
    if (invitedEmail) {
      setEmail(invitedEmail);
    }
  }, [searchParams]);

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");

    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail || !password || !confirmPassword) {
      setError("Please complete all fields.");
      return;
    }

    if (!cleanEmail.includes("@")) {
      setError("Enter a valid email.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setSubmitting(true);
      await signup(cleanEmail, password);
      navigate("/dashboard/overview");
    } catch (err) {
      console.error(err);
      setError(err.message || "Registration failed.");
    } finally {
      setSubmitting(false);
    }
  };

  const isMobile =
    typeof window !== "undefined" && window.innerWidth < 980;

  return (
    <div
      style={{
        ...styles.page,
        gridTemplateColumns: isMobile
          ? "1fr"
          : styles.page.gridTemplateColumns,
      }}
    >
      {!isMobile && (
        <div style={styles.brandPanel}>
          <div style={styles.brandGlowOne} />
          <div style={styles.brandGlowTwo} />

          <div style={styles.brandTop}>
            <div style={styles.logoRow}>
              <div style={styles.logoBadge}>LR</div>
              <div style={styles.logoTextWrap}>
                <p style={styles.logoText}>LeadRadar</p>
                <p style={styles.logoSub}>LinkedIn-compliant sourcing CRM</p>
              </div>
            </div>

            <h1 style={styles.heroTitle}>
              Build your compliant sourcing pipeline from day one.
            </h1>

            <p style={styles.heroText}>
              Create your workspace, save leads manually, manage follow-ups,
              and organize outreach with a clean CRM built for compliant growth.
            </p>
          </div>
        </div>
      )}

      <div style={styles.formPanel}>
        <div style={styles.formCard}>
          <div style={styles.formEyebrow}>Create account</div>

          <h1 style={styles.formTitle}>Start using LeadRadar</h1>
          <p style={styles.formSubtext}>
            Create your account and go straight into your sourcing dashboard.
          </p>

          {error ? <div style={styles.errorBox}>{error}</div> : null}

          <form onSubmit={handleSignup}>
            <div style={styles.fieldWrap}>
              <label style={styles.label}>Email</label>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={styles.input}
                autoComplete="email"
              />
            </div>

            <div style={styles.fieldWrap}>
              <label style={styles.label}>Password</label>
              <input
                type="password"
                placeholder="Create a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={styles.input}
                autoComplete="new-password"
              />
            </div>

            <div style={styles.fieldWrap}>
              <label style={styles.label}>Confirm password</label>
              <input
                type="password"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                style={styles.input}
                autoComplete="new-password"
              />
            </div>

            <div style={styles.helperRow}>
              <p style={styles.helperText}>
                Your account will be created in the backend PostgreSQL auth system.
              </p>
            </div>

            <button type="submit" style={styles.primaryButton} disabled={submitting}>
              {submitting ? "Creating account..." : "Create Account"}
            </button>
          </form>

          <div style={styles.secondaryLinkRow}>
            Already have an account?{" "}
            <Link to="/" style={styles.link}>
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}