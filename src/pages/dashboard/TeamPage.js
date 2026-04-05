import { useCallback, useEffect, useState } from "react";
import {
  fetchTeamInvites,
  fetchTeamMembers,
  inviteTeamMember,
} from "../../features/team/team.service";
import { useAuth } from "../../hooks/useAuth";

export default function TeamPage() {
  const { user } = useAuth();

  const [members, setMembers] = useState([]);
  const [invites, setInvites] = useState([]);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("member");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const isOwner = user?.workspaceRole === "owner";

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const membersRes = await fetchTeamMembers();
      setMembers(membersRes.members || []);

      if (isOwner) {
        const invitesRes = await fetchTeamInvites();
        setInvites(invitesRes.invites || []);
      } else {
        setInvites([]);
      }
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to load team data.");
    } finally {
      setLoading(false);
    }
  }, [isOwner]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleInvite = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail) {
      setError("Please enter an email.");
      return;
    }

    try {
      setSubmitting(true);
      const result = await inviteTeamMember(cleanEmail, role);
      setSuccess(result.message || "Invite created.");
      setEmail("");
      setRole("member");
      await loadData();
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to invite team member.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ display: "grid", gap: 20 }}>
      <div
        style={{
          background: "#fff",
          border: "1px solid #e2e8f0",
          borderRadius: 20,
          padding: 20,
        }}
      >
        <h2 style={{ marginTop: 0, color: "#0f172a" }}>Team</h2>
        <p style={{ color: "#64748b", marginBottom: 0 }}>
          Manage users inside your workspace.
        </p>
      </div>

      {error ? (
        <div
          style={{
            padding: 12,
            borderRadius: 12,
            background: "#fef2f2",
            border: "1px solid #fecaca",
            color: "#b91c1c",
          }}
        >
          {error}
        </div>
      ) : null}

      {isOwner ? (
        <div
          style={{
            background: "#fff",
            border: "1px solid #e2e8f0",
            borderRadius: 20,
            padding: 20,
          }}
        >
          <h3 style={{ marginTop: 0, color: "#0f172a" }}>Invite Team Member</h3>

          {success ? (
            <div
              style={{
                marginBottom: 12,
                padding: 12,
                borderRadius: 12,
                background: "#f0fdf4",
                border: "1px solid #bbf7d0",
                color: "#166534",
              }}
            >
              {success}
            </div>
          ) : null}

          <form
            onSubmit={handleInvite}
            style={{
              display: "grid",
              gap: 12,
              gridTemplateColumns: "2fr 1fr auto",
              alignItems: "end",
            }}
          >
            <div>
              <label
                style={{
                  display: "block",
                  marginBottom: 6,
                  fontWeight: 700,
                  color: "#334155",
                }}
              >
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="team@example.com"
                style={{
                  width: "100%",
                  padding: "12px 14px",
                  borderRadius: 14,
                  border: "1px solid #cbd5e1",
                  outline: "none",
                }}
              />
            </div>

            <div>
              <label
                style={{
                  display: "block",
                  marginBottom: 6,
                  fontWeight: 700,
                  color: "#334155",
                }}
              >
                Role
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                style={{
                  width: "100%",
                  padding: "12px 14px",
                  borderRadius: 14,
                  border: "1px solid #cbd5e1",
                  outline: "none",
                }}
              >
                <option value="member">Member</option>
                <option value="owner">Owner</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={submitting}
              style={{
                border: "none",
                borderRadius: 14,
                padding: "12px 18px",
                background: "linear-gradient(135deg, #2563eb 0%, #4f46e5 100%)",
                color: "#fff",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              {submitting ? "Inviting..." : "Invite"}
            </button>
          </form>
        </div>
      ) : (
        <div
          style={{
            background: "#fff",
            border: "1px solid #e2e8f0",
            borderRadius: 20,
            padding: 20,
          }}
        >
          <h3 style={{ marginTop: 0, color: "#0f172a" }}>Invite Team Members</h3>
          <p style={{ color: "#64748b", marginBottom: 0 }}>
            Only workspace owners can invite team members.
          </p>
        </div>
      )}

      <div
        style={{
          background: "#fff",
          border: "1px solid #e2e8f0",
          borderRadius: 20,
          padding: 20,
        }}
      >
        <h3 style={{ marginTop: 0, color: "#0f172a" }}>Workspace Members</h3>

        {loading ? (
          <p style={{ color: "#64748b" }}>Loading members...</p>
        ) : members.length === 0 ? (
          <p style={{ color: "#64748b" }}>No team members found.</p>
        ) : (
          <div style={{ display: "grid", gap: 12 }}>
            {members.map((member) => (
              <div
                key={member.id}
                style={{
                  padding: 14,
                  borderRadius: 14,
                  border: "1px solid #e2e8f0",
                  background: "#fff",
                }}
              >
                <div style={{ fontWeight: 800, color: "#0f172a" }}>
                  {member.email}
                </div>
                <div style={{ color: "#64748b", marginTop: 4 }}>
                  Role: {member.workspaceRole}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {isOwner && (
        <div
          style={{
            background: "#fff",
            border: "1px solid #e2e8f0",
            borderRadius: 20,
            padding: 20,
          }}
        >
          <h3 style={{ marginTop: 0, color: "#0f172a" }}>Pending Invites</h3>

          {invites.length === 0 ? (
            <p style={{ color: "#64748b" }}>No invites yet.</p>
          ) : (
            <div style={{ display: "grid", gap: 12 }}>
              {invites.map((invite) => (
                <div
                  key={invite.id}
                  style={{
                    padding: 14,
                    borderRadius: 14,
                    border: "1px solid #e2e8f0",
                    background: "#fff",
                  }}
                >
                  <div style={{ fontWeight: 800, color: "#0f172a" }}>
                    {invite.email}
                  </div>
                  <div style={{ color: "#64748b", marginTop: 4 }}>
                    Role: {invite.role} · Status: {invite.status}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}