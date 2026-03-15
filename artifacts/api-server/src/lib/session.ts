import { Request } from "express";

export interface SessionUser {
  id: number;
  phone: string;
  role: string;
}

const sessions = new Map<string, SessionUser>();

export function createSession(user: SessionUser): string {
  const token = Math.random().toString(36).slice(2) + Date.now().toString(36);
  sessions.set(token, user);
  return token;
}

export function getSession(req: Request): SessionUser | null {
  const token = req.cookies?.["nova_session"];
  if (!token) return null;
  return sessions.get(token) ?? null;
}

export function deleteSession(token: string): void {
  sessions.delete(token);
}

export function getSessionToken(req: Request): string | null {
  return req.cookies?.["nova_session"] ?? null;
}
