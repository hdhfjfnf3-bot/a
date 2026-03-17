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
