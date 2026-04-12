export function resolveWorkspaceAccess(workspace) {
  const plan =
    workspace?.plan ||
    workspace?.subscription_plan ||
    "starter";

  const subscriptionStatus =
    workspace?.subscription_status ||
    workspace?.subscriptionStatus ||
    "active";

  return {
    plan,
    subscriptionStatus,
    trialEndsAt: null,
    trialDaysLeft: 0,
    isTrialing: false,
    isExpired: false,
    isPaid: true,
    hasFullTrialAccess: true,
  };
}