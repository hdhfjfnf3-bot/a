import { Request, Response, NextFunction } from "express";
import { getSession } from "../lib/session";

export function requireAuth(req: Request, res: Response, next: NextFunction): void {
  const user = getSession(req);
  if (!user) {
    res.status(401).json({ error: "غير مصرح" });
    return;
  }
  (req as any).user = user;
  next();
}

export function requireAdmin(req: Request, res: Response, next: NextFunction): void {
  const user = getSession(req);
  if (!user) {
    res.status(401).json({ error: "غير مصرح" });
    return;
  }
  if (user.role !== "admin") {
    res.status(403).json({ error: "غير مسموح" });
    return;
  }
  (req as any).user = user;
  next();
}
