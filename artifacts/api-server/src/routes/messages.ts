import { Router } from "express";
import { pool, supabase } from "@workspace/db";
import { z } from "zod";

const router = Router();

const messageSchema = z.object({
  userPhone: z.string().min(10),
  productId: z.number().positive(),
  sender: z.enum(["user", "admin"]),
  content: z.string().min(1),
});

// ── WhatsApp notification via CallMeBot (free, no API key needed for basic) ──
async function notifyAdminOnWhatsApp(userPhone: string, productId: number, content: string) {
  const adminPhone = process.env.ADMIN_WHATSAPP_PHONE; // e.g. "201234567890"
  const apiKey = process.env.CALLMEBOT_API_KEY;        // from callmebot registration
  
  if (!adminPhone || !apiKey) return; // silently skip if not configured

  const message = encodeURIComponent(
    `🔔 رسالة جديدة من العميل\n📱 الهاتف: ${userPhone}\n📦 المنتج: #${productId}\n💬 "${content}"\n\n← ردّ عليه من لوحة التحكم`
  );

  const url = `https://api.callmebot.com/whatsapp.php?phone=${adminPhone}&text=${message}&apikey=${apiKey}`;

  try {
    await fetch(url);
  } catch (e) {
    console.error("WhatsApp notify failed:", e);
  }
}

// Get messages for a specific order/user and product
router.get("/:phone/:productId", async (req, res) => {
  try {
    const { phone, productId } = req.params;
    
    if (pool) {
      const result = await pool.query(
        "SELECT * FROM messages WHERE user_phone = $1 AND product_id = $2 ORDER BY created_at ASC",
        [phone, parseInt(productId)]
      );
      res.json(result.rows);
      return;
    }
    
    if (supabase) {
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .eq("user_phone", phone)
        .eq("product_id", parseInt(productId))
        .order("created_at", { ascending: true });
        
      if (error) throw error;
      res.json(data ?? []);
      return;
    }
    
    res.json([]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "خطأ في جلب الرسائل" });
  }
});

// Admin ONLY: get all active messages across all products
router.get("/", async (req, res) => {
  try {
    if (pool) {
      const result = await pool.query("SELECT * FROM messages ORDER BY created_at DESC");
      res.json(result.rows);
      return;
    }
    
    if (supabase) {
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .order("created_at", { ascending: false });
        
      if (error) throw error;
      res.json(data ?? []);
      return;
    }
    
    res.json([]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "خطأ في جلب كل الرسائل" });
  }
});

// Post a new message
router.post("/", async (req, res) => {
  try {
    const data = messageSchema.parse(req.body);
    
    let inserted: any = null;

    if (pool) {
      const result = await pool.query(
        "INSERT INTO messages (user_phone, product_id, sender, content) VALUES ($1, $2, $3, $4) RETURNING *",
        [data.userPhone, data.productId, data.sender, data.content]
      );
      inserted = result.rows[0];
    } else if (supabase) {
      const { data: row, error } = await supabase
        .from("messages")
        .insert({
          user_phone: data.userPhone,
          product_id: data.productId,
          sender: data.sender,
          content: data.content
        })
        .select()
        .single();
        
      if (error) throw error;
      inserted = row;
    } else {
      res.status(500).json({ error: "No DB connection active" });
      return;
    }

    // 🔔 Send WhatsApp notification to admin when user sends a message
    if (data.sender === "user") {
      notifyAdminOnWhatsApp(data.userPhone, data.productId, data.content); // fire and forget
    }

    res.json(inserted);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: "بيانات غير صالحة" });
  }
});

// Delete all messages for a specific phone and product (triggered when order delivered)
router.delete("/:phone/:productId", async (req, res) => {
  try {
    const { phone, productId } = req.params;
    
    if (pool) {
      await pool.query(
        "DELETE FROM messages WHERE user_phone = $1 AND product_id = $2",
        [phone, parseInt(productId)]
      );
      res.json({ success: true });
      return;
    }
    
    if (supabase) {
      const { error } = await supabase
        .from("messages")
        .delete()
        .eq("user_phone", phone)
        .eq("product_id", parseInt(productId));
        
      if (error) throw error;
      res.json({ success: true });
      return;
    }
    
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "خطأ في مسح الرسائل" });
  }
});

export default router;
