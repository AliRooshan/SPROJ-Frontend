/**
 * api.js — Thin fetch wrapper for all backend calls.
 * - Automatically attaches JWT Authorization header
 * - Returns parsed JSON on success
 * - Throws an Error with the server's error message on failure
 */

const BASE = (import.meta.env.VITE_API_URL || '') + '/api';

const getToken = () => localStorage.getItem('edvoyage_token');

const request = async (method, path, body = null) => {
  const headers = { 'Content-Type': 'application/json' };
  const token = getToken();
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const options = { method, headers };
  if (body) options.body = JSON.stringify(body);

  const res = await fetch(`${BASE}${path}`, options);
  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || data.errors?.[0]?.msg || 'Request failed');
  }

  return data;
};

const api = {
  get: (path) => request('GET', path),
  post: (path, body) => request('POST', path, body),
  put: (path, body) => request('PUT', path, body),
  delete: (path) => request('DELETE', path),
};

export default api;
