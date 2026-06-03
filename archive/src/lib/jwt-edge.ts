// JWT verification for Edge Runtime (middleware)
// This uses Web Crypto API for HMAC verification

export interface AuthUser {
  id: number;
  email: string;
  role: string;
}

// Get JWT secret from environment
const JWT_SECRET = process.env.NEXTAUTH_SECRET || "your-secret-key";

export async function verifyTokenEdge(token: string): Promise<AuthUser | null> {
  try {
    // Split the token
    const parts = token.split(".");
    if (parts.length !== 3) {
      return null;
    }

    const [header, payload, signature] = parts;

    // Verify signature using Web Crypto API
    const isValidSignature = await verifySignature(header, payload, signature, JWT_SECRET);
    if (!isValidSignature) {
      return null;
    }

    // Decode JWT payload (base64url). Unlike Node's jsonwebtoken, atob() needs padding.
    const parsed = decodeJwtPayloadJson(payload);

    // Check if token is expired (exp is seconds since epoch)
    const exp = parsed.exp;
    if (typeof exp === "number" && Date.now() >= exp * 1000) {
      return null;
    }

    const id = parsed.id;
    const email = parsed.email;
    const role = parsed.role;
    if (
      typeof id !== "number" ||
      typeof email !== "string" ||
      typeof role !== "string"
    ) {
      return null;
    }

    return { id, email, role };
  } catch  {
    return null;
  }
}

function decodeJwtPayloadJson(payloadSegment: string): Record<string, unknown> {
  let base64 = payloadSegment.replace(/-/g, "+").replace(/_/g, "/");
  const pad = base64.length % 4;
  if (pad) base64 += "=".repeat(4 - pad);
  const json = atob(base64);
  return JSON.parse(json) as Record<string, unknown>;
}

// HMAC signature verification using Web Crypto API
async function verifySignature(header: string, payload: string, signature: string, secret: string): Promise<boolean> {
  try {
    // Create the data to verify (header.payload)
    const data = `${header}.${payload}`;
    
    // Convert secret to ArrayBuffer
    const secretKey = await crypto.subtle.importKey(
      'raw',
      new TextEncoder().encode(secret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['verify']
    );

    // Convert signature from base64url to ArrayBuffer
    const signatureBuffer = base64UrlToArrayBuffer(signature);

    // Verify the signature
    const isValid = await crypto.subtle.verify(
      'HMAC',
      secretKey,
      signatureBuffer,
      new TextEncoder().encode(data)
    );

    return isValid;
  } catch  {
    return false;
  }
}

// Convert base64url to ArrayBuffer
function base64UrlToArrayBuffer(base64url: string): ArrayBuffer {
  // Convert base64url to base64
  const base64 = base64url.replace(/-/g, '+').replace(/_/g, '/');
  
  // Add padding if needed
  const padded = base64 + '='.repeat((4 - base64.length % 4) % 4);
  
  // Convert to binary string
  const binaryString = atob(padded);
  
  // Convert to ArrayBuffer
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  
  return bytes.buffer;
}
