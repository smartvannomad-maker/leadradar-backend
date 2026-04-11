import { DEFAULT_PLAN, PLAN_FEATURES } from "../config/planFeatures";

export function getPlanFeatures(plan) {
  return PLAN_FEATURES[plan] || PLAN_FEATURES[DEFAULT_PLAN];
}

export function canAccess(plan, feature) {
  const features = getPlanFeatures(plan);
  return Boolean(features?.[feature]);
}

export function getAllowedAiModes(plan) {
  const features = getPlanFeatures(plan);
  return features.aiSearchModes || ["broad"];
}