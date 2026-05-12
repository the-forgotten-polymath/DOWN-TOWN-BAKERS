"use client";

import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShoppingBag, Search, MapPin, Heart, Star, Sparkles, X, Check, 
  ChevronRight, Cake, Award, Truck, ShieldCheck, Flame, Plus, Minus, Menu
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { getCleanProducts, ProductItem } from '@/data/products';

// Helper to convert any displayed navigation text string into its exact verified subcategory slug mapping
const deriveSlug = (item: string, parentCat: string = '') => {
  if (item === 'Cheese Cakes' || item === 'Cheesecakes') return 'cheesecakes';
  if (item === 'Heart Shaped Cakes') return 'heart-shape-cakes';
  if (item === 'Bestsellers') return 'best-seller';
  if (item === 'All Cakes') return 'cakes';
  if (item === 'Fresh Drops') return 'trending-cakes';
  if (item === 'Love') return 'love-bento-cakes';
  if (item === 'Birthday' && parentCat === 'Bento') return 'birthday-bento-cakes';
  if (item === 'Anniversary' && parentCat === 'Bento') return 'anniversary-bento-cakes';
  if (item === 'Mom' && parentCat === 'Bento') return 'mothers-day-bento-cakes';
  if (item === 'Friend' && parentCat === 'Bento') return 'for-friend';
  if (item === 'All Bento') return 'bento-cakes';
  if (item === 'All Kids Cakes') return '1st-birthday-cakes';
  if (item === 'All Anniversary Cakes') return 'anniversary-cakes';
  if (item === 'All Desserts') return 'all-desserts';
  if (item === 'Gift Hampers') return 'bakery-baskets';
  if (item === 'Make Your Own Hamper') return 'make-your-own-hamper-hamp4315';
  if (item === 'Assorted Pastry Box') return 'pastries';
  if (item === 'Cupcake Delight Box') return 'cup-cakes';
  if (item === 'Make Your Dessert Box') return 'mixed-magic-dessert-box-hamp4694assorted';
  if (item === 'Cakes For Husband') return 'for-husband';
  if (item === 'Cakes For Boyfriend') return 'for-boyfriend';
  if (item === 'Cakes For Father') return 'for-father';
  if (item === 'Cakes For Brother') return 'for-brother';
  if (item === 'Cakes For Wife') return 'for-wife';
  if (item === 'Cakes For Mother') return 'for-mother';
  if (item === 'Cakes For Girlfriend') return 'for-girlfriend';
  if (item === 'Cakes For Sister') return 'for-sister';
  if (item === 'Father\'s Day Cake') return 'fathers-day-cakes';
  if (item === 'Rakhi Cakes') return 'rakhi-with-cakes';
  if (item === 'Half Birthday Cakes') return 'half-cakes';
  
  return item.toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+$/g, '');
};


interface CartItem {
  cartId: string;
  product: ProductItem;
  weightLabel: string;
  weightMultiplier: number;
  isEggless: boolean;
  customMessage: string;
  selectedAddons: { name: string; price: number }[];
  quantity: number;
  itemTotal: number;
}

function AutoScrollImageGallery({ angles, alt, fallback }: { angles: string[]; alt: string; fallback: string }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!angles || angles.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % angles.length);
    }, 2500);
    return () => clearInterval(interval);
  }, [angles]);

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src = fallback;
  };

  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.img
          key={currentIndex}
          src={angles[currentIndex] || angles[0]}
          alt={`${alt} view ${currentIndex + 1}`}
          onError={handleImageError}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out absolute inset-0 m-auto"
        />
      </AnimatePresence>
      {angles.length > 1 && (
        <div className="absolute bottom-1 right-2 flex items-center gap-1 z-10 bg-stone-900/40 backdrop-blur-xs px-1.5 py-0.5 rounded-full pointer-events-none">
          {angles.map((_, idx) => (
            <span
              key={idx}
              className={`w-1 h-1 rounded-full transition-all ${idx === currentIndex ? 'bg-amber-400 w-2.5' : 'bg-white/60'}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function BakeryApp() {
  const router = useRouter();
  // Master state
  const allProducts = useMemo(() => getCleanProducts(), []);
  
  // Filter states
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedFlavour, setSelectedFlavour] = useState<string>('all');
  const [isEgglessOnly, setIsEgglessOnly] = useState<boolean>(false);
  const [isBestsellerOnly, setIsBestsellerOnly] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('popularity');
  const [activeMegaMenu, setActiveMegaMenu] = useState<string | null>(null);

  // Auto-scrolling Hero Showcase state
  const [activeHeroSlide, setActiveHeroSlide] = useState<number>(0);
  const heroSlides = useMemo(() => [
    {
      titleLine1: "Downtown's",
      titleLine2: "Ultimate",
      titleHighlight: "Chocolate",
      titleLine3: "Dream!",
      subtitle: "Indulge in pure cocoa bliss!",
      eyebrow: "PURE COCOA BLISS",
      mainImage: "/hero_cake_1778560729107.png",
      secondaryImage: "/bakery_assorted_1778560745190.png",
      badgeText: "500+ Designs",
      pillBadge: "🔥 Bestseller"
    },
    {
      titleLine1: "Signature",
      titleLine2: "Wild Berry",
      titleHighlight: "Ganache",
      titleLine3: "Showpiece!",
      subtitle: "Handpicked summer forest strawberries",
      eyebrow: "SEASONAL LUXURY",
      mainImage: "/choco_truffle_cake_1778560769498.png",
      secondaryImage: "/hero_cake_1778560729107.png",
      badgeText: "⭐ 4.9 Rated",
      pillBadge: "✨ Fresh Drop"
    },
    {
      titleLine1: "Pristine",
      titleLine2: "Slow-Roasted",
      titleHighlight: "Caramel",
      titleLine3: "Crunch!",
      subtitle: "Buttery slow-baked golden pralines",
      eyebrow: "SLOW ROASTED CRUNCH",
      mainImage: "/butterscotch_cake_1778560821702.png",
      secondaryImage: "/bakery_assorted_1778560745190.png",
      badgeText: "100% Pure",
      pillBadge: "👑 Bestseller"
    }
  ], []);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveHeroSlide((prev) => (prev + 1) % heroSlides.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [heroSlides.length]);

  // Header states
  const [selectedCity, setSelectedCity] = useState<string>('New Delhi');
  const [isCityDropdownOpen, setIsCityDropdownOpen] = useState<boolean>(false);

  // Customizer / PDP state
  const [activePdpProduct, setActivePdpProduct] = useState<ProductItem | null>(null);
  const [pdpMainAngleIndex, setPdpMainAngleIndex] = useState<number>(0);
  const [pdpSelectedWeight, setPdpSelectedWeight] = useState<{ label: string; mult: number }>({ label: '0.5 Kg', mult: 1 });
  const [pdpIsEggless, setPdpIsEggless] = useState<boolean>(true);
  const [pdpCustomMessage, setPdpCustomMessage] = useState<string>('');
  const [pdpPincode, setPdpPincode] = useState<string>('');
  const [pdpPincodeStatus, setPdpPincodeStatus] = useState<string | null>(null);
  const [pdpAddons, setPdpAddons] = useState<{ name: string; price: number; checked: boolean }[]>([
    { name: 'Magic Sparkler Candle', price: 49, checked: false },
    { name: 'Gold Script Birthday Topper', price: 99, checked: false },
    { name: 'Premium Confectioner Knife', price: 29, checked: false }
  ]);

  // Wishlist state
  const [wishlistIds, setWishlistIds] = useState<string[]>([]);

  // Cart state
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [couponCode, setCouponCode] = useState<string>('');
  const [appliedDiscountPercent, setAppliedDiscountPercent] = useState<number>(0);
  const [couponError, setCouponError] = useState<string | null>(null);
  const [couponSuccess, setCouponSuccess] = useState<string | null>(null);

  // Multi-step Checkout simulator state inside Cart Drawer
  const [checkoutStep, setCheckoutStep] = useState<'cart' | 'auth' | 'slot' | 'payment' | 'confirmed'>('cart');
  const [mobileNumber, setMobileNumber] = useState<string>('');
  const [otpCode, setOtpCode] = useState<string>('');
  const [isOtpSent, setIsOtpSent] = useState<boolean>(false);
  const [selectedSlot, setSelectedSlot] = useState<string>('Standard Delivery (Today, 6 PM - 9 PM)');
  const [paymentMode, setPaymentMode] = useState<string>('card');
  const [orderReference, setOrderReference] = useState<string>('');

  // Toast utility notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Footer banner promotional VIP subscription state
  const [bannerEmail, setBannerEmail] = useState<string>('');
  const [bannerSubscribed, setBannerSubscribed] = useState<boolean>(false);

  // Pagination state: default showing 30 cakes
  const [visibleCount, setVisibleCount] = useState<number>(30);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState<boolean>(false);
  useEffect(() => {
    setVisibleCount(30);
  }, [selectedCategory, selectedFlavour, searchQuery, isEgglessOnly]);

  // Safe external image handler logic
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>, fallbackSrc: string = '/choco_truffle_cake_1778560769498.png') => {
    e.currentTarget.onerror = null;
    e.currentTarget.src = fallbackSrc;
  };

  // Filtered array resolver
  const filteredProducts = useMemo(() => {
    return allProducts.filter(prod => {
      // Category filter
      if (selectedCategory !== 'all' && prod.category !== selectedCategory) return false;
      // Flavour filter
      if (selectedFlavour !== 'all' && prod.flavour !== selectedFlavour) return false;
      // Eggless toggle
      if (isEgglessOnly && !prod.isEggless) return false;
      // Bestseller toggle
      if (isBestsellerOnly && !prod.isBestseller) return false;
      // Search logic
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase();
        const matchName = prod.name.toLowerCase().includes(q);
        const matchCat = prod.category.toLowerCase().includes(q);
        const matchFlav = prod.flavour.toLowerCase().includes(q);
        const matchDesc = prod.description.toLowerCase().includes(q);
        
        // Guarantee rich catalog content population for event/relationship/type Mega Menu tabs and custom strings
        const isBentoQuery = q.includes('bento');
        const isBirthdayQuery = q.includes('birthday');
        const isAnnivQuery = q.includes('anniversary');
        const isOccasionQuery = q.includes('occasion') || q.includes('day');
        const isRelationshipQuery = q.includes('relationship') || q.includes('husband') || q.includes('wife') || q.includes('him') || q.includes('her') || q.includes('father') || q.includes('mother');
        const isCustomQuery = q.includes('custom');

        // Deterministic heuristics based on string characteristics ensure relevant showstopper items always render
        const charCodeSum = prod.name.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
        
        let matchesMeta = false;
        if (isBentoQuery && (charCodeSum % 3 === 0 || prod.name.toLowerCase().includes('cherry') || prod.name.toLowerCase().includes('forest') || prod.name.toLowerCase().includes('mini'))) matchesMeta = true;
        if (isBirthdayQuery && (charCodeSum % 2 === 0 || prod.name.toLowerCase().includes('truffle') || prod.name.toLowerCase().includes('drip'))) matchesMeta = true;
        if (isAnnivQuery && (charCodeSum % 3 === 1 || prod.name.toLowerCase().includes('heart') || prod.name.toLowerCase().includes('rose') || prod.name.toLowerCase().includes('red'))) matchesMeta = true;
        if (isOccasionQuery && (charCodeSum % 4 === 0 || prod.name.toLowerCase().includes('delight') || prod.name.toLowerCase().includes('crunch'))) matchesMeta = true;
        if (isRelationshipQuery && (charCodeSum % 3 === 2 || prod.name.toLowerCase().includes('chocolate') || prod.name.toLowerCase().includes('sensa'))) matchesMeta = true;
        if (isCustomQuery && (charCodeSum % 5 === 0 || prod.name.toLowerCase().includes('dream') || prod.name.toLowerCase().includes('kunafa') || prod.name.toLowerCase().includes('loaded'))) matchesMeta = true;

        if (!matchName && !matchCat && !matchFlav && !matchDesc && !matchesMeta) return false;
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      if (sortBy === 'rating') return parseFloat(b.rating) - parseFloat(a.rating);
      return b.reviews - a.reviews; // default popularity
    });
  }, [allProducts, selectedCategory, selectedFlavour, isEgglessOnly, isBestsellerOnly, searchQuery, sortBy]);

  // Wishlist logic
  const toggleWishlist = (id: string, name: string) => {
    if (wishlistIds.includes(id)) {
      setWishlistIds(wishlistIds.filter(item => item !== id));
      triggerToast(`Removed ${name} from Wishlist`);
    } else {
      setWishlistIds([...wishlistIds, id]);
      triggerToast(`Saved ${name} to handpicked Wishlist`);
    }
  };

  // Trigger immersive customizer
  const openCustomizer = (product: ProductItem) => {
    setActivePdpProduct(product);
    setPdpMainAngleIndex(0);
    setPdpSelectedWeight({ label: '0.5 Kg', mult: 1 });
    setPdpIsEggless(product.isEggless);
    setPdpCustomMessage('');
    setPdpPincode('');
    setPdpPincodeStatus(null);
    setPdpAddons([
      { name: 'Magic Sparkler Candle', price: 49, checked: false },
      { name: 'Gold Script Birthday Topper', price: 99, checked: false },
      { name: 'Premium Confectioner Knife', price: 29, checked: false }
    ]);
  };

  // Dynamic calculated PDP live price sum
  const currentPdpCalculatedTotal = useMemo(() => {
    if (!activePdpProduct) return 0;
    let baseSum = activePdpProduct.price * pdpSelectedWeight.mult;
    // Dietary switch premium cost calculation
    if (pdpIsEggless && !activePdpProduct.isEggless) {
      baseSum += 50; // extra pure veg configuration tier
    }
    // Add selected addon checks
    pdpAddons.forEach(ad => {
      if (ad.checked) baseSum += ad.price;
    });
    return baseSum;
  }, [activePdpProduct, pdpSelectedWeight, pdpIsEggless, pdpAddons]);

  // Cart Management Engine
  const handleAddCustomizedToCart = () => {
    if (!activePdpProduct) return;
    
    const selectedAddonsList = pdpAddons.filter(a => a.checked).map(a => ({ name: a.name, price: a.price }));
    const uniqueCartId = `${activePdpProduct.id}_${pdpSelectedWeight.label}_${pdpIsEggless ? 'veg' : 'egg'}_${Date.now()}`;
    
    const newItem: CartItem = {
      cartId: uniqueCartId,
      product: activePdpProduct,
      weightLabel: pdpSelectedWeight.label,
      weightMultiplier: pdpSelectedWeight.mult,
      isEggless: pdpIsEggless,
      customMessage: pdpCustomMessage.trim(),
      selectedAddons: selectedAddonsList,
      quantity: 1,
      itemTotal: currentPdpCalculatedTotal
    };

    setCart(prev => [...prev, newItem]);
    setActivePdpProduct(null); // Close active overlay
    setIsCartOpen(true); // Pop open the cart drawer beautifully
    triggerToast(`Added customized ${activePdpProduct.name} to Box!`);
  };

  // Instant direct line insertion
  const handleInstantAdd = (prod: ProductItem) => {
    const uniqueCartId = `${prod.id}_base_${Date.now()}`;
    const newItem: CartItem = {
      cartId: uniqueCartId,
      product: prod,
      weightLabel: '0.5 Kg',
      weightMultiplier: 1,
      isEggless: prod.isEggless,
      customMessage: '',
      selectedAddons: [],
      quantity: 1,
      itemTotal: prod.price
    };
    setCart(prev => [...prev, newItem]);
    triggerToast(`Added ${prod.name} to Box`);
  };

  const updateCartQty = (cartId: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.cartId === cartId) {
        const newQ = item.quantity + delta;
        return newQ > 0 ? { ...item, quantity: newQ } : null;
      }
      return item;
    }).filter(Boolean) as CartItem[]);
  };

  // Cart summaries calculations
  const cartTotals = useMemo(() => {
    const subtotal = cart.reduce((sum, item) => sum + (item.itemTotal * item.quantity), 0);
    const discountAmount = Math.round(subtotal * (appliedDiscountPercent / 100));
    const shipping = subtotal > 0 ? (subtotal > 999 ? 0 : 79) : 0;
    const finalPayable = subtotal - discountAmount + shipping;
    const itemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    return { subtotal, discountAmount, shipping, finalPayable, itemsCount };
  }, [cart, appliedDiscountPercent]);

  // Apply code logic
  const handleApplyCoupon = () => {
    setCouponError(null);
    setCouponSuccess(null);
    const code = couponCode.trim().toUpperCase();
    if (code === 'CHOCO20') {
      setAppliedDiscountPercent(20);
      setCouponSuccess('Premium Voucher Applied: Flat 20% Off!');
    } else if (code === 'FRESH10') {
      setAppliedDiscountPercent(10);
      setCouponSuccess('Artisanal Perk: Flat 10% Off!');
    } else {
      setCouponError('Invalid voucher code. Try using CHOCO20');
    }
  };

  // Pincode validation helper
  const verifyPincode = () => {
    if (pdpPincode.trim().length === 6) {
      setPdpPincodeStatus('✨ Pincode serviceable! Guaranteed fresh delivery available within 120 mins.');
    } else {
      setPdpPincodeStatus('⚠️ Please enter a standard valid 6-digit postal code.');
    }
  };

  // Checkout submission handling
  const completeOrderSubmission = () => {
    const refNum = `DTB-ORDER-${Math.floor(100000 + Math.random() * 900000)}`;
    setOrderReference(refNum);
    setCheckoutStep('confirmed');
    setCart([]); // Clear persistent storage on completion
    setAppliedDiscountPercent(0);
    setCouponCode('');
  };

  return (
    <div className="min-h-screen flex flex-col font-outfit text-stone-800 antialiased overflow-x-hidden selection:bg-rose-500 selection:text-white">
      
      {/* Toast Notification Layer */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div 
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            className="fixed top-5 left-1/2 -translate-x-1/2 z-50 bg-stone-900 text-white px-5 py-3 rounded-full shadow-2xl flex items-center gap-3 border border-stone-700/60 text-sm font-medium"
          >
            <Sparkles className="w-4 h-4 text-rose-400 shrink-0 animate-spin" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* REPLICA INSPIRATION NAVIGATION HEADER */}
      <header className="sticky top-0 z-30 transition-all shadow-sm">
        
        {/* TOP PRIMARY BRIGHT RED BANNER */}
        <div className="bg-[#dc2626] text-white py-3 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
            
            {/* LEFT LOGO: Bold White Cursive Look mimicking Bakingo style */}
            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
              <button
                onClick={() => setIsMobileNavOpen(true)}
                className="block md:hidden p-1.5 rounded-lg hover:bg-white/10 active:scale-95 transition-all text-white cursor-pointer"
                aria-label="Open Mobile Navigation Menu"
              >
                <Menu className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.5]" />
              </button>
              <a 
                href="#menu" 
                onClick={(e) => {
                  e.preventDefault();
                  setSelectedCategory('all');
                  setSelectedFlavour('all');
                  setSearchQuery('');
                }}
                className="group relative block"
              >
                <span className="font-playfair italic font-extrabold text-2xl sm:text-3xl tracking-tight text-white drop-shadow-xs transition-transform group-hover:scale-105 inline-block">
                  Downtown Bakers
                </span>
                <span className="absolute -top-1 -right-3 text-[10px] bg-white text-[#dc2626] font-extrabold px-1 rounded-full scale-75 uppercase tracking-tighter">
                  °Joy
                </span>
              </a>
            </div>

            {/* CENTER WIDE SEARCH BAR */}
            <div className="flex-1 max-w-2xl mx-auto hidden md:block">
              <div className="relative flex items-center">
                <div className="absolute left-3 text-stone-600 font-bold">
                  <Search className="w-4 h-4 stroke-[2.5]" />
                </div>
                <input 
                  type="text"
                  placeholder="Search For Cakes, Occasion, Flavour And More..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white rounded-md pl-10 pr-8 py-2 text-xs text-stone-900 font-medium placeholder:text-stone-500 focus:outline-none focus:ring-2 focus:ring-white/40 shadow-inner"
                />
                {searchQuery && (
                  <button 
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2.5 text-stone-400 hover:text-stone-700"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* FAR RIGHT EXCLUSIVELY CART TRIGGER */}
            <div className="flex items-center shrink-0">
              <button 
                onClick={() => setIsCartOpen(true)}
                className="group flex flex-col items-center justify-center relative p-1 transition-transform active:scale-95"
                aria-label="Shopping Cart"
              >
                <div className="relative">
                  <ShoppingBag className="w-6 h-6 text-white stroke-[2.2] group-hover:text-rose-100 transition-colors" />
                  {cartTotals.itemsCount > 0 && (
                    <span className="absolute -top-1.5 -right-2 bg-white text-[#dc2626] text-[10px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center shadow-md">
                      {cartTotals.itemsCount}
                    </span>
                  )}
                </div>
                <span className="text-[10px] font-medium text-white tracking-wide mt-0.5">
                  Cart
                </span>
              </button>
            </div>

          </div>

          {/* MOBILE RESPONSIVE SEARCH BOX */}
          <div className="mt-2.5 block md:hidden w-full">
            <div className="relative flex items-center">
              <div className="absolute left-3 text-stone-600 font-bold">
                <Search className="w-3.5 h-3.5 stroke-[2.5]" />
              </div>
              <input 
                type="text"
                placeholder="Search For Cakes, Occasion, Flavour And More..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white rounded-md pl-9 pr-8 py-2 text-xs text-stone-900 font-medium placeholder:text-stone-500 focus:outline-none shadow-inner"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="absolute right-2.5 text-stone-400">
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* SECONDARY WHITE SUB-HEADER CATEGORY STRIP WITH MEGA MENU PANELS */}
        <div 
          className="bg-white border-b border-stone-200 shadow-xs relative"
          onMouseLeave={() => setActiveMegaMenu(null)}
        >
          <div className="w-full max-w-max mx-auto px-4 flex items-center justify-start md:justify-center gap-5 sm:gap-8 overflow-x-auto scrollbar-none py-2.5">
            {[
              { label: 'Cakes', act: () => { setSelectedCategory('cakes'); setSearchQuery(''); setActiveMegaMenu('Cakes'); } },
              { label: 'Bento', act: () => { setSearchQuery('bento'); setSelectedCategory('all'); setActiveMegaMenu('Bento'); } },
              { label: 'Theme Cakes', act: () => { setSelectedCategory('designer_cakes'); setSearchQuery(''); setActiveMegaMenu('Theme Cakes'); } },
              { label: 'By Relationship', act: () => { setSearchQuery('relationship'); setActiveMegaMenu('By Relationship'); triggerToast('Filtering designs perfect for special relationships'); } },
              { label: 'Desserts & Hampers', act: () => { setSelectedCategory('desserts'); setSearchQuery(''); setActiveMegaMenu('Desserts & Hampers'); } },
              { label: 'Birthday', act: () => { setSearchQuery('birthday'); setActiveMegaMenu('Birthday'); triggerToast('Loaded sparkling Birthday showstoppers'); } },
              { label: 'Anniversary', act: () => { setSearchQuery('anniversary'); setActiveMegaMenu('Anniversary'); triggerToast('Loaded romantic Anniversary milestones'); } },
              { label: 'Occasions', act: () => { setSearchQuery('occasion'); setActiveMegaMenu('Occasions'); triggerToast('Browsing signature festive occasions'); } },
            ].map((tab) => {
              const isActive = activeMegaMenu === tab.label;
              return (
                <button 
                  key={tab.label}
                  onClick={tab.act}
                  onMouseEnter={() => {
                    if (['Cakes', 'Bento', 'Theme Cakes', 'By Relationship', 'Desserts & Hampers', 'Birthday', 'Anniversary', 'Occasions'].includes(tab.label)) {
                      setActiveMegaMenu(tab.label);
                    } else {
                      setActiveMegaMenu(null);
                    }
                  }}
                  className={`text-xs sm:text-sm font-bold transition-colors whitespace-nowrap tracking-wide py-1.5 px-1 relative group ${isActive ? 'text-[#dc2626]' : 'text-stone-800 hover:text-[#dc2626]'}`}
                >
                  <span>{tab.label}</span>
                  {/* Persistent Active Red Underline matching screenshots */}
                  <span className={`absolute bottom-0 left-0 h-[3px] bg-[#dc2626] transition-all ${isActive ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
                </button>
              );
            })}
          </div>

          {/* ABSOLUTE OVERLAY MEGA-MENU DROPDOWN PANELS */}
          <AnimatePresence>
            {activeMegaMenu && (
              <motion.div 
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 2 }}
                transition={{ duration: 0.2 }}
                className="absolute top-full left-0 w-full bg-white border-b border-stone-200 shadow-2xl z-50 max-h-[70vh] overflow-y-auto"
              >
                <div className="max-w-7xl mx-auto flex flex-wrap md:flex-nowrap items-stretch justify-center">
                  
                  {/* PANEL 1: CAKES */}
                  {activeMegaMenu === 'Cakes' && (
                    <>
                      {/* Column 1: Trending Cakes */}
                      <div className="flex-1 min-w-[220px] p-5 bg-white border-r border-stone-100 last:border-0">
                        <p className="text-xs font-extrabold text-stone-900 tracking-wider mb-3 flex items-center gap-1.5 px-1">
                          <span className="text-amber-400 text-sm">✴</span> Trending Cakes
                        </p>
                        <div className="space-y-0.5">
                          {[
                            'Mango Cakes', 'Fire Cakes', 'Ribbon Cakes', 'Fresh Drops', 
                            'Cricket Cakes', 'Gourmet Cakes', 'Bento Cakes', 'Camera Cakes', 
                            'Anime Cakes', 'Labubu Cakes', 'Pinata Cakes', 'Drip Cakes'
                          ].map(item => (
                            <button 
                              key={item}
                              onClick={() => { 
                                setActiveMegaMenu(null); 
                                router.push('/category/' + deriveSlug(item)); 
                              }}
                              className="w-full text-left py-1.5 px-2 rounded-md hover:bg-red-50 text-stone-700 hover:text-[#dc2626] font-semibold text-xs transition-colors block truncate"
                            >
                              {item}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Column 2: By Type (Soft Orange Background) */}
                      <div className="flex-1 min-w-[220px] p-5 bg-[#fff7ed] border-r border-stone-100 last:border-0">
                        <p className="text-xs font-extrabold text-stone-900 tracking-wider mb-3 flex items-center gap-1.5 px-1">
                          <span className="text-amber-400 text-sm">✴</span> By Type
                        </p>
                        <div className="space-y-0.5">
                          {[
                            'Bestsellers', 'Eggless Cakes', 'Photo Cakes', 'Cheese Cakes', 
                            'Half Cakes', 'Heart Shaped Cakes', 'Rose Cakes', 'All Cakes'
                          ].map(item => (
                            <button 
                              key={item}
                              onClick={() => { 
                                setActiveMegaMenu(null); 
                                router.push('/category/' + deriveSlug(item)); 
                              }}
                              className="w-full text-left py-1.5 px-2 rounded-md hover:bg-white/80 text-stone-800 hover:text-[#dc2626] font-bold text-xs transition-colors block truncate"
                            >
                              {item}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Column 3: By Flavours */}
                      <div className="flex-1 min-w-[220px] p-5 bg-white">
                        <p className="text-xs font-extrabold text-stone-900 tracking-wider mb-3 flex items-center gap-1.5 px-1">
                          <span className="text-amber-400 text-sm">✴</span> By Flavours
                        </p>
                        <div className="space-y-0.5">
                          {[
                            'Chocolate Cakes', 'Pineapple Cakes', 'Mango Cakes', 'Fruit Cakes', 
                            'Butterscotch Cakes', 'Blueberry Cakes', 'Black Forest Cakes', 
                            'Vanilla Cakes', 'Red Velvet Cakes', 'Kit Kat Cakes', 'Oreo Cakes'
                          ].map(item => (
                            <button 
                              key={item}
                              onClick={() => { 
                                setActiveMegaMenu(null); 
                                router.push('/category/' + deriveSlug(item)); 
                              }}
                              className="w-full text-left py-1.5 px-2 rounded-md hover:bg-red-50 text-stone-700 hover:text-[#dc2626] font-semibold text-xs transition-colors block truncate"
                            >
                              {item}
                            </button>
                          ))}
                        </div>
                      </div>
                    </>
                  )}

                  {/* PANEL 2: BENTO */}
                  {activeMegaMenu === 'Bento' && (
                    <div className="w-full max-w-md p-6 bg-white text-left mx-auto">
                      <p className="text-xs font-extrabold text-stone-900 tracking-wider mb-3 flex items-center gap-1.5 px-1">
                        <span className="text-amber-400 text-sm">✴</span> Curated Bento Collections
                      </p>
                      <div className="grid grid-cols-2 gap-2">
                        {['Love', 'Birthday', 'Anniversary', 'Mom', 'Friend', 'All Bento'].map(item => (
                          <button 
                            key={item}
                            onClick={() => { 
                              setActiveMegaMenu(null); 
                              router.push('/category/' + deriveSlug(item, 'Bento')); 
                            }}
                            className="w-full text-left py-1.5 px-2 rounded-md hover:bg-red-50 text-stone-700 hover:text-[#dc2626] font-semibold text-xs transition-colors block truncate"
                          >
                            {item}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* PANEL 3: THEME Cakes */}
                  {activeMegaMenu === 'Theme Cakes' && (
                    <>
                      {/* Kids Cakes */}
                      <div className="flex-1 min-w-[200px] p-5 bg-white border-r border-stone-100">
                        <p className="text-xs font-extrabold text-stone-900 tracking-wider mb-3 flex items-center gap-1.5 px-1">
                          <span className="text-amber-400 text-sm">✴</span> Kids Cakes
                        </p>
                        <div className="space-y-0.5">
                          {[
                            '1st Birthday Cakes', 'Princess Cakes', 'Animal Cakes', 
                            'Masha & The Bear Cakes', 'Cakes For Boys', 'Cakes For Girls', 
                            'Number Cakes', 'Alphabet Cakes', 'Car And Vehicle Cakes', 
                            'Baby Shark Cakes', 'Thomas And Friends Cakes', 'Winnie The Pooh Cakes', 'All Kids Cakes'
                          ].map(item => (
                            <button 
                              key={item}
                              onClick={() => { 
                                setActiveMegaMenu(null); 
                                router.push('/category/' + deriveSlug(item)); 
                              }} 
                              className="w-full text-left py-1 px-2 rounded-md hover:bg-red-50 text-stone-700 hover:text-[#dc2626] font-semibold text-xs transition-colors block truncate"
                            >
                              {item}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Character Cakes */}
                      <div className="flex-1 min-w-[280px] p-5 bg-[#fff7ed] border-r border-stone-100">
                        <p className="text-xs font-extrabold text-stone-900 tracking-wider mb-3 flex items-center gap-1.5 px-1">
                          <span className="text-amber-400 text-sm">✴</span> Character Cakes
                        </p>
                        <div className="grid grid-cols-2 gap-x-3 gap-y-0.5">
                          {[
                            'Spiderman Cakes', 'Unicorn Cakes', 'Barbie Cakes', 'Harry Potter Cakes', 
                            'Avenger Cakes', 'Peppa Pig Cakes', 'Doraemon Cakes', 'Naruto Cakes', 
                            'Cocomelon Cakes', 'Cartoon Cakes', 'Super Hero Cakes', 'Bluey Cakes', 
                            'Bike Cakes', 'Iron-Man Cakes', 'Moana Cakes', 'Train Cakes', 
                            'Transformers Cakes', 'Dragon Ball Cakes', 'Panda Cakes', 'Fish Cakes', 
                            'Ben 10 Cakes', 'Demon Slayer Cakes', 'Bubu Dudu Cakes'
                          ].map(item => (
                            <button 
                              key={item} 
                              onClick={() => { 
                                setActiveMegaMenu(null); 
                                router.push('/category/' + deriveSlug(item)); 
                              }} 
                              className="w-full text-left py-1 px-2 rounded-md hover:bg-white/80 text-stone-800 hover:text-[#dc2626] font-bold text-[11px] transition-colors block truncate"
                            >
                              {item}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Grown Up Cakes */}
                      <div className="flex-1 min-w-[180px] p-5 bg-white border-r border-stone-100">
                        <p className="text-xs font-extrabold text-stone-900 tracking-wider mb-3 flex items-center gap-1.5 px-1">
                          <span className="text-amber-400 text-sm">✴</span> Grown Up Cakes
                        </p>
                        <div className="space-y-0.5">
                          {[
                            'Makeup Cakes', 'Bride To Be Cakes', 'Wedding Cakes', 'Gym Cakes', 
                            'Party Cakes', 'BTS Cakes', 'Police Cakes', 'Army Cakes', 'Beer Cakes', 
                            'Bachelor Cakes', 'Ca Cakes', 'Guitar Cakes', 'Aeorplane Cakes'
                          ].map(item => (
                            <button 
                              key={item}
                              onClick={() => { 
                                setActiveMegaMenu(null); 
                                router.push('/category/' + deriveSlug(item)); 
                              }} 
                              className="w-full text-left py-1 px-2 rounded-md hover:bg-red-50 text-stone-700 hover:text-[#dc2626] font-semibold text-xs transition-colors block truncate"
                            >
                              {item}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* More Cakes */}
                      <div className="flex-1 min-w-[180px] p-5 bg-[#fff7ed]">
                        <p className="text-xs font-extrabold text-stone-900 tracking-wider mb-3 flex items-center gap-1.5 px-1">
                          <span className="text-amber-400 text-sm">✴</span> More Cakes
                        </p>
                        <div className="space-y-0.5">
                          {[
                            'Jungle Theme Cakes', 'Cricket Cakes', 'Football Cakes', 
                            'Basketball Cakes', 'Rainbow Cakes', 'Butterfly Cakes', 
                            'Shinchan Cakes', 'Dinosaur Cakes', 'Pikachu Cakes', 
                            'Hulk Cakes', 'Jungle Book Cakes', 'All Designer Cakes'
                          ].map(item => (
                            <button 
                              key={item}
                              onClick={() => { 
                                setActiveMegaMenu(null); 
                                router.push('/category/' + deriveSlug(item === 'All Designer Cakes' ? 'designer' : item)); 
                              }} 
                              className="w-full text-left py-1 px-2 rounded-md hover:bg-white/80 text-stone-800 hover:text-[#dc2626] font-bold text-xs transition-colors block truncate"
                            >
                              {item}
                            </button>
                          ))}
                        </div>
                      </div>
                    </>
                  )}

                  {/* PANEL 4: BY RELATIONSHIP */}
                  {activeMegaMenu === 'By Relationship' && (
                    <>
                      <div className="flex-1 min-w-[220px] p-5 bg-white border-r border-stone-100">
                        <p className="text-xs font-extrabold text-stone-900 tracking-wider mb-3 flex items-center gap-1.5 px-1">
                          <span className="text-amber-400 text-sm">✴</span> For Him
                        </p>
                        <div className="space-y-0.5">
                          {['Cakes For Husband', 'Cakes For Boyfriend', 'Cakes For Father', 'Cakes For Brother'].map(item => (
                            <button 
                              key={item}
                              onClick={() => { 
                                setActiveMegaMenu(null); 
                                router.push('/category/' + deriveSlug(item)); 
                              }} 
                              className="w-full text-left py-1.5 px-2 rounded-md hover:bg-red-50 text-stone-700 hover:text-[#dc2626] font-semibold text-xs transition-colors block truncate"
                            >
                              {item}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="flex-1 min-w-[220px] p-5 bg-[#fff7ed]">
                        <p className="text-xs font-extrabold text-stone-900 tracking-wider mb-3 flex items-center gap-1.5 px-1">
                          <span className="text-amber-400 text-sm">✴</span> For Her
                        </p>
                        <div className="space-y-0.5">
                          {['Cakes For Wife', 'Cakes For Mother', 'Cakes For Girlfriend', 'Cakes For Sister'].map(item => (
                            <button 
                              key={item}
                              onClick={() => { 
                                setActiveMegaMenu(null); 
                                router.push('/category/' + deriveSlug(item)); 
                              }} 
                              className="w-full text-left py-1.5 px-2 rounded-md hover:bg-white/80 text-stone-800 hover:text-[#dc2626] font-bold text-xs transition-colors block truncate"
                            >
                              {item}
                            </button>
                          ))}
                        </div>
                      </div>
                    </>
                  )}

                  {/* PANEL 5: DESSERTS & HAMPERS */}
                  {activeMegaMenu === 'Desserts & Hampers' && (
                    <>
                      <div className="flex-1 min-w-[220px] p-5 bg-white border-r border-stone-100">
                        <p className="text-xs font-extrabold text-stone-900 tracking-wider mb-3 flex items-center gap-1.5 px-1">
                          <span className="text-amber-400 text-sm">✴</span> Desserts
                        </p>
                        <div className="space-y-0.5">
                          {['All Desserts', 'Jar Cakes', 'Pastries', 'Cheese Cakes', 'Cup Cakes', 'Brownies', 'Cookies', 'Tea Cakes'].map(item => (
                            <button 
                              key={item}
                              onClick={() => { 
                                setActiveMegaMenu(null); 
                                router.push('/category/' + deriveSlug(item)); 
                              }} 
                              className="w-full text-left py-1 px-2 rounded-md hover:bg-red-50 text-stone-700 hover:text-[#dc2626] font-semibold text-xs transition-colors block truncate"
                            >
                              {item}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="flex-1 min-w-[220px] p-5 bg-[#fff7ed]">
                        <p className="text-xs font-extrabold text-stone-900 tracking-wider mb-3 flex items-center gap-1.5 px-1">
                          <span className="text-amber-400 text-sm">✴</span> Hampers
                        </p>
                        <div className="space-y-0.5">
                          {['Gift Hampers', 'Make Your Own Hamper', 'Assorted Pastry Box', 'Cupcake Delight Box', 'Make Your Dessert Box'].map(item => (
                            <button 
                              key={item}
                              onClick={() => { 
                                setActiveMegaMenu(null); 
                                router.push('/category/' + deriveSlug(item)); 
                              }} 
                              className="w-full text-left py-1 px-2 rounded-md hover:bg-white/80 text-stone-800 hover:text-[#dc2626] font-bold text-xs transition-colors block truncate"
                            >
                              {item}
                            </button>
                          ))}
                        </div>
                      </div>
                    </>
                  )}

                  {/* PANEL 6: BIRTHDAY CAKES */}
                  {activeMegaMenu === 'Birthday' && (
                    <div className="flex-1 min-w-[240px] p-5 bg-[#fff8f5] border-r border-stone-100">
                      <p className="text-xs font-extrabold text-stone-900 tracking-wider mb-3 flex items-center gap-1.5 px-1">
                        <span className="text-amber-400 text-sm">✴</span> Birthday Milestones
                      </p>
                      <div className="grid grid-cols-2 gap-x-3 gap-y-1">
                        {[
                          'Birthday Cakes', 'Birthday Photo Cakes', 'Half Birthday Cakes',
                          '1st Birthday Cakes', '2nd Birthday Cakes', '18th Birthday Cakes',
                          '40th Birthday Cakes', '50th Birthday Cakes'
                        ].map(item => (
                          <button 
                            key={item}
                            onClick={() => { 
                              setActiveMegaMenu(null); 
                              router.push('/category/' + deriveSlug(item)); 
                            }} 
                            className="w-full text-left py-1 px-2 rounded-md hover:bg-white/80 text-stone-800 hover:text-[#dc2626] font-bold text-xs transition-colors block truncate"
                          >
                            {item}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* PANEL 7: ANNIVERSARY CAKES */}
                  {activeMegaMenu === 'Anniversary' && (
                    <div className="flex-1 min-w-[240px] p-5 bg-[#fff8f5] border-r border-stone-100">
                      <p className="text-xs font-extrabold text-stone-900 tracking-wider mb-3 flex items-center gap-1.5 px-1">
                        <span className="text-amber-400 text-sm">✴</span> Eternal Anniversaries
                      </p>
                      <div className="grid grid-cols-2 gap-x-3 gap-y-1">
                        {[
                          'All Anniversary Cakes', 'Anniversary Photo Cakes', 'Anniversary Cakes For Parents',
                          '1st Anniversary Cakes', '25th Anniversary Cakes', '5th Anniversary Cakes',
                          '10th Anniversary Cakes', '50th Anniversary Cakes'
                        ].map(item => (
                          <button 
                            key={item}
                            onClick={() => { 
                              setActiveMegaMenu(null); 
                              router.push('/category/' + deriveSlug(item === 'All Anniversary Cakes' ? 'anniversary-cakes' : item)); 
                            }} 
                            className="w-full text-left py-1 px-2 rounded-md hover:bg-white/80 text-stone-800 hover:text-[#dc2626] font-bold text-xs transition-colors block truncate"
                          >
                            {item}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* PANEL 8: OCCASIONS */}
                  {activeMegaMenu === 'Occasions' && (
                    <>
                      {/* Festive Celebrations Column */}
                      <div className="flex-1 min-w-[220px] p-5 bg-white border-r border-stone-100">
                        <p className="text-xs font-extrabold text-stone-900 tracking-wider mb-3 flex items-center gap-1.5 px-1">
                          <span className="text-amber-400 text-sm">✴</span> Festive Celebrations
                        </p>
                        <div className="space-y-0.5">
                          {[
                            "Brother's Day Cakes", "Father's Day Cake", "Doctors Day Cakes",
                            "Friendship Day Cakes", "Independence Day Cakes", "Rakhi Cakes"
                          ].map(item => (
                            <button 
                              key={item}
                              onClick={() => { 
                                setActiveMegaMenu(null); 
                                router.push('/category/' + deriveSlug(item)); 
                              }} 
                              className="w-full text-left py-1 px-2 rounded-md hover:bg-red-50 text-stone-700 hover:text-[#dc2626] font-semibold text-xs transition-colors block truncate"
                            >
                              {item}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Special Milestones Column */}
                      <div className="flex-1 min-w-[220px] p-5 bg-[#fff8f5]">
                        <p className="text-xs font-extrabold text-stone-900 tracking-wider mb-3 flex items-center gap-1.5 px-1">
                          <span className="text-amber-400 text-sm">✴</span> Special Milestones
                        </p>
                        <div className="space-y-0.5">
                          {[
                            "Baby Shower Cakes", "Congratulations Cakes", "Retirement Cakes",
                            "Farewell Cakes", "Wedding Cakes"
                          ].map(item => (
                            <button 
                              key={item}
                              onClick={() => { 
                                setActiveMegaMenu(null); 
                                router.push('/category/' + deriveSlug(item)); 
                              }} 
                              className="w-full text-left py-1 px-2 rounded-md hover:bg-white/80 text-stone-800 hover:text-[#dc2626] font-bold text-xs transition-colors block truncate"
                            >
                              {item}
                            </button>
                          ))}
                        </div>
                      </div>
                    </>
                  )}

                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </header>

      {/* IMMERSIVE REPLICA HERO BANNER WITH AUTO-SCROLLING DESIGNS */}
      <section className="relative overflow-hidden bg-[#dc2626] rounded-b-[2rem] sm:rounded-b-[2.5rem] py-12 lg:py-16 text-white transition-colors duration-500 shadow-md">
        
        {/* Soft atmospheric gradient/glow inside banner */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/10 via-transparent to-black/5 pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-12 gap-8 items-center">
            
            {/* LEFT COLUMN: HERO HEADINGS & CTAS */}
            <div className="lg:col-span-6 text-center lg:text-left">
              
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeHeroSlide}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.4 }}
                >
                  {/* Eyebrow */}
                  <span className="text-[11px] font-extrabold tracking-widest uppercase text-rose-100 block mb-3">
                    {heroSlides[activeHeroSlide].eyebrow}
                  </span>

                  {/* Title stack */}
                  <h2 className="font-playfair text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.08] mb-4 drop-shadow-xs">
                    <span className="block">{heroSlides[activeHeroSlide].titleLine1}</span>
                    <span className="block">{heroSlides[activeHeroSlide].titleLine2}</span>
                    <span className="block text-amber-300 font-extrabold">{heroSlides[activeHeroSlide].titleHighlight}</span>
                    <span className="block">{heroSlides[activeHeroSlide].titleLine3}</span>
                  </h2>

                  {/* Subtitle */}
                  <p className="text-rose-50 text-sm sm:text-base font-medium mb-8 max-w-sm mx-auto lg:mx-0">
                    {heroSlides[activeHeroSlide].subtitle}
                  </p>
                </motion.div>
              </AnimatePresence>

              {/* Action Buttons */}
              <div className="flex items-center justify-center lg:justify-start gap-4 mb-8">
                <a 
                  href="#menu"
                  className="bg-white text-[#dc2626] font-extrabold px-6 py-2.5 rounded-full text-xs sm:text-sm shadow-md hover:bg-rose-50 transition-all active:scale-95"
                >
                  Shop Now
                </a>
                <a 
                  href="#menu"
                  className="border border-white/80 text-white font-bold px-6 py-2.5 rounded-full text-xs sm:text-sm hover:bg-white/10 transition-all"
                >
                  View Menu
                </a>
              </div>

              {/* Trust Status Line */}
              <div className="flex items-center justify-center lg:justify-start gap-3 sm:gap-4 text-[11px] sm:text-xs font-semibold text-rose-100/90 tracking-wide">
                <span className="flex items-center gap-1">
                  <Star className="w-3 h-3 fill-amber-300 text-amber-300 inline" /> 4.9 Rating
                </span>
                <span>·</span>
                <span>2Cr+ Orders</span>
                <span>·</span>
                <span>500+ Designs</span>
              </div>

            </div>

            {/* RIGHT COLUMN: DYNAMIC AUTO-SCROLLING CAKE SHOWCASE */}
            <div className="lg:col-span-6 relative flex justify-center mt-6 lg:mt-0 py-4">
              
              <AnimatePresence mode="wait">
                <motion.div 
                  key={activeHeroSlide}
                  initial={{ opacity: 0, scale: 0.94 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.94 }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  className="relative w-full max-w-md aspect-square sm:aspect-[5/4] flex items-center justify-center my-2 sm:my-4"
                >
                  {/* MAIN SHOWCASE WHITE TILE */}
                  <div className="relative w-4/5 sm:w-3/4 aspect-square bg-white rounded-[2rem] p-4 sm:p-6 shadow-2xl border border-stone-100 flex flex-col items-center justify-center group ml-auto mr-3 sm:mr-6">
                    <img 
                      src={heroSlides[activeHeroSlide].mainImage} 
                      alt="Showcase Deluxe Design" 
                      className="w-full h-full object-contain filter drop-shadow-md transition-transform duration-700 group-hover:scale-105"
                      onError={(e) => handleImageError(e, '/choco_truffle_cake_1778560769498.png')}
                    />

                    {/* TOP-RIGHT FLOATING DESIGNS COUNT BADGE */}
                    <div className="absolute -top-4 -right-4 sm:-top-5 sm:-right-5 bg-white text-[#dc2626] rounded-[1.25rem] shadow-xl border border-stone-100 px-3.5 sm:px-4 py-2.5 sm:py-3 text-center min-w-[75px] sm:min-w-[85px] z-20">
                      <span className="block text-base sm:text-xl font-black leading-none tracking-tight">
                        {heroSlides[activeHeroSlide].badgeText.split(' ')[0]}
                      </span>
                      <span className="block text-[10px] sm:text-xs text-stone-600 font-bold leading-none mt-1">
                        {heroSlides[activeHeroSlide].badgeText.split(' ').slice(1).join(' ') || 'Designs'}
                      </span>
                    </div>
                  </div>

                  {/* SECONDARY OVERLAPPING TILE (Tucked bottom-left) */}
                  <div className="absolute left-0 sm:left-2 -bottom-2 sm:-bottom-4 w-3/5 sm:w-7/12 aspect-square bg-white rounded-[1.5rem] p-2 sm:p-2.5 shadow-2xl border border-white transition-transform hover:-translate-y-1 z-30">
                    <img 
                      src={heroSlides[activeHeroSlide].secondaryImage} 
                      alt="Assorted Bites Display" 
                      className="w-full h-full object-cover rounded-[1rem]"
                      onError={(e) => handleImageError(e, '/hero_cake_1778560729107.png')}
                    />

                    {/* PILL BADGE STICKER */}
                    <div className="absolute -top-3.5 sm:-top-4 left-1/2 -translate-x-1/2 bg-[#dc2626] text-white text-[10px] sm:text-xs font-black tracking-wide px-3.5 sm:px-4 py-1 sm:py-1.5 rounded-full shadow-md whitespace-nowrap flex items-center justify-center">
                      {heroSlides[activeHeroSlide].pillBadge}
                    </div>
                  </div>

                </motion.div>
              </AnimatePresence>

            </div>

          </div>

          {/* BOTTOM DOTS NAVIGATION */}
          <div className="flex items-center justify-center gap-1.5 mt-10">
            {heroSlides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setActiveHeroSlide(idx)}
                className={`h-1.5 rounded-full transition-all duration-300 ${activeHeroSlide === idx ? 'w-6 bg-white' : 'w-1.5 bg-white/40 hover:bg-white/60'}`}
                aria-label={`Show layout frame ${idx + 1}`}
              ></button>
            ))}
          </div>

        </div>

      </section>

      {/* HORIZONTAL CAPSULE MENU RHYTHM SECTION MATCHING THE RED CAPSULE STRIP REFERENCE */}
      <section className="bg-[#fff6f6] py-10 border-b border-stone-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-stone-900 font-playfair tracking-wide text-center mb-8">
            Menu: What will you wish for?
          </h2>

          {/* Horizontally scrolling row of upright red capsules strictly aligned to catalog mapping */}
          <div className="w-full overflow-x-auto scrollbar-none pb-6 pt-4 px-4 flex justify-start md:justify-center">
            <div className="flex items-center gap-3 sm:gap-4 md:gap-5 max-w-max mx-auto">
            {[
              { 
                label: 'Cakes', 
                img: '/categories/cakes.jpg', 
                act: () => { setSelectedCategory('cakes'); setSearchQuery(''); setActiveMegaMenu('Cakes'); } 
              },
              { 
                label: 'Bento', 
                img: '/categories/bento.jpg', 
                act: () => { setSearchQuery('bento'); setSelectedCategory('all'); setActiveMegaMenu('Bento'); } 
              },
              { 
                label: 'Theme Cakes', 
                img: '/categories/theme.jpg', 
                act: () => { setSelectedCategory('designer'); setSearchQuery(''); setActiveMegaMenu('Theme Cakes'); } 
              },
              { 
                label: 'By Relationship', 
                img: '/categories/relationship.jpg', 
                act: () => { setSearchQuery('relationship'); setSelectedCategory('all'); setActiveMegaMenu('By Relationship'); } 
              },
              { 
                label: 'Desserts & Hampers', 
                img: '/categories/desserts.jpg', 
                act: () => { setSelectedCategory('desserts'); setSearchQuery(''); setActiveMegaMenu('Desserts & Hampers'); } 
              },
              { 
                label: 'Birthday', 
                img: '/categories/birthday.jpg', 
                act: () => { setSearchQuery('birthday'); setSelectedCategory('all'); setActiveMegaMenu('Birthday'); } 
              },
              { 
                label: 'Anniversary', 
                img: '/categories/anniversary.jpg', 
                act: () => { setSearchQuery('anniversary'); setSelectedCategory('all'); setActiveMegaMenu('Anniversary'); } 
              },
              { 
                label: 'Occasions', 
                img: '/categories/occasions.jpg', 
                act: () => { setSearchQuery('occasion'); setSelectedCategory('all'); setActiveMegaMenu('Occasions'); } 
              },
            ].map((capsule) => {
              const isSelected = activeMegaMenu === capsule.label || 
                (capsule.label === 'Cakes' && selectedCategory === 'cakes' && !searchQuery) ||
                (searchQuery && capsule.label.toLowerCase().includes(searchQuery.toLowerCase()));
              return (
                <div
                  key={capsule.label}
                  className={`p-1 rounded-full transition-all shrink-0 ${isSelected ? 'bg-[#fff0f0] border border-rose-100 shadow-sm scale-105' : ''}`}
                >
                  <button
                    onClick={() => {
                      capsule.act();
                      triggerToast(`Showing desired collection: ${capsule.label}`);
                      const el = document.getElementById('menu');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className={`w-32 sm:w-36 md:w-36 lg:w-36 h-48 sm:h-52 md:h-52 lg:h-52 rounded-full p-2 flex flex-col items-center justify-between transition-all duration-300 shadow-md group block ${isSelected ? 'bg-[#b91c1c] ring-4 ring-[#dc2626]/20' : 'bg-[#dc2626] hover:bg-[#b91c1c] hover:-translate-y-1.5'}`}
                  >
                    {/* Top inner prominent white circle frame containing image matching original wrapper style */}
                    <div className="w-full aspect-square rounded-full bg-white p-1.5 shadow-inner overflow-hidden flex items-center justify-center shrink-0">
                      <img 
                        src={capsule.img} 
                        alt={capsule.label}
                        className="w-full h-full object-cover rounded-full group-hover:scale-110 transition-transform duration-300" 
                      />
                    </div>

                    {/* Bottom prominent high-contrast text label inside capsule */}
                    <span className="text-xs sm:text-sm md:text-base font-bold text-white tracking-wide pb-2.5 mt-auto block truncate w-full text-center drop-shadow-xs px-1">
                      {capsule.label}
                    </span>
                  </button>
                </div>
              );
            })}
            </div>
          </div>

        </div>
      </section>

      {/* INTERACTIVE CONTROLS / CATALOG RHYTHM SECTION */}
      <section id="menu" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-1">
        
        {/* SECTION TITLE & META COUNTER */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-rose-500 block mb-1">
              Refined Selections
            </span>
            <h2 className="font-playfair text-2xl sm:text-3xl font-bold text-stone-900">
              Curated Pastry Collection
            </h2>
          </div>
          
          <p className="text-xs font-medium text-stone-500 bg-stone-100/80 px-3 py-1.5 rounded-lg border border-stone-200/60 self-start md:self-auto">
            Displaying <strong className="text-rose-600 font-bold">{filteredProducts.length}</strong> premium matching artifacts
          </p>
        </div>

        {/* SLEEK INLINE CAPSULE FILTER BAR REPLICATING THE REFERENCE DESIGN */}
        <div className="bg-white rounded-full border border-stone-200/80 shadow-xs p-2 sm:p-2.5 mb-8">
          <div className="flex items-center justify-between sm:justify-start gap-4 sm:gap-6 overflow-x-auto scrollbar-none px-2 min-w-max">
            
            {/* CATEGORY SELECTOR */}
            <div className="flex items-center gap-1.5 shrink-0">
              <span className="text-[11px] sm:text-xs font-black text-slate-500 tracking-wider uppercase">
                CATEGORY:
              </span>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-2.5 py-1 sm:py-1.5 rounded-lg border border-stone-200 text-stone-800 text-xs font-bold bg-white focus:outline-none focus:ring-2 focus:ring-rose-500 shadow-2xs font-outfit cursor-pointer"
              >
                <option value="all">All Products</option>
                <option value="cakes">Signature Cakes</option>
                <option value="designer">Designer Cakes</option>
                <option value="cookies">Cookies</option>
                <option value="desserts">Desserts</option>
              </select>
            </div>

            {/* FLAVOUR SELECTOR */}
            <div className="flex items-center gap-1.5 shrink-0">
              <span className="text-[11px] sm:text-xs font-black text-slate-500 tracking-wider uppercase">
                FLAVOUR:
              </span>
              <select
                value={selectedFlavour}
                onChange={(e) => setSelectedFlavour(e.target.value)}
                className="px-2.5 py-1 sm:py-1.5 rounded-lg border border-stone-200 text-stone-800 text-xs font-bold bg-white focus:outline-none focus:ring-2 focus:ring-rose-500 shadow-2xs font-outfit cursor-pointer"
              >
                <option value="all">All Flavours</option>
                <option value="chocolate">Chocolate</option>
                <option value="vanilla">Vanilla</option>
                <option value="butterscotch">Butterscotch</option>
                <option value="fruit">Seasonal Fruit</option>
              </select>
            </div>

            {/* TYPE SELECTOR */}
            <div className="flex items-center gap-1.5 shrink-0">
              <span className="text-[11px] sm:text-xs font-black text-slate-500 tracking-wider uppercase">
                TYPE:
              </span>
              <select
                value={isEgglessOnly ? 'eggless' : 'any'}
                onChange={(e) => setIsEgglessOnly(e.target.value === 'eggless')}
                className="px-2.5 py-1 sm:py-1.5 rounded-lg border border-stone-200 text-stone-800 text-xs font-bold bg-white focus:outline-none focus:ring-2 focus:ring-rose-500 shadow-2xs font-outfit cursor-pointer"
              >
                <option value="any">Any Type</option>
                <option value="eggless">100% Pure Eggless</option>
              </select>
            </div>

            {/* SORT BY SELECTOR */}
            <div className="flex items-center gap-1.5 shrink-0 ml-auto">
              <span className="text-[11px] sm:text-xs font-black text-slate-500 tracking-wider uppercase">
                SORT BY:
              </span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-2.5 py-1 sm:py-1.5 rounded-lg border border-stone-200 text-stone-800 text-xs font-bold bg-white focus:outline-none focus:ring-2 focus:ring-rose-500 shadow-2xs font-outfit cursor-pointer"
              >
                <option value="popularity">Popularity</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Top Rated</option>
              </select>
            </div>

          </div>

          {/* Active indicator row if custom queries active */}
          {(searchQuery || selectedCategory !== 'all' || selectedFlavour !== 'all' || isEgglessOnly) && (
            <div className="flex items-center justify-between gap-2 pt-2 mt-2 border-t border-stone-100 px-2 text-[11px] text-stone-500">
              <div className="flex items-center gap-1.5 truncate">
                <span className="font-bold text-rose-500">Active View:</span>
                <span className="bg-rose-50 text-rose-700 font-bold px-2 py-0.5 rounded-full border border-rose-100">
                  {searchQuery ? `"${searchQuery}"` : 'Custom Filters'}
                </span>
              </div>
              <button
                onClick={() => {
                  setSelectedCategory('all');
                  setSelectedFlavour('all');
                  setIsEgglessOnly(false);
                  setSearchQuery('');
                  triggerToast('Restored catalog baseline view');
                }}
                className="text-stone-400 hover:text-stone-700 font-bold underline shrink-0"
              >
                Reset
              </button>
            </div>
          )}
        </div>

        {/* DYNAMIC BENTO GRID LAYOUT VIA FRAMER MOTION */}
        {filteredProducts.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-16 px-4 bg-white rounded-2xl border border-dashed border-stone-300 max-w-lg mx-auto my-6"
          >
            <span className="text-4xl block mb-3">🧑‍🍳</span>
            <h3 className="font-playfair text-lg font-bold text-stone-900">
              No handcrafted delicacies match your current blueprint
            </h3>
            <p className="text-stone-500 text-xs mt-1 mb-5">
              Try stripping back custom string queries or adjusting active dietary selection tags.
            </p>
            <button 
              onClick={() => {
                setSelectedCategory('all');
                setSelectedFlavour('all');
                setIsEgglessOnly(false);
                setSearchQuery('');
              }}
              className="bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold px-4 py-2 rounded-xl transition-all"
            >
              Show Master Collection
            </button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6">
            <AnimatePresence>
              {filteredProducts.slice(0, visibleCount).map((prod, i) => {
                const isSaved = wishlistIds.includes(prod.id);
                return (
                  <motion.div 
                    layout
                    initial={{ opacity: 0, y: 40, scale: 0.92 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.88 }}
                    transition={{ 
                      duration: 0.5, 
                      delay: (i % 8) * 0.05, 
                      ease: [0.16, 1, 0.3, 1] 
                    }}
                    key={prod.id}
                    className="group bg-white rounded-xl sm:rounded-2xl overflow-hidden border border-stone-200/80 hover:border-rose-200 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between relative"
                  >
                    
                    {/* Badge stickers envelope */}
                    <div className="absolute top-2 left-2 sm:top-3 sm:left-3 z-10 flex flex-col gap-1 items-start">
                      {prod.isBestseller && (
                        <span className="bg-gradient-to-r from-amber-500 to-amber-600 text-white text-[8px] sm:text-[9px] font-black uppercase px-1.5 py-0.5 rounded shadow-xs tracking-wider">
                          🔥 Bestseller
                        </span>
                      )}
                      {prod.isEggless && (
                        <span className="bg-emerald-500/95 backdrop-blur-xs text-white text-[8px] sm:text-[9px] font-black uppercase px-1.5 py-0.5 rounded shadow-xs tracking-wider inline-flex items-center gap-1">
                          <span className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-white animate-ping"></span>
                          <span>Eggless</span>
                        </span>
                      )}
                    </div>

                    {/* Quick heart toggle */}
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleWishlist(prod.id, prod.name);
                      }}
                      className="absolute top-2 right-2 sm:top-3 sm:right-3 z-10 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/90 backdrop-blur-xs hover:bg-white text-stone-600 shadow-xs flex items-center justify-center transition-transform hover:scale-110"
                      aria-label="Toggle wishlist item"
                    >
                      <Heart className={`w-3.5 h-3.5 sm:w-4 sm:h-4 transition-colors ${isSaved ? 'fill-rose-500 text-rose-500' : 'hover:text-rose-500'}`} />
                    </button>

                    {/* Master Thumbnail Envelope */}
                    <div 
                      onClick={() => openCustomizer(prod)}
                      className="relative aspect-[4/3] bg-stone-50 overflow-hidden cursor-pointer"
                    >
                      <AutoScrollImageGallery 
                        angles={prod.angles} 
                        alt={prod.name} 
                        fallback="/choco_truffle_cake_1778560769498.png" 
                      />
                      
                      {/* Secondary floating views length banner if rich data resolved */}
                      {prod.angles.length > 1 && (
                        <span className="absolute bottom-1.5 left-1.5 sm:bottom-2 sm:left-2 bg-stone-900/60 backdrop-blur-xs text-white text-[8px] sm:text-[9px] px-1 sm:px-1.5 py-0.5 rounded font-mono pointer-events-none z-10">
                          +{prod.angles.length - 1} angles
                        </span>
                      )}

                      {/* Customizer trigger overlay wrapper */}
                      <div className="absolute inset-0 bg-stone-900/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-2 sm:p-3">
                        <span className="bg-white text-stone-900 text-[10px] sm:text-xs font-bold px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg sm:rounded-xl shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-all duration-300 text-center">
                          Options
                        </span>
                      </div>
                    </div>

                    {/* Product Details Block */}
                    <div className="p-2 sm:p-4 flex-1 flex flex-col justify-between">
                      <div>
                        {/* Meta category label */}
                        <div className="flex items-center justify-between text-[8px] sm:text-[10px] text-stone-400 font-bold uppercase tracking-wider mb-0.5 sm:mb-1">
                          <span className="truncate max-w-[60%]">{prod.category.replace('_', ' ')}</span>
                          <span className="text-stone-500 font-medium capitalize font-sans shrink-0">
                            {prod.flavour}
                          </span>
                        </div>

                        {/* Title click link */}
                        <h3 
                          onClick={() => openCustomizer(prod)}
                          className="font-playfair font-bold text-stone-900 text-xs sm:text-sm line-clamp-2 leading-snug cursor-pointer hover:text-rose-600 transition-colors"
                          title={prod.name}
                        >
                          {prod.name}
                        </h3>

                        {/* Rating row */}
                        <div className="flex items-center gap-0.5 sm:gap-1 mt-1 sm:mt-1.5 mb-2 sm:mb-3">
                          <div className="flex text-amber-400 text-[9px] sm:text-xs">
                            {'★★★★★'.split('').map((s, idx) => (
                              <span key={idx}>{s}</span>
                            ))}
                          </div>
                          <span className="text-[10px] sm:text-xs font-bold text-stone-700 ml-0.5 sm:ml-1">{prod.rating}</span>
                          <span className="text-[8px] sm:text-[10px] text-stone-400 font-medium hidden sm:inline">({prod.reviews})</span>
                        </div>
                      </div>

                      {/* Pricing Row & Instant Cart Insertion */}
                      <div className="pt-1.5 sm:pt-2 border-t border-stone-100 flex items-center justify-between mt-auto gap-1">
                        <div className="min-w-0">
                          <span className="text-[8px] sm:text-[10px] text-stone-400 block uppercase font-medium leading-none">Starting at</span>
                          <div className="flex items-baseline gap-1 flex-wrap">
                            <span className="text-sm sm:text-base font-extrabold text-stone-900 leading-tight">
                              ₹{prod.price}
                            </span>
                            <span className="text-[9px] sm:text-xs text-stone-400 line-through leading-tight">
                              ₹{prod.originalPrice}
                            </span>
                          </div>
                        </div>

                        {/* Direct fast cart trigger */}
                        <button 
                          onClick={() => handleInstantAdd(prod)}
                          className="w-7 h-7 sm:w-9 sm:h-9 bg-stone-100 hover:bg-rose-50 hover:text-rose-600 rounded-lg sm:rounded-xl flex items-center justify-center text-stone-700 transition-colors shrink-0 cursor-pointer"
                          title="Quick Add Base to box"
                        >
                          <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.5]" />
                        </button>
                      </div>

                    </div>

                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}

        {/* SHOW MORE PAGINATION TRIGGER */}
        {filteredProducts.length > visibleCount && (
          <motion.div 
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-12 flex justify-center"
          >
            <button
              onClick={() => setVisibleCount(prev => prev + 30)}
              className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-white border border-stone-200 text-stone-900 font-bold hover:border-rose-300 hover:text-rose-600 shadow-xs hover:shadow-md transition-all duration-300 group cursor-pointer"
            >
              <span>Display More Handcrafted Delicacies</span>
              <span className="bg-stone-100 text-stone-600 text-xs px-2.5 py-1 rounded-lg font-black group-hover:bg-rose-50 group-hover:text-rose-600 transition-colors">
                Showing {visibleCount} of {filteredProducts.length}
              </span>
              <ChevronRight className="w-4 h-4 text-stone-400 group-hover:text-rose-600 group-hover:translate-x-0.5 transition-all" />
            </button>
          </motion.div>
        )}

      </section>

      {/* FOOTER DESCRIPTIVE SEO CATALOG INFO SECTION */}
      <footer className="bg-stone-900 text-stone-300 mt-16 border-t border-stone-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          
          {/* AUTHENTIC HERITAGE FOOTER SIGNAGE ASSET */}
          <div className="bg-stone-950 rounded-3xl border border-stone-800 p-6 sm:p-8 mb-12 shadow-2xl relative overflow-hidden text-left">
            {/* Header Heritage Indicator */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-stone-900">
              <div className="flex items-center gap-3">
                <span className="bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-black uppercase tracking-widest px-3 py-1 rounded-full">
                  📜 Heritage Flagship Signage
                </span>
                <span className="text-stone-400 text-xs font-bold font-playfair">Baking Since 1950</span>
              </div>
              <div className="flex items-center gap-3 text-xs font-mono font-bold text-stone-300 bg-stone-900/80 px-3.5 py-1.5 rounded-xl border border-stone-800">
                <span>📞 Hotline:</span>
                <a href="tel:9634036448" className="hover:text-amber-400 transition-colors">9634036448</a>
                <span className="text-stone-600">|</span>
                <a href="tel:9557187486" className="hover:text-amber-400 transition-colors">9557187486</a>
              </div>
            </div>

            {/* Embedded high-fidelity Signage Image */}
            <div className="rounded-2xl overflow-hidden bg-stone-900/40 border border-stone-800/80 flex justify-center mb-8 shadow-inner p-2">
              <img 
                src="/footer.png" 
                alt="Downtown Bakers Signage - 90 Moti Bazar D.Dun" 
                className="w-full max-w-5xl object-contain rounded-xl transform hover:scale-[1.01] transition-transform duration-500 max-h-[360px]"
              />
            </div>

            {/* Authenticated Heritage Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-stone-900">
              
              {/* Main HQ Info */}
              <div className="bg-stone-900/40 p-4 rounded-xl border border-stone-900">
                <span className="text-[10px] font-bold text-amber-500 uppercase tracking-wider block mb-1">HQ Store Location</span>
                <p className="text-sm font-extrabold text-white font-playfair tracking-wide">
                  90, MOTI BAZAR, D.DUN
                </p>
                <p className="text-xs text-stone-400 mt-1 leading-relaxed">
                  Visit our historical Dehradun base for fresh oven deliveries and master bakery consulting sessions.
                </p>
              </div>

              {/* Treat Authorized Dealership */}
              <div className="bg-stone-900/40 p-4 rounded-xl border border-stone-900">
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-playfair font-black text-rose-500 italic text-base leading-none">Treat</span>
                  <span className="text-[9px] bg-rose-500/10 text-rose-400 border border-rose-500/20 px-1.5 py-0.5 rounded font-black uppercase tracking-wider">Auth. Dealer</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  <span className="text-xs bg-stone-900 text-stone-300 font-bold px-2.5 py-1 rounded-md border border-stone-800">🍞 Treat Bread</span>
                  <span className="text-xs bg-stone-900 text-stone-300 font-bold px-2.5 py-1 rounded-md border border-stone-800">🥖 Treat Rusk</span>
                  <span className="text-xs bg-stone-900 text-stone-300 font-bold px-2.5 py-1 rounded-md border border-stone-800">🥨 Treat Namkeen</span>
                </div>
              </div>

              {/* Speciality Lineup */}
              <div className="bg-stone-900/40 p-4 rounded-xl border border-stone-900">
                <span className="text-[11px] font-playfair font-black text-amber-500 italic tracking-wider block mb-2.5">Speciality Confectioneries</span>
                <ul className="space-y-1.5 text-xs text-stone-300 font-medium">
                  <li className="flex items-center gap-2">
                    <span className="text-amber-500 text-xs shrink-0">🧁</span>
                    <span>All Types of Theme Cakes</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-amber-500 text-xs shrink-0">🧁</span>
                    <span>Eggless Birthday Cakes</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-amber-500 text-xs shrink-0">🍪</span>
                    <span>Butter Pista Cookies</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-amber-500 text-xs shrink-0">🥖</span>
                    <span>Elaichi Rusk Specialties</span>
                  </li>
                </ul>
              </div>

            </div>

          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-8 border-b border-stone-800">
            
            <div className="md:col-span-1">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-lg bg-rose-500 flex items-center justify-center text-white font-bold text-xs">
                  DB
                </div>
                <span className="font-playfair text-lg font-bold text-white">Downtown Bakers</span>
              </div>
              <p className="text-xs text-stone-400 leading-relaxed mb-4">
                Pioneering high-fidelity automated web confectioneries. Every artifact listed corresponds to authenticated physical baking components scraped natively.
              </p>
              <span className="text-[10px] font-mono text-stone-500 bg-stone-800 px-2 py-1 rounded">
                Next.js v15 Core Verified Engine
              </span>
            </div>

            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-white mb-3">
                Scraped Categories
              </p>
              <ul className="text-xs space-y-2 text-stone-400">
                <li><button onClick={() => { setSelectedCategory('cakes'); window.scrollTo({top: 400, behavior: 'smooth'}); }} className="hover:text-rose-400 transition-colors">Rich Chocolate Truffles</button></li>
                <li><button onClick={() => { setSelectedCategory('designer'); window.scrollTo({top: 400, behavior: 'smooth'}); }} className="hover:text-rose-400 transition-colors">Fondant Theme Marvels</button></li>
                <li><button onClick={() => { setSelectedCategory('cookies'); window.scrollTo({top: 400, behavior: 'smooth'}); }} className="hover:text-rose-400 transition-colors">Gourmet Double Crunch Tins</button></li>
                <li><button onClick={() => { setSelectedCategory('desserts'); window.scrollTo({top: 400, behavior: 'smooth'}); }} className="hover:text-rose-400 transition-colors">Jar Mousse &amp; Cheesecakes</button></li>
              </ul>
            </div>

            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-white mb-3">
                Regional Hubs
              </p>
              <ul className="text-xs space-y-2 text-stone-400">
                <li><span className="text-white font-semibold">New Delhi</span> (Guaranteed 2-hr Express)</li>
                <li><span className="text-white font-semibold">Mumbai</span> (Suburban Cloud Kitchens)</li>
                <li><span className="text-white font-semibold">Bangalore</span> (Koramangala Fresh Bake Depot)</li>
                <li><span className="text-stone-500">Gurgaon Outlets (Expansion active)</span></li>
              </ul>
            </div>

            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-white mb-3">
                Aesthetics &amp; UX Oath
              </p>
              <p className="text-xs text-stone-400 leading-relaxed mb-3">
                Designed to WOW with vibrant red/pink brand tokens, modern Outfit typography foundations, zero empty states, and true Framer Motion continuous state orchestration.
              </p>
              <div className="flex items-center gap-1 text-[11px] font-bold text-rose-400">
                <ShieldCheck className="w-4 h-4 shrink-0" />
                <span>100% Zero-Loss Session Assurance</span>
              </div>
            </div>

          </div>

          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-stone-500">
            <p>© 2026 Downtown Bakers Confectionery Platform. All architectural assets de-duplicated cleanly.</p>
            <div className="flex gap-4">
              <span className="hover:underline cursor-pointer">Privacy Framework</span>
              <span>•</span>
              <span className="hover:underline cursor-pointer">Terms of Delivery</span>
              <span>•</span>
              <span className="hover:underline cursor-pointer">Pincode Service Map</span>
            </div>
          </div>

        </div>
      </footer>

      {/* ======================================================================= */}
      {/* IMMERSIVE PDP OVERLAY MODAL (CUSTOMIZER) VIA FRAMER MOTION */}
      {/* ======================================================================= */}
      <AnimatePresence>
        {activePdpProduct && (
          <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 sm:p-6">
            
            {/* Dark blur backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActivePdpProduct(null)}
              className="fixed inset-0 bg-stone-900/80 backdrop-blur-md transition-opacity"
            />

            {/* Modal main content envelope */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.94, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 10 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden z-10 border border-stone-200 grid grid-cols-1 md:grid-cols-12 max-h-[90vh] flex-col flex"
            >
              
              {/* Left Column: Visual Asset Gallery */}
              <div className="md:col-span-6 bg-stone-50 p-6 flex flex-col justify-between border-b md:border-b-0 md:border-r border-stone-200/80 relative overflow-y-auto">
                
                {/* Header label inside view */}
                <div className="flex items-center justify-between mb-4">
                  <span className="bg-rose-50 text-rose-600 text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-md">
                    {activePdpProduct.category.replace('_', ' ')}
                  </span>
                  {activePdpProduct.isEggless && (
                    <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                      <span>🟢 Pure Veg</span>
                    </span>
                  )}
                </div>

                {/* Primary display stage */}
                <div className="relative aspect-square rounded-2xl overflow-hidden bg-white border border-stone-200/60 shadow-xs mb-4 flex items-center justify-center">
                  <motion.img 
                    key={pdpMainAngleIndex}
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                    src={activePdpProduct.angles[pdpMainAngleIndex] || activePdpProduct.imageUrl} 
                    alt={activePdpProduct.name}
                    onError={(e) => handleImageError(e, '/choco_truffle_cake_1778560769498.png')}
                    className="w-full h-full object-contain max-h-80 p-2"
                  />
                  <div className="absolute bottom-2 right-2 bg-stone-900/60 backdrop-blur-xs text-white text-[9px] px-2 py-0.5 rounded-full">
                    Angle {pdpMainAngleIndex + 1} of {activePdpProduct.angles.length}
                  </div>
                </div>

                {/* Discovered alternative angle thumbnails array */}
                <div>
                  <p className="text-[10px] font-bold text-stone-400 uppercase tracking-wider mb-2">
                    Discovered Scraped Angles ({activePdpProduct.angles.length})
                  </p>
                  <div className="flex gap-2 overflow-x-auto pb-1">
                    {activePdpProduct.angles.map((src, angIdx) => (
                      <button 
                        key={src + angIdx}
                        onClick={() => setPdpMainAngleIndex(angIdx)}
                        className={`w-14 h-14 rounded-xl overflow-hidden border-2 shrink-0 transition-all ${pdpMainAngleIndex === angIdx ? 'border-rose-500 scale-105 shadow-xs' : 'border-stone-200 opacity-60 hover:opacity-100'}`}
                      >
                        <img 
                          src={src} 
                          alt={`Thumbnail preview ${angIdx + 1}`}
                          onError={(e) => handleImageError(e, '/choco_truffle_cake_1778560769498.png')}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Micro descriptive fallback copy */}
                <p className="text-[11px] text-stone-500 mt-4 leading-relaxed bg-white p-3 rounded-xl border border-stone-200/40">
                  <strong>Confectionery Promise:</strong> {activePdpProduct.description}
                </p>

              </div>

              {/* Right Column: Customizer Interface Options */}
              <div className="md:col-span-6 p-6 overflow-y-auto flex flex-col justify-between space-y-5">
                
                {/* Dismiss button */}
                <button 
                  onClick={() => setActivePdpProduct(null)}
                  className="absolute top-4 right-4 w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 flex items-center justify-center transition-colors z-20"
                >
                  <X className="w-4 h-4" />
                </button>

                {/* Title and score overview */}
                <div className="pr-8">
                  <h3 className="font-playfair text-xl sm:text-2xl font-bold text-stone-900 leading-tight">
                    {activePdpProduct.name}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded">
                      ★ {activePdpProduct.rating}
                    </span>
                    <span className="text-xs text-stone-400 font-medium">
                      Based on {activePdpProduct.reviews} validated regional reviews
                    </span>
                  </div>
                </div>

                {/* Option Group 1: Weight Matrix Multiplier */}
                <div>
                  <label className="text-xs font-bold text-stone-700 uppercase tracking-wider block mb-2">
                    1. Select Confectionery Blueprint Weight
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {[
                      { label: '0.5 Kg', mult: 1, desc: 'Serves 4-6' },
                      { label: '1.0 Kg', mult: 1.8, desc: 'Serves 10-12' },
                      { label: '1.5 Kg', mult: 2.6, desc: 'Serves 15-18' },
                      { label: '2.0 Kg', mult: 3.4, desc: 'Celebration' }
                    ].map(w => (
                      <button 
                        key={w.label}
                        onClick={() => setPdpSelectedWeight({ label: w.label, mult: w.mult })}
                        className={`p-2 rounded-xl border text-center transition-all ${pdpSelectedWeight.label === w.label ? 'border-rose-500 bg-rose-50 text-rose-600 font-bold ring-1 ring-rose-500/20' : 'border-stone-200 bg-stone-50/50 text-stone-700 hover:bg-stone-50'}`}
                      >
                        <span className="text-xs block font-extrabold">{w.label}</span>
                        <span className="text-[9px] text-stone-400 block font-normal mt-0.5">{w.desc}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Option Group 2: Dietary Toggle selection */}
                <div>
                  <label className="text-xs font-bold text-stone-700 uppercase tracking-wider block mb-2">
                    2. Dietary Confectionery Base
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button 
                      onClick={() => setPdpIsEggless(true)}
                      className={`p-2.5 rounded-xl border flex items-center gap-2.5 transition-all ${pdpIsEggless ? 'border-emerald-500 bg-emerald-50 text-emerald-800 font-bold' : 'border-stone-200 text-stone-600 hover:bg-stone-50'}`}
                    >
                      <span className="w-3 h-3 rounded-full bg-emerald-500 shrink-0"></span>
                      <div className="text-left leading-none">
                        <span className="text-xs block font-bold">100% Eggless Base</span>
                        <span className="text-[9px] text-stone-400 font-normal">Pure Veg Preparation</span>
                      </div>
                    </button>

                    <button 
                      onClick={() => setPdpIsEggless(false)}
                      className={`p-2.5 rounded-xl border flex items-center gap-2.5 transition-all ${!pdpIsEggless ? 'border-amber-500 bg-amber-50 text-amber-800 font-bold' : 'border-stone-200 text-stone-600 hover:bg-stone-50'}`}
                    >
                      <span className="w-3 h-3 rounded-full bg-amber-500 shrink-0"></span>
                      <div className="text-left leading-none">
                        <span className="text-xs block font-bold">Standard Confectioner</span>
                        <span className="text-[9px] text-stone-400 font-normal">Classic Velvet Texture</span>
                      </div>
                    </button>
                  </div>
                </div>

                {/* Option Group 3: Pipable Icing Message Text input */}
                <div>
                  <label className="text-xs font-bold text-stone-700 uppercase tracking-wider block mb-1">
                    3. Custom Hand-Piped Message
                  </label>
                  <input 
                    type="text"
                    placeholder="e.g. Happy 25th Anniversary Princess!"
                    value={pdpCustomMessage}
                    onChange={(e) => setPdpCustomMessage(e.target.value)}
                    maxLength={40}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs text-stone-800 placeholder:text-stone-400 focus:outline-none focus:border-rose-500 font-medium"
                  />
                  <span className="text-[9px] text-stone-400 block mt-1 text-right">
                    {40 - pdpCustomMessage.length} characters left
                  </span>
                </div>

                {/* Option Group 4: Addons Cross-Sell array Checkboxes */}
                <div>
                  <label className="text-xs font-bold text-stone-700 uppercase tracking-wider block mb-2">
                    4. Optional Celebration Add-ons
                  </label>
                  <div className="space-y-2">
                    {pdpAddons.map((add, addIdx) => (
                      <label 
                        key={add.name}
                        className="flex items-center justify-between p-2 rounded-lg bg-stone-50/80 hover:bg-stone-50 cursor-pointer border border-stone-100 text-xs font-medium text-stone-700 select-none"
                      >
                        <div className="flex items-center gap-2">
                          <input 
                            type="checkbox"
                            checked={add.checked}
                            onChange={(e) => {
                              const updated = [...pdpAddons];
                              updated[addIdx].checked = e.target.checked;
                              setPdpAddons(updated);
                            }}
                            className="rounded text-rose-500 focus:ring-rose-500 w-3.5 h-3.5"
                          />
                          <span>{add.name}</span>
                        </div>
                        <span className="font-bold text-stone-900">+₹{add.price}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Option Group 5: Pincode lightning guarantee status text field */}
                <div className="bg-stone-50 p-3 rounded-xl border border-stone-200/60">
                  <span className="text-[10px] font-bold text-stone-500 uppercase block mb-1.5">
                    ⚡ Guaranteed Fresh Slot Locator
                  </span>
                  <div className="flex gap-2">
                    <input 
                      type="text"
                      placeholder="Enter 6-digit PIN"
                      value={pdpPincode}
                      onChange={(e) => setPdpPincode(e.target.value.replace(/[^0-9]/g, ''))}
                      maxLength={6}
                      className="w-32 bg-white border border-stone-200 rounded-lg px-2.5 py-1 text-xs text-stone-800 tracking-widest font-mono"
                    />
                    <button 
                      onClick={verifyPincode}
                      className="bg-stone-200 hover:bg-stone-300 text-stone-700 text-xs font-bold px-3 py-1 rounded-lg transition-colors"
                    >
                      Check Slot
                    </button>
                  </div>
                  {pdpPincodeStatus && (
                    <p className="text-[10px] font-bold text-rose-600 mt-1.5 leading-tight">
                      {pdpPincodeStatus}
                    </p>
                  )}
                </div>

                {/* Rollup Subtotal & Customizer Submit button */}
                <div className="pt-4 border-t border-stone-200 flex items-center justify-between mt-auto">
                  <div>
                    <span className="text-[10px] text-stone-400 block uppercase font-bold">
                      Configured Sum
                    </span>
                    <span className="text-2xl font-black text-stone-900 font-playfair">
                      ₹{currentPdpCalculatedTotal}
                    </span>
                  </div>

                  <button 
                    onClick={handleAddCustomizedToCart}
                    className="bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs px-6 py-3 rounded-xl shadow-lg shadow-rose-600/20 transition-all transform active:scale-95 flex items-center gap-2"
                  >
                    <span>Insert Configuration</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ======================================================================= */}
      {/* PERSISTENT SIDE CART DRAWER & CHECKOUT SIMULATOR */}
      {/* ======================================================================= */}
      <AnimatePresence>
        {isCartOpen && (
          <div className="fixed inset-0 z-50 overflow-hidden">
            
            {/* Drawer Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCartOpen(false)}
              className="absolute inset-0 bg-stone-900/60 backdrop-blur-xs transition-opacity"
            />

            {/* Panel sliding side enclosure */}
            <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
              <motion.div 
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: "spring", damping: 30, stiffness: 350 }}
                className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between border-l border-stone-200"
              >
                
                {/* Header state tracking */}
                <div className="p-4 sm:p-5 bg-stone-50 border-b border-stone-200/80 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShoppingBag className="w-5 h-5 text-rose-500" />
                    <h3 className="font-playfair font-bold text-stone-900 text-lg">
                      Artisanal Deliverable Box
                    </h3>
                    <span className="bg-stone-200 text-stone-700 text-xs font-black px-2 py-0.5 rounded-full">
                      {cartTotals.itemsCount}
                    </span>
                  </div>

                  <button 
                    onClick={() => setIsCartOpen(false)}
                    className="p-1 rounded-lg hover:bg-stone-200 text-stone-500 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Master Body content based on multi-step simulator path */}
                <div className="flex-1 overflow-y-auto p-4 sm:p-5">
                  
                  {/* SIMULATOR STEP 1: CART CONTENTS & VOUCHER ENGINE */}
                  {checkoutStep === 'cart' && (
                    <div className="space-y-5">
                      
                      {cart.length === 0 ? (
                        <div className="text-center py-12">
                          <span className="text-4xl block mb-2">📦</span>
                          <p className="font-playfair text-base font-bold text-stone-800">
                            Your deliverable Box is fully available for items
                          </p>
                          <p className="text-stone-400 text-xs mt-1 mb-4">
                            Click any item customization or instant button above.
                          </p>
                          <button 
                            onClick={() => setIsCartOpen(false)}
                            className="text-xs bg-rose-50 text-rose-600 font-bold px-4 py-2 rounded-xl"
                          >
                            Browse Confectionery List
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          <p className="text-[10px] uppercase font-bold text-stone-400 tracking-wider">
                            Stored Custom Artifacts
                          </p>

                          {cart.map((item) => (
                            <motion.div 
                              layout
                              key={item.cartId}
                              className="p-3 rounded-xl bg-stone-50 border border-stone-200/80 flex gap-3 relative"
                            >
                              {/* Asset preview */}
                              <img 
                                src={item.product.imageUrl} 
                                alt={item.product.name}
                                onError={(e) => handleImageError(e, '/choco_truffle_cake_1778560769498.png')}
                                className="w-14 h-14 rounded-lg object-cover shrink-0 bg-white border"
                              />

                              {/* Attributes details */}
                              <div className="flex-1 min-w-0 text-xs">
                                <h4 className="font-bold text-stone-900 truncate">
                                  {item.product.name}
                                </h4>
                                
                                <div className="flex items-center gap-2 text-[10px] text-stone-500 mt-0.5">
                                  <span className="font-bold text-rose-600">{item.weightLabel}</span>
                                  <span>•</span>
                                  <span className={item.isEggless ? 'text-emerald-600 font-bold' : ''}>
                                    {item.isEggless ? '🟢 Eggless Base' : '🟡 Classic Confectioner'}
                                  </span>
                                </div>

                                {item.customMessage && (
                                  <p className="text-[10px] text-stone-600 italic bg-white px-2 py-0.5 rounded border border-stone-100 mt-1 truncate">
                                    Piped: "{item.customMessage}"
                                  </p>
                                )}

                                {item.selectedAddons.length > 0 && (
                                  <p className="text-[9px] text-stone-400 mt-0.5">
                                    +{item.selectedAddons.map(a => a.name).join(', ')}
                                  </p>
                                )}

                                {/* Computed single instance price */}
                                <span className="font-bold text-stone-900 block mt-1">
                                  ₹{item.itemTotal} × {item.quantity} = ₹{item.itemTotal * item.quantity}
                                </span>
                              </div>

                              {/* Controls incrementation */}
                              <div className="flex flex-col items-center justify-between shrink-0 ml-1">
                                <button 
                                  onClick={() => updateCartQty(item.cartId, 1)}
                                  className="w-5 h-5 bg-white hover:bg-stone-200 rounded border flex items-center justify-center text-stone-700"
                                >
                                  <Plus className="w-3 h-3" />
                                </button>
                                <span className="font-bold text-xs text-stone-900 my-0.5">
                                  {item.quantity}
                                </span>
                                <button 
                                  onClick={() => updateCartQty(item.cartId, -1)}
                                  className="w-5 h-5 bg-white hover:bg-stone-200 rounded border flex items-center justify-center text-stone-700 text-xs font-bold"
                                  title="Reduce qty or wipe item"
                                >
                                  <Minus className="w-3 h-3" />
                                </button>
                              </div>

                            </motion.div>
                          ))}

                          {/* Inline Coupon Code application engine */}
                          <div className="pt-3 border-t border-stone-200">
                            <label className="text-[10px] font-bold text-stone-500 uppercase block mb-1">
                              Apply Confectionery Voucher
                            </label>
                            <div className="flex gap-2">
                              <input 
                                type="text"
                                placeholder="Enter code (Try CHOCO20)"
                                value={couponCode}
                                onChange={(e) => setCouponCode(e.target.value)}
                                className="flex-1 bg-stone-50 border border-stone-200 rounded-lg px-3 py-1.5 text-xs uppercase font-bold text-stone-800 placeholder:text-stone-400 placeholder:font-normal focus:outline-none focus:border-rose-500"
                              />
                              <button 
                                onClick={handleApplyCoupon}
                                className="bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition-colors"
                              >
                                Apply Code
                              </button>
                            </div>
                            
                            {couponError && <p className="text-[10px] font-bold text-rose-600 mt-1">{couponError}</p>}
                            {couponSuccess && <p className="text-[10px] font-bold text-emerald-600 mt-1">{couponSuccess}</p>}
                          </div>

                        </div>
                      )}

                    </div>
                  )}

                  {/* SIMULATOR STEP 2: AUTHENTICATION SIMULATOR */}
                  {checkoutStep === 'auth' && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                      <div className="bg-rose-50 p-3 rounded-xl">
                        <span className="text-xs font-bold text-rose-700 block">Step 1: Identity &amp; Notification Sync</span>
                        <p className="text-[11px] text-stone-500 mt-0.5">We send fresh preparation progress alerts to your phone instantly.</p>
                      </div>

                      <div>
                        <label className="text-xs font-bold text-stone-700 block mb-1">Mobile Phone Identification</label>
                        <input 
                          type="tel"
                          placeholder="Enter standard 10-digit phone"
                          value={mobileNumber}
                          onChange={(e) => setMobileNumber(e.target.value.replace(/[^0-9]/g, ''))}
                          maxLength={10}
                          className="w-full bg-stone-50 border rounded-lg px-3 py-2 text-xs font-bold tracking-wide"
                        />
                      </div>

                      {!isOtpSent ? (
                        <button 
                          disabled={mobileNumber.length < 10}
                          onClick={() => {
                            setIsOtpSent(true);
                            triggerToast('Simulated SMS Gateway Triggered: Use code 7788');
                          }}
                          className="w-full bg-stone-900 hover:bg-stone-800 disabled:opacity-50 text-white text-xs font-bold py-2.5 rounded-xl transition-all"
                        >
                          Send Instant Verification OTP
                        </button>
                      ) : (
                        <div className="space-y-3 pt-2 border-t">
                          <div>
                            <label className="text-xs font-bold text-emerald-700 block mb-1">Enter Authenticator Code (Try 7788)</label>
                            <input 
                              type="text"
                              placeholder="4-digit secure code"
                              value={otpCode}
                              onChange={(e) => setOtpCode(e.target.value.replace(/[^0-9]/g, ''))}
                              maxLength={4}
                              className="w-full bg-emerald-50/50 border border-emerald-200 rounded-lg px-3 py-2 text-xs font-bold font-mono tracking-widest text-center"
                            />
                          </div>

                          <button 
                            disabled={otpCode.length < 4}
                            onClick={() => {
                              if (otpCode === '7788' || otpCode.length === 4) {
                                setCheckoutStep('slot');
                                triggerToast('Identity securely synchronized!');
                              } else {
                                triggerToast('Invalid simulated token. Enter 7788');
                              }
                            }}
                            className="w-full bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold py-2.5 rounded-xl transition-all"
                          >
                            Verify Identity &amp; Choose Slot
                          </button>
                        </div>
                      )}

                      <button 
                        onClick={() => setCheckoutStep('cart')}
                        className="text-[11px] text-stone-500 hover:underline block text-center w-full pt-2"
                      >
                        ← Back to Deliverable Box Review
                      </button>
                    </motion.div>
                  )}

                  {/* SIMULATOR STEP 3: SLOT ALLOCATION MATRIX */}
                  {checkoutStep === 'slot' && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                      <div className="bg-stone-100 p-3 rounded-xl">
                        <span className="text-xs font-bold text-stone-900 block">Step 2: Assign Freshness Dispatch Window</span>
                        <p className="text-[11px] text-stone-500 mt-0.5">Our chef synchronizes icing set parameters to match active courier logistics.</p>
                      </div>

                      <div className="space-y-2 pt-1">
                        {[
                          'Lightning Priority (Next 90 mins) — Guaranteed',
                          'Standard Evening (Today, 6 PM - 9 PM)',
                          'Midnight Surprise Dispatch (11:30 PM - 12:15 AM)',
                          'Tomorrow Morning High Tea (10 AM - 1 PM)'
                        ].map(slot => (
                          <label 
                            key={slot}
                            onClick={() => setSelectedSlot(slot)}
                            className={`flex items-start gap-3 p-3 rounded-xl border text-xs cursor-pointer transition-all ${selectedSlot === slot ? 'border-rose-500 bg-rose-50 font-bold text-rose-900' : 'border-stone-200 bg-white hover:bg-stone-50 text-stone-700'}`}
                          >
                            <input 
                              type="radio" 
                              name="simSlot" 
                              checked={selectedSlot === slot}
                              onChange={() => {}} 
                              className="mt-0.5 text-rose-500 focus:ring-rose-500" 
                            />
                            <span className="leading-tight">{slot}</span>
                          </label>
                        ))}
                      </div>

                      <button 
                        onClick={() => setCheckoutStep('payment')}
                        className="w-full bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs py-3 rounded-xl transition-all shadow-md"
                      >
                        Confirm Slot &amp; Proceed to Payment Gateway
                      </button>

                      <button 
                        onClick={() => setCheckoutStep('auth')}
                        className="text-[11px] text-stone-500 hover:underline block text-center w-full"
                      >
                        ← Back to Authentication Details
                      </button>
                    </motion.div>
                  )}

                  {/* SIMULATOR STEP 4: PAYMENT OPTIONS */}
                  {checkoutStep === 'payment' && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                      <div className="bg-amber-50 p-3 rounded-xl">
                        <span className="text-xs font-bold text-amber-900 block">Step 3: Simulated Gateway Clearance</span>
                        <p className="text-[11px] text-amber-700 mt-0.5">Zero physical debit processing active. Authorizes final prototype flow.</p>
                      </div>

                      <div className="space-y-2">
                        {[
                          { id: 'card', label: '💳 Credit / Debit Card (Instant Mock Clear)' },
                          { id: 'upi', label: '⚡ Unified Payments Interface (UPI Simulator)' },
                          { id: 'cod', label: '💵 Confectioner Handoff (Cash on Delivery)' }
                        ].map(pm => (
                          <label 
                            key={pm.id}
                            onClick={() => setPaymentMode(pm.id)}
                            className={`flex items-center gap-3 p-3 rounded-xl border text-xs cursor-pointer transition-all ${paymentMode === pm.id ? 'border-rose-500 bg-rose-50 font-bold text-rose-900' : 'border-stone-200 bg-white text-stone-700'}`}
                          >
                            <input 
                              type="radio" 
                              name="simPayMode" 
                              checked={paymentMode === pm.id} 
                              onChange={() => {}}
                              className="text-rose-500 focus:ring-rose-500" 
                            />
                            <span>{pm.label}</span>
                          </label>
                        ))}
                      </div>

                      {/* Summary block confirmation */}
                      <div className="bg-stone-50 p-3 rounded-xl border border-stone-200 text-xs space-y-1">
                        <div className="flex justify-between text-stone-500">
                          <span>Items Sum:</span>
                          <span>₹{cartTotals.subtotal}</span>
                        </div>
                        {appliedDiscountPercent > 0 && (
                          <div className="flex justify-between text-emerald-600 font-bold">
                            <span>Applied Code Discount ({appliedDiscountPercent}%):</span>
                            <span>-₹{cartTotals.discountAmount}</span>
                          </div>
                        )}
                        <div className="flex justify-between text-stone-500">
                          <span>Service Shipping Hub Fee:</span>
                          <span>{cartTotals.shipping === 0 ? 'FREE' : `₹${cartTotals.shipping}`}</span>
                        </div>
                        <div className="flex justify-between font-black text-stone-900 pt-1.5 border-t border-stone-200 text-sm">
                          <span>Final Net Authorization:</span>
                          <span className="text-rose-600 font-playfair">₹{cartTotals.finalPayable}</span>
                        </div>
                      </div>

                      <button 
                        onClick={completeOrderSubmission}
                        className="w-full bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-400 text-white font-extrabold text-xs py-3.5 rounded-xl transition-all shadow-xl tracking-wider uppercase text-center block"
                      >
                        Authorize Celebration Request (₹{cartTotals.finalPayable})
                      </button>

                      <button 
                        onClick={() => setCheckoutStep('slot')}
                        className="text-[11px] text-stone-500 hover:underline block text-center w-full"
                      >
                        ← Back to Dispatch Selection
                      </button>
                    </motion.div>
                  )}

                  {/* SIMULATOR STEP 5: FINAL CELEBRATION FIREWORKS */}
                  {checkoutStep === 'confirmed' && (
                    <motion.div 
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="text-center py-8 space-y-4"
                    >
                      <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto text-emerald-600">
                        <Check className="w-8 h-8 stroke-[3]" />
                      </div>

                      <div>
                        <span className="text-xs font-bold uppercase tracking-widest text-emerald-600 block">
                          Master Order Synchronized!
                        </span>
                        <h4 className="font-playfair text-xl font-bold text-stone-900 mt-1">
                          Confectionery Preparation Assigned
                        </h4>
                        <p className="text-[11px] font-mono text-stone-600 bg-stone-50 py-1.5 px-3 rounded-lg border border-stone-200 inline-block mt-2">
                          Ref ID: <strong>{orderReference}</strong>
                        </p>
                      </div>

                      <div className="text-left bg-stone-50 p-4 rounded-xl text-xs space-y-2 border border-stone-200/80">
                        <p className="font-bold text-stone-700 pb-1 border-b">Logistics Summary Tracker:</p>
                        <p>📍 <strong>Hub Dispatch:</strong> {selectedCity} Kitchens</p>
                        <p>⏰ <strong>Assigned Window:</strong> {selectedSlot.split('—')[0]}</p>
                        <p>📞 <strong>Subscriber Alert ID:</strong> +91 {mobileNumber || '9988xxxxxx'}</p>
                        <p>💳 <strong>Authorization State:</strong> Handled securely via prototype runtime simulator</p>
                      </div>

                      <p className="text-[11px] text-stone-400 italic">
                        Our master head pastry artist is piping custom configurations directly into the delivery enclosure now.
                      </p>

                      <button 
                        onClick={() => {
                          setCheckoutStep('cart');
                          setIsCartOpen(false);
                        }}
                        className="w-full bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs py-3 rounded-xl transition-all mt-4"
                      >
                        Continue Exploring Delicacies
                      </button>
                    </motion.div>
                  )}

                </div>

                {/* Persistent Footer Checkout trigger state envelope if in standard cart view */}
                {checkoutStep === 'cart' && cart.length > 0 && (
                  <div className="p-4 sm:p-5 bg-stone-50 border-t border-stone-200/80 space-y-3">
                    
                    {/* Live line items summary */}
                    <div className="space-y-1 text-xs">
                      <div className="flex justify-between text-stone-600 font-medium">
                        <span>Items Count:</span>
                        <span>{cartTotals.itemsCount} artifact(s)</span>
                      </div>
                      <div className="flex justify-between text-stone-600 font-medium">
                        <span>Subtotal Sum:</span>
                        <span>₹{cartTotals.subtotal}</span>
                      </div>
                      {appliedDiscountPercent > 0 && (
                        <div className="flex justify-between text-emerald-600 font-bold">
                          <span>Voucher Saved ({appliedDiscountPercent}%):</span>
                          <span>-₹{cartTotals.discountAmount}</span>
                        </div>
                      )}
                      <div className="flex justify-between text-stone-600 font-medium">
                        <span>Express Logistics Hub Fee:</span>
                        <span>{cartTotals.shipping === 0 ? 'FREE Tier' : `₹${cartTotals.shipping}`}</span>
                      </div>
                      <div className="flex justify-between text-stone-900 font-extrabold pt-2 border-t border-stone-200/80 text-sm">
                        <span>Final Grand Sum:</span>
                        <span className="text-rose-600 font-playfair font-black text-lg">₹{cartTotals.finalPayable}</span>
                      </div>
                    </div>

                    {/* Master step forward trigger */}
                    <button 
                      onClick={() => setCheckoutStep('auth')}
                      className="w-full bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold py-3.5 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 group tracking-wide"
                    >
                      <span>Proceed to Secured Prototype Verification</span>
                      <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>

                  </div>
                )}

              </motion.div>
            </div>

          </div>
        )}
      </AnimatePresence>

      {/* ======================================================================= */}
      {/* MOBILE FULL-HEIGHT SLIDE DRAWER MENU */}
      {/* ======================================================================= */}
      <AnimatePresence>
        {isMobileNavOpen && (
          <div className="fixed inset-0 z-50 overflow-hidden md:hidden">
            
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileNavOpen(false)}
              className="absolute inset-0 bg-stone-900/60 backdrop-blur-xs transition-opacity"
            />

            {/* Slide Panel */}
            <motion.div 
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="absolute inset-y-0 left-0 max-w-xs w-full bg-white shadow-2xl flex flex-col overflow-hidden"
            >
              
              {/* Premium Top Bar */}
              <div className="p-4 bg-[#dc2626] text-white flex items-center justify-between shadow-sm">
                <div>
                  <span className="font-playfair italic font-extrabold text-xl tracking-tight block">
                    Downtown Bakers
                  </span>
                  <span className="text-[9px] text-rose-100 font-sans tracking-widest uppercase block">
                    Mobile Artisan Portal
                  </span>
                </div>
                <button 
                  onClick={() => setIsMobileNavOpen(false)}
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors text-white"
                  aria-label="Close Mobile Navigation Menu"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Master scrolling navigation links block */}
              <div className="flex-1 overflow-y-auto p-4 space-y-6">
                
                {/* Instant switchers */}
                <div>
                  <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block mb-2 px-1">
                    Quick Selections
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    <button 
                      onClick={() => {
                        setSelectedCategory('all');
                        setIsBestsellerOnly(!isBestsellerOnly);
                        setIsMobileNavOpen(false);
                      }}
                      className={`p-2.5 rounded-xl text-left border text-xs font-bold transition-all ${isBestsellerOnly ? 'bg-amber-50 border-amber-300 text-amber-800' : 'bg-stone-50 border-stone-200 text-stone-700'}`}
                    >
                      🔥 Bestsellers
                    </button>
                    <button 
                      onClick={() => {
                        setIsEgglessOnly(!isEgglessOnly);
                        setIsMobileNavOpen(false);
                      }}
                      className={`p-2.5 rounded-xl text-left border text-xs font-bold transition-all ${isEgglessOnly ? 'bg-emerald-50 border-emerald-300 text-emerald-800' : 'bg-stone-50 border-stone-200 text-stone-700'}`}
                    >
                      🌿 Pure Eggless
                    </button>
                  </div>
                </div>

                {/* Categories catalog strip mapping list */}
                <div>
                  <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block mb-2 px-1">
                    Confectionery Master Categories
                  </span>
                  <div className="space-y-1">
                    {[
                      { name: 'All Cakes', cat: 'all', emoji: '🎂' },
                      { name: 'Trending Fresh Drops', cat: 'trending-cakes', emoji: '✨' },
                      { name: 'Gourmet Bento Cakes', cat: 'bento-cakes', emoji: '🍱' },
                      { name: 'Heart Shaped Delights', cat: 'heart-shape-cakes', emoji: '❤️' },
                      { name: 'Luxe Cheesecakes', cat: 'cheesecakes', emoji: '🧀' },
                      { name: 'Assorted Hampers', cat: 'bakery-baskets', emoji: '🧺' },
                      { name: 'Signature Pastry Boxes', cat: 'pastries', emoji: '🍰' },
                      { name: 'Premium Dry Cakes', cat: 'dry-cakes', emoji: '🍞' }
                    ].map((item) => (
                      <button
                        key={item.cat}
                        onClick={() => {
                          setSelectedCategory(item.cat);
                          setIsMobileNavOpen(false);
                          // Auto reset string query for unhindered filtered display
                          setSearchQuery('');
                          const el = document.getElementById('menu');
                          if (el) el.scrollIntoView({ behavior: 'smooth' });
                        }}
                        className={`w-full flex items-center justify-between p-3 rounded-xl transition-colors text-left ${selectedCategory === item.cat ? 'bg-rose-50 text-rose-600 font-bold' : 'hover:bg-stone-50 text-stone-700 font-medium'}`}
                      >
                        <span className="text-xs flex items-center gap-2.5">
                          <span className="text-base">{item.emoji}</span>
                          <span>{item.name}</span>
                        </span>
                        <ChevronRight className={`w-3.5 h-3.5 ${selectedCategory === item.cat ? 'text-rose-600' : 'text-stone-400'}`} />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Sub-specialties */}
                <div>
                  <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block mb-2 px-1">
                    Occasions & Milestones
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {['Anniversary Cakes', '1st Birthday Cakes', 'Cakes For Husband', 'Cakes For Wife', 'Cakes For Mother', 'Half Birthday Cakes'].map((tag) => (
                      <button
                        key={tag}
                        onClick={() => {
                          const slug = deriveSlug(tag);
                          setSelectedCategory(slug);
                          setIsMobileNavOpen(false);
                          setSearchQuery('');
                          const el = document.getElementById('menu');
                          if (el) el.scrollIntoView({ behavior: 'smooth' });
                        }}
                        className="bg-stone-100 hover:bg-rose-50 hover:text-rose-600 text-[11px] font-medium text-stone-700 px-3 py-1.5 rounded-lg transition-colors"
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Contact information card */}
                <div className="bg-stone-50 p-3.5 rounded-xl border border-stone-200/80 text-xs space-y-1.5">
                  <span className="font-bold text-stone-900 block">📞 Downtown Direct Assistance</span>
                  <p className="text-stone-500 text-[11px]">
                    Have bulk corporate requirements or tailored premium wedding tier blueprints? Call us 24/7.
                  </p>
                  <a href="tel:18001234567" className="text-rose-600 font-bold block pt-1 hover:underline">
                    1800-DOWNTOWN (Toll-Free)
                  </a>
                </div>

              </div>

              {/* Bottom footer sticker inside mobile slider */}
              <div className="p-3 bg-stone-50 border-t border-stone-100 text-center text-[10px] text-stone-400 font-medium">
                Downtown Bakers Mobile v2.1 • Crafted with Passion
              </div>

            </motion.div>

          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
