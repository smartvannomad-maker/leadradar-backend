import { useEffect, useState } from "react";
import { fetchUsersAdmin, updateUserRoleAdmin } from "../../api/admin";
import { styles } from "../../styles/dashboardStyles";

export default function AdminPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [workingUserId, setWorkingUserId] = useState("");

  const loadUsers = async () => {
    try {
      setLoading(true);
      const data = await fetchUsersAdmin();
      setUsers(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
      alert(error.message || "Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleRoleChange = async (userId, role) => {
    try {
      setWorkingUserId(userId);
      const updated = await updateUserRoleAdmin(userId, role);

      setUsers((prev) =>
        prev.map((user) => (user.id === userId ? updated : user))
      );
    } catch (error) {
      console.error(error);
      alert(error.message || "Failed to update role");
    } finally {
      setWorkingUserId("");
    }
  };

  return (
    <div style={styles.card}>
      <h2 style={styles.sectionTitle}>Admin User Management</h2>

      {loading ? (
        <p style={styles.emptyText}>Loading users...</p>
      ) : users.length === 0 ? (
        <p style={styles.emptyText}>No users found.</p>
      ) : (
        <div style={{ display: "grid", gap: 14 }}>
          {users.map((user) => (
            <div
              key={user.id}
              style={{
                border: "1px solid #e2e8f0",
                borderRadius: 18,
                padding: 16,
                background: "#fff",
                display: "flex",
                justifyContent: "space-between",
                gap: 16,
                alignItems: "center",
                flexWrap: "wrap",
              }}
            >
              <div>
                <div style={{ fontWeight: 800, color: "#0f172a" }}>
                  {user.email}
                </div>
                <div style={{ color: "#64748b", fontSize: 14 }}>
                  Role: {user.role}
                </div>
              </div>

              <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                <select
                  value={user.role}
                  onChange={(e) => handleRoleChange(user.id, e.target.value)}
                  disabled={workingUserId === user.id}
                  style={styles.sortSelect}
                >
                  <option value="user">user</option>
                  <option value="admin">admin</option>
                </select>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}