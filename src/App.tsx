import { useState, useEffect, createContext, useContext } from "react";

// ─── Types ──────────────────────────────────────────────────────

interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  image: string;
  category: string;
}

interface SaleProduct {
  id: number;
  name: string;
  originalPrice: number;
  salePrice: number;
  discount: number;
  description: string;
  image: string;
  category: string;
  badge?: string;
}

interface CartItem {
  id: number;
  name: string;
  price: number;
  image: string;
  quantity: number;
  category: string;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (item: Omit<CartItem, "quantity">) => void;
  removeFromCart: (id: number) => void;
  updateQuantity: (id: number, qty: number) => void;
  clearCart: () => void;
  totalItems: number;
  subtotal: number;
  deliveryFee: number;
  total: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
}

// ─── Context ────────────────────────────────────────────────────

const CartContext = createContext<CartContextType | null>(null);

function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}

const DELIVERY_FEE = 50;

function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Prevent scroll when cart is open
  useEffect(() => {
    document.body.style.overflow = isCartOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isCartOpen]);

  const addToCart = (item: Omit<CartItem, "quantity">) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        return prev.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (id: number) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const updateQuantity = (id: number, qty: number) => {
    if (qty <= 0) {
      removeFromCart(id);
      return;
    }
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, quantity: qty } : i))
    );
  };

  const clearCart = () => setItems([]);

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const deliveryFee = items.length > 0 ? DELIVERY_FEE : 0;
  const total = subtotal + deliveryFee;

  return (
    <CartContext.Provider
      value={{
        items, addToCart, removeFromCart, updateQuantity, clearCart,
        totalItems, subtotal, deliveryFee, total, isCartOpen, setIsCartOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

// ─── Data ──────────────────────────────────────────────────────

const products: Product[] = [
  { id: 1, name: "كرة بيلياردو احترافية", price: 250, description: "كرة بيلياردو احترافية عالية الجودة، مثالية للالعاب التنافسية والتدريب.", image: "/images/billiard-ball.jpg", category: "billiard" },
  { id: 2, name: "ستيك بيلياردو", price: 350, description: "ستيك بيلياردو احترافي مصنوع من الخشب الطبيعي عالي الجودة.", image: "/images/billiard-cue.jpg", category: "billiard" },
  { id: 3, name: "طباشير Master", price: 25, description: "طباشير Master الأصلي للبيلياردو. قبضة ممتازة ويمنع الانزلاق.", image: "/images/master-chalk.jpg", category: "billiard" },
  { id: 4, name: "كرة بابي فوت", price: 30, description: "كرة بابي فوت احترافية مصنوعة من مواد متينة للتحكم الدقيق.", image: "/images/foosball-ball.jpg", category: "foosball" },
  { id: 5, name: "مقبض بابي فوت", price: 40, description: "مقبض بابي فوت مريح ومتين بتصميم أنيق يوفر قبضة محكمة.", image: "/images/foosball-handle.jpg", category: "foosball" },
  { id: 6, name: "كرة بابي فوت", price: 30, description: "كرة بابي فوت احترافية مصنوعة من مواد متينة للتحكم الدقيق.", image: "/images/foosball-ball.jpg", category: "foosball" },
  { id: 7, name: "مقبض بابي فوت", price: 40, description: "مقبض بابي فوت مريح ومتين بتصميم أنيق يوفر قبضة محكمة.", image: "/images/foosball-handle.jpg", category: "foosball" },
];

const saleProducts: SaleProduct[] = [
  { id: 101, name: "طقم كرات بيلياردو كامل 16 كرة", originalPrice: 1200, salePrice: 850, discount: 29, description: "طقم كرات بيلياردو احترافي كامل 16 كرة بألوان زاهية وجودة عالمية.", image: "/images/billiard-ball.jpg", category: "billiard", badge: "الأكثر مبيعاً 🔥" },
  { id: 102, name: "ستيك بيلياردو خشب زان فاخر", originalPrice: 600, salePrice: 420, discount: 30, description: "ستيك خشب الزان الطبيعي بتصميم أنيق ومتوازن للاعبين المحترفين.", image: "/images/billiard-cue.jpg", category: "billiard", badge: "عرض حصري ⭐" },
  { id: 103, name: "علبة طباشير Master x12", originalPrice: 300, salePrice: 200, discount: 33, description: "علبة كاملة من طباشير Master الأصلي تحتوي على 12 قطعة.", image: "/images/master-chalk.jpg", category: "billiard", badge: "خصم خاص 💎" },
  { id: 104, name: "طقم كرات بابي فوت 10 كرات", originalPrice: 250, salePrice: 160, discount: 36, description: "طقم كرات بابي فوت متين ومتوازن. مقاومة للكسر.", image: "/images/foosball-ball.jpg", category: "foosball", badge: "كمية محدودة ⏰" },
  { id: 105, name: "مجموعة 4 مقابض بابي فوت", originalPrice: 180, salePrice: 120, discount: 33, description: "مجموعة 4 مقابض بابي فوت أصلية بقبضة مريحة.", image: "/images/foosball-handle.jpg", category: "foosball", badge: "الأكثر طلباً 🏆" },
  { id: 106, name: "قماش طاولة بيلياردو Speed Pro", originalPrice: 1500, salePrice: 1100, discount: 27, description: "قماش بيلياردو احترافي Speed Pro بجودة عالية ومتانة طويلة.", image: "/images/billiard-cue.jpg", category: "billiard", badge: "جديد 🆕" },
];

// ─── Icons ──────────────────────────────────────────────────────

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

function CartIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
    </svg>
  );
}

function TrashIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
  );
}

function PlusIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
    </svg>
  );
}

function MinusIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M20 12H4" />
    </svg>
  );
}

// ─── Cart Drawer ────────────────────────────────────────────────

function CartDrawer() {
  const { items, removeFromCart, updateQuantity, clearCart, totalItems, subtotal, deliveryFee, total, isCartOpen, setIsCartOpen } = useCart();
  const [step, setStep] = useState<"cart" | "checkout">("cart");
  const [form, setForm] = useState({ name: "", phone: "", address: "" });
  const [errors, setErrors] = useState({ name: "", phone: "", address: "" });

  const resetAndClose = () => {
    setStep("cart");
    setForm({ name: "", phone: "", address: "" });
    setErrors({ name: "", phone: "", address: "" });
    setIsCartOpen(false);
  };

  const goBackToCart = () => {
    setStep("cart");
    setErrors({ name: "", phone: "", address: "" });
  };

  const validate = () => {
    const e = { name: "", phone: "", address: "" };
    let ok = true;
    if (!form.name.trim()) { e.name = "الاسم مطلوب"; ok = false; }
    if (!form.phone.trim()) { e.phone = "رقم الهاتف مطلوب"; ok = false; }
    else if (!/^[\d+\s]{8,15}$/.test(form.phone.trim())) { e.phone = "رقم الهاتف غير صحيح"; ok = false; }
    if (!form.address.trim()) { e.address = "العنوان مطلوب"; ok = false; }
    setErrors(e);
    return ok;
  };

  const buildWhatsAppMessage = () => {
    let msg = "🛒 *طلب جديد — Billiard Store*\n";
    msg += "━━━━━━━━━━━━━━━\n\n";
    items.forEach((item, i) => {
      msg += `${i + 1}. ${item.name}\n    ${item.quantity} × ${item.price} = ${item.price * item.quantity} DH\n`;
    });
    msg += "\n━━━━━━━━━━━━━━━\n";
    msg += `📦 المجموع الفرعي: *${subtotal} DH*\n`;
    msg += `🚚 التوصيل: *${deliveryFee} DH*\n`;
    msg += `💰 الإجمالي: *${total} DH*\n`;
    msg += "\n━━━━━━━━━━━━━━━\n";
    msg += "📋 *معلومات الزبون*\n\n";
    msg += `👤 الاسم: ${form.name}\n`;
    msg += `📞 الهاتف: ${form.phone}\n`;
    msg += `📍 العنوان: ${form.address}\n`;
    return encodeURIComponent(msg);
  };

  const handleConfirm = () => {
    if (!validate()) return;
    const url = `https://wa.me/212717657640?text=${buildWhatsAppMessage()}`;
    window.open(url, "_blank");
    clearCart();
    resetAndClose();
  };

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 z-50 transition-all duration-300 ${
          isCartOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
      >
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={resetAndClose} />

        {/* Drawer */}
        <div
          className={`absolute top-0 left-0 h-full w-full sm:w-[420px] bg-billiard-black border-r border-gray-800 shadow-2xl flex flex-col transition-transform duration-300 ${
            isCartOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 sm:p-5 border-b border-gray-800 flex-shrink-0">
            <button
              onClick={step === "checkout" ? goBackToCart : () => setIsCartOpen(false)}
              className="text-gray-400 hover:text-white p-1.5 rounded-lg hover:bg-gray-800 transition-colors"
            >
              {step === "checkout" ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </button>
            <div className="flex items-center gap-2">
              {/* Step indicators */}
              <div className="flex items-center gap-1.5">
                <div className={`w-2.5 h-2.5 rounded-full transition-colors duration-300 ${step === "cart" ? "bg-billiard-green-light scale-125" : "bg-billiard-green-light/60"}`} />
                <div className={`w-8 h-0.5 rounded-full transition-colors duration-300 ${step === "checkout" ? "bg-billiard-green-light" : "bg-gray-700"}`} />
                <div className={`w-2.5 h-2.5 rounded-full transition-colors duration-300 ${step === "checkout" ? "bg-billiard-green-light scale-125" : "bg-gray-700"}`} />
              </div>
              <h2 className="text-lg font-bold text-white">
                {step === "cart" ? "سلة المشتريات" : "معلومات التوصيل"}
              </h2>
              {step === "cart" && (
                <span className="bg-billiard-green text-white text-xs font-bold px-2 py-0.5 rounded-full">{totalItems}</span>
              )}
            </div>
          </div>

          {items.length === 0 && step === "cart" ? (
            /* Empty state */
            <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
              <div className="w-20 h-20 bg-gray-800 rounded-full flex items-center justify-center mb-4">
                <CartIcon className="w-10 h-10 text-gray-600" />
              </div>
              <h3 className="text-white font-bold text-lg mb-2">السلة فارغة</h3>
              <p className="text-gray-500 text-sm mb-6">لم تضف أي منتجات بعد. تصفح المنتجات وأضف ما تريد!</p>
              <button
                onClick={() => setIsCartOpen(false)}
                className="bg-billiard-green hover:bg-billiard-green-dark text-white font-bold px-6 py-3 rounded-xl transition-all active:scale-95"
              >
                تصفح المنتجات
              </button>
            </div>
          ) : step === "cart" ? (
            <>
              {/* Items */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="bg-gray-900/80 rounded-xl p-3 border border-gray-800 flex gap-3"
                  >
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden flex-shrink-0 bg-gray-800">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-white text-sm font-bold leading-tight mb-1 line-clamp-1">{item.name}</h4>
                      <p className="text-billiard-green-light font-bold text-sm mb-2">{item.price} DH</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-0">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="w-8 h-8 bg-gray-800 hover:bg-gray-700 text-white rounded-lg rounded-l-none flex items-center justify-center transition-colors active:scale-90"
                          >
                            <PlusIcon className="w-4 h-4" />
                          </button>
                          <span className="w-10 h-8 bg-gray-800 text-white text-sm font-bold flex items-center justify-center border-x border-gray-700">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="w-8 h-8 bg-gray-800 hover:bg-gray-700 text-white rounded-lg rounded-r-none flex items-center justify-center transition-colors active:scale-90"
                          >
                            <MinusIcon className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-white font-bold text-sm">{item.price * item.quantity} DH</span>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="text-red-400 hover:text-red-300 hover:bg-red-500/10 p-1.5 rounded-lg transition-colors active:scale-90"
                          >
                            <TrashIcon className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Footer / Summary */}
              <div className="border-t border-gray-800 p-4 sm:p-5 space-y-3 flex-shrink-0 bg-billiard-dark/50">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">المجموع الفرعي ({totalItems} منتج)</span>
                  <span className="text-white font-bold">{subtotal} DH</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400 flex items-center gap-1"><span>🚚</span> التوصيل</span>
                  <span className="text-amber-400 font-bold">+{deliveryFee} DH</span>
                </div>
                <div className="border-t border-gray-700 pt-3">
                  <div className="flex items-center justify-between">
                    <span className="text-white font-bold text-lg">الإجمالي</span>
                    <span className="text-billiard-green-light font-black text-2xl">{total} DH</span>
                  </div>
                </div>

                <button
                  onClick={() => setStep("checkout")}
                  className="flex items-center justify-center gap-2 w-full bg-billiard-green hover:bg-billiard-green-dark text-white font-bold py-3.5 rounded-xl transition-all text-base shadow-lg shadow-billiard-green/25 active:scale-95"
                >
                  <span>متابعة الطلب</span>
                  <svg className="w-5 h-5 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>

                <button
                  onClick={clearCart}
                  className="flex items-center justify-center gap-2 w-full bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-red-400 font-medium py-2.5 rounded-xl transition-all text-sm active:scale-95"
                >
                  <TrashIcon className="w-4 h-4" />
                  <span>إفراغ السلة</span>
                </button>
              </div>
            </>
          ) : (
            /* ─── Checkout Step ─── */
            <div className="flex-1 flex flex-col overflow-hidden">
              <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-5">
                {/* Order summary mini */}
                <div className="bg-gray-900/80 rounded-xl p-3.5 border border-gray-800">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-400 text-xs font-medium">ملخص الطلب</span>
                    <button onClick={goBackToCart} className="text-billiard-green-light text-xs font-bold hover:underline">تعديل</button>
                  </div>
                  <div className="space-y-1.5">
                    {items.map((item) => (
                      <div key={item.id} className="flex items-center justify-between text-sm">
                        <span className="text-gray-300">{item.name} × {item.quantity}</span>
                        <span className="text-white font-bold">{item.price * item.quantity} DH</span>
                      </div>
                    ))}
                  </div>
                  <div className="border-t border-gray-700 mt-2 pt-2 flex items-center justify-between">
                    <span className="text-white font-bold text-sm">💰 الإجمالي + التوصيل</span>
                    <span className="text-billiard-green-light font-black text-lg">{total} DH</span>
                  </div>
                </div>

                {/* Form */}
                <div className="space-y-4">
                  <h3 className="text-white font-bold text-base flex items-center gap-2">
                    <span className="w-7 h-7 bg-billiard-green/20 rounded-lg flex items-center justify-center text-sm">📋</span>
                    معلومات التوصيل
                  </h3>

                  {/* Name */}
                  <div>
                    <label className="block text-gray-400 text-xs font-medium mb-1.5">👤 الاسم الكامل <span className="text-red-400">*</span></label>
                    <input
                      type="text"
                      placeholder="مثال: أحمد بنعلي"
                      value={form.name}
                      onChange={(e) => { setForm({ ...form, name: e.target.value }); if (errors.name) setErrors({ ...errors, name: "" }); }}
                      className={`w-full bg-gray-900 border rounded-xl px-4 py-3 text-white text-sm placeholder:text-gray-600 focus:outline-none focus:ring-2 transition-colors ${
                        errors.name ? "border-red-500 focus:ring-red-500/30" : "border-gray-700 focus:ring-billiard-green/30 focus:border-billiard-green"
                      }`}
                    />
                    {errors.name && <p className="text-red-400 text-xs mt-1 flex items-center gap-1"><span>⚠️</span> {errors.name}</p>}
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-gray-400 text-xs font-medium mb-1.5">📞 رقم الهاتف <span className="text-red-400">*</span></label>
                    <input
                      type="tel"
                      placeholder="مثال: 0717657640"
                      value={form.phone}
                      dir="ltr"
                      onChange={(e) => { setForm({ ...form, phone: e.target.value }); if (errors.phone) setErrors({ ...errors, phone: "" }); }}
                      className={`w-full bg-gray-900 border rounded-xl px-4 py-3 text-white text-sm placeholder:text-gray-600 focus:outline-none focus:ring-2 transition-colors text-left ${
                        errors.phone ? "border-red-500 focus:ring-red-500/30" : "border-gray-700 focus:ring-billiard-green/30 focus:border-billiard-green"
                      }`}
                    />
                    {errors.phone && <p className="text-red-400 text-xs mt-1 flex items-center gap-1"><span>⚠️</span> {errors.phone}</p>}
                  </div>

                  {/* Address */}
                  <div>
                    <label className="block text-gray-400 text-xs font-medium mb-1.5">📍 العنوان / المدينة <span className="text-red-400">*</span></label>
                    <textarea
                      placeholder="مثال: الدار البيضاء، حي المعاريف، شارع الحسن الثاني، رقم 15"
                      value={form.address}
                      onChange={(e) => { setForm({ ...form, address: e.target.value }); if (errors.address) setErrors({ ...errors, address: "" }); }}
                      rows={3}
                      className={`w-full bg-gray-900 border rounded-xl px-4 py-3 text-white text-sm placeholder:text-gray-600 focus:outline-none focus:ring-2 transition-colors resize-none ${
                        errors.address ? "border-red-500 focus:ring-red-500/30" : "border-gray-700 focus:ring-billiard-green/30 focus:border-billiard-green"
                      }`}
                    />
                    {errors.address && <p className="text-red-400 text-xs mt-1 flex items-center gap-1"><span>⚠️</span> {errors.address}</p>}
                  </div>
                </div>

                {/* Info note */}
                <div className="bg-billiard-green/10 border border-billiard-green/20 rounded-xl p-3.5">
                  <p className="text-billiard-green-light text-xs leading-relaxed flex items-start gap-2">
                    <span className="text-base flex-shrink-0">💡</span>
                    <span>بعد الضغط على "تأكيد الطلب"، سيتم توجيهك إلى واتساب لإرسال الطلب تلقائياً. سيتم التواصل معك لتأكيد الطلب وموعد التوصيل.</span>
                  </p>
                </div>
              </div>

              {/* Checkout footer */}
              <div className="border-t border-gray-800 p-4 sm:p-5 space-y-3 flex-shrink-0 bg-billiard-dark/50">
                <div className="flex items-center justify-between">
                  <span className="text-white font-bold">💰 الإجمالي</span>
                  <div className="text-left">
                    <span className="text-billiard-green-light font-black text-xl">{total} DH</span>
                    <span className="text-gray-500 text-xs block">شامل التوصيل +{deliveryFee}</span>
                  </div>
                </div>

                <button
                  onClick={handleConfirm}
                  className="flex items-center justify-center gap-2 w-full bg-billiard-green hover:bg-billiard-green-dark text-white font-bold py-3.5 rounded-xl transition-all text-base shadow-lg shadow-billiard-green/25 active:scale-95"
                >
                  <WhatsAppIcon className="w-5 h-5" />
                  <span>تأكيد الطلب عبر واتساب</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

// ─── Cart Badge Button (for navbar) ────────────────────────────

function CartBadgeButton() {
  const { totalItems, setIsCartOpen } = useCart();
  return (
    <button
      onClick={() => setIsCartOpen(true)}
      className="relative text-white p-2 rounded-lg hover:bg-gray-800/50 transition-colors active:scale-90"
      aria-label="السلة"
    >
      <CartIcon className="w-6 h-6" />
      {totalItems > 0 && (
        <span className="absolute -top-0.5 -left-0.5 bg-red-500 text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center animate-pulse shadow-lg shadow-red-500/40">
          {totalItems > 9 ? "+9" : totalItems}
        </span>
      )}
    </button>
  );
}

// ─── Navbar ─────────────────────────────────────────────────────

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleResize = () => { if (window.innerWidth >= 768) setMenuOpen(false); };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  const navLinks = [
    { name: "الرئيسية", href: "#hero", icon: "🏠" },
    { name: "العروض", href: "#sales", icon: "🔥" },
    { name: "المنتجات", href: "#products", icon: "🛒" },
    { name: "من نحن", href: "#about", icon: "ℹ️" },
    { name: "اتصل بنا", href: "#contact", icon: "📞" },
  ];

  return (
    <>
      <nav
        className={`fixed top-0 right-0 left-0 z-40 transition-all duration-300 ${
          scrolled ? "bg-billiard-black/95 backdrop-blur-md shadow-lg shadow-black/30" : "bg-transparent"
        }`}
      >
        <div className="max-w-[75%] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-20">
            <a href="#hero" className="flex items-center gap-2 group">
              <span className="text-2xl sm:text-3xl">🎱</span>
              <span className="text-base sm:text-xl font-bold text-white">
                Billiard <span className="text-billiard-green-light">Store</span>
              </span>
            </a>

            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className={`text-sm font-medium transition-colors duration-200 ${
                    link.name === "العروض" ? "text-red-400 hover:text-red-300" : "text-gray-300 hover:text-billiard-green-light"
                  }`}
                >
                  {link.name}
                </a>
              ))}
            </div>

            <div className="flex items-center gap-1">
              <CartBadgeButton />
              <button
                className="md:hidden text-white p-2 rounded-lg active:bg-gray-800 transition-colors"
                onClick={() => setMenuOpen(!menuOpen)}
                aria-label="Toggle menu"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {menuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      <div className={`fixed inset-0 z-40 md:hidden transition-all duration-300 ${menuOpen ? "opacity-100 visible" : "opacity-0 invisible"}`}>
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setMenuOpen(false)} />
        <div className={`absolute top-0 right-0 w-72 h-full bg-billiard-black border-l border-gray-800 shadow-2xl transition-transform duration-300 ${menuOpen ? "translate-x-0" : "translate-x-full"}`}>
          <div className="pt-20 pb-6 px-5">
            <div className="flex items-center gap-2 mb-8 pb-6 border-b border-gray-800">
              <span className="text-3xl">🎱</span>
              <span className="text-lg font-bold text-white">Billiard <span className="text-billiard-green-light">Store</span></span>
            </div>
            <div className="space-y-1">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all active:scale-95 ${
                    link.name === "العروض" ? "text-red-400 hover:bg-red-500/10" : "text-gray-300 hover:text-billiard-green-light hover:bg-gray-800/60"
                  }`}
                >
                  <span className="text-xl">{link.icon}</span>
                  <span className="font-medium">{link.name}</span>
                </a>
              ))}
            </div>
            <div className="mt-8 pt-6 border-t border-gray-800 space-y-2">
              <a
                href="https://wa.me/212717657640"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 bg-billiard-green text-white font-bold py-3.5 rounded-xl w-full active:scale-95 transition-transform"
              >
                <WhatsAppIcon className="w-5 h-5" />
                <span>اطلب عبر واتساب</span>
              </a>
              <button
                onClick={() => { setMenuOpen(false); }}
                className="flex items-center justify-center gap-2 bg-gray-800 text-white font-medium py-3 rounded-xl w-full active:scale-95 transition-transform"
              >
                <CartIcon className="w-5 h-5" />
                <span>السلة</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// ─── Hero ───────────────────────────────────────────────────────

function HeroSection() {
  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0">
        <img src="/images/hero-billiard.jpg" alt="Billiard table" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-billiard-black" />
      </div>
      <div className="absolute top-1/4 left-0 w-48 sm:w-72 h-48 sm:h-72 bg-billiard-green/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-0 w-64 sm:w-96 h-64 sm:h-96 bg-billiard-green/5 rounded-full blur-3xl" />

      <div className="relative z-10 max-w-[75%] mx-auto px-5 sm:px-6 lg:px-8 text-center pt-16 pb-24 sm:pt-0 sm:pb-0">
        <div className="animate-slide-up">
          <div className="inline-flex items-center gap-2 bg-billiard-green/20 border border-billiard-green/30 rounded-full px-4 py-1.5 sm:px-5 sm:py-2 mb-6 sm:mb-8">
            <span className="w-2 h-2 bg-billiard-green-light rounded-full animate-pulse" />
            <span className="text-billiard-green-light text-xs sm:text-sm font-medium">متجر معتمد في المغرب 🇲🇦</span>
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-7xl font-black text-white mb-4 sm:mb-6 leading-tight">
            🎲 كل ما تحتاجه
            <br />لطاولة <span className="text-gradient">البيلياردو</span>
            <br />و<span className="text-gradient">بابي فوت</span>
          </h1>

          <p className="text-gray-400 text-sm sm:text-lg max-w-xl mx-auto mb-8 sm:mb-10 leading-relaxed px-2">
            بيع جميع مستلزمات البيلياردو وبابي فوت بجودة عالية وأسعار تنافسية. شحن لجميع مدن المغرب
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 px-2">
            <a href="#sales" className="group w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white font-bold px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl transition-all text-base sm:text-lg shadow-lg shadow-red-500/30 active:scale-95">
              <span className="animate-pulse">🔥</span>
              <span>تصفح العروض</span>
              <span className="bg-white/20 text-xs px-2 py-0.5 rounded-full">-%{saleProducts[0].discount}</span>
            </a>
            <a href="#products" className="group w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-billiard-green hover:bg-billiard-green-dark text-white font-bold px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl transition-all text-base sm:text-lg shadow-lg shadow-billiard-green/25 active:scale-95">
              <span>تصفح المنتجات</span>
            </a>
            <a href="https://wa.me/212717657640" target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-transparent border-2 border-gray-600 hover:border-billiard-green-light text-white font-bold px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl transition-all text-base sm:text-lg active:scale-95">
              <WhatsAppIcon className="w-5 h-5" />
              <span>واتساب</span>
            </a>
          </div>
        </div>

        <div className="mt-10 sm:mt-16 grid grid-cols-3 gap-2 sm:gap-8 max-w-md sm:max-w-xl mx-auto animate-fade-in bg-white/5 backdrop-blur-sm rounded-2xl sm:rounded-none p-4 sm:p-0 sm:bg-transparent border border-white/10 sm:border-0">
          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <svg className="w-5 h-5 sm:w-6 sm:h-6 text-billiard-green-light/70" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
            </div>
            <div className="text-xl sm:text-3xl font-black text-billiard-green-light">+500</div>
            <div className="text-gray-400 text-[10px] sm:text-sm mt-0.5">منتج متوفر</div>
          </div>
          <div className="text-center border-x border-white/10 sm:border-gray-800">
            <div className="flex items-center justify-center mb-1">
              <svg className="w-5 h-5 sm:w-6 sm:h-6 text-billiard-green-light/70" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
            </div>
            <div className="text-xl sm:text-3xl font-black text-billiard-green-light">+1000</div>
            <div className="text-gray-400 text-[10px] sm:text-sm mt-0.5">عميل راضي</div>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <svg className="w-5 h-5 sm:w-6 sm:h-6 text-billiard-green-light/70" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
            </div>
            <div className="text-xl sm:text-3xl font-black text-billiard-green-light">🇲🇦</div>
            <div className="text-gray-400 text-[10px] sm:text-sm mt-0.5">شحن جميع المدن</div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-5 h-8 sm:w-6 sm:h-10 border-2 border-gray-600 rounded-full flex justify-center pt-1.5 sm:pt-2">
          <div className="w-1 h-2.5 sm:w-1.5 sm:h-3 bg-billiard-green-light rounded-full animate-pulse" />
        </div>
      </div>
    </section>
  );
}

// ─── Add to Cart Button ─────────────────────────────────────────

function AddToCartButton({ id, name, price, image, category }: {
  id: number; name: string; price: number; image: string; category: string;
}) {
  const { addToCart } = useCart();

  return (
    <button
      onClick={() => {
        addToCart({ id, name, price, image, category });
      }}
      className="inline-flex items-center gap-1.5 bg-billiard-green hover:bg-billiard-green-dark text-white font-bold px-3.5 py-2 sm:px-5 sm:py-2.5 rounded-xl transition-all duration-300 text-[11px] sm:text-sm shadow-lg shadow-billiard-green/20 active:scale-95 whitespace-nowrap"
    >
      <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" /></svg>
      <span>أضف للسلة</span>
    </button>
  );
}

// ─── Sale Product Card ──────────────────────────────────────────

function SaleProductCard({ product }: { product: SaleProduct }) {
  const [imgLoaded, setImgLoaded] = useState(false);

  return (
    <div className="relative bg-gradient-to-br from-gray-900 to-billiard-gray rounded-2xl overflow-hidden border border-red-500/20 hover:border-red-500/50 group transition-all duration-300 flex flex-row sm:flex-col">
      {/* Discount ribbon */}
      <div className="absolute top-0 right-0 z-10">
        <div className="bg-red-500 text-white font-black text-[9px] sm:text-sm px-2 py-1 sm:px-3.5 sm:py-1.5 rounded-bl-xl sm:rounded-bl-2xl shadow-lg flex items-center gap-0.5">
          <svg className="w-2.5 h-2.5 sm:w-3 sm:h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" /></svg>
          <span>{product.discount}%</span>
        </div>
      </div>

      {/* Image */}
      <div className="relative overflow-hidden bg-billiard-black w-28 sm:w-auto flex-shrink-0 sm:aspect-[4/3]">
        {!imgLoaded && (
          <div className="absolute inset-0 bg-gray-800 animate-pulse flex items-center justify-center">
            <span className="text-2xl sm:text-4xl">{product.category === "billiard" ? "🎱" : "⚽"}</span>
          </div>
        )}
        <img
          src={product.image}
          alt={product.name}
          className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ${imgLoaded ? "opacity-100" : "opacity-0"}`}
          onLoad={() => setImgLoaded(true)}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent hidden sm:block" />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/20 sm:hidden" />

        {/* Badge — desktop only */}
        {product.badge && (
          <div className="absolute top-2 left-2 hidden sm:block">
            <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold text-[10px] px-2.5 py-1 rounded-lg shadow-lg truncate max-w-[120px]">{product.badge}</div>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col justify-between flex-1 p-3 sm:p-4 sm:pt-3 min-w-0">
        <div>
          {/* Badge — mobile only */}
          {product.badge && (
            <div className="mb-1 sm:hidden">
              <span className="bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold text-[8px] px-1.5 py-0.5 rounded truncate max-w-full inline-block">{product.badge}</span>
            </div>
          )}
          <h3 className="text-xs sm:text-base font-bold text-white mb-1 group-hover:text-red-400 transition-colors leading-tight line-clamp-2">{product.name}</h3>
          <p className="text-gray-500 text-[10px] sm:text-xs leading-relaxed mb-2 sm:mb-3 line-clamp-1 sm:line-clamp-2">{product.description}</p>
        </div>

        {/* Prices */}
        <div className="mb-2 sm:mb-3">
          <div className="flex items-end gap-1.5 sm:gap-2">
            <span className="text-base sm:text-xl font-black text-red-400 whitespace-nowrap">{product.salePrice} <span className="text-[9px] sm:text-xs font-medium text-gray-500">DH</span></span>
            <span className="text-[10px] sm:text-xs text-gray-600 line-through" dir="ltr">{product.originalPrice} DH</span>
          </div>
          <div className="flex items-center gap-0.5 mt-0.5">
            <svg className="w-2.5 h-2.5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
            <span className="text-[9px] sm:text-[10px] text-red-400 font-bold">وفّر {product.originalPrice - product.salePrice} DH</span>
          </div>
        </div>

        {/* Add to cart */}
        <div className="mt-auto">
          <AddToCartButton id={product.id} name={product.name} price={product.salePrice} image={product.image} category={product.category} />
        </div>
      </div>
    </div>
  );
}

// ─── Discounts Section ──────────────────────────────────────────

function DiscountsSection() {
  return (
    <section id="sales" className="relative py-12 sm:py-28 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-red-950/30 via-billiard-black to-billiard-black" />
      <div className="absolute top-0 left-1/4 w-64 sm:w-[500px] h-64 sm:h-[500px] bg-red-500/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-48 sm:w-96 h-48 sm:h-96 bg-orange-500/5 rounded-full blur-3xl" />

      <div className="relative max-w-[75%] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-14">
          <div className="inline-flex items-center gap-2 bg-red-500/15 border border-red-500/30 rounded-full px-4 py-1.5 sm:px-5 sm:py-2 mb-4 sm:mb-6">
            <svg className="w-4 h-4 sm:w-5 sm:h-5 text-red-400 animate-pulse" fill="currentColor" viewBox="0 0 24 24"><path d="M12 23a7.5 7.5 0 0 1-5.138-12.963C8.204 8.774 11.5 6.5 11 1.5c6 4 9 8 3 14 1 0 2.5 0 5-2.47.27.773.5 1.604.5 2.47A7.5 7.5 0 0 1 12 23z"/></svg>
            <span className="text-red-400 text-xs sm:text-sm font-bold">عروض حصرية</span>
            <svg className="w-4 h-4 sm:w-5 sm:h-5 text-red-400 animate-pulse" fill="currentColor" viewBox="0 0 24 24"><path d="M12 23a7.5 7.5 0 0 1-5.138-12.963C8.204 8.774 11.5 6.5 11 1.5c6 4 9 8 3 14 1 0 2.5 0 5-2.47.27.773.5 1.604.5 2.47A7.5 7.5 0 0 1 12 23z"/></svg>
          </div>
          <h2 className="text-3xl sm:text-5xl md:text-6xl font-black text-white mb-3 sm:mb-4">
            <span className="text-red-400">عروض</span> حصرية
          </h2>
          <p className="text-gray-400 text-sm sm:text-lg max-w-xl mx-auto">
            عروض لا تتكرر على أفضل مستلزمات البيلياردو وبابي فوت. اغتنم الفرصة!
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6 lg:gap-8">
          {saleProducts.map((product) => (
            <SaleProductCard key={product.id} product={product} />
          ))}
        </div>

        <div className="mt-8 sm:mt-14 text-center">
          <a href="https://wa.me/212717657640?text=مرحباً، أريد الاستفسار عن العروض 🔥" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-3 bg-red-500 hover:bg-red-600 text-white font-bold px-6 sm:px-10 py-3.5 sm:py-4 rounded-xl transition-all text-base sm:text-lg shadow-xl shadow-red-500/25 active:scale-95">
            <WhatsAppIcon className="w-5 h-5 sm:w-6 sm:h-6" />
            <span>اطلب الآن قبل نفاد الكمية</span>
            <span className="text-lg sm:text-xl">🔥</span>
          </a>
        </div>
      </div>
    </section>
  );
}

// ─── Product Card ───────────────────────────────────────────────

function ProductCard({ product }: { product: Product }) {
  const [imgLoaded, setImgLoaded] = useState(false);

  return (
    <div className="bg-gradient-to-br from-gray-900 to-billiard-gray rounded-2xl overflow-hidden border border-gray-800 hover:border-billiard-green/30 group transition-all duration-300 flex flex-row sm:flex-col">
      {/* Image — square on mobile left side, vertical on desktop */}
      <div className="relative overflow-hidden bg-billiard-black w-28 sm:w-auto flex-shrink-0 sm:aspect-[4/3]">
        {!imgLoaded && (
          <div className="absolute inset-0 bg-gray-800 animate-pulse flex items-center justify-center">
            <span className="text-2xl sm:text-4xl">{product.category === "billiard" ? "🎱" : "⚽"}</span>
          </div>
        )}
        <img
          src={product.image}
          alt={product.name}
          className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ${imgLoaded ? "opacity-100" : "opacity-0"}`}
          onLoad={() => setImgLoaded(true)}
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent hidden sm:block" />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/20 sm:hidden" />

        {/* Category badge — desktop only */}
        <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-sm text-white px-2 py-0.5 rounded-md text-[9px] hidden sm:flex items-center gap-0.5">
          <span className="text-xs">{product.category === "billiard" ? "🎱" : "⚽"}</span>
          <span>{product.category === "billiard" ? "بيلياردو" : "بابي فوت"}</span>
        </div>

        {/* Price badge — desktop only */}
        <div className="absolute bottom-2 left-2 bg-billiard-green text-white font-bold px-2.5 py-1 rounded-lg text-xs shadow-lg hidden sm:flex items-center gap-1">
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" /></svg>
          <span>{product.price} DH</span>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col justify-between flex-1 p-3 sm:p-4 sm:pt-3 min-w-0">
        <div>
          {/* Category icon — mobile only */}
          <div className="flex items-center gap-1 mb-1 sm:hidden">
            <span className="text-xs">{product.category === "billiard" ? "🎱" : "⚽"}</span>
            <span className="text-gray-500 text-[9px]">{product.category === "billiard" ? "بيلياردو" : "بابي فوت"}</span>
          </div>
          <h3 className="text-xs sm:text-base font-bold text-white mb-1 group-hover:text-billiard-green-light transition-colors leading-tight line-clamp-2">{product.name}</h3>
          <p className="text-gray-500 text-[10px] sm:text-xs leading-relaxed mb-2 sm:mb-3 line-clamp-1 sm:line-clamp-2">{product.description}</p>
        </div>
        <div className="flex items-center justify-between gap-1.5 mt-auto">
          <span className="text-base sm:text-xl font-black text-billiard-green-light whitespace-nowrap">
            {product.price} <span className="text-[9px] sm:text-xs font-medium text-gray-500">DH</span>
          </span>
          <AddToCartButton id={product.id} name={product.name} price={product.price} image={product.image} category={product.category} />
        </div>
      </div>
    </div>
  );
}

// ─── Products Section ───────────────────────────────────────────

function ProductsSection() {
  const [filter, setFilter] = useState<"all" | "billiard" | "foosball">("all");
  const filteredProducts = filter === "all" ? products : products.filter((p) => p.category === filter);

  return (
    <section id="products" className="py-12 sm:py-28 bg-billiard-black">
      <div className="max-w-[75%] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-12">
          <span className="inline-block text-billiard-green-light text-xs sm:text-sm font-bold tracking-wider mb-2 sm:mb-3 bg-billiard-green/10 px-3 py-1 sm:px-4 rounded-full">المتجر</span>
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-black text-white mb-2 sm:mb-4">أحدث <span className="text-gradient">المنتجات</span></h2>
          <p className="text-gray-500 text-sm sm:text-lg max-w-2xl mx-auto">اكتشف تشكيلتنا المتميزة من المستلزمات الاحترافية</p>
        </div>

        <div className="flex items-center justify-center gap-2 sm:gap-3 mb-8 sm:mb-12">
          {[
            { key: "all", label: "الكل" },
            { key: "billiard", label: "🎱 بيلياردو" },
            { key: "foosball", label: "⚽ بابي فوت" },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key as "all" | "billiard" | "foosball")}
              className={`px-4 sm:px-6 py-2 sm:py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all duration-300 active:scale-95 ${
                filter === tab.key ? "bg-billiard-green text-white shadow-lg shadow-billiard-green/25" : "bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6 lg:gap-8">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── About ──────────────────────────────────────────────────────

function AboutSection() {
  return (
    <section id="about" className="py-12 sm:py-28 bg-billiard-dark relative overflow-hidden">
      <div className="absolute top-0 left-0 w-64 sm:w-96 h-64 sm:h-96 bg-billiard-green/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-64 sm:w-96 h-64 sm:h-96 bg-billiard-green/5 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />

      <div className="relative max-w-[75%] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-16">
          <span className="inline-block text-billiard-green-light text-xs sm:text-sm font-bold tracking-wider mb-2 sm:mb-3 bg-billiard-green/10 px-3 py-1 sm:px-4 rounded-full">تعرف علينا</span>
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-black text-white mb-2 sm:mb-4">من <span className="text-gradient">نحن</span>؟</h2>
        </div>

        <div className="max-w-3xl mx-auto">
          <div className="bg-gradient-to-br from-gray-900 to-billiard-gray rounded-2xl p-5 sm:p-12 border border-gray-800">
            <div className="text-center">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-billiard-green/20 rounded-2xl flex items-center justify-center text-3xl sm:text-4xl mx-auto mb-4 sm:mb-6">🎱</div>
              <p className="text-gray-300 text-sm sm:text-xl leading-relaxed mb-6 sm:mb-8">
                نحن متخصصون في بيع جميع مستلزمات البيلياردو وبابي فوت داخل المغرب مع إمكانية الشحن لجميع المدن.
                <br className="hidden sm:block" /><br className="hidden sm:block" />
                نقدم منتجات عالية الجودة بأسعار تنافسية مع خدمة عملاء مميزة وتوصيل سريع لجميع أنحاء المملكة المغربية 🇲🇦
              </p>
              <div className="grid grid-cols-2 gap-2.5 sm:gap-4">
                {[
                  { icon: (<svg className="w-6 h-6 sm:w-7 sm:h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>), label: "جودة عالية" },
                  { icon: (<svg className="w-6 h-6 sm:w-7 sm:h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" /></svg>), label: "أسعار تنافسية" },
                  { icon: (<svg className="w-6 h-6 sm:w-7 sm:h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" /></svg>), label: "شحن سريع" },
                  { icon: (<svg className="w-6 h-6 sm:w-7 sm:h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" /></svg>), label: "منتجات أصلية" },
                ].map((item, i) => (
                  <div key={i} className="bg-gray-800/50 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-gray-700/50 text-center">
                    <div className="text-billiard-green-light flex justify-center mb-1.5 sm:mb-2">{item.icon}</div>
                    <div className="text-gray-400 text-xs sm:text-sm font-medium">{item.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Contact ────────────────────────────────────────────────────

function ContactSection() {
  return (
    <section id="contact" className="py-12 sm:py-28 bg-billiard-black">
      <div className="max-w-[75%] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-16">
          <span className="inline-block text-billiard-green-light text-xs sm:text-sm font-bold tracking-wider mb-2 sm:mb-3 bg-billiard-green/10 px-3 py-1 sm:px-4 rounded-full">تواصل معنا</span>
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-black text-white mb-2 sm:mb-4">اتصل <span className="text-gradient">بنا</span></h2>
          <p className="text-gray-500 text-sm sm:text-lg">نسعد بتواصلكم معنا لأي استفسار أو طلب</p>
        </div>

        <div className="grid md:grid-cols-2 gap-4 sm:gap-8 max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-gray-900 to-billiard-gray rounded-2xl p-5 sm:p-8 border border-gray-800">
            <h3 className="text-base sm:text-xl font-bold text-white mb-4 sm:mb-6">معلومات التواصل</h3>
            <div className="space-y-4 sm:space-y-6">
              <a href="tel:+212717657640" className="flex items-center gap-3 sm:gap-4 p-3 -m-3 rounded-xl hover:bg-gray-800/30 transition-colors active:bg-gray-800/50">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-billiard-green/20 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 text-billiard-green-light" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                </div>
                <div>
                  <div className="text-gray-500 text-xs sm:text-sm mb-0.5">الهاتف</div>
                  <div className="text-white font-bold text-base sm:text-lg" dir="ltr">0717657640</div>
                </div>
              </a>
              <div className="flex items-center gap-3 sm:gap-4 p-3 -m-3">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-billiard-green/20 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 text-billiard-green-light" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                </div>
                <div>
                  <div className="text-gray-500 text-xs sm:text-sm mb-0.5">الموقع</div>
                  <div className="text-white font-bold text-base sm:text-lg">المغرب 🇲🇦</div>
                </div>
              </div>
              <div className="flex items-center gap-3 sm:gap-4 p-3 -m-3">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-billiard-green/20 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 text-billiard-green-light" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </div>
                <div>
                  <div className="text-gray-500 text-xs sm:text-sm mb-0.5">أوقات العمل</div>
                  <div className="text-white font-bold text-sm sm:text-base">كل يوم: 9:00 - 21:00</div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-billiard-green/20 to-billiard-green-dark/20 rounded-2xl p-5 sm:p-8 border border-billiard-green/30 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-billiard-green/20 rounded-full flex items-center justify-center mb-4 sm:mb-6">
              <WhatsAppIcon className="w-8 h-8 sm:w-10 sm:h-10 text-billiard-green-light" />
            </div>
            <h3 className="text-lg sm:text-2xl font-bold text-white mb-2 sm:mb-3">اطلب عبر واتساب</h3>
            <p className="text-gray-400 text-xs sm:text-base mb-5 sm:mb-8 leading-relaxed px-2">تواصل معنا مباشرة عبر واتساب لطلب أي منتج أو الاستفسار عن الأسعار والشحن</p>
            <a href="https://wa.me/212717657640" target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-billiard-green hover:bg-billiard-green-dark text-white font-bold px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl transition-all text-base sm:text-lg shadow-lg shadow-billiard-green/25 active:scale-95 animate-pulse-green">
              <WhatsAppIcon className="w-5 h-5 sm:w-6 sm:h-6" />
              <span dir="ltr">0717657640</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Footer ─────────────────────────────────────────────────────

function Footer() {
  return (
    <footer className="bg-billiard-dark border-t border-gray-800">
      <div className="max-w-[75%] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
          <div className="col-span-2">
            <div className="flex items-center gap-2 mb-3 sm:mb-4">
              <span className="text-2xl">🎱</span>
              <span className="text-base sm:text-lg font-bold text-white">Billiard <span className="text-billiard-green-light">Store</span></span>
            </div>
            <p className="text-gray-500 text-xs sm:text-sm leading-relaxed max-w-xs">متجرك الأول في المغرب لمستلزمات البيلياردو وبابي فوت. جودة عالية وأسعار تنافسية.</p>
          </div>
          <div>
            <h4 className="text-white font-bold text-sm sm:text-base mb-3 sm:mb-4">روابط سريعة</h4>
            <ul className="space-y-1.5 sm:space-y-2">
              {[
                { name: "الرئيسية", href: "#hero" },
                { name: "العروض 🔥", href: "#sales" },
                { name: "المنتجات", href: "#products" },
                { name: "من نحن", href: "#about" },
              ].map((link) => (
                <li key={link.name}>
                  <a href={link.href} className="text-gray-500 hover:text-billiard-green-light transition-colors text-xs sm:text-sm">{link.name}</a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold text-sm sm:text-base mb-3 sm:mb-4">تواصل معنا</h4>
            <ul className="space-y-2 sm:space-y-3">
              <li className="flex items-center gap-2 text-gray-500 text-xs sm:text-sm">
                <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                <a href="tel:+212717657640" className="hover:text-billiard-green-light transition-colors" dir="ltr">0717657640</a>
              </li>
              <li className="flex items-center gap-2 text-gray-500 text-xs sm:text-sm">
                <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                <span>المغرب</span>
              </li>
              <li className="flex items-center gap-2 text-gray-500 text-xs sm:text-sm">
                <WhatsAppIcon className="w-4 h-4 text-gray-600" />
                <a href="https://wa.me/212717657640" target="_blank" rel="noopener noreferrer" className="hover:text-billiard-green-light transition-colors">واتساب</a>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 sm:mt-10 pt-6 sm:pt-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-gray-600 text-[10px] sm:text-sm">© {new Date().getFullYear()} Billiard Store Morocco. جميع الحقوق محفوظة.</p>
          <div className="flex items-center gap-1 text-gray-600 text-[10px] sm:text-sm"><span>صنع بـ</span><span className="text-red-500">❤️</span><span>في المغرب 🇲🇦</span></div>
        </div>
      </div>
    </footer>
  );
}

// ─── Floating Cart Button (mobile bottom bar) ──────────────────

function FloatingCartBar() {
  const { totalItems, total, setIsCartOpen } = useCart();

  if (totalItems === 0) return null;

  return (
    <div className="fixed bottom-0 right-0 left-0 z-30 sm:hidden">
      <button
        onClick={() => setIsCartOpen(true)}
        className="w-full bg-billiard-green hover:bg-billiard-green-dark text-white flex items-center justify-between px-4 py-3 shadow-[0_-4px_20px_rgba(0,0,0,0.5)] transition-all active:scale-[0.98]"
      >
        <div className="flex items-center gap-2">
          <div className="relative">
            <CartIcon className="w-6 h-6" />
            <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center">
              {totalItems}
            </span>
          </div>
          <span className="font-bold text-sm">السلة ({totalItems})</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-black text-lg">{total} DH</span>
          <span className="text-white/60 text-xs">+50 توصيل</span>
        </div>
      </button>
    </div>
  );
}

// ─── WhatsApp Float ─────────────────────────────────────────────

function WhatsAppFloat() {
  return (
    <a
      href="https://wa.me/212717657640"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-16 sm:bottom-6 left-5 z-30 bg-billiard-green hover:bg-billiard-green-dark rounded-full flex items-center justify-center shadow-2xl shadow-green-900/40 transition-all duration-300 hover:scale-110 active:scale-95 animate-pulse-green group"
      style={{ width: 52, height: 52 }}
      aria-label="تواصل عبر واتساب"
    >
      <WhatsAppIcon className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
    </a>
  );
}

// ─── Main App ────────────────────────────────────────────────────

export default function App() {
  return (
    <CartProvider>
      <div className="min-h-screen bg-billiard-black text-white pb-16 sm:pb-0" style={{ fontFamily: "'Cairo', sans-serif" }}>
        <Navbar />
        <HeroSection />
        <DiscountsSection />
        <ProductsSection />
        <AboutSection />
        <ContactSection />
        <Footer />
        <WhatsAppFloat />
        <FloatingCartBar />
        <CartDrawer />
      </div>
    </CartProvider>
  );
}
