import crypto from 'node:crypto';
import { db } from '../db/index.js';
import { users, sessions } from '../db/schema.js';
import { eq } from 'drizzle-orm';

export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  createdAt: string;
}

export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.scryptSync(password, salt, 64).toString('hex');
  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, storedHash: string): boolean {
  const [salt, key] = storedHash.split(':');
  if (!salt || !key) return false;
  const derivedKey = crypto.scryptSync(password, salt, 64).toString('hex');
  return crypto.timingSafeEqual(Buffer.from(key, 'hex'), Buffer.from(derivedKey, 'hex'));
}

export async function registerUser(email: string, name: string, password: string): Promise<User> {
  const normalized = email.toLowerCase().trim();
  const existing = await db.select({ id: users.id }).from(users).where(eq(users.email, normalized));
  if (existing.length > 0) {
    throw new Error('An account with this email address already exists.');
  }

  const userId = `usr_${crypto.randomUUID().slice(0, 8)}`;
  const now = new Date().toISOString();

  await db.insert(users).values({
    id: userId,
    email: normalized,
    name: name.trim(),
    password_hash: hashPassword(password),
    role: 'user',
    created_at: now
  });

  return {
    id: userId,
    email: normalized,
    name: name.trim(),
    role: 'user',
    createdAt: now
  };
}

export async function loginUser(email: string, password: string): Promise<{ user: User; token: string }> {
  const normalized = email.toLowerCase().trim();
  const rows = await db.select().from(users).where(eq(users.email, normalized));
  const user = rows[0];
  if (!user) {
    throw new Error('Invalid email or password.');
  }

  const isMatch = verifyPassword(password, user.password_hash);
  if (!isMatch) {
    throw new Error('Invalid email or password.');
  }

  const token = `tok_${crypto.randomUUID()}`;
  const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(); // 30 days

  await db.insert(sessions).values({
    token,
    user_id: user.id,
    expires_at: expiresAt
  });

  return {
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      createdAt: user.created_at
    },
    token
  };
}

export async function getUserByToken(token: string): Promise<User | null> {
  if (!token) return null;

  const rows = await db
    .select({
      id: users.id,
      email: users.email,
      name: users.name,
      role: users.role,
      created_at: users.created_at,
      expires_at: sessions.expires_at
    })
    .from(sessions)
    .innerJoin(users, eq(sessions.user_id, users.id))
    .where(eq(sessions.token, token));

  const session = rows[0];
  if (!session) return null;

  if (new Date(session.expires_at).getTime() < Date.now()) {
    await db.delete(sessions).where(eq(sessions.token, token));
    return null;
  }

  return {
    id: session.id,
    email: session.email,
    name: session.name,
    role: session.role,
    createdAt: session.created_at
  };
}

export async function logoutUser(token: string): Promise<void> {
  if (token) {
    await db.delete(sessions).where(eq(sessions.token, token));
  }
}
