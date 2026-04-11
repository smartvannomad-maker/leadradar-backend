import { DEFAULT_PLAN } from "../config/planFeatures";

export function getCurrentPlan() {
  return localStorage.getItem("leadradar_plan") || DEFAULT_PLAN;
}

export function setCurrentPlan(plan) {
  localStorage.setItem("leadradar_plan", plan);
}