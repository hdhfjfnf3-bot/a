import { Router } from "express";
import bcrypt from "bcryptjs";
import { db, usersTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { createSession, getSession, deleteSession, getSessionToken } from "../lib/session";

const router = Router();

router.post("/register", async (req, res) => {
  try {
    const { fullName, phone, password } = req.body;
    if (!fullName || !phone || !password) {
      res.status(400).json({ error: "جميع الحقول مطلوبة" });
      return;
    }
    const existing = await db.select().from(usersTable).where(eq(usersTable.phone, phone)).limit(1);
    if (existing.length > 0) {
      res.status(400).json({ error: "رقم الهاتف مسجل بالفعل" });
      return;
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const [user] = await db.insert(usersTable).values({
      fullName,
      phone,
      password: hashedPassword,
      role: "user",
    }).returning();
    const token = createSession({ id: user.id, phone: user.phone, role: user.role });
    res.cookie("nova_session", token, {
      httpOnly: true,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    res.json({
      user: { id: user.id, fullName: user.fullName, phone: user.phone, role: user.role, createdAt: user.createdAt.toISOString() },
      message: "تم التسجيل بنجاح"
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "خطأ في الخادم" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { phone, password } = req.body;
    if (!phone || !password) {
      res.status(400).json({ error: "أدخل رقم الهاتف وكلمة المرور" });
      return;
    }
    const [user] = await db.select().from(usersTable).where(eq(usersTable.phone, phone)).limit(1);
    if (!user) {
      res.status(401).json({ error: "رقم الهاتف أو كلمة المرور غير صحيحة" });
      return;
    }
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      res.status(401).json({ error: "رقم الهاتف أو كلمة المرور غير صحيحة" });
      return;
    }
    const token = createSession({ id: user.id, phone: user.phone, role: user.role });
    res.cookie("nova_session", token, {
      httpOnly: true,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    res.json({
      user: { id: user.id, fullName: user.fullName, phone: user.phone, role: user.role, createdAt: user.createdAt.toISOString() },
      message: "تم تسجيل الدخول بنجاح"
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "خطأ في الخادم" });
  }
});

router.post("/logout", (req, res) => {
  const token = getSessionToken(req);
  if (token) deleteSession(token);
  res.clearCookie("nova_session");
  res.json({ message: "تم تسجيل الخروج" });
});

router.get("/me", (req, res) => {
  const user = getSession(req);
  if (!user) {
    res.status(401).json({ error: "غير مصرح" });
    return;
  }
  db.select().from(usersTable).where(eq(usersTable.id, user.id)).limit(1).then(([u]) => {
    if (!u) {
      res.status(401).json({ error: "غير مصرح" });
      return;
    }
    res.json({ id: u.id, fullName: u.fullName, phone: u.phone, role: u.role, createdAt: u.createdAt.toISOString() });
  }).catch(() => res.status(500).json({ error: "خطأ في الخادم" }));
});

export default router;
