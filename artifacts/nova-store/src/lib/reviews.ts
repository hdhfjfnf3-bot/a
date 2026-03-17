// ─── نظام التقييمات والمبيعات ───

const ARABIC_NAMES = [
  "أحمد محمد", "سارة عبدالله", "محمود علي", "فاطمة حسن", "عمر الشريف",
  "نور الدين", "ريم الجميل", "خالد العزيز", "منى سعيد", "يوسف الغالي",
  "هدى رمضان", "طارق المصري", "إيمان شوقي", "كريم حاتم", "رانيا فؤاد",
  "بشار ناصر", "دينا وليد", "عادل السيد", "سلمى توفيق", "زياد إبراهيم",
  "نادية قاسم", "ماجد الحربي", "ليلى عمر", "حسام العقاد", "شيماء جمال",
  "وليد رشاد", "أسماء طلعت", "مصطفى نور", "هناء الطيب", "عبدالرحمن صبري",
  "غادة منصور", "سمير العطار", "مروة فتحي", "أنور حجازي", "لبنى كريم",
  "ياسر البدوي", "أميرة سلطان", "فيصل الخضر", "رشا أبو زيد", "إبراهيم ماضي",
  "تيسير العمر", "أشرف صالح", "بسمة لطفي", "حمزة برهان", "زينب السعد",
  "نصر الدين", "علا عامر", "سليمان الجبر", "مها درويش", "وسام الشحي",
];

const REVIEW_TEMPLATES = [
  "منتج ممتاز جداً، تعاملت معه بشراء وكل حاجة تمام من الجودة والسعر والشحن.",
  "الشحن وصل في الوقت المحدد والمنتج كان متعبأ بشكل رائع، ممنون جداً.",
  "جودة المنتج فاقت توقعاتي! سأشتري مرة أخرى بالتأكيد.",
  "سعر ممتاز مقارنة بالجودة العالية. أنصح به بشدة.",
  "الشحن سريع والتعبئة محترمة. المنتج مطابق للصور تماماً.",
  "اشتريته لأول مرة وكنت قلقان، بس الحمد لله وصل بحالة ممتازة.",
  "خدمة عملاء رائعة والمنتج فعلاً يستحق السعر. شكراً جزيلاً.",
  "المنتج تمام 100%، الجودة عالية والسعر مناسب. استلمته في يومين بس!",
  "بصراحة أكثر من ممتاز! الشحن كان سريع جداً والمنتج رائع.",
  "قيمة ممتازة مقابل المال. المنتج يستحق الثقة.",
  "وصلني المنتج بدون أي مشكلة، وكان بالضبط زي ما هو موضح.",
  "تجربة شراء رائعة من البداية للنهاية. شكراً على الاحترافية.",
  "ما توقعت تكون الجودة بالمستوى ده! ممنون جداً.",
  "الشحن وصل بسرعة والمنتج ممتاز جداً. أنصح الجميع بالشراء.",
  "استلمت الطلب وكنت مبسوط جداً. الجودة تحفة والتغليف محترم.",
  "ممتاز جداً، كل التفاصيل مضبوطة والجودة تتكلم عن نفسها.",
  "أنصح بشدة بهذا المنتج، سعره مناسب وجودته ممتازة.",
  "الشراء كان تجربة ممتعة، المنتج وصل سريع وكان في حالة ممتازة.",
  "مش قادر أصدق الجودة دي بالسعر ده! صفقة رائعة.",
  "وصلني المنتج أسرع مما توقعت والجودة فاقت التوقعات. 5 نجوم.",
  "تعامل ممتاز وشحن سريع، المنتج بالظبط زي التوصيف. شكراً.",
  "من أفضل المشتريات اللي عملتها. الجودة عالية والسعر معقول.",
  "شراء رائع! المنتج ممتاز والشحن وصل في الموعد المحدد.",
  "الجودة ممتازة جداً وعندي ثقة تامة في هذا المتجر.",
  "أول مرة أشتري وكانت التجربة مبهجة جداً. سأعود للشراء.",
  "المنتج يستحق كل سنتاوي منو. الجودة فعلاً ممتازة.",
  "سريع في الشحن، المنتج ممتاز، وسعر مناسب جداً. أنصح به.",
  "كل شيء تمام بالنسبة لي. المنتج جيد جداً والشحن كان سريع.",
  "تجربة ممتعة جداً! المنتج وصل بحالة ممتازة وكان التغليف رائع.",
  "الله عليك! منتج ممتاز وبسعر كويس. الشحن وصل في 3 أيام.",
];

// توليد بذرة ثابتة من ID المنتج لضمان نفس التقييمات في كل مرة
function seededRandom(seed: number) {
  return function() {
    seed = (seed * 16807 + 0) % 2147483647;
    return (seed - 1) / 2147483646;
  };
}

export interface Review {
  id: string;
  name: string;
  rating: number;
  text: string;
  date: string;
  verified: boolean;
}

export interface ProductStats {
  rating: number;
  reviewCount: number;
  salesCount: number;
  reviews: Review[];
}

export function getProductStats(productId: number): ProductStats {
  const rng = seededRandom(productId * 31337 + 42);

  // تحديد السعر بشكل عشوائي ثابت
  const salesBase = 70 + Math.floor(rng() * 430); // من 70 إلى 500
  const reviewCount = 20;

  // تحديد التقييم العام (4 أو 4.5 أو 5)
  const ratingOptions = [4.0, 4.5, 4.5, 5.0]; // 4.5 مرتين لتكون أكثر احتمالاً
  const overallRating = ratingOptions[Math.floor(rng() * ratingOptions.length)];

  // توليد التقييمات
  const usedNames = new Set<string>();
  const usedTemplates = new Set<number>();
  const reviews: Review[] = [];

  for (let i = 0; i < reviewCount; i++) {
    // اختيار اسم غير مكرر
    let nameIdx: number;
    do {
      nameIdx = Math.floor(rng() * ARABIC_NAMES.length);
    } while (usedNames.has(ARABIC_NAMES[nameIdx]) && usedNames.size < ARABIC_NAMES.length);
    usedNames.add(ARABIC_NAMES[nameIdx]);

    // اختيار تعليق غير مكرر
    let templateIdx: number;
    do {
      templateIdx = Math.floor(rng() * REVIEW_TEMPLATES.length);
    } while (usedTemplates.has(templateIdx) && usedTemplates.size < REVIEW_TEMPLATES.length);
    usedTemplates.add(templateIdx);

    // تقييم كل شخص (4 أو 4.5 أو 5)
    const starOptions = [4, 4, 4.5, 4.5, 5];
    const starRating = starOptions[Math.floor(rng() * starOptions.length)];

    // تاريخ عشوائي في آخر 6 أشهر
    const daysAgo = Math.floor(rng() * 180);
    const date = new Date();
    date.setDate(date.getDate() - daysAgo);
    const dateStr = date.toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' });

    reviews.push({
      id: `${productId}-${i}`,
      name: ARABIC_NAMES[nameIdx],
      rating: starRating,
      text: REVIEW_TEMPLATES[templateIdx],
      date: dateStr,
      verified: rng() > 0.2, // 80% مشتري موثق
    });
  }

  return {
    rating: overallRating,
    reviewCount,
    salesCount: salesBase,
    reviews,
  };
}

// توليد تقييمات لمنتج جديد (ديناميكية باستخدام وقت الإضافة)
export function getNewProductStats(productId: number): ProductStats {
  // استخدام وقت الآن لضمان تنوع التقييمات لكل منتج جديد
  return getProductStats(productId + Date.now() % 100000);
}

export function renderStars(rating: number): string {
  return rating.toFixed(1);
}
