import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useLogin } from "@workspace/api-client-react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { useQueryClient } from "@tanstack/react-query";

const loginSchema = z.object({
  phone: z.string().min(10, "رقم الهاتف غير صحيح"),
  password: z.string().min(6, "كلمة المرور يجب أن تكون 6 أحرف على الأقل"),
});

type LoginValues = z.infer<typeof loginSchema>;

export function Login() {
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  
  const { mutate: login, isPending, error } = useLogin({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["/api/auth/me"] });
        setLocation("/");
      }
    }
  });

  const { register, handleSubmit, formState: { errors } } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema)
  });

  return (
    <div className="min-h-screen relative flex items-center justify-center px-4 overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img src={`${import.meta.env.BASE_URL}images/auth-bg.png`} className="w-full h-full object-cover opacity-50" alt="" />
        <div className="absolute inset-0 bg-background/80 backdrop-blur-[2px]" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10 glass-panel p-8 md:p-10 rounded-3xl"
      >
        <div className="text-center mb-8">
          <Link href="/">
            <img
              src={`${import.meta.env.BASE_URL}images/nova-logo-real.jpg`}
              alt="NOVA"
              className="h-24 w-auto object-contain rounded-xl mx-auto mb-4 drop-shadow-[0_0_20px_rgba(212,175,55,0.5)] cursor-pointer"
            />
          </Link>
          <h1 className="text-2xl font-bold mb-2 text-foreground">تسجيل الدخول</h1>
          <p className="text-muted-foreground">مرحباً بك مجدداً في عالم الرفاهية</p>
        </div>

        <form onSubmit={handleSubmit((d) => login({ data: d }))} className="space-y-5">
          {error && <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm border border-destructive/20">{error.error}</div>}
          
          <div className="space-y-2">
            <label className="text-sm font-medium">رقم المحمول</label>
            <Input {...register("phone")} dir="ltr" placeholder="01001234567" error={!!errors.phone} className="text-left font-mono" />
            {errors.phone && <p className="text-xs text-destructive">{errors.phone.message}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">كلمة المرور</label>
            <Input type="password" {...register("password")} dir="ltr" error={!!errors.password} className="text-left" />
            {errors.password && <p className="text-xs text-destructive">{errors.password.message}</p>}
          </div>

          <Button type="submit" className="w-full h-14 text-lg mt-4" isLoading={isPending}>
            دخول
          </Button>
        </form>

        <p className="text-center mt-8 text-muted-foreground text-sm">
          ليس لديك حساب؟{" "}
          <Link href="/register" className="text-primary font-bold hover:underline">
            أنشئ حسابك الآن
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
