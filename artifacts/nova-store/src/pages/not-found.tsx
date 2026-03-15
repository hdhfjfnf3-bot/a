import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background text-center px-4">
      <h1 className="text-8xl font-black text-gradient-gold mb-4 font-luxury">404</h1>
      <h2 className="text-3xl font-bold text-foreground mb-4">الصفحة غير موجودة</h2>
      <p className="text-muted-foreground mb-8 max-w-md">
        عذراً، الصفحة التي تبحث عنها غير موجودة أو تم نقلها.
      </p>
      <Link href="/">
        <Button size="lg">العودة للرئيسية</Button>
      </Link>
    </div>
  );
}
