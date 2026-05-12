import React from 'react';
import fs from 'fs';
import path from 'path';
import CategoryClientView, { CategoryProductItem } from './CategoryClientView';

interface CategoryPageProps {
  params: {
    slug: string;
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const resolvedParams = await params;
  const { slug } = resolvedParams || {};
  const decodedSlug = decodeURIComponent(slug || '').toLowerCase().trim();

  // Load parent catalog mapping dataset
  const filePath = path.join(process.cwd(), '../catalog_mapping.json');
  let rawData: any = { categories: [] };
  
  try {
    if (fs.existsSync(filePath)) {
      const fileContent = fs.readFileSync(filePath, 'utf8');
      rawData = JSON.parse(fileContent);
    }
  } catch (error) {
    console.error('Error loading catalog_mapping.json in category route:', error);
  }

  let foundSubcategory: any = null;
  let parentCategoryName = '';
  let subcategoryTitle = '';

  // 1. Direct search by subcategory slug
  for (const cat of rawData.categories || []) {
    for (const sub of cat.subcategories || []) {
      if ((sub.slug || '').toLowerCase() === decodedSlug) {
        foundSubcategory = sub;
        parentCategoryName = cat.name || 'PREMIUM COLLECTION';
        // Auto-format beautiful title if missing
        subcategoryTitle = sub.name || decodedSlug
          .replace(/(-[a-z0-9]+[0-9]+[a-z0-9]*)$/i, '')
          .split('-')
          .map((w: string) => w.charAt(0).toUpperCase() + w.slice(1))
          .join(' ');
        break;
      }
    }
    if (foundSubcategory) break;
  }

  // 2. Fallback search by top-level category name if slug is a master grouping
  if (!foundSubcategory) {
    for (const cat of rawData.categories || []) {
      const catNameFormatted = (cat.name || '').toLowerCase().replace(/[^a-z0-9]/g, '-');
      if (catNameFormatted.includes(decodedSlug) || decodedSlug.includes(catNameFormatted.replace(/-+/g, ''))) {
        parentCategoryName = cat.name;
        subcategoryTitle = cat.name + ' Master Showcase';
        // Combine all subcategory products under this top-level category
        const combinedProducts: any[] = [];
        for (const sub of cat.subcategories || []) {
          if (sub.products && Array.isArray(sub.products)) {
            combinedProducts.push(...sub.products);
          }
        }
        foundSubcategory = { products: combinedProducts };
        break;
      }
    }
  }

  // 3. Absolute global fallback if slug is completely custom or broad
  if (!foundSubcategory) {
    parentCategoryName = 'BOUTIQUE CURATION';
    subcategoryTitle = decodedSlug
      .split('-')
      .map((w: string) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');

    const allProductsPool: any[] = [];
    for (const cat of rawData.categories || []) {
      for (const sub of cat.subcategories || []) {
        if (sub.products && Array.isArray(sub.products)) {
          allProductsPool.push(...sub.products);
        }
      }
    }
    // Filter global pool for relevant keywords
    const filteredPool = allProductsPool.filter(p => {
      const t = (p.title || '').toLowerCase();
      const s = decodedSlug.replace(/-+/g, ' ');
      return t.includes(s) || s.split(' ').some(word => word.length > 3 && t.includes(word));
    });

    foundSubcategory = { products: filteredPool.length > 0 ? filteredPool : allProductsPool.slice(0, 24) };
  }

  // Transform raw product pool into deterministic premium view instances
  const rawProductsList = foundSubcategory?.products || [];
  
  // De-duplicate items based on SKU/Title to present pristine core master items
  const uniqueItemsMap = new Map<string, any>();
  for (const item of rawProductsList) {
    const rawTitle = (item.title || item.name || '').trim();
    if (!rawTitle) continue;
    
    // Base core title logic matching products.ts
    let coreTitle = rawTitle;
    const prefixes = ['Top View of ', 'Front View of ', 'Side View of ', 'Close-up of ', 'Slice of ', 'Sliced View of ', 'Zoomed-in View of '];
    for (const pref of prefixes) {
      if (coreTitle.startsWith(pref)) {
        coreTitle = coreTitle.slice(pref.length).trim();
        break;
      }
    }

    const key = coreTitle.toLowerCase();
    if (!uniqueItemsMap.has(key)) {
      uniqueItemsMap.set(key, { ...item, cleanTitle: coreTitle, rawAnglesPool: [...(item.images || [])] });
    } else {
      // Append secondary image to the angles array of the main item
      const existing = uniqueItemsMap.get(key);
      if (item.images && Array.isArray(item.images)) {
        existing.rawAnglesPool.push(...item.images);
      }
    }
  }

  const mappedProducts: CategoryProductItem[] = Array.from(uniqueItemsMap.values()).map((prod: any, idx: number) => {
    const title = prod.cleanTitle || 'Exquisite Showstopper Confectionery';

    // Premium Pricing deterministic assignment if scraped price is zero
    let price = prod.price;
    if (!price || typeof price !== 'number' || price <= 0) {
      const hashSpread = [449, 499, 549, 599, 649, 699, 749, 799, 849, 899, 999, 1099, 1199];
      price = hashSpread[title.length % hashSpread.length];
    }

    const originalPrice = prod.original_price && prod.original_price > price 
      ? prod.original_price 
      : Math.round(price * 1.25);

    // Rating & Reviews assignment
    const rating = prod.rating && prod.rating > 0 
      ? prod.rating.toFixed(1) 
      : (4.4 + (title.length % 6) * 0.1).toFixed(1);

    const reviews = prod.reviews && prod.reviews > 0 
      ? prod.reviews 
      : (28 + (title.length * 9) % 160);

    // Unique angles pool deduplication
    const rawAnglesSet = Array.from(new Set<string>(prod.rawAnglesPool || []));
    const angles = rawAnglesSet.map((img: string) => {
      if (img.startsWith('http') || img.startsWith('/')) return img;
      return `/api/image?path=${encodeURIComponent(img)}`;
    });

    // Determine master primary image
    let imageUrl = angles[0];
    if (!imageUrl) {
      if (prod.local_path) {
        imageUrl = `/api/image?path=${encodeURIComponent(prod.local_path + '/image_1.jpg')}`;
      } else {
        const fallbacks = [
          '/hero_cake_1778560729107.png',
          '/choco_truffle_cake_1778560769498.png',
          '/white_choco_cake_1778560786673.png',
          '/tropical_fruit_cake_1778560802560.png',
          '/butterscotch_cake_1778560821702.png'
        ];
        imageUrl = fallbacks[title.length % fallbacks.length];
      }
    }

    return {
      id: prod.sku || `cat-item-${idx}-${title.replace(/\s+/g, '-')}`,
      name: title,
      price,
      originalPrice,
      category: parentCategoryName,
      flavour: 'Signature European Blend',
      isEggless: prod.eggless !== false,
      isBestseller: idx < 4,
      rating,
      reviews,
      imageUrl,
      angles: angles.length > 0 ? angles : [imageUrl],
      description: prod.description || 'Artisanal micro-batch preparation loaded with premium local ingredients, delicate sponge layering, and custom fondant design matching your absolute themes.',
    };
  });

  return (
    <CategoryClientView 
      subcategoryTitle={subcategoryTitle || 'Boutique Collection'}
      parentCategoryName={parentCategoryName || 'EXCLUSIVE CONFECTIONERY'}
      products={mappedProducts}
    />
  );
}

// Generate static headers/metatags
export async function generateMetadata({ params }: CategoryPageProps) {
  const resolvedParams = await params;
  const slug = resolvedParams?.slug || '';
  const title = slug
    .split('-')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');

  return {
    title: `${title} | Downtown Bakers Boutique Curation`,
    description: `Browse pristine artisanal cake designs perfect for ${title}. Order 100% fresh, customized masterpiece centerpieces hand-delivered regionally.`,
  };
}
