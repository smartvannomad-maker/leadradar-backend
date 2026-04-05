import { apiFetch } from "../../api/client";

export async function fetchTeamMembers() {
  return apiFetch("/team/members", {
    method: "GET",
  });
}

export async function fetchTeamInvites() {
  return apiFetch("/team/invites", {
    method: "GET",
  });
}

export async function inviteTeamMember(email, role = "member") {
  return apiFetch("/team/invite", {
    method: "POST",
    body: JSON.stringify({
      email,
      role,
    }),
  });
}