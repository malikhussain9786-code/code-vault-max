import axios from 'axios';

// Only used for calling the AI endpoints (/api/ai/*) now — those are stateless
// serverless functions with no authentication of their own (matching the same proven
// pattern used elsewhere: the AI call just takes code/language/prompt and returns a
// result, no user session involved). No JWT, no refresh tokens, no cookies needed —
// there's no backend user session to manage anymore since all account/snippet data
// lives in the browser.
export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '',
});
