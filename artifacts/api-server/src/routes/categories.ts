import { Router } from "express";
import { db, categoriesTable, productsTable } from "@workspace/db";
import { eq, sql } from "drizzle-orm";

const router = Router();

router.get("/", async (_req, res) => {
  try {
    const categories = await db.select({
      id: categoriesTable.id,
      name: categoriesTable.name,
      nameAr: categoriesTable.nameAr,
      slug: categoriesTable.slug,
      icon: categoriesTable.icon,
      image: categoriesTable.image,
      productCount: sql<number>`(select count(*) from products where category_id = ${categoriesTable.id})`,
    }).from(categoriesTable);
    res.json(categories);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "خطأ في الخادم" });
  }
});

router.post("/", async (req, res) => {
  try {
    const { name, nameAr, slug, icon, image } = req.body;
    if (!name || !nameAr || !slug) {
      res.status(400).json({ error: "الاسم والرابط مطلوبان" });
      return;
    }
    const [category] = await db.insert(categoriesTable).values({ name, nameAr, slug, icon, image }).returning();
    res.status(201).json({ ...category, productCount: 0 });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "خطأ في الخادم" });
  }
});

export default router;
