const fs = require('fs');

const seedPath = 'd:\\\\1111111111\\\\متجر\\\\Nova-Dropship\\\\artifacts\\\\api-server\\\\src\\\\seed.ts';
let content = fs.readFileSync(seedPath, 'utf8');

const newProduct = `
  // --- العطور ومستحضرات التجميل ---
  {
    _slug: "skincare",
    name: "Eclat Vanilla Rose Eau De Parfum 100ml",
    name_ar: "عطر إكليل الڤانيليا الوردي — هدية فاخرة (100 مل)",
    description_ar: "🌸 سحر الأنوثة في زجاجة عطر واحدة!\\n\\n🎀 عطر إكليل الڤانيليا الوردي (Eau De Parfum) الممزوج بخلاصة الزهور الطبيعية ليمنحكِ رائحة ناعمة وفواحة.\\n⏳ تركيبة مركزة تدوم طويلاً، تبقى معكِ طوال اليوم لتتركي أثراً لا يُنسى في كل مكان تذهبين إليه.\\n💖 تصميم الزجاجة الأنيق والفريد يجعله الهدية المثالية التي تعبر عن الحب والذوق الرفيع لمن تحبين.\\n\\nاكتشفي سر الجاذبية واخطفي الأنظار برائحتك الساحرة ✨",
    price: 25000, original_price: 35000, stock: 40, featured: true, badge: "عطر فاخر",
    images: [
      "https://ae-pic-a1.aliexpress-media.com/kf/Saf86fed0d6b04414a062aa0cb55e42e6o.png_960x960.png_.avif",
      "https://ae-pic-a1.aliexpress-media.com/kf/Sb09d4fe4b0e44f2784725c2a260214b1n.jpg_960x960q75.jpg_.avif",
      "https://ae-pic-a1.aliexpress-media.com/kf/S1fca9ed79eaa4046a18d0abb9e84a16f9.jpg_960x960q75.jpg_.avif",
      "https://ae-pic-a1.aliexpress-media.com/kf/S991fba13c08a43d69c8d2dce37202cc1S.jpg_960x960q75.jpg_.avif",
      "https://ae-pic-a1.aliexpress-media.com/kf/Sf1ac3635a8674628bb28d404fe730272U.jpg_960x960q75.jpg_.avif"
    ]
  },
`;

content = content.replace('images: [] as string[],\\n  },', 'images: [] as string[],\\n  },' + newProduct);

fs.writeFileSync(seedPath, content, 'utf8');
console.log('Seed file successfully updated! Now running seed process...');
