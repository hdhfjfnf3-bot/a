// @ts-nocheck
import { Router } from "express";
import { db } from "@workspace/db";
import { siteVisits } from "@workspace/db/schema";
import { eq, sql } from "drizzle-orm";

const router = Router();

// GET /api/analytics/visits
router.get("/visits", async (req, res) => {
  try {
    const records = await db.select().from(siteVisits).where(eq(siteVisits.id, 1));
    const count = records.length > 0 ? records[0].count : 0;
    res.json({ count });
  } catch (err) {
    console.error("Failed to fetch visits:", err);
    res.status(500).json({ error: "Failed to fetch visits" });
  }
});

// POST /api/analytics/visit
router.post("/visit", async (req, res) => {
  try {
    await db.insert(siteVisits)
      .values({ id: 1, count: 1 })
      .onConflictDoUpdate({
        target: siteVisits.id,
        set: { count: sql`${siteVisits.count} + 1` },
      });
    res.json({ success: true });
  } catch (err) {
    console.error("Failed to increment visit:", err);
    res.status(500).json({ error: "Failed to increment visit" });
  }
});

export default router;
