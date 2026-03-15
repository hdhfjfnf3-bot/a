import { Link } from "wouter";
import { Facebook, Instagram, Twitter, Mail, MapPin, Phone } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-black border-t border-primary/10 pt-16 pb-8 relative overflow-hidden">
      {/* Decorative gradients */}
      <div className="absolute top-0 left-1/4 w-1/2 h-[1px] bg-gradient-to-r from-transparent via-primary to-transparent opacity-50" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          
          {/* Brand */}
          <div className="space-y-6">
            <Link href="/" className="inline-block">
              <span className="font-luxury text-4xl font-bold tracking-widest text-gradient-gold">
                NOVA
              </span>
            </Link>
            <p className="text-muted-foreground leading-relaxed">
              وجهتك الأولى للتسوق الفاخر. نقدم لك تشكيلة منتقاة من أفضل المنتجات بأسعار تنافسية وجودة لا تضاهى.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full glass-panel flex items-center justify-center text-foreground hover:text-primary hover:-translate-y-1 transition-all">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full glass-panel flex items-center justify-center text-foreground hover:text-primary hover:-translate-y-1 transition-all">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full glass-panel flex items-center justify-center text-foreground hover:text-primary hover:-translate-y-1 transition-all">
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-bold mb-6 text-foreground">روابط سريعة</h3>
            <ul className="space-y-4">
              <li><Link href="/products" className="text-muted-foreground hover:text-primary transition-colors">كل المنتجات</Link></li>
              <li><Link href="/categories" className="text-muted-foreground hover:text-primary transition-colors">الأقسام</Link></li>
              <li><Link href="/about" className="text-muted-foreground hover:text-primary transition-colors">من نحن</Link></li>
              <li><Link href="/contact" className="text-muted-foreground hover:text-primary transition-colors">اتصل بنا</Link></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-xl font-bold mb-6 text-foreground">خدمة العملاء</h3>
            <ul className="space-y-4">
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">سياسة الاسترجاع</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">الشحن والتوصيل</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">الأسئلة الشائعة</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">الشروط والأحكام</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-xl font-bold mb-6 text-foreground">تواصل معنا</h3>
            <ul className="space-y-4">
              <li className="flex items-center gap-3 text-muted-foreground">
                <MapPin className="w-5 h-5 text-primary" />
                <span>القاهرة، جمهورية مصر العربية</span>
              </li>
              <li className="flex items-center gap-3 text-muted-foreground">
                <Phone className="w-5 h-5 text-primary" />
                <span dir="ltr">+20 100 123 4567</span>
              </li>
              <li className="flex items-center gap-3 text-muted-foreground">
                <Mail className="w-5 h-5 text-primary" />
                <span>support@novastore.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-muted-foreground text-sm">
            © {new Date().getFullYear()} NOVA Store. جميع الحقوق محفوظة.
          </p>
          <div className="flex items-center gap-4 text-sm font-medium text-muted-foreground">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-green-500"></span> تسوق آمن
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-primary"></span> شحن سريع
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
