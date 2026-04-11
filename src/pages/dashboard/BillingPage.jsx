import { useMemo, useState } from "react";
import {
  CreditCard,
  CheckCircle2,
  Crown,
  Zap,
  Rocket,
  Building2,
  Clock3,
  AlertTriangle,
} from "lucide-react";
import { styles } from "../../styles/dashboardStyles";
import { PLAN_FEATURES } from "../../config/planFeatures";
import { getCurrentPlan, setCurrentPlan } from "../../utils/currentPlan";
import { useAuth } from "../../hooks/useAuth";

export default function BillingPage() {
  const { workspace } = useAuth();
  const currentPlan = getCurrentPlan();
  const [currency, setCurrency] = useState("ZAR");
  const [pricingMode, setPricingMode] = useState("monthly");

  const plans = useMemo(
    () => [
      {
        key: "starter",
        title: "Starter",
        icon: Zap,
        description: "Ideal for solo operators starting structured outreach.",
        eurMonthly: 29,
        zarMonthly: 499,
        eurOnceOff: 2500,
        zarOnceOff: 9900,
        monthlyPeriod: "/ month",
        onceOffPeriod: "once-off",
        accent: "soft",
        badge: "Entry",
      },
      {
        key: "growth",
        title: "Growth",
        icon: Rocket,
        description: "Built for growing teams that want cleaner pipeline flow.",
        eurMonthly: 59,
        zarMonthly: 999,
        eurOnceOff: 5000,
        zarOnceOff: 19900,
        monthlyPeriod: "/ month",
        onceOffPeriod: "once-off",
        accent: "primary",
        badge: "Most Popular",
      },
      {
        key: "pro",
        title: "Pro",
        icon: Crown,
        description: "For businesses that want a serious lead management engine.",
        eurMonthly: 99,
        zarMonthly: 1999,
        eurOnceOff: 8000,
        zarOnceOff: 39000,
        monthlyPeriod: "/ month",
        onceOffPeriod: "once-off",
        accent: "soft",
        badge: "Advanced",
      },
      {
        key: "scale",
        title: "Scale",
        icon: Building2,
        description: "For larger teams managing higher lead volume.",
        eurMonthly: 199,
        zarMonthly: 3999,
        eurOnceOff: 12000,
        zarOnceOff: 79000,
        monthlyPeriod: "/ month",
        onceOffPeriod: "custom / once-off",
        accent: "soft",
        badge: "Enterprise",
      },
    ],
    []
  );

  const pageStyles = {
    page: { display: "grid", gap: 24 },
    hero: {
      ...styles.card,
      padding: 24,
      borderRadius: 28,
      background: "linear-gradient(135deg, #eff6ff 0%, #ffffff 52%, #f8fafc 100%)",
      border: "1px solid #dbeafe",
      boxShadow: "0 20px 50px rgba(15, 23, 42, 0.06)",
    },
    titleRow: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 16,
      marginBottom: 12,
      flexWrap: "wrap",
    },
    titleLeft: {
      display: "flex",
      alignItems: "center",
      gap: 12,
      flexWrap: "wrap",
    },
    iconWrap: {
      width: 46,
      height: 46,
      borderRadius: 14,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "linear-gradient(135deg, #dbeafe 0%, #eef2ff 100%)",
      color: "#2563eb",
      boxShadow: "0 10px 24px rgba(59,130,246,0.12)",
      flexShrink: 0,
    },
    title: {
      margin: 0,
      fontSize: 30,
      fontWeight: 900,
      color: "#0f172a",
      letterSpacing: "-0.04em",
    },
    subtitle: {
      margin: 0,
      color: "#64748b",
      lineHeight: 1.8,
      fontSize: 14,
      maxWidth: 860,
    },
    currentPill: {
      display: "inline-flex",
      alignItems: "center",
      gap: 8,
      padding: "10px 14px",
      borderRadius: 999,
      background: "#eff6ff",
      border: "1px solid #dbeafe",
      color: "#1d4ed8",
      fontWeight: 800,
      fontSize: 13,
      marginTop: 16,
    },
    statusCard: {
      ...styles.card,
      padding: 18,
      borderRadius: 22,
      background: "#fbfdff",
      border: "1px solid #e2e8f0",
      display: "grid",
      gap: 8,
    },
    controlsRow: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 14,
      flexWrap: "wrap",
      marginTop: 20,
    },
    toggleWrap: {
      display: "inline-flex",
      alignItems: "center",
      gap: 6,
      padding: 6,
      borderRadius: 999,
      background: "#f8fafc",
      border: "1px solid #e2e8f0",
      boxShadow: "inset 0 1px 0 rgba(255,255,255,0.6)",
    },
    toggleButton: (active) => ({
      border: "none",
      outline: "none",
      cursor: "pointer",
      minWidth: 94,
      padding: "11px 16px",
      borderRadius: 999,
      fontWeight: 800,
      fontSize: 13,
      transition: "all 0.2s ease",
      background: active
        ? "linear-gradient(135deg, #2563eb 0%, #4f46e5 100%)"
        : "transparent",
      color: active ? "#ffffff" : "#334155",
      boxShadow: active ? "0 10px 24px rgba(59,130,246,0.18)" : "none",
      whiteSpace: "nowrap",
    }),
    helperCard: {
      ...styles.card,
      padding: 18,
      borderRadius: 22,
      background: "#fbfdff",
      border: "1px solid #e2e8f0",
    },
    helperTitle: {
      margin: "0 0 6px",
      fontSize: 15,
      fontWeight: 900,
      color: "#0f172a",
    },
    helperText: {
      margin: 0,
      fontSize: 13,
      lineHeight: 1.7,
      color: "#64748b",
    },
    planGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(270px, 1fr))",
      gap: 18,
    },
    planCard: (accent, isCurrent) => ({
      ...styles.card,
      padding: 22,
      borderRadius: 26,
      display: "flex",
      flexDirection: "column",
      gap: 16,
      border: isCurrent
        ? "1px solid #bfdbfe"
        : accent === "primary"
        ? "1px solid rgba(99,102,241,0.20)"
        : "1px solid #e2e8f0",
      boxShadow: isCurrent
        ? "0 18px 40px rgba(59,130,246,0.12)"
        : accent === "primary"
        ? "0 18px 40px rgba(99,102,241,0.08)"
        : undefined,
      background:
        accent === "primary"
          ? "linear-gradient(180deg, #f8fbff 0%, #ffffff 100%)"
          : "#ffffff",
      position: "relative",
      overflow: "hidden",
    }),
    currentRibbon: {
      position: "absolute",
      top: 14,
      right: 14,
      padding: "7px 10px",
      borderRadius: 999,
      background: "#dbeafe",
      color: "#1d4ed8",
      fontSize: 11,
      fontWeight: 900,
      letterSpacing: "0.06em",
      textTransform: "uppercase",
    },
    badge: (accent) => ({
      display: "inline-flex",
      alignItems: "center",
      alignSelf: "flex-start",
      padding: "7px 10px",
      borderRadius: 999,
      fontSize: 11,
      fontWeight: 900,
      letterSpacing: "0.06em",
      textTransform: "uppercase",
      background: accent === "primary" ? "#ede9fe" : "#eff6ff",
      color: accent === "primary" ? "#5b21b6" : "#1d4ed8",
      marginBottom: 6,
    }),
    planTop: {
      display: "flex",
      alignItems: "flex-start",
      justifyContent: "space-between",
      gap: 12,
    },
    planIconWrap: (accent) => ({
      width: 42,
      height: 42,
      borderRadius: 14,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background:
        accent === "primary"
          ? "linear-gradient(135deg, #dbeafe 0%, #ede9fe 100%)"
          : "linear-gradient(135deg, #eff6ff 0%, #f8fafc 100%)",
      color: accent === "primary" ? "#4f46e5" : "#2563eb",
      flexShrink: 0,
    }),
    planTitle: {
      margin: 0,
      fontSize: 24,
      fontWeight: 900,
      color: "#0f172a",
      letterSpacing: "-0.04em",
    },
    planText: {
      margin: "6px 0 0",
      color: "#64748b",
      lineHeight: 1.7,
      fontSize: 14,
      minHeight: 48,
    },
    strikeRow: {
      minHeight: 18,
      marginTop: 6,
    },
    strikeText: {
      fontSize: 13,
      color: "#94a3b8",
      textDecoration: "line-through",
      fontWeight: 700,
    },
    priceWrap: {
      display: "flex",
      alignItems: "flex-end",
      gap: 8,
      flexWrap: "nowrap",
      whiteSpace: "nowrap",
      marginTop: 4,
    },
    priceSymbol: {
      fontSize: 22,
      lineHeight: 1,
      fontWeight: 800,
      color: "#334155",
      marginBottom: 6,
      flexShrink: 0,
    },
    priceValue: {
      fontSize: 38,
      lineHeight: 0.95,
      letterSpacing: "-0.055em",
      fontWeight: 900,
      color: "#0f172a",
      fontVariantNumeric: "tabular-nums lining-nums",
      flexShrink: 0,
    },
    period: {
      fontSize: 13,
      fontWeight: 700,
      color: "#64748b",
      marginBottom: 4,
    },
    launchPill: {
      display: "inline-flex",
      alignItems: "center",
      alignSelf: "flex-start",
      marginTop: 8,
      padding: "8px 11px",
      borderRadius: 999,
      background: "#dcfce7",
      border: "1px solid #bbf7d0",
      color: "#166534",
      fontSize: 11,
      fontWeight: 900,
      letterSpacing: "0.06em",
      textTransform: "uppercase",
    },
    sectionLabel: {
      fontSize: 12,
      fontWeight: 900,
      color: "#64748b",
      letterSpacing: "0.08em",
      textTransform: "uppercase",
      marginBottom: 8,
    },
    featureList: {
      display: "grid",
      gap: 10,
      padding: 0,
      margin: 0,
      listStyle: "none",
    },
    featureItem: {
      display: "flex",
      alignItems: "flex-start",
      gap: 10,
      color: "#334155",
      fontSize: 14,
      lineHeight: 1.6,
    },
    actionRow: {
      marginTop: "auto",
      display: "flex",
      gap: 12,
      flexWrap: "wrap",
    },
    primaryButton: (disabled) => ({
      width: "100%",
      border: 0,
      borderRadius: 16,
      padding: "13px 16px",
      fontWeight: 800,
      fontSize: 14,
      cursor: disabled ? "default" : "pointer",
      background: disabled
        ? "#e2e8f0"
        : "linear-gradient(135deg, #2563eb 0%, #4f46e5 100%)",
      color: disabled ? "#475569" : "#ffffff",
      boxShadow: disabled ? "none" : "0 16px 34px rgba(59,130,246,0.20)",
    }),
  };

  const formatAmount = (amount) => {
    return new Intl.NumberFormat("de-DE", {
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getCurrencySymbol = (selectedCurrency) =>
    selectedCurrency === "EUR" ? "€" : "R";

  const renderPlanFeatures = (planKey) => {
    const features = PLAN_FEATURES[planKey];

    return [
      `Max leads: ${features.maxLeads}`,
      `CSV import: ${features.canImportCsv ? "Yes" : "No"}`,
      `AI Search: ${features.canUseAiSearch ? "Enabled" : "No"}`,
      `AI modes: ${features.aiSearchModes.join(", ")}`,
      `Save campaigns: ${features.canSaveCampaigns ? "Yes" : "No"}`,
      `Google open web: ${features.canUseGoogleOpenWeb ? "Yes" : "No"}`,
      `Google intent search: ${features.canUseGoogleIntent ? "Yes" : "No"}`,
      `LinkedIn extension: ${features.canUseExtension ? "Yes" : "No"}`,
      `Max team members: ${features.maxTeamMembers}`,
    ];
  };

  const workspaceStatus = useMemo(() => {
    if (!workspace) {
      return {
        icon: <Clock3 size={16} />,
        label: "No workspace loaded",
        text: "Workspace details are not currently available in the session.",
      };
    }

    if (workspace.isExpired) {
      return {
        icon: <AlertTriangle size={16} />,
        label: "Trial expired",
        text: "Your trial has ended. Upgrade to continue full access.",
      };
    }

    if (workspace.isTrialing) {
      return {
        icon: <Clock3 size={16} />,
        label: `Trial active • ${workspace.trialDaysLeft} day${
          workspace.trialDaysLeft === 1 ? "" : "s"
        } left`,
        text: `Workspace: ${workspace.name}`,
      };
    }

    if (workspace.isPaid) {
      return {
        icon: <Crown size={16} />,
        label: "Paid plan active",
        text: `Workspace: ${workspace.name}`,
      };
    }

    return {
      icon: <CreditCard size={16} />,
      label: "Access status available",
      text: `Workspace: ${workspace.name}`,
    };
  }, [workspace]);

  return (
    <div style={pageStyles.page}>
      <section style={pageStyles.hero}>
        <div style={pageStyles.titleRow}>
          <div style={pageStyles.titleLeft}>
            <div style={pageStyles.iconWrap}>
              <CreditCard size={22} />
            </div>
            <h1 style={pageStyles.title}>Billing & Plan Access</h1>
          </div>

          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <div style={pageStyles.toggleWrap}>
              <button
                type="button"
                onClick={() => setPricingMode("monthly")}
                style={pageStyles.toggleButton(pricingMode === "monthly")}
              >
                Monthly
              </button>
              <button
                type="button"
                onClick={() => setPricingMode("once-off")}
                style={pageStyles.toggleButton(pricingMode === "once-off")}
              >
                Once-off
              </button>
            </div>

            <div style={pageStyles.toggleWrap}>
              <button
                type="button"
                onClick={() => setCurrency("ZAR")}
                style={pageStyles.toggleButton(currency === "ZAR")}
              >
                ZAR
              </button>
              <button
                type="button"
                onClick={() => setCurrency("EUR")}
                style={pageStyles.toggleButton(currency === "EUR")}
              >
                EUR
              </button>
            </div>
          </div>
        </div>

        <p style={pageStyles.subtitle}>
          This is now the main place to manage pricing and feature access. Switch
          plans locally for testing, compare South African and European pricing,
          and choose between a lower-entry monthly model or a higher-value once-off model.
        </p>

        <div style={pageStyles.currentPill}>
          <CheckCircle2 size={16} />
          Current plan: {PLAN_FEATURES[currentPlan]?.label || "Starter"}
        </div>

        <div style={{ marginTop: 18 }}>
          <div style={pageStyles.statusCard}>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                fontWeight: 900,
                color: "#0f172a",
              }}
            >
              {workspaceStatus.icon}
              {workspaceStatus.label}
            </div>
            <div style={{ color: "#64748b", fontSize: 14 }}>
              {workspaceStatus.text}
            </div>
          </div>
        </div>

        <div style={pageStyles.controlsRow}>
          <div style={pageStyles.helperCard}>
            <h3 style={pageStyles.helperTitle}>
              {pricingMode === "monthly" ? "Monthly entry pricing" : "Once-off launch pricing"}
            </h3>
            <p style={pageStyles.helperText}>
              {pricingMode === "monthly"
                ? "Monthly pricing lowers the barrier to entry and helps you break into the market faster."
                : "Once-off pricing is best for clients who want a bigger setup commitment and stronger ownership positioning."}
            </p>
          </div>
        </div>
      </section>

      <section style={pageStyles.planGrid}>
        {plans.map((plan) => {
          const Icon = plan.icon;
          const isCurrent = currentPlan === plan.key;
          const isMonthly = pricingMode === "monthly";

          const price =
            currency === "EUR"
              ? isMonthly
                ? plan.eurMonthly
                : plan.eurOnceOff
              : isMonthly
              ? plan.zarMonthly
              : plan.zarOnceOff;

          const referencePrice =
            currency === "EUR"
              ? isMonthly
                ? plan.eurOnceOff
                : null
              : isMonthly
              ? plan.zarOnceOff
              : null;

          const symbol = getCurrencySymbol(currency);
          const period = isMonthly ? plan.monthlyPeriod : plan.onceOffPeriod;

          return (
            <div
              key={plan.key}
              style={pageStyles.planCard(plan.accent, isCurrent)}
            >
              {isCurrent ? <div style={pageStyles.currentRibbon}>Current</div> : null}

              <div style={pageStyles.badge(plan.accent)}>{plan.badge}</div>

              <div style={pageStyles.planTop}>
                <div>
                  <h2 style={pageStyles.planTitle}>{plan.title}</h2>
                  <p style={pageStyles.planText}>{plan.description}</p>
                </div>

                <div style={pageStyles.planIconWrap(plan.accent)}>
                  <Icon size={20} />
                </div>
              </div>

              <div style={pageStyles.strikeRow}>
                {isMonthly && referencePrice ? (
                  <span style={pageStyles.strikeText}>
                    {symbol}
                    {formatAmount(referencePrice)} once-off
                  </span>
                ) : null}
              </div>

              <div style={pageStyles.priceWrap}>
                <span style={pageStyles.priceSymbol}>{symbol}</span>
                <span style={pageStyles.priceValue}>{formatAmount(price)}</span>
              </div>
              <div style={pageStyles.period}>{period}</div>

              {isMonthly ? (
                <div style={pageStyles.launchPill}>Lower-entry offer</div>
              ) : (
                <div style={pageStyles.launchPill}>Launch pricing</div>
              )}

              <div>
                <div style={pageStyles.sectionLabel}>Included access</div>
                <ul style={pageStyles.featureList}>
                  {renderPlanFeatures(plan.key).map((feature) => (
                    <li key={feature} style={pageStyles.featureItem}>
                      <CheckCircle2 size={16} />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div style={pageStyles.actionRow}>
                <button
                  type="button"
                  style={pageStyles.primaryButton(isCurrent)}
                  onClick={() => {
                    if (!isCurrent) {
                      setCurrentPlan(plan.key);
                      window.location.reload();
                    }
                  }}
                >
                  {isCurrent ? "Current Plan" : `Switch to ${plan.title}`}
                </button>
              </div>
            </div>
          );
        })}
      </section>
    </div>
  );
}