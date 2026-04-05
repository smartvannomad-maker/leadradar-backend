import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authStyles as styles } from "../styles/authStyles";
import { useAuth } from "../hooks/useAuth";

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail || !password) {
      setError("Please enter both email and password.");
      return;
    }

    try {
      setSubmitting(true);
      await login(cleanEmail, password);
      navigate("/dashboard/overview");
    } catch (err) {
      console.error(err);
      setError(err.message || "Login failed.");
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
              Source, track, and manage leads with a premium workflow.
            </h1>

            <p style={styles.heroText}>
              LeadRadar helps you save prospects manually, run compliant sourcing
              workflows, manage pipeline stages, and keep outreach organized in
              one clean CRM.
            </p>

            <div style={styles.featureGrid}>
              <div style={styles.featureCard}>
                <p style={styles.featureTitle}>Compliant sourcing</p>
                <p style={styles.featureText}>
                  Manual save flows, user-triggered actions, CSV imports, and no scraping.
                </p>
              </div>

              <div style={styles.featureCard}>
                <p style={styles.featureTitle}>Pipeline visibility</p>
                <p style={styles.featureText}>
                  Track stages, statuses, follow-ups, and notes in one clear dashboard.
                </p>
              </div>

              <div style={styles.featureCard}>
                <p style={styles.featureTitle}>Team-ready direction</p>
                <p style={styles.featureText}>
                  Structured for scaling into a sellable multi-tenant SaaS.
                </p>
              </div>

              <div style={styles.featureCard}>
                <p style={styles.featureTitle}>Lead outreach tools</p>
                <p style={styles.featureText}>
                  Save templates, quotes, and LinkedIn messaging flows with less friction.
                </p>
              </div>
            </div>
          </div>

          <div style={styles.brandBottom}>
            <div style={styles.bottomBadge}>Internal MVP</div>
            <div style={styles.bottomBadge}>Production-ready direction</div>
            <div style={styles.bottomBadge}>Premium CRM UX</div>
          </div>
        </div>
      )}

      <div style={styles.formPanel}>
        <div style={styles.formCard}>
          <div style={styles.formEyebrow}>Welcome back</div>

          <h1 style={styles.formTitle}>Sign in to LeadRadar</h1>
          <p style={styles.formSubtext}>
            Access your sourcing dashboard, manage leads, and continue your outreach pipeline.
          </p>

          {error ? <div style={styles.errorBox}>{error}</div> : null}

          <form onSubmit={handleLogin}>
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
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={styles.input}
                autoComplete="current-password"
              />
            </div>

            <div style={styles.helperRow}>
              <p style={styles.helperText}>
                Secure sign-in for your CRM workspace
              </p>
            </div>

            <button
              type="submit"
              style={styles.primaryButton}
              disabled={submitting}
            >
              {submitting ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <div style={styles.secondaryLinkRow}>
            Don&apos;t have an account?{" "}
            <Link to="/signup" style={styles.link}>
              Create one
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}