export const fetcher = (...args) => fetch(...args).then(res => res.json());
export const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5001/api';
