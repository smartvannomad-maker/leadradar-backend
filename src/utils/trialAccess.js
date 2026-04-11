export function getWorkspaceAccess() {
  try {
    const raw = localStorage.getItem("workspace");
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function isTrialExpired(workspace) {
  if (!workspace) return false;
  return workspace.subscriptionStatus === "expired";
}

export function hasFullAccess(workspace) {
  if (!workspace) return false;
  return workspace.hasFullTrialAccess || workspace.isPaid;
}