-- ============================================================
-- Nova Store - Supabase Setup Script
-- قم بتشغيل هذا الملف في Supabase SQL Editor
-- ============================================================

-- أولاً: إنشاء الأنواع المخصصة (آمن حتى لو موجودة مسبقاً)
DO $$ BEGIN
  CREATE TYPE public.order_status AS ENUM ('pending', 'confirmed', 'shipped', 'delivered', 'cancelled');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE public.role AS ENUM ('user', 'admin');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- ============================================================
-- إنشاء الجداول
-- ============================================================

CREATE TABLE IF NOT EXISTS public.categories (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    name_ar TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    icon TEXT,
    image TEXT
);

CREATE TABLE IF NOT EXISTS public.users (
    id SERIAL PRIMARY KEY,
    full_name TEXT NOT NULL,
    phone TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    role public.role DEFAULT 'user' NOT NULL,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.products (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    name_ar TEXT NOT NULL,
    description TEXT,
    description_ar TEXT,
    price NUMERIC(10,2) NOT NULL,
    original_price NUMERIC(10,2),
    images JSON DEFAULT '[]'::JSON NOT NULL,
    category_id INTEGER REFERENCES public.categories(id),
    stock INTEGER DEFAULT 0 NOT NULL,
    featured BOOLEAN DEFAULT false NOT NULL,
    badge TEXT,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.orders (
    id SERIAL PRIMARY KEY,
    product_id INTEGER NOT NULL REFERENCES public.products(id),
    full_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    alt_phone TEXT,
    governorate TEXT NOT NULL,
    address TEXT NOT NULL,
    quantity INTEGER DEFAULT 1 NOT NULL,
    total_price NUMERIC(10,2) NOT NULL,
    status public.order_status DEFAULT 'pending' NOT NULL,
    facebook_page TEXT,
    notes TEXT,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT now() NOT NULL
);

-- ============================================================
-- الأقسام (Categories)
-- ============================================================

INSERT INTO public.categories (name, name_ar, slug, icon) VALUES
    ('Clothing', 'ملابس', 'clothing', '👗'),
    ('Perfumes', 'عطور', 'perfumes', '🌹'),
    ('Home Tools', 'أدوات منزلية', 'home-tools', '🏠'),
    ('Electronics', 'إلكترونيات', 'electronics', '📱'),
    ('Beauty', 'جمال وعناية', 'beauty', '💄'),
    ('Accessories', 'إكسسوارات', 'accessories', '💍')
ON CONFLICT (slug) DO NOTHING;

-- ============================================================
-- المنتجات (Products)
-- ============================================================

INSERT INTO public.products (name, name_ar, description, description_ar, price, original_price, images, category_id, stock, featured, badge) VALUES

-- ملابس
('Elegant Abaya',         'عباية أنيقة فاخرة',      'Stunning elegant abaya made from premium fabric',       'عباية أنيقة فاخرة مصنوعة من أجود أنواع القماش',         350.00, 500.00, '["https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600"]',  1, 50, true,  'الأكثر مبيعاً'),
('Summer Dress',          'فستان صيفي زاهي',         'Beautiful summer dress with vibrant colors',            'فستان صيفي جميل بألوان زاهية ومريح للإرتداء',           220.00, 320.00, '["https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600"]',  1, 40, false, NULL),
('Men Casual Shirt',      'قميص رجالي كاجوال',       'Comfortable and stylish men casual shirt',              'قميص رجالي مريح وعصري مناسب لجميع المناسبات',           185.00, 250.00, '["https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=600"]',  1, 60, false, 'جديد'),
('Sport Sneakers',        'حذاء رياضي عصري',         'Trendy sport sneakers for everyday use',                'حذاء رياضي عصري مناسب للاستخدام اليومي',                280.00, 380.00, '["https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600"]',  1, 35, true,  'خصم 26%'),

-- عطور
('Royal Oud Perfume',     'عطر العود الملكي',        'Premium oud perfume with long-lasting scent',           'عطر عود ملكي فاخر برائحة تدوم طويلاً',                  280.00, 400.00, '["https://images.unsplash.com/photo-1541643600914-78b084683702?w=600"]',  2, 30, true,  'جديد'),
('French Perfume',        'عطر فرنسي مميز',          'Luxury French perfume with unique scent',               'عطر فرنسي فاخر برائحة مميزة ومنعشة',                    320.00, NULL,   '["https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?w=600"]',  2, 25, false, NULL),
('Rose Water Perfume',    'عطر ماء الورد',           'Delicate rose water perfume for all occasions',         'عطر ماء الورد الرقيق المناسب لجميع المناسبات',           150.00, 200.00, '["https://images.unsplash.com/photo-1619994121345-b61cd610c5a6?w=600"]',  2, 50, false, NULL),

-- أدوات منزلية
('Smart Kitchen Blender', 'خلاط مطبخ ذكي',          'Powerful multi-function kitchen blender',               'خلاط مطبخ قوي متعدد الوظائف بسرعات متعددة',            199.00, 299.00, '["https://images.unsplash.com/photo-1570222094114-d054a817e56b?w=600"]',  3, 20, true,  'خصم 33%'),
('Air Fryer XL',          'قلاية هوائية كبيرة',     'Large capacity air fryer with digital control',         'قلاية هوائية بسعة كبيرة وتحكم رقمي سهل الاستخدام',     450.00, 600.00, '["https://images.unsplash.com/photo-1648360225143-d15e0e7afac3?w=600"]',  3, 15, true,  'الأكثر مبيعاً'),
('Coffee Machine',        'ماكينة قهوة إيطالية',    'Italian espresso machine for home use',                 'ماكينة قهوة إيطالية فاخرة للاستخدام المنزلي',           550.00, 750.00, '["https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=600"]',  3, 10, false, NULL),
('Steam Iron',            'مكواة بخار احترافية',    'Professional steam iron with advanced features',        'مكواة بخار احترافية بميزات متقدمة وتقنية عالية',        120.00, 180.00, '["https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=600"]',  3, 30, false, 'خصم 33%'),

-- إلكترونيات
('Wireless Earbuds Pro',  'سماعات لاسلكية برو',     'Premium wireless earbuds with noise cancellation',     'سماعات لاسلكية فاخرة بخاصية إلغاء الضوضاء',             450.00, 650.00, '["https://images.unsplash.com/photo-1606220838315-056192d5e927?w=600"]',  4, 15, true,  'تخفيض'),
('Smart Watch',           'ساعة ذكية فاخرة',        'Premium smartwatch with health monitoring features',   'ساعة ذكية فاخرة بميزات متعددة لمراقبة الصحة',           680.00, 900.00, '["https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600"]',  4, 20, true,  'الأفضل'),
('Bluetooth Speaker',     'مكبر صوت بلوتوث',       'Portable waterproof bluetooth speaker',                 'مكبر صوت بلوتوث محمول ومقاوم للماء',                    220.00, 300.00, '["https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600"]',  4, 25, false, NULL),
('Phone Stand Charger',   'حامل هاتف وشاحن لاسلكي','Wireless charging phone stand for all phones',          'حامل هاتف مع شاحن لاسلكي يناسب جميع الهواتف',          95.00,  140.00, '["https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=600"]',  4, 40, false, 'جديد'),

-- جمال وعناية
('Skincare Set',          'طقم العناية بالبشرة',    'Complete skincare set for glowing skin',                'طقم كامل للعناية بالبشرة للحصول على بشرة متألقة',        380.00, 500.00, '["https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=600"]',  5, 20, true,  'الأكثر مبيعاً'),
('Hair Care Kit',         'مجموعة العناية بالشعر',  'Professional hair care kit with natural ingredients',  'طقم احترافي للعناية بالشعر بمكونات طبيعية',             250.00, 350.00, '["https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600"]',  5, 30, false, NULL),

-- إكسسوارات
('Gold Bracelet',         'إسورة ذهبية فاخرة',      'Elegant gold-plated bracelet for all occasions',        'إسورة فاخرة بطلاء ذهبي مناسبة لجميع المناسبات',         180.00, 250.00, '["https://images.unsplash.com/photo-1573408301185-9519f94bf510?w=600"]',  6, 15, true,  'حصري'),
('Leather Wallet',        'محفظة جلد طبيعي',        'Genuine leather wallet with multiple card slots',       'محفظة جلد طبيعي أصلي بمقاعد متعددة للبطاقات',          220.00, 300.00, '["https://images.unsplash.com/photo-1627123424574-724758594913?w=600"]',  6, 25, false, NULL)
;

-- ============================================================
-- حساب المدير الافتراضي
-- كلمة المرور: admin123 (مشفرة bcrypt)
-- ============================================================

INSERT INTO public.users (full_name, phone, password, role) VALUES
    ('Nova Admin', '201000000000', '$2b$10$zUqZkJnLr6Dfm16n.db3UOKrmhyGVqE6SPcd8fMju76pkWxAG.TSu', 'admin')
ON CONFLICT (phone) DO NOTHING;
