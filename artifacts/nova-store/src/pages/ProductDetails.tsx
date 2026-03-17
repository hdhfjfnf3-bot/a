import { useParams, Link, useLocation } from "wouter";
import { useGetProduct, useGetMe } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { formatPrice } from "@/lib/utils";
import { getProductStats, Review } from "@/lib/reviews";
import { ShoppingCart, ShieldCheck, Truck, ArrowRight, Star, CheckCircle, TrendingUp, ThumbsUp, Send, MessageCircle, X } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

// --- Product Chat Component ---
function ProductChat({ productId, userPhone }: { productId: number, userPhone: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const fetchMessages = async () => {
    try {
      const res = await fetch(`/api/messages/${userPhone}/${productId}`);
      if (res.ok) {
        setMessages(await res.json());
      }
    } catch (e) {}
  };

  useEffect(() => {
    if (isOpen) {
      fetchMessages();
      const interval = setInterval(fetchMessages, 5000);
      return () => clearInterval(interval);
    }
    return undefined;
  }, [isOpen, productId, userPhone]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const msgText = newMessage;
    setNewMessage("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userPhone,
          productId,
          sender: "user",
          content: msgText
        })
      });
      if (res.ok) {
        await fetchMessages();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 left-6 z-50 bg-primary text-primary-foreground p-4 rounded-full shadow-2xl hover:scale-110 transition-transform flex items-center gap-2 group"
      >
        <MessageCircle className="w-6 h-6" />
        <span className="sr-only md:not-sr-only overflow-hidden max-w-0 md:max-w-xs transition-all duration-300 md:group-hover:ml-2 font-medium opacity-0 md:opacity-100 hidden md:block">
          تواصل معنا
        </span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="fixed bottom-24 left-6 z-50 w-80 sm:w-96 bg-card border border-border shadow-2xl rounded-2xl overflow-hidden flex flex-col max-h-[500px] h-[80vh]"
          >
            {/* Header */}
            <div className="bg-primary/10 border-b border-border p-4 flex justify-between items-center">
              <div>
                <h3 className="font-bold flex items-center gap-2 text-primary">
                  <MessageCircle className="w-5 h-5" /> دعم المنتج
                </h3>
                <p className="text-xs text-muted-foreground">فريق خدمة العملاء متاح للرد على أي استفسار</p>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-muted-foreground hover:text-foreground">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 flex flex-col bg-background/50">
              <div className="text-center text-xs text-muted-foreground my-2">
                تبدأ المحادثة حول هذا المنتج فقط
              </div>
              {messages.map((msg) => (
                <div key={msg.id} className={`max-w-[80%] rounded-2xl p-3 text-sm ${msg.sender === "user" ? "bg-primary text-primary-foreground self-start rounded-tr-sm" : "bg-muted text-foreground self-end rounded-tl-sm"}`}>
                  <p>{msg.content}</p>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form onSubmit={handleSend} className="p-3 bg-card border-t border-border flex items-center gap-2">
              <Input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="اكتب استفسارك..."
                className="flex-1 h-10 bg-background"
                disabled={isLoading}
              />
              <Button type="submit" size="icon" disabled={!newMessage.trim() || isLoading} className="h-10 w-10 shrink-0">
                <Send className="w-4 h-4 rtl:-scale-x-100" />
              </Button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export function ProductDetails() {
  const params = useParams();
  const [, setLocation] = useLocation();
  const id = parseInt(params.id || "0");
  const { data: product, isLoading, error } = useGetProduct(id);
  const { data: user } = useGetMe({ query: { retry: false, queryKey: ['/api/auth/me'] } });
  const [activeImage, setActiveImage] = useState(0);
  const [realReviews, setRealReviews] = useState<Review[]>([]);
  const [newReview, setNewReview] = useState({ name: "", text: "", rating: 5 });
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [hasActiveOrder, setHasActiveOrder] = useState(false);

  // Check if user has an active (non-delivered) order for this product
  useEffect(() => {
    if (!user?.phone || !id) return;
    const checkOrder = async () => {
      try {
        const res = await fetch(`/api/orders?phone=${user.phone}`);
        if (res.ok) {
          const data = await res.json();
          const orders = Array.isArray(data) ? data : (data?.data ?? []);
          const active = orders.some(
            (o: any) => o.productId === id && o.phone === user.phone && o.status !== 'delivered'
          );
          setHasActiveOrder(active);
        }
      } catch (e) { /* ignore */ }
    };
    checkOrder();
  }, [user, id]);

  useEffect(() => {
    if (id) {
      const savedReviews = localStorage.getItem(`reviews_${id}`);
      if (savedReviews) {
        try {
          setRealReviews(JSON.parse(savedReviews));
        } catch (e) {
          console.error("Failed to parse saved reviews");
        }
      }
    }
  }, [id]);

  // Combine stats (must be calculated before SEO useEffect)
  const baseStats = product ? getProductStats(product.id) : { rating: 5, reviews: [], salesCount: 0 };
  const allReviews = [...realReviews, ...baseStats.reviews];
  const totalReviewsCount = allReviews.length;
  const totalRatingSum = allReviews.reduce((sum, rev) => sum + rev.rating, 0);
  const averageRating = totalReviewsCount > 0 ? (totalRatingSum / totalReviewsCount) : baseStats.rating;

  useEffect(() => {
    if (!product) return;

    const name = product.nameAr || product.name || 'منتج';
    const desc = product.descriptionAr || product.description || `اشتري ${name} من نوفا ستور بأفضل سعر`;
    const price = product.price;
    const image = product.images?.[0] || '/images/nova-logo-real.jpg';
    const url = `https://nova-store.com/products/${product.id}`;

    // ① Dynamic Page Title
    document.title = `${name} | نوفا ستور NOVA - اشتري بـ ${price} جنيه مع توصيل سريع`;

    // ② OG meta tags (WhatsApp/Facebook preview per product)
    const setMeta = (prop: string, val: string, attr = 'property') => {
      let el = document.querySelector(`meta[${attr}="${prop}"]`) as HTMLMetaElement | null;
      if (!el) { el = document.createElement('meta'); el.setAttribute(attr, prop); document.head.appendChild(el); }
      el.setAttribute('content', val);
    };
    setMeta('og:title',       `${name} | نوفا ستور - شراء أونلاين`);
    setMeta('og:description', `${desc} - السعر: ${price} جنيه. اطلب الآن وادفع عند الاستلام 🚀`);
    setMeta('og:image',       image.startsWith('http') ? image : `https://nova-store.com${image}`);
    setMeta('og:url',         url);
    setMeta('og:type',        'product');
    setMeta('product:price:amount',   String(price), 'property');
    setMeta('product:price:currency', 'EGP', 'property');
    setMeta('twitter:title',       `${name} | نوفا ستور`, 'name');
    setMeta('twitter:description', `${desc} - ${price} جنيه فقط 🔥`, 'name');
    setMeta('twitter:image',       image.startsWith('http') ? image : `https://nova-store.com${image}`, 'name');

    // ③ Product JSON-LD (Google Rich Results: price + stars in search 🎯)
    const oldScript = document.getElementById('product-jsonld');
    if (oldScript) oldScript.remove();
    const script = document.createElement('script');
    script.id   = 'product-jsonld';
    script.type = 'application/ld+json';
    script.text = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Product",
      "name": name,
      "description": desc,
      "url": url,
      "image": product.images || [image],
      "brand": { "@type": "Brand", "name": "NOVA Store" },
      "offers": {
        "@type": "Offer",
        "url": url,
        "priceCurrency": "EGP",
        "price": price,
        "availability": product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
        "seller": { "@type": "Organization", "name": "NOVA Store | نوفا ستور" },
        "priceValidUntil": "2026-12-31",
        "hasMerchantReturnPolicy": {
          "@type": "MerchantReturnPolicy",
          "applicableCountry": "EG",
          "returnPolicyCategory": "https://schema.org/MerchantReturnFiniteReturnWindow"
        },
        "shippingDetails": {
          "@type": "OfferShippingDetails",
          "shippingRate": { "@type": "MonetaryAmount", "value": "0", "currency": "EGP" },
          "shippingDestination": { "@type": "DefinedRegion", "addressCountry": "EG" },
          "deliveryTime": {
            "@type": "ShippingDeliveryTime",
            "handlingTime": { "@type": "QuantitativeValue", "minValue": 0, "maxValue": 1, "unitCode": "DAY" },
            "transitTime": { "@type": "QuantitativeValue", "minValue": 2, "maxValue": 5, "unitCode": "DAY" }
          }
        }
      },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": String(averageRating.toFixed(1)),
        "reviewCount": String(totalReviewsCount || 30),
        "bestRating": "5",
        "worstRating": "1"
      }
    });
    document.head.appendChild(script);

    // ④ BreadcrumbList per product
    const oldBC = document.getElementById('breadcrumb-jsonld');
    if (oldBC) oldBC.remove();
    const bcScript = document.createElement('script');
    bcScript.id   = 'breadcrumb-jsonld';
    bcScript.type = 'application/ld+json';
    bcScript.text = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "نوفا ستور", "item": "https://nova-store.com/" },
        { "@type": "ListItem", "position": 2, "name": "المنتجات", "item": "https://nova-store.com/products" },
        { "@type": "ListItem", "position": 3, "name": name, "item": url }
      ]
    });
    document.head.appendChild(bcScript);

    return () => {
      document.title = 'NOVA Store | نوفا ستور';
      document.getElementById('product-jsonld')?.remove();
      document.getElementById('breadcrumb-jsonld')?.remove();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product, averageRating, totalReviewsCount]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-4xl font-bold text-destructive mb-4">المنتج غير موجود</h1>
        <p className="text-muted-foreground mb-8">عذراً، لم نتمكن من العثور على المنتج المطلوب.</p>
        <Link href="/products">
          <Button>العودة للمنتجات</Button>
        </Link>
      </div>
    );
  }

  const isSoldOut = product.stock <= 0;
  
  const discountPct = product.originalPrice && product.originalPrice > product.price
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : null;

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReview.name.trim() || !newReview.text.trim()) return;

    setIsSubmittingReview(true);
    
    // Simulate slight network delay for better UX
    setTimeout(() => {
      const review: Review = {
        id: `real-${Date.now()}`,
        name: newReview.name,
        text: newReview.text,
        rating: newReview.rating,
        date: new Date().toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' }),
        verified: true // Real users on the site count as verified
      };

      const updatedReviews = [review, ...realReviews];
      setRealReviews(updatedReviews);
      localStorage.setItem(`reviews_${id}`, JSON.stringify(updatedReviews));
      
      setNewReview({ name: "", text: "", rating: 5 });
      setIsSubmittingReview(false);
    }, 600);
  };

  return (
    <div className="min-h-screen pt-32 pb-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        
        <Link href="/products" className="inline-flex items-center text-muted-foreground hover:text-primary transition-colors mb-8 group">
          <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
          العودة للمنتجات
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24">
          {/* Images Gallery */}
          <div className="space-y-6">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="aspect-square bg-card rounded-3xl border border-white/5 p-8 flex items-center justify-center shadow-2xl relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-radial from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <img 
                src={product.images[activeImage] || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800"} 
                alt={product.nameAr || product.name}
                className="w-full h-full object-contain drop-shadow-2xl z-10"
              />
            </motion.div>
            
            {product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(i)}
                    className={`aspect-square rounded-xl border-2 p-2 bg-card flex items-center justify-center transition-all ${
                      activeImage === i ? "border-primary opacity-100 scale-105" : "border-transparent opacity-60 hover:opacity-100"
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-contain" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col"
          >
            <div className="mb-6">
              {product.badge && (
                <span className="inline-block bg-primary/20 text-primary px-4 py-1.5 rounded-full text-sm font-bold mb-4 border border-primary/30">
                  {product.badge}
                </span>
              )}
              {discountPct && (
                <span className="inline-block bg-red-500/20 text-red-400 px-3 py-1 rounded-full text-sm font-bold mb-4 mr-2 border border-red-500/30">
                  خصم {discountPct}%
                </span>
              )}
              <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-4 leading-tight">
                {product.nameAr || product.name}
              </h1>
              <p className="text-primary font-medium text-lg">
                {product.categoryNameAr || product.categoryName || 'متنوع'}
              </p>
            </div>

            {/* التقييم والمبيعات */}
            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center gap-1">
                {[1,2,3,4,5].map(i => {
                  const full = i <= Math.floor(averageRating);
                  const half = !full && i === Math.ceil(averageRating) && averageRating % 1 !== 0;
                  return (
                    <Star key={i} className={`w-5 h-5 ${full ? 'text-amber-400 fill-amber-400' : half ? 'text-amber-400 fill-amber-400/50' : 'text-gray-600'}`} />
                  );
                })}
                <span className="font-bold text-amber-400 mr-1">{averageRating.toFixed(1)}</span>
                <span className="text-muted-foreground text-sm">({totalReviewsCount} تقييم)</span>
              </div>
              <div className="flex items-center gap-1 text-muted-foreground text-sm">
                <TrendingUp className="w-4 h-4 text-green-400" />
                <span className="text-green-400 font-semibold">{baseStats.salesCount}+</span>
                <span>مبيعة</span>
              </div>
            </div>

            <div className="flex items-end gap-4 mb-8 pb-8 border-b border-white/10">
              <span className="text-4xl font-bold text-gradient-gold">
                {formatPrice(product.price)}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-xl text-muted-foreground line-through mb-1">
                  {formatPrice(product.originalPrice)}
                </span>
              )}
            </div>

            <div className="prose prose-invert max-w-none mb-10 text-muted-foreground leading-relaxed">
              <p>{product.descriptionAr || product.description || 'لا يوجد وصف متاح لهذا المنتج.'}</p>
            </div>

            {/* Features */}
            <div className="grid grid-cols-2 gap-4 mb-10">
              <div className="flex items-center gap-3 bg-white/5 p-4 rounded-xl border border-white/5">
                <Truck className="w-6 h-6 text-primary" />
                <span className="text-sm font-medium">شحن لجميع المحافظات</span>
              </div>
              <div className="flex items-center gap-3 bg-white/5 p-4 rounded-xl border border-white/5">
                <ShieldCheck className="w-6 h-6 text-primary" />
                <span className="text-sm font-medium">ضمان الجودة</span>
              </div>
            </div>

            {/* Action */}
            <div className="mt-auto pt-8">
              {isSoldOut ? (
                <Button size="lg" disabled className="w-full lg:w-auto min-w-[250px] opacity-70">
                  نفذت الكمية
                </Button>
              ) : (
                <Button 
                  size="lg" 
                  className="w-full lg:w-auto min-w-[250px] text-lg shadow-xl shadow-primary/30 hover:-translate-y-1"
                  onClick={() => {
                    if (!user) {
                      setLocation(`/login?redirect=/order/${product.id}`);
                    } else {
                      setLocation(`/order/${product.id}`);
                    }
                  }}
                >
                  <ShoppingCart className="w-5 h-5 ml-2" />
                  اشتري الآن
                </Button>
              )}
            </div>
          </motion.div>
        </div>

        {/* قسم آراء العملاء */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-16"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 border-b border-border pb-6">
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-bold">آراء العملاء</h2>
              <span className="bg-primary/15 text-primary text-sm font-bold px-3 py-1 rounded-full border border-primary/30">
                {totalReviewsCount} تقييم
              </span>
              <span className="bg-amber-500/10 text-amber-400 text-sm font-bold px-3 py-1 rounded-full border border-amber-500/30 flex items-center gap-1">
                <Star className="w-3.5 h-3.5 fill-amber-400" />
                {averageRating.toFixed(1)} / 5
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* نموذج إضافة تقييم */}
            <div className="lg:col-span-1 border border-border bg-card rounded-2xl p-6 h-fit sticky top-24">
              <h3 className="font-bold text-lg mb-4">أضف تقييمك</h3>
              <form onSubmit={handleSubmitReview} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm text-muted-foreground">الاسم</label>
                  <Input 
                    value={newReview.name} 
                    onChange={e => setNewReview({ ...newReview, name: e.target.value })} 
                    placeholder="اكتب اسمك هنا" 
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-muted-foreground">التقييم</label>
                  <div className="flex gap-2">
                    {[1,2,3,4,5].map(s => (
                      <button 
                        key={s} 
                        type="button" 
                        onClick={() => setNewReview({ ...newReview, rating: s })}
                        className="focus:outline-none transition-transform hover:scale-110"
                      >
                        <Star className={`w-6 h-6 ${s <= newReview.rating ? 'text-amber-400 fill-amber-400' : 'text-gray-600'}`} />
                      </button>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-muted-foreground">رأيك في المنتج</label>
                  <Textarea 
                    value={newReview.text} 
                    onChange={e => setNewReview({ ...newReview, text: e.target.value })} 
                    placeholder="شاركنا تجربتك مع المنتج..." 
                    rows={4} 
                    required 
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full gap-2" 
                  disabled={!newReview.name.trim() || !newReview.text.trim() || isSubmittingReview}
                >
                  {isSubmittingReview ? (
                    <div className="w-5 h-5 border-2 border-primary-foreground border-t-transparent flex-shrink-0 animate-spin rounded-full"></div>
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                  إرسال التقييم
                </Button>
              </form>
            </div>

            {/* عرض التقييمات */}
            <div className="lg:col-span-2 flex flex-col gap-4">
              {allReviews.map((review, i) => (
              <motion.div
                key={review.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className="bg-card border border-border rounded-2xl p-5 space-y-3 hover:border-primary/30 transition-colors"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary/30 to-amber-500/30 flex items-center justify-center font-bold text-sm text-primary shrink-0">
                      {review.name.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-1">
                        <p className="font-semibold text-sm">{review.name}</p>
                        {review.verified && (
                          <CheckCircle className="w-3.5 h-3.5 text-green-400 shrink-0" />
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">{review.date}</p>
                    </div>
                  </div>
                  <div className="flex gap-0.5 shrink-0">
                    {[1,2,3,4,5].map(s => (
                      <Star key={s} className={`w-3.5 h-3.5 ${
                        s <= Math.floor(review.rating) ? 'text-amber-400 fill-amber-400' :
                        s === Math.ceil(review.rating) && review.rating % 1 !== 0 ? 'text-amber-400 fill-amber-400/50' :
                        'text-gray-700'
                      }`} />
                    ))}
                  </div>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">{review.text}</p>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <ThumbsUp className="w-3 h-3" />
                  <span>مفيد</span>
                </div>
              </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Floating Chat ONLY if user has an active order for this product */}
      {hasActiveOrder && user?.phone && (
        <ProductChat productId={product.id} userPhone={user.phone} />
      )}
    </div>
  );
}
