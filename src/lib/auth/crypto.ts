// Password hashing via the browser's built-in Web Crypto API (SubtleCrypto).
// This is a genuine improvement over storing plaintext passwords — each password gets
// a random salt and is hashed with SHA-256 before ever touching storage, and the raw
// password is never persisted anywhere.
//
// Honest limitation, stated plainly: because everything here runs client-side against
// browser storage (there is no backend server in this build), someone with direct
// access to the browser's storage could still see the salt+hash pair — a real
// server-side auth system keeps that off the client entirely. This is a deliberate,
// disclosed trade-off for a portfolio deployment with no backend, not a hidden gap.

function bufferToHex(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

function randomSaltHex(bytes = 16): string {
  const arr = new Uint8Array(bytes);
  crypto.getRandomValues(arr);
  return bufferToHex(arr.buffer);
}

async function sha256Hex(text: string): Promise<string> {
  const data = new TextEncoder().encode(text);
  const digest = await crypto.subtle.digest('SHA-256', data);
  return bufferToHex(digest);
}

export async function hashPassword(plainPassword: string): Promise<{ salt: string; hash: string }> {
  const salt = randomSaltHex();
  const hash = await sha256Hex(salt + plainPassword);
  return { salt, hash };
}

export async function verifyPassword(plainPassword: string, salt: string, expectedHash: string): Promise<boolean> {
  const hash = await sha256Hex(salt + plainPassword);
  return hash === expectedHash;
}
