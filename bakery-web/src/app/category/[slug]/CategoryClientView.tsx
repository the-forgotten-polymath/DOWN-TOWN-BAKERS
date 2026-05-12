"use client";

import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShoppingBag, Search, MapPin, Heart, Star, Sparkles, X, Check, 
  ChevronRight, Cake, Award, Truck, ShieldCheck, Flame, ArrowLeft
} from 'lucide-react';
import { useRouter } from 'next/navigation';

export interface CategoryProductItem {
  id: string;
  name: string;
  price: number;
  originalPrice: number;
  category: string;
  flavour: string;
  isEggless: boolean;
  isBestseller: boolean;
  rating: string;
  reviews: number;
  imageUrl: string;
  angles: string[];
  description: string;
}

interface CategoryClientViewProps {
  subcategoryTitle: string;
  parentCategoryName: string;
  products: CategoryProductItem[];
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
          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500 max-h-52 absolute inset-0 m-auto"
        />
      </AnimatePresence>
      {angles.length > 1 && (
        <div className="absolute bottom-1 right-2 flex items-center gap-1 z-10 bg-stone-900/40 backdrop-blur-xs px-1.5 py-0.5 rounded-full">
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

export default function CategoryClientView({ 
  subcategoryTitle, 
  parentCategoryName, 
  products 
}: CategoryClientViewProps) {
  const router = useRouter();

  // Toast State
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Filter & Sort States
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isEgglessOnly, setIsEgglessOnly] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<string>('popularity');

  // Product Customizer Modal / Overlay States
  const [activePdpProduct, setActivePdpProduct] = useState<CategoryProductItem | null>(null);
  const [pdpMainAngleIndex, setPdpMainAngleIndex] = useState<number>(0);
  const [pdpSelectedWeight, setPdpSelectedWeight] = useState<{ label: string; mult: number }>({ label: '0.5 Kg', mult: 1 });
  const [pdpIsEggless, setPdpIsEggless] = useState<boolean>(true);
  const [pdpCustomMessage, setPdpCustomMessage] = useState<string>('');
  const [pdpPincode, setPdpPincode] = useState<string>('');
  const [pdpPincodeStatus, setPdpPincodeStatus] = useState<string | null>(null);

  // Fallback image handlers
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>, fallback: string) => {
    e.currentTarget.src = fallback;
  };

  // Session Cart simulation synced visually
  const [sessionCartCount, setSessionCartCount] = useState<number>(2);

  // Compute filtered & sorted products
  const finalProducts = useMemo(() => {
    let result = [...products];

    // Query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(p => 
        p.name.toLowerCase().includes(q) || 
        p.description.toLowerCase().includes(q)
      );
    }

    // Eggless filter
    if (isEgglessOnly) {
      result = result.filter(p => p.isEggless);
    }

    // Sort
    if (sortBy === 'price-low') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating') {
      result.sort((a, b) => parseFloat(b.rating) - parseFloat(a.rating));
    }

    return result;
  }, [products, searchQuery, isEgglessOnly, sortBy]);

  // Handle open customizer modal
  const openCustomizer = (product: CategoryProductItem) => {
    setActivePdpProduct(product);
    setPdpMainAngleIndex(0);
    setPdpSelectedWeight({ label: '0.5 Kg', mult: 1 });
    setPdpIsEggless(product.isEggless);
    setPdpCustomMessage('');
    setPdpPincode('');
    setPdpPincodeStatus(null);
  };

  // Handle add to cart inside Customizer Modal
  const handleAddToCart = () => {
    if (!activePdpProduct) return;
    setSessionCartCount(prev => prev + 1);
    triggerToast(`Added customized ${activePdpProduct.name} to Box!`);
    setActivePdpProduct(null);
  };

  // Calculate current PDP customizer customized summary pricing
  const pdpCalculatedPrice = useMemo(() => {
    if (!activePdpProduct) return 0;
    let base = activePdpProduct.price * pdpSelectedWeight.mult;
    if (pdpIsEggless && !activePdpProduct.isEggless) {
      base += 50; // extra pure veg processing fee
    }
    return Math.round(base);
  }, [activePdpProduct, pdpSelectedWeight, pdpIsEggless]);

  return (
    <div className="min-h-screen bg-stone-50 font-sans pb-20">
      
      {/* GLOBAL TOAST BANNER */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div 
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            className="fixed top-5 left-1/2 -translate-x-1/2 z-50 bg-stone-900 text-white px-5 py-3 rounded-full shadow-2xl flex items-center gap-2.5 border border-stone-700 text-xs sm:text-sm font-bold backdrop-blur-md"
          >
            <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* TOP HEADER */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-4">
          
          {/* Back button & Brand Identity */}
          <div className="flex items-center gap-3 sm:gap-4">
            <button 
              onClick={() => router.push('/')}
              className="p-2 rounded-full hover:bg-stone-100 transition-colors text-stone-700 flex items-center justify-center group"
              aria-label="Go back to Home Showcase"
            >
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" />
            </button>

            <div onClick={() => router.push('/')} className="cursor-pointer flex flex-col items-start">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="text-xl sm:text-2xl font-black text-[#dc2626] tracking-tighter font-playfair drop-shadow-xs">
                  Downtown
                </span>
                <span className="text-xs sm:text-sm bg-[#dc2626] text-white px-2 py-0.5 rounded font-black tracking-widest uppercase italic">
                  Bakers
                </span>
              </div>
              <span className="text-[9px] text-stone-400 font-bold uppercase tracking-widest hidden sm:block mt-[-2px]">
                Artisanal Showstoppers
              </span>
            </div>
          </div>

          {/* Quick Context Title on large screens */}
          <div className="hidden md:flex items-center gap-2 text-xs font-bold text-stone-400">
            <span>Home</span>
            <ChevronRight className="w-3 h-3" />
            <span>{parentCategoryName}</span>
            <ChevronRight className="w-3 h-3" />
            <span className="text-[#dc2626]">{subcategoryTitle}</span>
          </div>

          {/* Right Action Icons */}
          <div className="flex items-center gap-3">
            <button 
              onClick={() => router.push('/')} 
              className="relative p-2 rounded-full bg-stone-50 hover:bg-stone-100 text-stone-700 transition-colors"
              aria-label="View Shopping Basket"
            >
              <ShoppingBag className="w-5 h-5 text-stone-800" />
              {sessionCartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#dc2626] text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-black animate-pulse">
                  {sessionCartCount}
                </span>
              )}
            </button>
          </div>

        </div>
      </header>

      {/* HERO SECTION BANNER */}
      <section className="relative bg-gradient-to-r from-rose-600 via-[#dc2626] to-red-800 text-white py-12 px-4 sm:px-6 lg:px-8 overflow-hidden shadow-inner">
        {/* Soft background glow circles */}
        <div className="absolute -right-10 -top-20 w-80 h-80 rounded-full bg-rose-400/20 blur-3xl pointer-events-none" />
        <div className="absolute -left-10 -bottom-20 w-80 h-80 rounded-full bg-amber-400/20 blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <span className="bg-white/20 backdrop-blur-xs text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full text-rose-100 inline-block mb-3">
              {parentCategoryName} MILIEU
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black font-playfair tracking-tight drop-shadow-sm">
              {subcategoryTitle}
            </h1>
            <p className="text-xs sm:text-sm text-rose-100 mt-2 font-medium max-w-xl">
              Freshly indexed boutique confectionery designs handcrafted to match your magnificent themes. Loaded directly from live workspace indexes.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 text-center shrink-0 w-full sm:w-auto">
            <span className="text-2xl sm:text-3xl font-black block text-amber-300 drop-shadow-xs">
              {products.length}
            </span>
            <span className="text-[10px] font-extrabold text-rose-100 uppercase tracking-widest block mt-0.5">
              Available Designs
            </span>
          </div>
        </div>
      </section>

      {/* FILTERS & SORTING RIBBON */}
      <section className="bg-white border-b border-stone-200 sticky top-16 sm:top-20 z-30 shadow-xs py-3 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          
          {/* Left search inputs */}
          <div className="flex items-center gap-2 flex-1 min-w-[220px]">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
              <input 
                type="text" 
                placeholder="Search specific cake name or theme..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-1.5 bg-stone-50 border border-stone-200 rounded-xl text-xs font-semibold text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all"
              />
            </div>

            {/* Pure Veg Switch */}
            <button
              onClick={() => {
                setIsEgglessOnly(!isEgglessOnly);
                triggerToast(isEgglessOnly ? 'Showing all preparations' : 'Filtered 100% Pure Veg preparations');
              }}
              className={`px-3 py-1.5 rounded-xl border text-xs font-extrabold flex items-center gap-1.5 transition-all shrink-0 ${isEgglessOnly ? 'bg-emerald-50 border-emerald-300 text-emerald-700 shadow-2xs' : 'bg-stone-50 border-stone-200 text-stone-600 hover:bg-stone-100'}`}
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span>Pure Veg Only</span>
            </button>
          </div>

          {/* Right Sorting parameter selector */}
          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <span className="text-xs text-stone-400 font-bold tracking-wider uppercase hidden sm:inline">
              Sort By:
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-stone-50 border border-stone-200 rounded-xl px-3 py-1.5 text-xs font-bold text-stone-700 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all cursor-pointer"
            >
              <option value="popularity">🔥 High Popularity</option>
              <option value="price-low">💰 Price: Low to High</option>
              <option value="price-high">💎 Price: High to Low</option>
              <option value="rating">★ Highest Ratings</option>
            </select>
          </div>

        </div>
      </section>

      {/* PRODUCTS DISPLAY GRID STAGE */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        
        {finalProducts.length === 0 ? (
          <div className="bg-white rounded-3xl border border-stone-200 p-12 text-center max-w-lg mx-auto shadow-xs my-12">
            <div className="w-16 h-16 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-4 text-rose-500">
              <Cake className="w-8 h-8" />
            </div>
            <h3 className="font-playfair text-xl font-bold text-stone-900">
              No specific matching designs found
            </h3>
            <p className="text-xs text-stone-500 mt-2 leading-relaxed">
              Try adjusting your active search keyword or clear the "Pure Veg Only" filter to browse all discovered custom angles.
            </p>
            <button
              onClick={() => { setSearchQuery(''); setIsEgglessOnly(false); }}
              className="mt-5 px-4 py-2 bg-[#dc2626] text-white rounded-xl text-xs font-bold hover:bg-red-700 transition-colors"
            >
              Reset Search Parameters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {finalProducts.map((product) => (
              <motion.div
                key={product.id}
                layout
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-2xl border border-stone-200/80 shadow-xs overflow-hidden hover:shadow-xl hover:border-rose-200 transition-all duration-300 flex flex-col group relative"
              >
                {/* Absolute overlay labels */}
                <div className="absolute top-2 left-2 z-10 flex flex-col gap-1">
                  {product.isBestseller && (
                    <span className="bg-amber-400 text-stone-900 text-[9px] font-black uppercase px-2 py-0.5 rounded shadow-xs tracking-wider">
                      ★ Bestseller
                    </span>
                  )}
                  {product.isEggless && (
                    <span className="bg-emerald-600 text-white text-[9px] font-black uppercase px-2 py-0.5 rounded shadow-xs tracking-wider">
                      Pure Veg
                    </span>
                  )}
                </div>

                {/* Primary Image preview window */}
                <div 
                  onClick={() => openCustomizer(product)}
                  className="relative aspect-square w-full overflow-hidden bg-stone-50 cursor-pointer p-2 flex items-center justify-center"
                >
                  <AutoScrollImageGallery 
                    angles={product.angles} 
                    alt={product.name} 
                    fallback="/choco_truffle_cake_1778560769498.png" 
                  />
                  {product.angles.length > 1 && (
                    <div className="absolute bottom-2 left-2 bg-stone-900/60 backdrop-blur-xs text-white text-[8px] font-black px-1.5 py-0.5 rounded z-10 pointer-events-none">
                      +{product.angles.length - 1} Angles
                    </div>
                  )}
                </div>

                {/* Details context envelope */}
                <div className="p-4 flex-1 flex flex-col justify-between border-t border-stone-100">
                  <div>
                    <span className="text-[9px] font-extrabold text-[#dc2626] uppercase tracking-widest block mb-1">
                      {product.category.replace('_', ' ')}
                    </span>
                    <h3 
                      onClick={() => openCustomizer(product)}
                      className="font-playfair text-xs sm:text-sm font-bold text-stone-900 group-hover:text-[#dc2626] transition-colors leading-snug cursor-pointer line-clamp-2"
                    >
                      {product.name}
                    </h3>

                    {/* Review stars indicators */}
                    <div className="flex items-center gap-1.5 mt-2.5">
                      <div className="flex items-center text-amber-400">
                        <Star className="w-3.5 h-3.5 fill-amber-400" />
                        <span className="text-xs font-extrabold text-stone-800 ml-1">
                          {product.rating}
                        </span>
                      </div>
                      <span className="text-[10px] text-stone-400 font-semibold">
                        ({product.reviews})
                      </span>
                    </div>
                  </div>

                  {/* Pricing row & Action trigger */}
                  <div className="mt-4 pt-3 border-t border-stone-100/80 flex items-center justify-between gap-1">
                    <div>
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-sm sm:text-base font-black text-stone-900">
                          ₹{product.price}
                        </span>
                        {product.originalPrice > product.price && (
                          <span className="text-xs text-stone-400 line-through font-semibold">
                            ₹{product.originalPrice}
                          </span>
                        )}
                      </div>
                      {product.originalPrice > product.price && (
                        <span className="text-[9px] text-emerald-600 font-extrabold tracking-tight block mt-[-2px]">
                          Save ₹{product.originalPrice - product.price}
                        </span>
                      )}
                    </div>

                    <button
                      onClick={() => openCustomizer(product)}
                      className="px-3 py-1.5 bg-rose-50 hover:bg-[#dc2626] text-[#dc2626] hover:text-white rounded-xl text-xs font-bold transition-all duration-300 flex items-center gap-1 group/btn shrink-0"
                    >
                      <span>Customize</span>
                      <ChevronRight className="w-3 h-3 group-hover/btn:translate-x-0.5 transition-transform" />
                    </button>
                  </div>

                </div>

              </motion.div>
            ))}
          </div>
        )}

      </main>

      {/* ======================================================================= */}
      {/* MAGNIFICENT DEDICATED PRODUCT CUSTOMIZER MODAL OVERLAY */}
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
                        <span className="text-xs block font-bold">Standard Egg Base</span>
                        <span className="text-[9px] text-stone-400 font-normal">Classic Master Texture</span>
                      </div>
                    </button>
                  </div>
                </div>

                {/* Option Group 3: Complimentary Icing inscription */}
                <div>
                  <label className="text-xs font-bold text-stone-700 uppercase tracking-wider block mb-1">
                    3. Complimentary Fondant Inscription
                  </label>
                  <input 
                    type="text" 
                    placeholder="e.g. Happy Birthday Sparky!" 
                    value={pdpCustomMessage}
                    onChange={(e) => setPdpCustomMessage(e.target.value)}
                    maxLength={32}
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
                  />
                  <span className="text-[9px] text-stone-400 block text-right mt-1">
                    {32 - pdpCustomMessage.length} characters remaining
                  </span>
                </div>

                {/* Local Hyper-Delivery Verification validation block */}
                <div className="bg-stone-50 p-3 rounded-xl border border-stone-200/80">
                  <span className="text-[10px] font-black text-stone-700 uppercase tracking-wider block mb-1.5 flex items-center gap-1">
                    <Truck className="w-3.5 h-3.5 text-[#dc2626]" />
                    <span>Check Boutique Transit Eligibility</span>
                  </span>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      placeholder="Enter 6-digit PIN" 
                      value={pdpPincode}
                      onChange={(e) => {
                        setPdpPincode(e.target.value.replace(/\D/g, '').slice(0, 6));
                        setPdpPincodeStatus(null);
                      }}
                      className="flex-1 px-2.5 py-1.5 bg-white border border-stone-200 rounded-lg text-xs font-bold tracking-widest text-center"
                    />
                    <button
                      onClick={() => {
                        if (pdpPincode.length === 6) {
                          setPdpPincodeStatus('Available for express 2-hour white glove hand-delivery.');
                        } else {
                          setPdpPincodeStatus('Please enter a valid 6-digit code.');
                        }
                      }}
                      className="px-3 py-1 bg-stone-800 hover:bg-stone-900 text-white rounded-lg text-xs font-bold"
                    >
                      Verify
                    </button>
                  </div>
                  {pdpPincodeStatus && (
                    <p className={`text-[10px] font-bold mt-2 ${pdpPincodeStatus.includes('Available') ? 'text-emerald-600' : 'text-rose-600'}`}>
                      {pdpPincodeStatus}
                    </p>
                  )}
                </div>

                {/* Final Add to Cart Trigger Footer */}
                <div className="pt-4 border-t border-stone-200/80 flex items-center justify-between gap-4">
                  <div>
                    <span className="text-[10px] text-stone-400 uppercase tracking-widest block font-bold">
                      Customized Final Outlay
                    </span>
                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl font-black text-stone-900 font-playfair">
                        ₹{pdpCalculatedPrice}
                      </span>
                      {pdpIsEggless && !activePdpProduct.isEggless && (
                        <span className="text-[9px] text-emerald-600 font-bold block">
                          (+₹50 Pure Veg fee included)
                        </span>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={handleAddToCart}
                    className="flex-1 py-3 bg-[#dc2626] hover:bg-red-700 text-white rounded-xl text-xs sm:text-sm font-black tracking-wider uppercase shadow-md hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>Add Handcrafted Showstopper</span>
                  </button>
                </div>

              </div>

            </motion.div>

          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
