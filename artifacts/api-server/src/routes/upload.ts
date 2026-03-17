import { Router } from "express";
import { supabase } from "@workspace/db";

const router = Router();
const BUCKET = "product-images";

/** تأكد إن الـ bucket موجود وأنشئه لو لأ */
async function ensureBucket() {
  if (!supabase) return;
  const { data: buckets } = await supabase.storage.listBuckets();
  const exists = buckets?.some((b) => b.name === BUCKET);
  if (!exists) {
    await supabase.storage.createBucket(BUCKET, { public: true });
  }
}
ensureBucket().catch(console.error);

/**
 * POST /api/upload
 * multipart/form-data مع حقل "file"
 */
router.post("/", async (req, res) => {
  try {
    if (!supabase) {
      res.status(500).json({ error: "Supabase غير مهيأ" });
      return;
    }

    // نجمع الـ body
    const chunks: Buffer[] = [];
    for await (const chunk of req as unknown as AsyncIterable<Buffer>) {
      chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
    }
    const rawBody = Buffer.concat(chunks);

    const contentType = req.headers["content-type"] || "";
    const boundaryMatch = contentType.match(/boundary=([^\s;]+)/);
    if (!boundaryMatch) {
      res.status(400).json({ error: "لا يوجد boundary" });
      return;
    }

    // نحول الـ buffer لـ string binary لاستخراج الأجزاء
    const bodyStr = rawBody.toString("binary");
    const boundary = "--" + boundaryMatch[1];
    const parts = bodyStr.split(boundary).filter((p) => p.includes("Content-Disposition"));
    const filePart = parts.find((p) => p.includes('name="file"'));
    if (!filePart) {
      res.status(400).json({ error: "لم يتم إرسال ملف" });
      return;
    }

    const filenameMatch = filePart.match(/filename="([^"]+)"/);
    const mimeMatch = filePart.match(/Content-Type:\s*([^\r\n]+)/);
    const filename = filenameMatch?.[1] || `img_${Date.now()}.jpg`;
    const mimeType = mimeMatch?.[1]?.trim() || "image/jpeg";

    // نقطع الـ header ونأخذ البيانات
    const headerSep = "\r\n\r\n";
    const headerEnd = filePart.indexOf(headerSep);
    const fileDataStr = filePart.substring(headerEnd + headerSep.length).replace(/\r\n$/, "");
    const fileBuffer = Buffer.from(fileDataStr, "binary");

    const uniqueName = `${Date.now()}_${filename.replace(/[^a-zA-Z0-9._-]/g, "_")}`;

    const { error: uploadError } = await supabase.storage
      .from(BUCKET)
      .upload(uniqueName, fileBuffer, { contentType: mimeType, upsert: false });

    if (uploadError) {
      console.error("Upload error:", uploadError);
      res.status(500).json({ error: "فشل رفع الصورة: " + uploadError.message });
      return;
    }

    const { data: publicUrlData } = supabase.storage.from(BUCKET).getPublicUrl(uniqueName);
    res.json({ url: publicUrlData.publicUrl });
  } catch (err) {
    console.error("Upload route error:", err);
    res.status(500).json({ error: "خطأ في الخادم" });
  }
});

export default router;
