import { Router } from "express";
import { db, ordersTable, productsTable } from "@workspace/db";
import { eq } from "drizzle-orm";

const router = Router();

router.get("/", async (_req, res) => {
  try {
    const orders = await db.select({
      id: ordersTable.id,
      productId: ordersTable.productId,
      productName: productsTable.name,
      productNameAr: productsTable.nameAr,
      fullName: ordersTable.fullName,
      phone: ordersTable.phone,
      altPhone: ordersTable.altPhone,
      governorate: ordersTable.governorate,
      address: ordersTable.address,
      quantity: ordersTable.quantity,
      totalPrice: ordersTable.totalPrice,
      status: ordersTable.status,
      facebookPage: ordersTable.facebookPage,
      notes: ordersTable.notes,
      createdAt: ordersTable.createdAt,
    }).from(ordersTable)
      .leftJoin(productsTable, eq(ordersTable.productId, productsTable.id))
      .orderBy(ordersTable.createdAt);

    res.json(orders.map(o => ({
      ...o,
      productName: o.productName ?? "",
      productNameAr: o.productNameAr ?? "",
      productImage: undefined,
      totalPrice: Number(o.totalPrice),
      createdAt: o.createdAt.toISOString(),
    })));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "خطأ في الخادم" });
  }
});

router.post("/", async (req, res) => {
  try {
    const { productId, fullName, phone, altPhone, governorate, address, quantity, facebookPage, notes } = req.body;
    if (!productId || !fullName || !phone || !governorate || !address || !quantity) {
      res.status(400).json({ error: "جميع الحقول المطلوبة يجب تعبئتها" });
      return;
    }
    const [product] = await db.select().from(productsTable).where(eq(productsTable.id, Number(productId))).limit(1);
    if (!product) {
      res.status(404).json({ error: "المنتج غير موجود" });
      return;
    }
    const totalPrice = Number(product.price) * Number(quantity);
    const [order] = await db.insert(ordersTable).values({
      productId: Number(productId),
      fullName,
      phone,
      altPhone,
      governorate,
      address,
      quantity: Number(quantity),
      totalPrice: String(totalPrice),
      facebookPage,
      notes,
    }).returning();

    res.status(201).json({
      ...order,
      productName: product.name,
      productNameAr: product.nameAr,
      productImage: product.images?.[0] ?? undefined,
      totalPrice: Number(order.totalPrice),
      createdAt: order.createdAt.toISOString(),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "خطأ في الخادم" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const [order] = await db.select({
      id: ordersTable.id,
      productId: ordersTable.productId,
      productName: productsTable.name,
      productNameAr: productsTable.nameAr,
      fullName: ordersTable.fullName,
      phone: ordersTable.phone,
      altPhone: ordersTable.altPhone,
      governorate: ordersTable.governorate,
      address: ordersTable.address,
      quantity: ordersTable.quantity,
      totalPrice: ordersTable.totalPrice,
      status: ordersTable.status,
      facebookPage: ordersTable.facebookPage,
      notes: ordersTable.notes,
      createdAt: ordersTable.createdAt,
    }).from(ordersTable)
      .leftJoin(productsTable, eq(ordersTable.productId, productsTable.id))
      .where(eq(ordersTable.id, Number(req.params.id)));

    if (!order) {
      res.status(404).json({ error: "الطلب غير موجود" });
      return;
    }
    res.json({
      ...order,
      productName: order.productName ?? "",
      productNameAr: order.productNameAr ?? "",
      productImage: undefined,
      totalPrice: Number(order.totalPrice),
      createdAt: order.createdAt.toISOString(),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "خطأ في الخادم" });
  }
});

router.patch("/:id", async (req, res) => {
  try {
    const { status } = req.body;
    const [order] = await db.update(ordersTable)
      .set({ status })
      .where(eq(ordersTable.id, Number(req.params.id)))
      .returning();

    if (!order) {
      res.status(404).json({ error: "الطلب غير موجود" });
      return;
    }

    const [product] = await db.select().from(productsTable).where(eq(productsTable.id, order.productId)).limit(1);

    res.json({
      ...order,
      productName: product?.name ?? "",
      productNameAr: product?.nameAr ?? "",
      productImage: product?.images?.[0] ?? undefined,
      totalPrice: Number(order.totalPrice),
      createdAt: order.createdAt.toISOString(),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "خطأ في الخادم" });
  }
});

export default router;
