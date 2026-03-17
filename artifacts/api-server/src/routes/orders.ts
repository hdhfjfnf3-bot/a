// @ts-nocheck
import { Router } from "express";
import { supabase, db, ordersTable, productsTable } from "@workspace/db";
import { eq } from "drizzle-orm";

const router = Router();

router.get("/", async (_req, res) => {
  try {
    if (supabase) {
      const { data, error } = await supabase
        .from("orders")
        .select("*, products(name, name_ar, images)")
        .order("created_at", { ascending: false });
      if (error) throw error;
      res.json((data ?? []).map((o: any) => ({
        id: o.id, productId: o.product_id,
        productName: o.products?.name ?? "",
        productNameAr: o.products?.name_ar ?? "",
        productImage: o.products?.images?.[0] ?? undefined,
        fullName: o.full_name, phone: o.phone, altPhone: o.alt_phone,
        governorate: o.governorate, address: o.address, quantity: o.quantity,
        totalPrice: Number(o.total_price), status: o.status,
        facebookPage: o.facebook_page, notes: o.notes, createdAt: o.created_at,
      })));
      return;
    }

    const orders = await db.select({
      id: ordersTable.id, productId: ordersTable.productId,
      productName: productsTable.name, productNameAr: productsTable.nameAr,
      fullName: ordersTable.fullName, phone: ordersTable.phone,
      altPhone: ordersTable.altPhone, governorate: ordersTable.governorate,
      address: ordersTable.address, quantity: ordersTable.quantity,
      totalPrice: ordersTable.totalPrice, status: ordersTable.status,
      facebookPage: ordersTable.facebookPage, notes: ordersTable.notes,
      createdAt: ordersTable.createdAt,
    }).from(ordersTable)
      .leftJoin(productsTable, eq(ordersTable.productId, productsTable.id))
      .orderBy(ordersTable.createdAt);

    res.json(orders.map(o => ({
      ...o, productName: o.productName ?? "", productNameAr: o.productNameAr ?? "",
      productImage: undefined, totalPrice: Number(o.totalPrice),
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

    if (supabase) {
      const { data: product, error: pErr } = await supabase
        .from("products").select("*").eq("id", Number(productId)).single();
      if (pErr || !product) { res.status(404).json({ error: "المنتج غير موجود" }); return; }

      const totalPrice = Number(product.price) * Number(quantity);
      const { data: order, error: oErr } = await supabase.from("orders").insert({
        product_id: Number(productId), full_name: fullName, phone,
        alt_phone: altPhone, governorate, address,
        quantity: Number(quantity), total_price: totalPrice,
        facebook_page: facebookPage, notes,
      }).select().single();
      if (oErr) throw oErr;

      res.status(201).json({
        id: order.id, productId: order.product_id,
        productName: product.name, productNameAr: product.name_ar,
        productImage: product.images?.[0] ?? undefined,
        fullName: order.full_name, phone: order.phone, altPhone: order.alt_phone,
        governorate: order.governorate, address: order.address,
        quantity: order.quantity, totalPrice: Number(order.total_price),
        status: order.status, facebookPage: order.facebook_page,
        notes: order.notes, createdAt: order.created_at,
      });
      return;
    }

    const [product] = await db.select().from(productsTable).where(eq(productsTable.id, Number(productId))).limit(1);
    if (!product) { res.status(404).json({ error: "المنتج غير موجود" }); return; }

    const totalPrice = Number(product.price) * Number(quantity);
    const [order] = await db.insert(ordersTable).values({
      productId: Number(productId), fullName, phone, altPhone, governorate, address,
      quantity: Number(quantity), totalPrice: String(totalPrice), facebookPage, notes,
    }).returning();

    res.status(201).json({
      ...order, productName: product.name, productNameAr: product.nameAr,
      productImage: product.images?.[0] ?? undefined,
      totalPrice: Number(order.totalPrice), createdAt: order.createdAt.toISOString(),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "خطأ في الخادم" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    if (supabase) {
      const { data: o, error } = await supabase
        .from("orders").select("*, products(name, name_ar, images)")
        .eq("id", Number(req.params.id)).single();
      if (error || !o) { res.status(404).json({ error: "الطلب غير موجود" }); return; }
      res.json({
        id: o.id, productId: o.product_id, productName: o.products?.name ?? "",
        productNameAr: o.products?.name_ar ?? "", productImage: o.products?.images?.[0] ?? undefined,
        fullName: o.full_name, phone: o.phone, altPhone: o.alt_phone,
        governorate: o.governorate, address: o.address, quantity: o.quantity,
        totalPrice: Number(o.total_price), status: o.status,
        facebookPage: o.facebook_page, notes: o.notes, createdAt: o.created_at,
      });
      return;
    }

    const [order] = await db.select({
      id: ordersTable.id, productId: ordersTable.productId,
      productName: productsTable.name, productNameAr: productsTable.nameAr,
      fullName: ordersTable.fullName, phone: ordersTable.phone,
      altPhone: ordersTable.altPhone, governorate: ordersTable.governorate,
      address: ordersTable.address, quantity: ordersTable.quantity,
      totalPrice: ordersTable.totalPrice, status: ordersTable.status,
      facebookPage: ordersTable.facebookPage, notes: ordersTable.notes,
      createdAt: ordersTable.createdAt,
    }).from(ordersTable)
      .leftJoin(productsTable, eq(ordersTable.productId, productsTable.id))
      .where(eq(ordersTable.id, Number(req.params.id)));

    if (!order) { res.status(404).json({ error: "الطلب غير موجود" }); return; }
    res.json({
      ...order, productName: order.productName ?? "", productNameAr: order.productNameAr ?? "",
      productImage: undefined, totalPrice: Number(order.totalPrice),
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

    if (supabase) {
      const { data: order, error } = await supabase
        .from("orders").update({ status }).eq("id", Number(req.params.id))
        .select("*, products(name, name_ar, images)").single();
      if (error || !order) { res.status(404).json({ error: "الطلب غير موجود" }); return; }
      res.json({
        id: order.id, productId: order.product_id,
        productName: order.products?.name ?? "", productNameAr: order.products?.name_ar ?? "",
        productImage: order.products?.images?.[0] ?? undefined,
        fullName: order.full_name, phone: order.phone, altPhone: order.alt_phone,
        governorate: order.governorate, address: order.address, quantity: order.quantity,
        totalPrice: Number(order.total_price), status: order.status,
        facebookPage: order.facebook_page, notes: order.notes, createdAt: order.created_at,
      });
      return;
    }

    const [order] = await db.update(ordersTable)
      .set({ status }).where(eq(ordersTable.id, Number(req.params.id))).returning();
    if (!order) { res.status(404).json({ error: "الطلب غير موجود" }); return; }

    const [product] = await db.select().from(productsTable).where(eq(productsTable.id, order.productId)).limit(1);
    res.json({
      ...order, productName: product?.name ?? "", productNameAr: product?.nameAr ?? "",
      productImage: product?.images?.[0] ?? undefined,
      totalPrice: Number(order.totalPrice), createdAt: order.createdAt.toISOString(),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "خطأ في الخادم" });
  }
});

export default router;
