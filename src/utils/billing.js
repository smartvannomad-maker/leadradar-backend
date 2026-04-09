export function getTrialEndsAt(days = 14) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString();
}

export function getTrialDaysLeft(trialEndsAt) {
  if (!trialEndsAt) return 0;

  const now = new Date();
  const end = new Date(trialEndsAt);

  if (Number.isNaN(end.getTime())) return 0;

  const diffMs = end.getTime() - now.getTime();
  const daysLeft = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  return Math.max(0, daysLeft);
}

export function isTrialExpired(trialEndsAt) {
  if (!trialEndsAt) return false;

  const end = new Date(trialEndsAt);

  if (Number.isNaN(end.getTime())) return false;

  return end.getTime() < Date.now();
}

export function resolveWorkspaceAccess(workspace) {
  if (!workspace) {
    return {
      plan: "starter",
      subscriptionStatus: "inactive",
      trialEndsAt: null,
      trialDaysLeft: 0,
      isTrialing: false,
      isExpired: false,
      isPaid: false,
      hasFullTrialAccess: false,
    };
  }

  const plan = workspace.plan || "starter";
  const subscriptionStatus = workspace.subscription_status || workspace.subscriptionStatus || "trialing";
  const trialEndsAt = workspace.trial_ends_at || workspace.trialEndsAt || null;

  const expiredByDate = trialEndsAt ? isTrialExpired(trialEndsAt) : false;
  const isPaid = subscriptionStatus === "active" || subscriptionStatus === "paid";
  const isExpired = subscriptionStatus === "expired" || (!isPaid && expiredByDate);
  const isTrialing = !isPaid && !isExpired && (subscriptionStatus === "trialing" || !!trialEndsAt);
  const trialDaysLeft = isTrialing ? getTrialDaysLeft(trialEndsAt) : 0;

  return {
    plan,
    subscriptionStatus: isPaid ? "active" : isExpired ? "expired" : "trialing",
    trialEndsAt,
    trialDaysLeft,
    isTrialing,
    isExpired,
    isPaid,
    hasFullTrialAccess: isTrialing && !isExpired,
  };
}