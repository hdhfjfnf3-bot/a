import { useState } from "react";
import { useGetProducts, useGetCategories } from "@workspace/api-client-react";
import { ProductCard } from "@/components/ProductCard";
import { Input } from "@/components/ui/input";
import { Search, Filter } from "lucide-react";

export function Products() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<number | undefined>();

  // Fetch all products, allow filtering client-side or pass params to query
  const { data: products, isLoading } = useGetProducts({ 
    search: search.length > 2 ? search : undefined,
    categoryId: selectedCategory 
  });
  
  const { data: categories } = useGetCategories();

  return (
    <div className="min-h-screen pt-32 pb-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-12 text-center md:text-right">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            تصفح <span className="text-gradient-gold">المنتجات</span>
          </h1>
          <p className="text-muted-foreground text-lg">
            اكتشف أحدث وأفخم المنتجات المتاحة في متجرنا
          </p>
        </div>

        {/* Filters and Search */}
        <div className="flex flex-col md:flex-row gap-6 mb-12 bg-card border border-white/5 p-4 rounded-2xl shadow-lg">
          <div className="relative flex-1">
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input 
              placeholder="ابحث عن منتج..." 
              className="pr-12 bg-background/50"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          
          <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
            <button
              onClick={() => setSelectedCategory(undefined)}
              className={`whitespace-nowrap px-6 py-3 rounded-xl font-medium transition-all ${
                !selectedCategory 
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" 
                  : "bg-background/50 text-muted-foreground hover:text-foreground hover:bg-white/5"
              }`}
            >
              الكل
            </button>
            {categories?.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`whitespace-nowrap px-6 py-3 rounded-xl font-medium transition-all ${
                  selectedCategory === cat.id 
                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" 
                    : "bg-background/50 text-muted-foreground hover:text-foreground hover:bg-white/5"
                }`}
              >
                {cat.nameAr || cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        {isLoading ? (
          <div className="flex justify-center py-32">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (Array.isArray(products) ? products : (products as any)?.data || [])?.length === 0 ? (
          <div className="text-center py-32 bg-card rounded-3xl border border-white/5">
            <Filter className="w-16 h-16 text-muted-foreground mx-auto mb-6 opacity-50" />
            <h3 className="text-2xl font-bold mb-2">لا توجد منتجات</h3>
            <p className="text-muted-foreground">حاول تغيير كلمات البحث أو القسم المختار</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-8">
            {(Array.isArray(products) ? products : (products as any)?.data || []).map((product: any, i: number) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
