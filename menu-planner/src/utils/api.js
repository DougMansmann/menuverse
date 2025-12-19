export async function apiFetch(url, options = {}) {
  const token = localStorage.getItem("token");
  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(url, { ...options, headers });
  if (response.status === 401) {
    localStorage.removeItem("token");
    window.location.href = "/login"; // Redirect to login on unauthorized
    throw new Error("Unauthorized - redirecting to login");
  }
  if (!response.ok) {
    throw new Error(`HTTP error: ${response.status}`);
  }
  return response;
}