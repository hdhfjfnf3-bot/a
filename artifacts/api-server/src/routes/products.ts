import { Router } from "express";
import { db, productsTable, categoriesTable } from "@workspace/db";
import { eq, and, ilike, sql } from "drizzle-orm";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const { categoryId, search, featured } = req.query;
    const conditions: any[] = [];
    if (categoryId) conditions.push(eq(productsTable.categoryId, Number(categoryId)));
    if (featured === "true") conditions.push(eq(productsTable.featured, true));
    if (search) conditions.push(
      sql`(${productsTable.name} ilike ${'%' + search + '%'} or ${productsTable.nameAr} ilike ${'%' + search + '%'})`
    );

    const products = await db.select({
      id: productsTable.id,
      name: productsTable.name,
      nameAr: productsTable.nameAr,
      description: productsTable.description,
      descriptionAr: productsTable.descriptionAr,
      price: productsTable.price,
      originalPrice: productsTable.originalPrice,
      images: productsTable.images,
      categoryId: productsTable.categoryId,
      categoryName: categoriesTable.name,
      categoryNameAr: categoriesTable.nameAr,
      stock: productsTable.stock,
      featured: productsTable.featured,
      badge: productsTable.badge,
      createdAt: productsTable.createdAt,
    }).from(productsTable)
      .leftJoin(categoriesTable, eq(productsTable.categoryId, categoriesTable.id))
      .where(conditions.length > 0 ? and(...conditions) : undefined);

    res.json(products.map(p => ({
      ...p,
      price: Number(p.price),
      originalPrice: p.originalPrice ? Number(p.originalPrice) : undefined,
      createdAt: p.createdAt.toISOString(),
    })));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "خطأ في الخادم" });
  }
});

router.post("/", async (req, res) => {
  try {
    const { name, nameAr, description, descriptionAr, price, originalPrice, images, categoryId, stock, featured, badge } = req.body;
    if (!name || !nameAr || !price) {
      res.status(400).json({ error: "الاسم والسعر مطلوبان" });
      return;
    }
    const [product] = await db.insert(productsTable).values({
      name, nameAr, description, descriptionAr,
      price: String(price),
      originalPrice: originalPrice ? String(originalPrice) : undefined,
      images: images ?? [],
      categoryId: categoryId ?? null,
      stock: stock ?? 0,
      featured: featured ?? false,
      badge,
    }).returning();

    const [cat] = categoryId
      ? await db.select().from(categoriesTable).where(eq(categoriesTable.id, categoryId)).limit(1)
      : [null];

    res.status(201).json({
      ...product,
      price: Number(product.price),
      originalPrice: product.originalPrice ? Number(product.originalPrice) : undefined,
      categoryName: cat?.name,
      categoryNameAr: cat?.nameAr,
      createdAt: product.createdAt.toISOString(),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "خطأ في الخادم" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const [product] = await db.select({
      id: productsTable.id,
      name: productsTable.name,
      nameAr: productsTable.nameAr,
      description: productsTable.description,
      descriptionAr: productsTable.descriptionAr,
      price: productsTable.price,
      originalPrice: productsTable.originalPrice,
      images: productsTable.images,
      categoryId: productsTable.categoryId,
      categoryName: categoriesTable.name,
      categoryNameAr: categoriesTable.nameAr,
      stock: productsTable.stock,
      featured: productsTable.featured,
      badge: productsTable.badge,
      createdAt: productsTable.createdAt,
    }).from(productsTable)
      .leftJoin(categoriesTable, eq(productsTable.categoryId, categoriesTable.id))
      .where(eq(productsTable.id, Number(req.params.id)));

    if (!product) {
      res.status(404).json({ error: "المنتج غير موجود" });
      return;
    }
    res.json({
      ...product,
      price: Number(product.price),
      originalPrice: product.originalPrice ? Number(product.originalPrice) : undefined,
      createdAt: product.createdAt.toISOString(),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "خطأ في الخادم" });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { name, nameAr, description, descriptionAr, price, originalPrice, images, categoryId, stock, featured, badge } = req.body;
    const [product] = await db.update(productsTable).set({
      name, nameAr, description, descriptionAr,
      price: price ? String(price) : undefined,
      originalPrice: originalPrice ? String(originalPrice) : null,
      images,
      categoryId: categoryId ?? null,
      stock,
      featured,
      badge,
    }).where(eq(productsTable.id, Number(req.params.id))).returning();

    if (!product) {
      res.status(404).json({ error: "المنتج غير موجود" });
      return;
    }

    const [cat] = product.categoryId
      ? await db.select().from(categoriesTable).where(eq(categoriesTable.id, product.categoryId)).limit(1)
      : [null];

    res.json({
      ...product,
      price: Number(product.price),
      originalPrice: product.originalPrice ? Number(product.originalPrice) : undefined,
      categoryName: cat?.name,
      categoryNameAr: cat?.nameAr,
      createdAt: product.createdAt.toISOString(),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "خطأ في الخادم" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await db.delete(productsTable).where(eq(productsTable.id, Number(req.params.id)));
    res.json({ message: "تم حذف المنتج" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "خطأ في الخادم" });
  }
});

export default router;
