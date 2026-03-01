const CORE_BASE = "/api/backend";
const CHATBOT_BASE = "/api/chatbot";

/**
 * Core backend API client.
 * @param {string} path - path after /api/v1/, e.g. "leafybank/accounts/secure/fetch-accounts-for-user"
 * @param {object} options
 * @param {string} [options.method="GET"]
 * @param {object} [options.body]
 * @param {string} [options.bearerToken]
 * @param {object} [options.params] - query params as key-value pairs (keeps path and query separate to avoid URL normalization issues)
 * @returns {Promise<{data: any, error: string|null}>}
 */
export async function coreApi(path, { method = "GET", body = null, bearerToken = null, params = null } = {}) {
  const headers = { "Content-Type": "application/json" };
  if (bearerToken) {
    headers["Authorization"] = `Bearer ${bearerToken}`;
  }

  let url = `${CORE_BASE}/${path}`;
  if (params) {
    const qs = new URLSearchParams(params).toString();
    url += (url.includes("?") ? "&" : "?") + qs;
  }

  try {
    const res = await fetch(url, {
      method,
      headers,
      body: body ? JSON.stringify(body) : null,
    });

    if (!res.ok) {
      const errText = await res.text();
      return { data: null, error: `${res.status}: ${errText}` };
    }

    const data = await res.json();
    return { data, error: null };
  } catch (e) {
    return { data: null, error: e.message };
  }
}

/**
 * Chatbot backend API client (non-streaming).
 * @param {string} path - path after root, e.g. "chat"
 * @param {object} options
 * @returns {Promise<{data: any, error: string|null}>}
 */
export async function chatApi(path, { method = "POST", body = null } = {}) {
  const headers = { "Content-Type": "application/json" };

  try {
    const res = await fetch(`${CHATBOT_BASE}/${path}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : null,
    });

    if (!res.ok) {
      const errText = await res.text();
      return { data: null, error: `${res.status}: ${errText}` };
    }

    const data = await res.json();
    return { data, error: null };
  } catch (e) {
    return { data: null, error: e.message };
  }
}

/**
 * Chatbot streaming — returns the raw Response for SSE processing.
 * @param {string} path - e.g. "chat/stream"
 * @param {object} body - request body
 * @returns {Promise<Response>}
 */
export async function chatStream(path, body) {
  const res = await fetch(`${CHATBOT_BASE}/${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    throw new Error(`${res.status}: ${await res.text()}`);
  }

  return res;
}
