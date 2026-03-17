import { Router } from "express";
import bcrypt from "bcryptjs";
import { supabase, db, usersTable } from "@workspace/db";
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

    if (supabase) {
      const { data: existing } = await supabase.from("users").select("id").eq("phone", phone).single();
      if (existing) { res.status(400).json({ error: "رقم الهاتف مسجل بالفعل" }); return; }

      const hashedPassword = await bcrypt.hash(password, 10);
      const { data: user, error } = await supabase.from("users")
        .insert({ full_name: fullName, phone, password: hashedPassword, role: "user" })
        .select().single();
      if (error) throw error;

      const token = createSession({ id: user.id, phone: user.phone, role: user.role });
      res.cookie("nova_session", token, { httpOnly: true, sameSite: "lax", maxAge: 7 * 24 * 60 * 60 * 1000 });
      res.json({ user: { id: user.id, fullName: user.full_name, phone: user.phone, role: user.role, createdAt: user.created_at }, message: "تم التسجيل بنجاح" });
      return;
    }

    const existing = await db.select().from(usersTable).where(eq(usersTable.phone, phone)).limit(1);
    if (existing.length > 0) { res.status(400).json({ error: "رقم الهاتف مسجل بالفعل" }); return; }

    const hashedPassword = await bcrypt.hash(password, 10);
    const [user] = await db.insert(usersTable).values({ fullName, phone, password: hashedPassword, role: "user" }).returning();
    const token = createSession({ id: user.id, phone: user.phone, role: user.role });
    res.cookie("nova_session", token, { httpOnly: true, sameSite: "lax", maxAge: 7 * 24 * 60 * 60 * 1000 });
    res.json({ user: { id: user.id, fullName: user.fullName, phone: user.phone, role: user.role, createdAt: user.createdAt.toISOString() }, message: "تم التسجيل بنجاح" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "خطأ في الخادم" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { phone, password } = req.body;
    if (!phone || !password) { res.status(400).json({ error: "أدخل رقم الهاتف وكلمة المرور" }); return; }

    if (supabase) {
      const { data: user, error } = await supabase.from("users").select("*").eq("phone", phone).single();
      if (error) console.error("Supabase login error:", error);
      if (!user) { res.status(401).json({ error: "رقم الهاتف أو كلمة المرور غير صحيحة" }); return; }
      const valid = await bcrypt.compare(password, user.password);
      if (!valid) { res.status(401).json({ error: "رقم الهاتف أو كلمة المرور غير صحيحة" }); return; }
      const token = createSession({ id: user.id, phone: user.phone, role: user.role });
      res.cookie("nova_session", token, { httpOnly: true, sameSite: "lax", maxAge: 7 * 24 * 60 * 60 * 1000 });
      res.json({ user: { id: user.id, fullName: user.full_name, phone: user.phone, role: user.role, createdAt: user.created_at }, message: "تم تسجيل الدخول بنجاح" });
      return;
    }

    const [user] = await db.select().from(usersTable).where(eq(usersTable.phone, phone)).limit(1);
    if (!user) { res.status(401).json({ error: "رقم الهاتف أو كلمة المرور غير صحيحة" }); return; }
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) { res.status(401).json({ error: "رقم الهاتف أو كلمة المرور غير صحيحة" }); return; }
    const token = createSession({ id: user.id, phone: user.phone, role: user.role });
    res.cookie("nova_session", token, { httpOnly: true, sameSite: "lax", maxAge: 7 * 24 * 60 * 60 * 1000 });
    res.json({ user: { id: user.id, fullName: user.fullName, phone: user.phone, role: user.role, createdAt: user.createdAt.toISOString() }, message: "تم تسجيل الدخول بنجاح" });
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

router.get("/me", async (req, res) => {
  const session = getSession(req);
  if (!session) { res.status(401).json({ error: "غير مصرح" }); return; }

  try {
    if (supabase) {
      const { data: u } = await supabase.from("users").select("*").eq("id", session.id).single();
      if (!u) { res.status(401).json({ error: "غير مصرح" }); return; }
      res.json({ id: u.id, fullName: u.full_name, phone: u.phone, role: u.role, createdAt: u.created_at });
      return;
    }

    const [u] = await db.select().from(usersTable).where(eq(usersTable.id, session.id)).limit(1);
    if (!u) { res.status(401).json({ error: "غير مصرح" }); return; }
    res.json({ id: u.id, fullName: u.fullName, phone: u.phone, role: u.role, createdAt: u.createdAt.toISOString() });
  } catch {
    res.status(500).json({ error: "خطأ في الخادم" });
  }
});

export default router;
