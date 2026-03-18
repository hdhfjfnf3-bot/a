/**
 * Nova Store — Seed Script (Real Products)
 * Run: pnpm --filter @workspace/api-server tsx src/seed.ts
 */
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.SUPABASE_URL!;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error("❌ SUPABASE_URL و SUPABASE_SERVICE_ROLE_KEY مطلوبان");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

/* ═══════════════════════════════════════
   الأقسام
═══════════════════════════════════════ */
const categories = [
  { name: "Skincare",    name_ar: "عناية بالبشرة",    slug: "skincare",    icon: "✨" },
  { name: "Jewelry",    name_ar: "مجوهرات وقلائد",   slug: "jewelry",     icon: "💎" },
  { name: "Electronics",name_ar: "إلكترونيات",        slug: "electronics", icon: "🎧" },
  { name: "Accessories",name_ar: "إكسسوارات",         slug: "accessories", icon: "💍" },
  { name: "Watches",    name_ar: "ساعات ذكية",       slug: "watches",     icon: "⌚" },
  { name: "Fashion",    name_ar: "أزياء رياضية",     slug: "fashion",     icon: "👕" },
  { name: "Cameras",    name_ar: "كاميرات وتصوير",   slug: "cameras",     icon: "📷" },
];

/* ═══════════════════════════════════════
   المنتجات الحقيقية
═══════════════════════════════════════ */
const products = [
  {
    _slug: "skincare", // Changed from "beauty" to "skincare" to match existing categories
    name: "Sunscreen Lotion SPF 50+",
    name_ar: "كريم لوشن واقي من الشمس SPF 50+",
    description_ar: `🌞 حماية مثالية لبشرتك طوال اليوم!
  
🛡️ حماية قصوى SPF 50+ تمنع حروق الشمس وتلف البشرة
💧 خفيف الوزن وغير دهني — سريع الامتصاص ولا يترك أثراً أبيض
⏳ حماية تدوم طويلاً — مثالي للطلعات والمصايف والجامعة
✨ العناية ببشرة الوجه والجسم في منتج واحد
🛡️ يقي من التجاعيد المبكرة والبقع الداكنة الناتجة عن الشمس
💦 مقاوم للعرق والماء لتظل بشرتك محمية دائماً

العناية ببشرتك تبدأ بالحماية الصحيحة ☀️`,
    price: 450,
    original_price: 1080,
    stock: 150,
    featured: true,
    badge: "مميز",
    images: [
      "https://ae-pic-a1.aliexpress-media.com/kf/Sfbafe99c06014515ad8d760c9ae29f55I.jpg_960x960q75.jpg_.avif",
      "https://ae-pic-a1.aliexpress-media.com/kf/S233c8b573a404cbc815cc7c2c440723db.jpg_960x960q75.jpg_.avif",
      "https://ae-pic-a1.aliexpress-media.com/kf/Sa28eca7264954136a299e5eea4842bc2B.jpg_960x960q75.jpg_.avif",
      "https://ae-pic-a1.aliexpress-media.com/kf/Sadf911f0849f43cab7d06dee7b487b51T.jpg_960x960q75.jpg_.avif",
      "https://ae-pic-a1.aliexpress-media.com/kf/Sa6ec5d9befcb43f49ca50482aa4d28bfi.jpg_960x960q75.jpg_.avif",
      "https://ae-pic-a1.aliexpress-media.com/kf/S43609c228111491c9ec457fd78ecb3abq.jpg_960x960q75.jpg_.avif"
    ],
  },

  // ──────────── عناية بالبشرة ────────────

  {
    _slug: "skincare",
    name: "Nova Bamboo Charcoal Black Mask",
    name_ar: "قناع نوفا الأسود بالفحم والخيزران",
    description_ar: `🖤 سر البشرة النقية في أنبوب واحد!

✅ يزيل الرؤوس السوداء من الجذور
🌿 فحم الخيزران الطبيعي ينقي المسام بعمق
🧴 يُقشِّر ويُنظِّف ويُشد البشرة في نفس الوقت
⚡ تأثير Peel-Off ممتع — اسحبي وشوفي النتيجة بعينيكِ!
💆 مناسب لجميع أنواع البشرة — حتى الحساسة
📦 60 جرام — تكفيك أشهر!

استخدميه مرتين أسبوعياً وداعاً للرؤوس السوداء إلى الأبد 👑`,
    price: 280, original_price: 350, stock: 80, featured: true, badge: "الأكثر مبيعاً",
    images: [
      "https://ae-pic-a1.aliexpress-media.com/kf/S193dbbf5a1a14d8382da30d626584e4bh.jpg_960x960q75.jpg_.avif",
      "https://ae-pic-a1.aliexpress-media.com/kf/S28cab24795d1477cbfd2dece866b81bfY.jpg_960x960q75.jpg_.avif",
      "https://ae-pic-a1.aliexpress-media.com/kf/S9a3c0cc1f14544469a3bbb5de7e4bbeak.jpg_960x960q75.jpg_.avif",
    ],
  },

  {
    _slug: "skincare",
    name: "Sakura Hand Cream",
    name_ar: "كريم يد ساكورا المرطب الفاخر",
    description_ar: `🌸 يدانِ ناعمتان كالحرير في دقائق!

🌺 تركيبة يابانية برائحة زهر الكرز الساحرة
💧 ترطيب عميق يدوم 24 ساعة كاملة
🩹 يعالج التشققات والجفاف الشديد بسرعة مذهلة
✨ يُبيِّض ويُشرق البشرة مع الاستخدام المنتظم
🚫 خالٍ من البارابين — آمن 100%
🎁 هدية مثالية وعبوة أنيقة

ضعيه بعد غسيل يديكِ واستمتعي بنعومة لا مثيل لها 💕`,
    price: 110, original_price: 250, stock: 60, featured: true, badge: "خصم 56%",
    images: [
      "https://ae-pic-a1.aliexpress-media.com/kf/S1cb0f58c37104597bc613b064b72946bP.jpg",
      "https://ae-pic-a1.aliexpress-media.com/kf/S65df24657f7f4cb2a9599f9211aa7e510.jpg",
      "https://ae-pic-a1.aliexpress-media.com/kf/S21585d5600eb4bf7ad95e72719884424x.jpg",
      "https://ae-pic-a1.aliexpress-media.com/kf/Sa23c24389fbd446dac064ff5ba83600fU.jpg",
      "https://ae-pic-a1.aliexpress-media.com/kf/S529c9c74f49e43ba83f4114ed035a73eV.jpg",
    ],
  },

  {
    _slug: "skincare",
    name: "Nova Face Lifting Sleep Mask",
    name_ar: "قناع نوفا لنحت الوجه أثناء النوم",
    description_ar: `😴 نامِ وصحِّي بوجه أصغر 10 سنوات!

🔬 تقنية V-Shape تشدّ وترفع الوجه أثناء النوم
💪 يقاوم ترهل البشرة والخدود وخط الفك
🌙 ارتديه ليلاً وشوفي الفرق من أول استخدام
♻️ مرن وقابل للغسيل — يتحمل مئات الاستخدامات
🎯 مناسب لجميع أشكال الوجه
✨ من إصدارات NOVA Beauty الحصرية

سلاحكِ السري ضد التجاعيد وترهل الوجه 👸`,
    price: 150, original_price: 230, stock: 45, featured: true, badge: "جديد",
    images: [
      "https://ae-pic-a1.aliexpress-media.com/kf/Sf19710011b3d44e283062f8896504b7cw.jpg",
      "https://ae-pic-a1.aliexpress-media.com/kf/S71588a3fa04649f78d7b3186d33bbde90.jpg_960x960q75.jpg_.avif",
      "https://ae-pic-a1.aliexpress-media.com/kf/Scfe4ebb9ce8048a4906acc2ac2d8c0659.jpg",
    ],
  },

  {
    _slug: "skincare",
    name: "Deep Pore Nose Strips",
    name_ar: "شرائط تنظيف مسام الأنف العميق",
    description_ar: `👃 وداعاً للرؤوس السوداء إلى الأبد!

⚡ تنظيف عميق للمسام في 15 دقيقة فقط
🧲 تسحب الشوائب والدهون والرؤوس السوداء من الجذور
💦 مرطبة ومغذية للبشرة في نفس الوقت
🌿 تركيبة طبيعية وآمنة للبشرة الحساسة
👁️ للرجال والنساء — مناسب للجميع
📦 عبوة تكفي لأوقات طويلة

الحل الأسهل لأنف نظيف ومسام مفتوحة ✨`,
    price: 120, original_price: 240, stock: 100, featured: false, badge: "خصم 50%",
    images: [
      "https://ae-pic-a1.aliexpress-media.com/kf/S6c3f1f8ede424ea1bab84309948989362.jpg_960x960q75.jpg_.avif",
      "https://ae-pic-a1.aliexpress-media.com/kf/S50b69ea4a47d4c9eb6d675bdcbd96a751.jpg_960x960q75.jpg_.avif",
      "https://ae-pic-a1.aliexpress-media.com/kf/S5813e667d3fc46109ffe78947e92171aw.jpg_960x960q75.jpg_.avif",
      "https://ae-pic-a1.aliexpress-media.com/kf/S9f8bbcb21b8c4d2580ef98d3612d362af.jpg_960x960q75.jpg_.avif",
    ],
  },

  // ──────────── مجوهرات وقلائد ────────────

  {
    _slug: "jewelry",
    name: "Gothic Cross Hip-Hop Necklace",
    name_ar: "قلادة الصليب القوطي الرجالية",
    description_ar: `⛓️ اجعل إطلالتك لا تُنسى!

🖤 تصميم Gothic فريد — لا تجده عند الجميع
💀 فولاذ مقاوم للصدأ — لا يتغير لونه أبداً
✨ تفاصيل دقيقة محفورة باحترافية عالية
🎸 مثالية لعشاق الـ Hip-Hop والـ Rock
🎁 هدية مذهلة للرجال والنساء
🛡️ محجوبة ضد التعرق والإجهاد والتآكل

اجعل قلادتك تتكلم قبل أن تنطق أنت 💪`,
    price: 220, original_price: 340, stock: 35, featured: true, badge: "حصري",
    images: [
      "https://ae-pic-a1.aliexpress-media.com/kf/S6811db86545c48a99d05470b6cadfef6o.jpg_960x960q75.jpg_.avif",
      "https://ae-pic-a1.aliexpress-media.com/kf/S1dd02a6ca6dd4837bb79cf01f3b959cdC.jpg_220x220q75.jpg_.avif",
      "https://ae-pic-a1.aliexpress-media.com/kf/S3e0d1dd0d6454fe2b33151aa3fcab7fdD.jpg_220x220q75.jpg_.avif",
    ],
  },

  {
    _slug: "jewelry",
    name: "NOVA Silver Heart Necklace",
    name_ar: "قلادة نوفا قلب فضي ساحر",
    description_ar: `💕 أجمل هدية تُهديها لمن تحب!

🤍 تصميم قلب رقيق وبسيط ومثير في نفس الوقت
🔗 سلسلة سحرية ناعمة تناسب كل إطلالة
✨ لون فضي لامع لا يؤكسد ولا يتغير
👗 تتناسب مع كل الملابس — كاجوال وعروس وسهرة
💝 الهدية المثالية للأعياد والذكريات
NOVA — Wear Your Story

المجوهرات الصحيحة تكمل الأناقة ولا تزعجها 👑`,
    price: 55, original_price: 100, stock: 120, featured: true, badge: "الأكثر مبيعاً",
    images: [
      "https://ae-pic-a1.aliexpress-media.com/kf/Sa510f0a619e945d6ad4a130404671d61t.jpg",
      "https://ae-pic-a1.aliexpress-media.com/kf/S391cec71275a48b4bd108bf4b450fca9U.jpg_960x960q75.jpg_.avif",
      "https://ae-pic-a1.aliexpress-media.com/kf/S092b2c17d554400f99132c570b626a7bE.jpg_960x960q75.jpg_.avif",
      "https://ae-pic-a1.aliexpress-media.com/kf/Se7ebac575892401fa1a8d11f7b0f50988.jpg_960x960q75.jpg_.avif",
    ],
  },

  {
    _slug: "jewelry",
    name: "Ahura Mazda Gold Talisman",
    name_ar: "قلادة أهورا مازدا الذهبية — تميمة النور",
    description_ar: `🔥 رمز القوة والحكمة والنور في قلادة واحدة!

⭐ مستوحاة من الحضارة الفارسية الزرادشتية العريقة
🥇 طلاء ذهبي فاخر لا يتآكل
🧿 تُعتقد بأنها تجلب الطاقة الإيجابية والحماية
💡 نقش دقيق لرمز النار المقدسة الأيقوني
🎁 هدية فريدة نادرة لا يستطيع الجميع اقتناءها
🎭 تناسب شخصية مميزة وفريدة

للرجال الذين يحملون روح الملوك ✨`,
    price: 170, original_price: 280, stock: 25, featured: false, badge: "نادر",
    images: [
      "https://ae-pic-a1.aliexpress-media.com/kf/S5a9d0dfa01a9437ba6ee0ba1a7382133L.jpg_960x960q75.jpg_.avif",
    ],
  },

  {
    _slug: "jewelry",
    name: "Gold Heart Titanium Choker",
    name_ar: "طوق قلب ذهبي من التيتانيوم",
    description_ar: `💛 جمال فاخر بسعر لا يُصدَّق!

🏆 تيتانيوم بدرجة طبية — لا تحسسات
✨ طلاء ذهبي 18 قيراط فاخر
❤️ تصميم قلب عصري يجذب الأنظار
🌟 مجوهرات فاخرة Luxury بسعر عادل
💍 تناسب المناسبات والحياة اليومية
📦 تأتيك في علبة هدايا أنيقة

استحقي الفخامة في كل لحظة 👑`,
    price: 70, original_price: 150, stock: 80, featured: true, badge: "خصم 53%",
    images: [
      "https://ae-pic-a1.aliexpress-media.com/kf/S63ad9b8ac052482bb128ff5552e85f11n.jpg_960x960q75.jpg_.avif",
      "https://ae-pic-a1.aliexpress-media.com/kf/S6b0b90119dbd4b1594c95b3e21a1e521I.jpg_960x960q75.jpg_.avif",
      "https://ae-pic-a1.aliexpress-media.com/kf/S632bfff7bfa44352aa568fe4de6b8e6bq.jpg_960x960q75.jpg_.avif",
    ],
  },

  {
    _slug: "jewelry",
    name: "Crystal Stainless Chain Necklace",
    name_ar: "قلادة كريستال مع سلسلة فاخرة",
    description_ar: `💎 أناقة تتكلم قبل أن تنطق!

🌊 فولاذ طبي مقاوم للصدأ — يصحبكِ مدى الحياة
💠 كريستال شفاف يعكس الضوء بشكل ساحر
🌟 تصميم عصري يناسب كل الأذواق
👒 للسهرات والحفلات وارتداء يومي راقٍ
🎀 هدية الـ"لازم تبقى عندها" في خزانتها
📐 متعددة الأحجام لتناسب كل رقبة

اختاري المجوهرات التي تحكي قصتكِ ✨`,
    price: 100, original_price: 190, stock: 55, featured: false, badge: "جديد",
    images: [
      "https://ae-pic-a1.aliexpress-media.com/kf/Scc012b26d42e49f6ae45605b74bf3919n.jpg",
      "https://ae-pic-a1.aliexpress-media.com/kf/S9fe9b56fa34c45669ccdb49c482fb880m.jpg_960x960q75.jpg_.avif",
      "https://ae-pic-a1.aliexpress-media.com/kf/S20cced728d5747c78e2c76724a34a8923.jpg_960x960q75.jpg_.avif",
      "https://ae-pic-a1.aliexpress-media.com/kf/S2133161f244048ba9b552b2496c9cdceC.jpg",
    ],
  },

  {
    _slug: "jewelry",
    name: "NOVA Cat Couple BFF Necklace",
    name_ar: "قلادة نوفا القطة — للأصدقاء المقربين",
    description_ar: `🐱 لأن بعض الصداقات تستحق أن تُخلَّد!

💞 قلادة ثنائية للأزواج أو أعز صديقتين
🐾 تصميم قط يعانق — رمز الحب الأصيل
🔗 فولاذ مقاوم للصدأ — لا يتغير ولا يصدأ
✨ من مجموعة NOVA الحصرية لعلاقات لا تُنسى
🎁 تأتيك في علبة هدايا فاخرة
💝 مثالية للأعياد وذكريات الميلاد

لأن من اخترتيها له يستحق أجمل الهدايا 🐈‍⬛`,
    price: 135, original_price: 250, stock: 40, featured: true, badge: "NOVA",
    images: [
      "https://ae-pic-a1.aliexpress-media.com/kf/S1de0fbdcd9094bcfa50e46dd5958a9bbI.jpg_960x960q75.jpg_.avif",
      "https://ae-pic-a1.aliexpress-media.com/kf/S86f70de5711b4c7b8ec911b4692709ccL.jpg_960x960q75.jpg_.avif",
    ],
  },

  {
    _slug: "jewelry",
    name: "Stars & Moon Galaxy Necklace",
    name_ar: "قلادة النجوم والقمر — سحر الكون",
    description_ar: `🌙 اجعلي السماء تُزيِّن عنقكِ!

⭐ تصميم مستوحى من النجوم والمجرات
🌟 كوارتز لامع يحاكي ضوء الكواكب
🔗 سلسلة ترقوة خفيفة وأنيقة
✨ يُضيء بشكل رائع تحت الإضاءة
📿 فولاذ طبي — لبشرة بدون تهيج أبداً
🎭 مناسبة للعصريات ومحبات الـ Boho

لأن بعض المجوهرات تصل إلى القلب مباشرة 💫`,
    price: 199, original_price: 375, stock: 30, featured: true, badge: "حصري",
    images: [
      "https://ae-pic-a1.aliexpress-media.com/kf/S236f4c01d9ef443bb80d94aed117b32aO.jpg_960x960q75.jpg_.avif",
      "https://ae-pic-a1.aliexpress-media.com/kf/S926a7e9ebc354de08d930de2c3e2d052G.jpg_960x960q75.jpg_.avif",
    ],
  },

  // ──────────── إكسسوارات ────────────

  {
    _slug: "accessories",
    name: "Gold Dollar Hip-Hop Ring",
    name_ar: "خاتم الدولار الهيب هوب الذهبي",
    description_ar: `💰 خاتم يقول كل شيء بدون كلام!

🥇 طلاء ذهبي فاخر بتصميم حرف مميز
👑 مستوحى من ثقافة الـ Hip-Hop الأيقونية
💪 مناسب لجميع المناسبات الجريئة والحفلات
🎭 يعكس شخصية واثقة من نفسها
🖐️ متوفر بأحجام متعددة
🔑 من مجموعة NOVA الذكورية الحصرية

الخاتم الذي يجعلكم في كل محفل نجماً ⭐`,
    price: 200, original_price: 290, stock: 25, featured: false, badge: "Hip-Hop",
    images: [
      "https://ae-pic-a1.aliexpress-media.com/kf/S28019aeb52bd411ba932a52a629e11dbP.jpg_960x960q75.jpg_.avif",
      "https://ae-pic-a1.aliexpress-media.com/kf/S18492d2f463e4669b8342a86a6f73602t.jpg_960x960q75.jpg_.avif",
    ],
  },

  // ──────────── إلكترونيات ────────────

  {
    _slug: "electronics",
    name: "NOVA LED Neckband Bluetooth Headset",
    name_ar: "سماعات نوفا بلوتوث حول الرقبة LED",
    description_ar: `🎵 صوت استثنائي + ستايل لافت للنظر!

💡 شاشة LED ديناميكية تُضيء أثناء التشغيل
🔊 صوت Bass قوي + ستيريو ثلاثي الأبعاد رهيب
📡 بلوتوث 5.0 — اتصال فوري ومستقر
💧 مقاوم للماء والعرق — مثالي للرياضة
🔋 بطارية تدوم 8 ساعات متواصلة
🎤 ميكروفون HD للمكالمات الواضحة
NOVA — Where Performance Meets Style

تجربة صوتية ستُغيِّر طريقتك في الاستماع 🎧`,
    price: 150, original_price: 300, stock: 30, featured: true, badge: "NOVA",
    images: [
      "https://ae-pic-a1.aliexpress-media.com/kf/Sd339f4a78ff14b6f8dfdbd833c01a3844.jpg",
      "https://ae-pic-a1.aliexpress-media.com/kf/Sa1c4666985764299b403a44eda75bc85I.png_960x960.png_.avif",
      "https://ae-pic-a1.aliexpress-media.com/kf/S8d301f3f326f4315a82981dd7d26c9a9R.png",
      "https://ae-pic-a1.aliexpress-media.com/kf/S74331653e51742128d6860ce647385a34.jpg_960x960q75.jpg_.avif",
    ],
  },

  {
    _slug: "skincare",
    name: "SHI-GLAM 7-Day Nail Repair Pen",
    name_ar: "قلم SHI-GLAM لتجديد الأظافر في 7 أيام",
    description_ar: `💅 أظافر جميلة وصحية في أسبوع واحد فقط!

✨ نتائج واضحة خلال 7 أيام — مش شهور!
💛 تركيبة سيروم ذهبية تغذّي وتعالج الأظافر المتقصفة
🌟 يمنح الأظافر لمعاناً وحيويةً فورية من أول استخدام
🛡️ يحمي الأظافر من التكسر والتقشر والهشاشة
🎨 يصلح كطلاء أساسي فاخر تحت أي طلاء آخر
👩‍⚕️ تركيبة طبية آمنة بدون كيماويات ضارة

🔑 طريقة الاستخدام:
• ضعيه على الأظافر مرة أو مرتين يومياً
• اتركيه يُمتص لمدة دقيقتين
• شوفي النتيجة المذهلة بنفسك بعد 7 أيام! 🤯

NOVA × SHI-GLAM — Because Your Nails Deserve More 👑`,
    price: 99, original_price: 199, stock: 150, featured: true, badge: "الأكثر مبيعاً",
    images: [] as string[],
  },
  // --- الأزياء الرياضية ---
  {
    _slug: "fashion",
    name: "Ombre Ultra-Active Men's T-Shirt",
    name_ar: "تي شيرت أومبري الرياضي - الجيل الأحدث",
    description_ar: "🏃‍♂️ الأداء المتميز يبدأ من راحتك!\n\n✨ تي شيرت رياضي فاخر بتصميم أومبري متدرج الألوان، ليمنحك إطلالة عصرية ومميزة.\n🧊 مصنوع من نسيج الحرير الجليدي البارد الذي يمتص العرق فوراً ليوفر أقصى درجات التهوية والانتعاش أثناء الجري وتمارين الجيم الشاقة.\n🛡️ مرونة واستدامة: لا ينكمش، لا يتغير لونه بعد الغسيل، ويحتفظ ببريقه وكأنه جديد دائماً.\n\nاختيارك الأول لكل تحدي رياضي 💪",
    price: 899, original_price: 1900, stock: 150, featured: true, badge: "جديد",
    images: [
      "https://ae-pic-a1.aliexpress-media.com/kf/S311749c1df504df391b9b023df80d207B.jpg?has_lang=1&ver=1_960x960q75.jpg_.avif",
      "https://ae-pic-a1.aliexpress-media.com/kf/Sa69a46210fa74489a6123bd6b2f3c1b8w.jpg?has_lang=1&ver=1_960x960q75.jpg_.avif",
      "https://ae-pic-a1.aliexpress-media.com/kf/S82e1aa2e80ce45878d276affce53af39D.jpg_960x960q75.jpg_.avif",
      "https://ae-pic-a1.aliexpress-media.com/kf/Sdcb987f1de144371abba4bd38a6bd9fej.jpg_960x960q75.jpg_.avif",
      "https://ae-pic-a1.aliexpress-media.com/kf/S97c2def15b8e494885e914d3780d4626z.jpg_960x960q75.jpg_.avif"
    ]
  },
  {
    _slug: "fashion",
    name: "Aero-Thermal 3D Dry-Fit T-Shirt",
    name_ar: "تي شيرت أيرو الحراري للرياضيين — Dry Fit",
    description_ar: "🔥 أقصى درجات المرونة والحرية أثناء التمرين!\n\n⚡ تي شيرت رياضي صيفي بتقنية الطباعة ثلاثية الأبعاد، مُصمم كقطعة عملية تواكب الموضة.\n💨 تقنية Dry-Fit المتطورة لطرد العرق وتوفير تهوية مثالية تحافظ على برودة الجسم وتجفافه السريع.\n💎 مثالي للتمارين الخارجية واللياقة البدنية الشديدة.\n\nلا تدع العرق يوقفك، انطلق نحو أهدافك 🏆",
    price: 599, original_price: 1400, stock: 120, featured: true, badge: "خصم",
    images: [
      "https://ae-pic-a1.aliexpress-media.com/kf/S8163c6600480426bbdaad5085053a6a6K.jpg_960x960q75.jpg_.avif",
      "https://ae-pic-a1.aliexpress-media.com/kf/S5279cb026ee5476585d9ce86a3f7cdf1t.jpg_960x960q75.jpg_.avif",
      "https://ae-pic-a1.aliexpress-media.com/kf/S2b6e1efd479e4f2ebfc02906c9c56e0bL.jpg_960x960q75.jpg_.avif",
      "https://ae-pic-a1.aliexpress-media.com/kf/S70dee9b757e044da915d31ea9db8e7f3F.jpg_960x960q75.jpg_.avif",
      "https://ae-pic-a1.aliexpress-media.com/kf/Sd9251b1e31a541a9ac98d611689b296e1.jpg_960x960q75.jpg_.avif",
      "https://ae-pic-a1.aliexpress-media.com/kf/S14f53fb830c6494fb7ab52314d32d207s.jpg_960x960q75.jpg_.avif"
    ]
  },
  {
    _slug: "fashion",
    name: "Pro-Active V5 Compression T-Shirt",
    name_ar: "تي شيرت البرو أكتيف — الجيل الخامس للتمرين",
    description_ar: "🏋️‍♂️ رفيقك المثالي لتحطيم الأرقام القياسية!\n\n🚀 أداء استثنائي يجمع بين التصميم المريح والديناميكية الرياضية لتدريباتك الشاقة.\n💧 قماش ممتاز يطرد العرق ويوفر لمسة تبريد فورية لتبقى مرتاحاً لساعات طويلة.\n🎯 مقاسات متنوعة تلبي تطلعات الشباب للجمع بين الراحة والأناقة.\n\nتي شيرت واحد لجميع تحدياتك 🌟",
    price: 1099, original_price: 2200, stock: 80, featured: true, badge: "أكثر مبيعاً",
    images: [
      "https://ae-pic-a1.aliexpress-media.com/kf/Sb6cc177a78864c8c9e84f97e0e8adf4cu.jpg_960x960q75.jpg_.avif",
      "https://ae-pic-a1.aliexpress-media.com/kf/S426b419dcf824c6798459a88613625c06.jpg_960x960q75.jpg_.avif",
      "https://ae-pic-a1.aliexpress-media.com/kf/S90181bd4d916475c988e5e9c12a05969s.jpg_960x960q75.jpg_.avif",
      "https://ae-pic-a1.aliexpress-media.com/kf/S11ea12fabb9e48099c1f36f0e15522f5k.jpg",
      "https://ae-pic-a1.aliexpress-media.com/kf/S0cb08e1d21da46d2b542e24d11e34935i.jpg_960x960q75.jpg_.avif"
    ]
  },
  {
    _slug: "fashion",
    name: "Max-Air Dynamic Sport T-Shirt",
    name_ar: "تي شيرت ماكس إير الديناميكي الرياضي",
    description_ar: "⚡ طاقة أكبر، جهد أقل مع تي شيرت ماكس إير!\n\n🏃‍♂️ قُصة تكتيكية توفر حرية تامة وتمنع الاحتكاك المزعج أثناء الجري واليوجا والتدريبات البدنية.\n🌬️ نسيج عالي التهوية يمنع تراكم البكتيريا المسببة للروائح لتبقى منتعشاً طوال الوقت.\n\nاختيار المدربين والرياضيين المحترفين 🥇",
    price: 599, original_price: 1400, stock: 95, featured: true, badge: "عرض خاص",
    images: [
      "https://ae-pic-a1.aliexpress-media.com/kf/S01f0aeed2abe43a6ae090e5c736fe2fcQ.jpg_960x960q75.jpg_.avif",
      "https://ae-pic-a1.aliexpress-media.com/kf/Sa35840b63808424898ae9bb5d7492bacR.jpg_960x960q75.jpg_.avif",
      "https://ae-pic-a1.aliexpress-media.com/kf/S963401ba030f4345a870d1c9a037b0b7B.jpg_960x960q75.jpg_.avif",
      "https://ae-pic-a1.aliexpress-media.com/kf/Sb4ca4f6dc6a5438e9f1aeebca3cbcc2d8.jpg_960x960q75.jpg_.avif",
      "https://ae-pic-a1.aliexpress-media.com/kf/S6712a0fb645a4e869498db3cd925e04eL.jpg_960x960q75.jpg_.avif",
      "https://ae-pic-a1.aliexpress-media.com/kf/Sde84df717e58430790b4b328d57d1540g.jpg_960x960q75.jpg_.avif",
      "https://ae-pic-a1.aliexpress-media.com/kf/Scb41b4f6e7d64499ab861270792d5bc0C.jpg_960x960q75.jpg_.avif"
    ]
  },

  // --- الساعات الذكية ---
  {
    _slug: "watches",
    name: "S-Shock Tactical Military Watch",
    name_ar: "ساعة S-Shock التكتيكية العسكرية — مقاومة للماء",
    description_ar: "⌚ ساعة الرجال المهام الصعبة!\n\n🛡️ ساعة رياضية شديدة التحمل مصممة للاستخدام العسكري القاسي.\n💧 مقاومة للماء والصدمات والعرق، وتتحمل أصعب الظروف البيئية.\n💡 شاشة إلكترونية رياضية مضيئة ليلاً وتوقيت متعدد الوظائف للطلاب والرياضيين والمغامرين.\n\nالساعة المثالية لأصحاب الحركة الدائمة 🏞️",
    price: 250, original_price: 800, stock: 200, featured: true, badge: "جديد",
    images: [
      "https://ae-pic-a1.aliexpress-media.com/kf/Scd86c55b5a0043e3a0dea0f03e69f7f6N.jpg_960x960q75.jpg_.avif",
      "https://ae-pic-a1.aliexpress-media.com/kf/S7c5ea76a3bbc4a8bba6af21e6009ba39i.jpg_960x960q75.jpg_.avif",
      "https://ae-pic-a1.aliexpress-media.com/kf/Sf65d841a209a48389123db18204e3845A.jpg_960x960q75.jpg_.avif",
      "https://ae-pic-a1.aliexpress-media.com/kf/Sffe87bddbcff459e8ee86a3b8b4dd121I.jpg_960x960q75.jpg_.avif"
    ]
  },
  {
    _slug: "watches",
    name: "Nova Series 9 Smart Watch GPS",
    name_ar: "ساعة Nova Series 9 الذكية — ألترا GPS",
    description_ar: "🔥 الذكاء الحقيقي التفاحي في إصدار نوفا المطلق!\n\n📱 شاشة دائمة التشغيل Always-On أنيقة مع دعم شامل وتوافق تام مع نظامي iOS وأندرويد.\n📍 نظام لتحديد المواقع (GPS)، متتبع للأنشطة المختلفة، ومكالمات بلوتوث بنقاء فائق.\n❤️ قياس لدرجة حرارة الجسم ومعدّل ضربات القلب لتتبع صحي دقيق على مدار الـ 24 ساعة.\n🔗 خاصية الدفع عبر NFC ومزايا نسائية مخصصة.\n\nأقوى بديل وأناقة في معصمك 👑",
    price: 1500, original_price: 3500, stock: 45, featured: true, badge: "متكاملة",
    images: [
      "https://ae-pic-a1.aliexpress-media.com/kf/S6ff7dd5a7ed4453ea5844a3cf212d705g.jpg_960x960q75.jpg_.avif",
      "https://ae-pic-a1.aliexpress-media.com/kf/Seb08116ca53b46e0862cf82e2a20b1f0S.jpg_960x960q75.jpg_.avif",
      "https://ae-pic-a1.aliexpress-media.com/kf/S4bc41b997af24393a14c876e769596fah.jpg_960x960q75.jpg_.avif",
      "https://ae-pic-a1.aliexpress-media.com/kf/S4eb399db3e7e4d0e818c5871fa3039490.jpg_960x960q75.jpg_.avif",
      "https://ae-pic-a1.aliexpress-media.com/kf/Sdc5d926011d043b4900bc2bfb87bfb1cm.jpg_960x960q75.jpg_.avif",
      "https://ae-pic-a1.aliexpress-media.com/kf/Sbab029eeb0c04e4a9711e2ed19ad205cI.jpg_960x960q75.jpg_.avif",
      "https://ae-pic-a1.aliexpress-media.com/kf/Sf168ff8240a346eba83ee507a85625efX.jpg_960x960q75.jpg_.avif",
      "https://ae-pic-a1.aliexpress-media.com/kf/S9d38aac0ea4e4314909d6a46de905bb35.jpg_960x960q75.jpg_.avif",
      "https://ae-pic-a1.aliexpress-media.com/kf/S7dd938d54f9c4868b57117faab3fb00bI.jpg_960x960q75.jpg_.avif",
      "https://ae-pic-a1.aliexpress-media.com/kf/S508938a222d9456dad531e6013262006A.jpg_960x960q75.jpg_.avif"
    ]
  },
  {
    _slug: "watches",
    name: "Nova Ultra 8 AMOLED 49mm",
    name_ar: "ساعة Nova Ultra 8 الذكية — إصدار 49MM",
    description_ar: "🏆 قمة الفخامة الرياضية لعشاق ساعة الألترا الشهيرة!\n\n💎 شاشة AMOLED ناصعة بحجم 2.3 بوصة وحواف 49 مللي متر من الصلب المقاوم للإجهاد.\n💧 بوصلة دقيقة ومقاومة حقيقية للماء، مما يجعلها مثالية للرياضات المائية والبرية.\n📲 تقترن بسهولة فائقة مع جميع الهواتف الذكية (Android). أضف لمسة النخبة لعروضك الرياضية 2025.\n\nاختيار من يبحث عن التميز والصلابة البارزة 🖤",
    price: 699, original_price: 1800, stock: 75, featured: true, badge: "Ultra",
    images: [
      "https://ae-pic-a1.aliexpress-media.com/kf/Sdd5f7624b858495d93681fd227d06b67x.jpg?has_lang=1&ver=2_960x960q75.jpg_.avif",
      "https://ae-pic-a1.aliexpress-media.com/kf/S2616eb14d6724ff0864a7fe285ece88bq.jpg?has_lang=1&ver=2_960x960q75.jpg_.avif",
      "https://ae-pic-a1.aliexpress-media.com/kf/Se440f880b8f34598bbc79a4c3a66ec93s.jpg?has_lang=1&ver=2_960x960q75.jpg_.avif",
      "https://ae-pic-a1.aliexpress-media.com/kf/S6c510878cdb44af89e2313aa9b588752T.jpg?has_lang=1&ver=2_960x960q75.jpg_.avif",
      "https://ae-pic-a1.aliexpress-media.com/kf/S0740b9434b3e453881272347c3aeac75h.jpg?has_lang=1&ver=2_960x960q75.jpg_.avif",
      "https://ae-pic-a1.aliexpress-media.com/kf/S4b10924020f544e89c6efa3d0219476fU.jpg_960x960q75.jpg_.avif"
    ]
  },
  {
    _slug: "watches",
    name: "Nova Galaxy Classic 8 AMOLED",
    name_ar: "ساعة Nova Galaxy Classic — إصدار البريميوم",
    description_ar: "✨ الكلاسيكية والتكنولوجيا المتقدمة في إطار دائري لامع!\n\n⌚ ساعة بديلة لأرقى ساعات جالاكسي بقطر 47 مللي متر وشاشة AMOLED متطورة لتقوم بمقام ساعتك الكلاسيكية في السهرات وساعتك الرياضية في الجيم.\n🩺 مستشعرات طبية دقيقة للياقة البدنية والمشاهدة الصحية عبر اتصال بلوتوث للمكالمات عالي الوضوح.\n🎫 تدعم NFC وتحديد المواقع في شكل دائري كلاسيكي جذاب يبرز أناقة الرجل العصري.\n\nلرِجال الأعمال والأناقة الكلاسيكية الحصرية 🎩",
    price: 2000, original_price: 3000, stock: 40, featured: true, badge: "Premium",
    images: [
      "https://ae-pic-a1.aliexpress-media.com/kf/S035b64640b7440acb90f9134d87d3786b.jpg?has_lang=1&ver=2_960x960q75.jpg_.avif",
      "https://ae-pic-a1.aliexpress-media.com/kf/S342536c4447d4a5c85ed350d626d1dcdX.jpg?has_lang=1&ver=2_960x960q75.jpg_.avif",
      "https://ae-pic-a1.aliexpress-media.com/kf/Sb9ff3ad0ef054dc4ab0a22211e82fb2bT.jpg?has_lang=1&ver=2_960x960q75.jpg_.avif",
      "https://ae-pic-a1.aliexpress-media.com/kf/Sf3974efdd13a4d989a402da788d888ean.jpg?has_lang=1&ver=2_960x960q75.jpg_.avif",
      "https://ae-pic-a1.aliexpress-media.com/kf/Sc8db74acce0b4134894cd2b7e2875795m.jpg?has_lang=1&ver=2_960x960q75.jpg_.avif",
      "https://ae-pic-a1.aliexpress-media.com/kf/S442941986f4a4319b0522f04b853f57dp.jpg_960x960q75.jpg_.avif",
      "https://ae-pic-a1.aliexpress-media.com/kf/S85e4641f12104759b32b228f97e5ca2aU.jpg_960x960q75.jpg_.avif"
    ]
  },
  {
    _slug: "watches",
    name: "Tactical Nylon Watch Strap",
    name_ar: "حزام نوفا التكتيكي لساعات أبل والألترا",
    description_ar: "🔌 اضمن ساعتك ولا تتخلى عن روح المغامرة!\n\n🔗 حزام عسكري من نسيج النايلون والمظلات (Parachute) مصمم ليتحمل الشد العنيف، مثالي للرحلات والإكستريم سبورتس.\n📏 متوافق تماماً مع جميع إصدارات ساعة أبل و iWatch للقياسات (41 - 49 مللي متر) وحتى السلسلة 8 والألترا.\n💯 يضمن عدم انزلاق المعصم ويوفر مرونة تنفس عالية للجلد مهما كانت درجة تعرقك.\n\nالحزام المثالي للمعصم القوي 🛡️",
    price: 250, original_price: 500, stock: 110, featured: false, badge: "خصم",
    images: [
      "https://ae-pic-a1.aliexpress-media.com/kf/S2dedd207a37145beba23e822fc29f3d3W.jpg?has_lang=1&ver=2_960x960q75.jpg_.avif",
      "https://ae-pic-a1.aliexpress-media.com/kf/S3b201f2f1b9545119d2f618d1cf27ff4A.jpg?has_lang=1&ver=2_960x960q75.jpg_.avif",
      "https://ae-pic-a1.aliexpress-media.com/kf/Sb2baf66b21d4424093365b7343bcb38e8.jpg_960x960q75.jpg_.avif",
      "https://ae-pic-a1.aliexpress-media.com/kf/S973515f917f34330b117ac8eb4e6b6d40.jpg?has_lang=1&ver=2_960x960q75.jpg_.avif",
      "https://ae-pic-a1.aliexpress-media.com/kf/S709ce3df536549488214dbbbbe589dd4s.jpg_960x960q75.jpg_.avif"
    ]
  },
  {
    _slug: "watches",
    name: "Huawei Watch Ultimate Design",
    name_ar: "ساعة Huawei Ultimate Design — الياقوت والذهب",
    description_ar: "⚜️ التحفة الفنية الأغلى والأندر بين يديك اليوم!\n\n황 إطار وتفاصيل مرصعة بالذهب عيار 18 مع شاشة ياقوتية من نوع LTPO AMOLED مقاس 1.5 بوصة لتتفجر بالألوان بدقة مذهلة.\n📱 تعمل بنظام Harmony OS الأيقوني وتجمع بين التميز السويسري في التصميم وتقنيات هواوي الجبارة، إضافة لبطارية عملاقة تدوم طويلاً وتدعم الاتصال البلوتوث العميق.\n💎 ساعة لكبار الشخصيات ورجال الأعمال، تجسد الرفاهية المكتملة دون أي مساومة.\n\nاقتنِ قمة التكنولوجيا والرفاهية العصرية الملكية 👑",
    price: 215000, original_price: 290000, stock: 5, featured: true, badge: "نادر وحصري",
    images: [
      "https://ae-pic-a1.aliexpress-media.com/kf/S39be84c1c66d4153a8b13ac36cbb4eedX.jpg_960x960q75.jpg_.avif",
      "https://ae-pic-a1.aliexpress-media.com/kf/S7d2243f5bc25474ea7cac8e15ffe9a653.jpg_960x960q75.jpg_.avif",
      "https://ae-pic-a1.aliexpress-media.com/kf/S7dc6e76a46754faeab532024e50ca2b12.jpg_960x960q75.jpg_.avif",
      "https://ae-pic-a1.aliexpress-media.com/kf/Sb7ce0755bbb64ea0858cf63c757a5ac3O.jpg_960x960q75.jpg_.avif",
      "https://ae-pic-a1.aliexpress-media.com/kf/Saca675b7308d41d0858c6697173902c1d.png_960x960.png_.avif",
      "https://ae-pic-a1.aliexpress-media.com/kf/Se3aaa1855c3643719f6bf5bd9dd22546u.png_960x960.png_.avif"
    ]
  },
  {
    _slug: "watches",
    name: "Morata Medical Smartwatch ECG",
    name_ar: "ساعة نوفا الطبية المتقدمة — قياس ضغط الدم وECG",
    description_ar: "❤️ حارس صحتك المتقدم بين يديك 24 ساعة!\n\n🩺 ثورة في عالم الساعات الذكية! مزودة بمضخة هواء فعلية لتقديم قياس بالغ الدقة لضغط الدم يضاهي الأجهزة الطبية الخارجية، بالإضافة لدعم تخطيط القلب (ECG).\n📱 شاشة AMOLED نانوية فائقة التوصيل مغطاة بالزجاج المتين.\n🔋 تدعم NFC وحلول الدفع والمراقبة الرياضية لكبار السن واليافعين.\n\nحافظ على صحة من تحب بأقوى أداة طبية ذكية ⚕️",
    price: 50000, original_price: 150000, stock: 15, featured: true, badge: "طبي معتمد",
    images: [
      "https://ae-pic-a1.aliexpress-media.com/kf/Sdb36874cdd15497c817afd2d38e704cdc.jpg_960x960q75.jpg_.avif",
      "https://ae-pic-a1.aliexpress-media.com/kf/Sf29cfc0ea6464a75819d99f1d1b5c6c2c.jpg_960x960q75.jpg_.avif",
      "https://ae-pic-a1.aliexpress-media.com/kf/Sd4ef61ab0f314a54b48a6418bf64952cI.jpg_960x960q75.jpg_.avif",
      "https://ae-pic-a1.aliexpress-media.com/kf/Sefc757c8a8e64325ab2551fc3ef05bf5T.jpg_960x960q75.jpg_.avif",
      "https://ae-pic-a1.aliexpress-media.com/kf/S6cc782be8a6d4365b6c56910ce3238cdx.jpg_960x960q75.jpg_.avif",
      "https://ae-pic-a1.aliexpress-media.com/kf/Sb64e31c72b624cdcada44d3cc12e7130y.jpg_960x960q75.jpg_.avif",
      "https://ae-pic-a1.aliexpress-media.com/kf/S2068ed618eef4ec3a8b9e6816bd42d28l.jpg_960x960q75.jpg_.avif",
      "https://ae-pic-a1.aliexpress-media.com/kf/Sc2700554ad6643f48d105512a3ac8c99P.jpg_960x960q75.jpg_.avif"
    ]
  },

  // --- الإلكترونيات ---
  {
    _slug: "electronics",
    name: "High Speed Ionic Hair Dryer",
    name_ar: "مجفف الشعر الأيوني السريع — صالون احترافي",
    description_ar: "✨ تجفيف أسرع 3 مرات مع حماية مطلقة وحيوية لشعرك!\n\n🌪️ مجفف شعر عالي الطاقة وتقنية متطورة يبث إشعاع الضوء الأزرق والهواء المتوازن للحصول على نعومة خيالية بدون أي هيشان.\n🧊 أزرار تحكم سلسة بالهواء البارد والساخن وتصميم كاتم للصوت الفائق للاستخدام المريح الممتد.\n⚡ مناسب للسفر وإعدادات الاتحاد الأوروبي والمملكة المتحدة بموتور قوي يعتمد عليه.\n\nاحصلي على الجودة الفندقية الفاخرة يومياً في منزلك 💇‍♀️",
    price: 2000, original_price: 3500, stock: 50, featured: true, badge: "الأكثر مبيعاً",
    images: [
      "https://ae-pic-a1.aliexpress-media.com/kf/S7ced3ea23817478b8b9f08b670eb14b7A.jpg_960x960q75.jpg_.avif",
      "https://ae-pic-a1.aliexpress-media.com/kf/Sa309ac203caf45599c8a96871e3121564.jpg_960x960q75.jpg_.avif",
      "https://ae-pic-a1.aliexpress-media.com/kf/S82d92fe2c8154856b0ab06f615d8e0f0p.jpg_960x960q75.jpg_.avif",
      "https://ae-pic-a1.aliexpress-media.com/kf/S1def5e7daf464e47847c331700d850521.png_960x960.png_.avif",
      "https://ae-pic-a1.aliexpress-media.com/kf/Sea3c6b402a60400ca75876a5e2c2b6c85.jpg_960x960q75.jpg_.avif"
    ]
  },
  {
    _slug: "electronics",
    name: "Xiaomi Mijia High Speed Pro Hair Dryer",
    name_ar: "سشوار Xiaomi المائي الاحترافي — إصدار البرو",
    description_ar: "🚀 القوة الجبارة والترطيب العميق من العملاق شاومي!\n\n🌬️ موتور يدور بـ 110 ألف دورة بالدقيقة ينتج رياح بسرعة 70 متر/ثانية لتجفيف شعرك في أقل من ثلث الوقت المعتاد!\n💧 يقذف 200 مليون أيون مائي سالب ليغلق بصيلات الشعر ويحميها عند 50 درجة مئوية ثابتة (لا ضرر حراري تماماً).\n⚙️ يحتوي على 8 أوضاع مختلفة لتدفق الهواء بشاشة عصرية ومكثف هواء لتصفيف صالون مثالي.\n\nتكنولوجيا شاومي الذكية لشعر صحي دائماً 💎",
    price: 9000, original_price: 15000, stock: 25, featured: true, badge: "شاومي الأصلي",
    images: [
      "https://ae-pic-a1.aliexpress-media.com/kf/Sd3ffaa45347248158b827f243748d9b5J.jpg_960x960q75.jpg_.avif",
      "https://ae-pic-a1.aliexpress-media.com/kf/S3e32bd0d6f7645cfbf296aa670534147p.jpg?has_lang=1&ver=2_960x960q75.jpg_.avif",
      "https://ae-pic-a1.aliexpress-media.com/kf/Se936cfd61a864e51ba9c5102b478f7cfJ.jpg?has_lang=1&ver=2_960x960q75.jpg_.avif",
      "https://ae-pic-a1.aliexpress-media.com/kf/Se92a187483124e5bae2cab46dfcd1d66Y.jpg?has_lang=1&ver=2_960x960q75.jpg_.avif",
      "https://ae-pic-a1.aliexpress-media.com/kf/S634a13b149914bc7b21b772b4d578bd6K.jpg?has_lang=1&ver=2_960x960q75.jpg_.avif"
    ]
  },

  // --- الكاميرات والتصوير ---
  {
    _slug: "cameras",
    name: "Polaroid Instant Print Mini Camera",
    name_ar: "كاميرا نوفا صغيرة للطباعة الفورية",
    description_ar: "📸 اطبع ذكرياتك فوراً وعِش اللحظة ببصمة كلاسيكية!\n\n🖼️ طابعة صور صغيرة وكاميرا رقمية مجمعة في تصميم كرتوني إبداعي يعشقه الأطفال والبالغون.\n🖨️ التقط واطبع فوراً بالأبيض والأسود الحراري بدون أي حبر مزعج.\n👫 الهدية الخيالية الأجمل في الرحلات والحفلات والمناسبات التذكارية لتعليق الصور كقطعة ديكور فاخرة!\n\nاصنع الفرحة بتجميد لحظاتك للأبد 🖤🤍",
    price: 1999, original_price: 3000, stock: 85, featured: true, badge: "هدية مثالية",
    images: [
      "https://ae-pic-a1.aliexpress-media.com/kf/Sd2aedc97cf6242d18332b5c754c85a4aE.jpg_960x960q75.jpg_.avif",
      "https://ae-pic-a1.aliexpress-media.com/kf/S7bcc8a8f34df48beb938b986471e8222t.jpg_960x960q75.jpg_.avif",
      "https://ae-pic-a1.aliexpress-media.com/kf/Se21bb27aa0a149fb8c67c471f204885fI.jpg_960x960q75.jpg_.avif",
      "https://ae-pic-a1.aliexpress-media.com/kf/Sdbd9553735934be482db6d8db17204500.jpg_960x960q75.jpg_.avif"
    ]
  },
  {
    _slug: "cameras",
    name: "24MP Professional Vlogging Camera",
    name_ar: "كاميرا فيديو نوفا الاحترافية — 24 ميجابكسل 4K",
    description_ar: "🎥 اصنع السينما الخاصة بك وابدأ رحلة الفلوجنة الاحترافية!\n\n🌟 كاميرا فيديو رقمية احترافية بقوة 24 ميجابكسل وخاصية التقريب 18 مرة (Zoom الرقمي) لالتقاط مشاهد مبهرة.\n📱 مزودة بشاشة لمس 3 بوصات مريحة وتصوير مستقر وممتاز للرؤية الليلية بالأشعة تحت الحمراء.\n🎬 مثالي لمنشئي المحتوى، يوتيوبرز، ولتوثيق الأحداث والمقابلات بأقصى وضوح وثبات للقطة والفيديو.\n\nعينُك السينمائية الذكية في جهاز مضغوط 🎬",
    price: 4500, original_price: 9000, stock: 35, featured: true, badge: "احترافية",
    images: [
      "https://ae-pic-a1.aliexpress-media.com/kf/H94fe62bc341c45fe82634d63e2399aacb.jpg_220x220q75.jpg_.avif"
    ]
  },
  {
    _slug: "cameras",
    name: "HD Mini Portable Security Camera",
    name_ar: "كاميرا الجيب المصغرة — رؤية ليلية HD",
    description_ar: "🕵️‍♂️ الصندوق الأسود الشخصي لك أينما كنت!\n\n📹 مسجل فيديو رقمي عالي الدقة (HD Body Cam) حجم صغير جداً يسهل إخفائه أو تعليقه بالجيب أثناء تأمين مهامك.\n🌑 رؤية ليلية قوية بالأشعة تحت الحمراء تلتقط أدق التفاصيل في الظلام الكامل.\n🚗 رائعة للمراقبة وتوثيق الحوادث والاستخدام الأمني والتسجيل السري أثناء تنقلك.\n\nالثقة والأمان بتوثيق غير قابل للنزاع 🚨",
    price: 1500, original_price: 3800, stock: 150, featured: true, badge: "أمنية",
    images: [
      "https://ae-pic-a1.aliexpress-media.com/kf/S759d30fa808b4744beab4faa8d05ad42N.png_220x220.png_.avif"
    ]
  },
  {
    _slug: "cameras",
    name: "Canon EOS R7 APS-C Mirrorless Camera",
    name_ar: "كاميرا Canon EOS R7 الاحترافية — بدون مرآة",
    description_ar: "📷 وحش الكاميرات اللامِرآة للسرعات الهائلة من Canon الأصيلة!\n\n⚡ دقة غير طبيعية تلتقط 30 إطاراً بالثانية مع مُستشعر APS-C لتصوير فائق وعزل سينمائي مذهل.\n👁️ تركيز تلقائي أسطوري يتتبع العيون والمركبات للحصول على فيديوهات 4K مذهلة بدون غشاوة.\n📽️ الماكينة الحلم لكل صانع أفلام محترف، مصور رياضي، وعاشق للتفاصيل المجهرية والألوان المشرقة.\n\nانتقل لتصنيف صُناع المحتوى العالميين الآن الفئة الرائدة 🏆",
    price: 125000, original_price: 250000, stock: 4, featured: true, badge: "Canon Flagship",
    images: [
      "https://ae-pic-a1.aliexpress-media.com/kf/S524009bb2b7d488883cdba968dc1da03c.png?has_lang=1&ver=2_960x960.png_.avif",
      "https://ae-pic-a1.aliexpress-media.com/kf/Sd8c87267083c48889b857ca5b54cc9f69.png?has_lang=1&ver=2_960x960.png_.avif",
      "https://ae-pic-a1.aliexpress-media.com/kf/S9f746310ff8044ba8c248444c0c98c12E.png?has_lang=1&ver=2_960x960.png_.avif",
      "https://ae-pic-a1.aliexpress-media.com/kf/Sd6f2e544c06c41549434b13625234eb6f.png?has_lang=1&ver=2_960x960.png_.avif",
      "https://ae-pic-a1.aliexpress-media.com/kf/Secf0ae0adc784e96a9ae67e498f6c51fM.png_960x960.png_.avif"
    ]
  },
  {
    _slug: "electronics",
    name: "NOVA Pro Hair Dryer — Dyson Alternative",
    name_ar: "سشوار نوفا برو — بديل الدايسون الفاخر",
    description_ar: `🌪️ نتيجة صالون في دقايق ومن غير سعر الدايسون! 😍

🚀 موتور Brushless فائق السرعة 110,000 RPM
⚡ سرعة هوا تصل لـ 26 متر/ثانية — 3 أضعاف السشوار العادي
⏱️ ينشف شعرك في وقت قياسي ويوفر وقتك

💙 200 مليون أيون سالب:
• يحافظ على ترطيب الشعر من الداخل
• يقلل الهيشان والتقصف 100%
• يقفل مسام الشعرة ويخليها أنعم ولمعان حريري

🧲 فوهة مغناطيسية 360° تركّب بسهولة وتلف في أي اتجاه
🌡️ 21 وضع للحرارة والسرعة — تحكم ذكي بضغطة زر
🔇 صوت هادي أقل من 50 ديسيبل — استخدميه في أي وقت

🎁 هدية مثالية للأعياد للأم والأخت وكل من تحبيها

NOVA — Your Salon at Home 👑`,
    price: 1200, original_price: 1890, stock: 20, featured: true, badge: "الأكثر مبيعاً",
    images: [] as string[],
  },
];

/* ═══════════════════════════════════════
   تشغيل الـ Seed
═══════════════════════════════════════ */
async function seed() {
  console.log("🚀 بدأ الـ Seed...\n");

  // 1. حذف كل المنتجات القديمة
  try {
    console.log("🗑️  حذف الطلبات القديمة...");
    const { error: delOrdErr } = await supabase.from("orders").delete().neq("id", 0);
    if (delOrdErr) console.warn("⚠️  الطلبات:", delOrdErr.message);
  } catch (error: any) {
    console.log("⚠️  الطلبات:", error.message);
  }

  try {
    console.log("🗑️  حذف المنتجات القديمة...");
    const { error: delProdErr } = await supabase.from("products").delete().neq("id", 0);
    if (delProdErr) console.warn("⚠️  المنتجات:", delProdErr.message);
  } catch (error: any) {
    console.warn("⚠️  المنتجات:", error.message);
  }

  // 2. حذف الأقسام القديمة
  console.log("🗑️  حذف الأقسام القديمة...");
  const { error: delCatErr } = await supabase.from("categories").delete().neq("id", 0);
  if (delCatErr) console.warn("⚠️  الأقسام:", delCatErr.message);

  // 3. إضافة الأقسام الجديدة
  console.log("📂 إضافة الأقسام...");
  const { data: insertedCats, error: catErr } = await supabase
    .from("categories")
    .insert(categories.map(c => ({
      name: c.name, name_ar: c.name_ar, slug: c.slug, icon: c.icon,
    })))
    .select();
  if (catErr) { console.error("❌ فشل إضافة الأقسام:", catErr.message); process.exit(1); }

  const catMap: Record<string, number> = {};
  for (const cat of insertedCats) catMap[cat.slug] = cat.id;
  console.log("✅ الأقسام:", Object.keys(catMap).join(", "), "\n");

  // 4. إضافة المنتجات
  console.log("📦 إضافة المنتجات...");
  let ok = 0, fail = 0;
  for (const p of products) {
    const catId = catMap[p._slug];
    if (!catId) { console.warn(`⚠️  لم يُعثر على قسم: ${p._slug}`); fail++; continue; }

    const { _slug, ...rest } = p;
    const { error } = await supabase.from("products").insert({
      ...rest,
      category_id: catId,
      original_price: rest.original_price ?? null,
    });

    if (error) { console.error(`❌ ${p.name_ar}:`, error.message); fail++; }
    else { console.log(`  ✅ ${p.name_ar}`); ok++; }
  }

  console.log(`\n🎉 انتهى الـ Seed! ✅ ${ok} نجح — ❌ ${fail} فشل`);
}

seed().catch(err => { console.error(err); process.exit(1); });
