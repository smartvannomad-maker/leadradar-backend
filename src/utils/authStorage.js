export function saveAuthSession(data) {
  if (data?.accessToken) {
    localStorage.setItem("accessToken", data.accessToken);
  }

  if (data?.refreshToken) {
    localStorage.setItem("refreshToken", data.refreshToken);
  }

  if (data?.workspace) {
    localStorage.setItem("workspace", JSON.stringify(data.workspace));
  }

  if (data?.user) {
    localStorage.setItem("user", JSON.stringify(data.user));
  }
}

export function clearAuthSession() {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("workspace");
  localStorage.removeItem("user");
}