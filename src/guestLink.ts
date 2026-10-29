// Short guest links: ?g=<mode+prefix digit><base64url payload>
// Digits 0-3: compact payload (Sinhala/ASCII packed one byte per character).
// Digits 4-7: UTF-8 payload, used when the name has characters compact mode can't hold.

export const PREFIXES = ['ඔබට', 'ඔබ දෙපලට', 'ඔබ සැමට', 'ඔබ ඇතුළු පවුලේ සැමට'];

const SINHALA_START = 0x0d80;
const ZWJ = 0x200d;
const ZWJ_BYTE = 0x7f;

const toBase64Url = (bytes: Uint8Array) =>
  btoa(String.fromCharCode(...bytes)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

const fromBase64Url = (value: string) => {
  const base64 = value.replace(/-/g, '+').replace(/_/g, '/');
  return Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));
};

const compactEncode = (name: string): Uint8Array | null => {
  const bytes: number[] = [];
  for (const char of name) {
    const code = char.codePointAt(0)!;
    if (code >= SINHALA_START && code < SINHALA_START + 0x80) bytes.push(0x80 + code - SINHALA_START);
    else if (code === ZWJ) bytes.push(ZWJ_BYTE);
    else if (code < ZWJ_BYTE) bytes.push(code);
    else return null;
  }
  return Uint8Array.from(bytes);
};

const compactDecode = (bytes: Uint8Array) =>
  Array.from(bytes, (b) =>
    String.fromCodePoint(b >= 0x80 ? SINHALA_START + b - 0x80 : b === ZWJ_BYTE ? ZWJ : b),
  ).join('');

export const encodeGuest = (name: string, prefixIndex: number) => {
  const compact = compactEncode(name);
  if (compact) return `${prefixIndex}${toBase64Url(compact)}`;
  return `${prefixIndex + 4}${toBase64Url(new TextEncoder().encode(name))}`;
};

export const decodeGuest = (code: string): { name: string; prefix: string } | null => {
  try {
    const digit = Number(code[0]);
    if (!Number.isInteger(digit) || digit < 0 || digit > 7) return null;
    const prefix = PREFIXES[digit % 4];
    if (!prefix) return null;
    const bytes = fromBase64Url(code.slice(1));
    const name = digit < 4 ? compactDecode(bytes) : new TextDecoder().decode(bytes);
    return name.trim() ? { name, prefix } : null;
  } catch {
    return null;
  }
};

export const guestGreeting = (name: string, prefix: string) => `ආදරණීය ${name} ${prefix}`;
