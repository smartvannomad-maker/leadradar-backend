import { apiFetch } from "./client";

export async function fetchUsersAdmin() {
  return apiFetch("/admin/users", {
    method: "GET",
  });
}

export async function updateUserRoleAdmin(userId, role) {
  return apiFetch(`/admin/users/${userId}/role`, {
    method: "PATCH",
    body: JSON.stringify({ role }),
  });
}