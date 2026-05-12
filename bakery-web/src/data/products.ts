import rawProducts from './enriched_products.json';

export interface ProductItem {
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

// Fallback images available in root directory mapped beautifully for uncompromised demo rendering
const defaultImages = [
  '/hero_cake_1778560729107.png',
  '/choco_truffle_cake_1778560769498.png',
  '/white_choco_cake_1778560786673.png',
  '/tropical_fruit_cake_1778560802560.png',
  '/butterscotch_cake_1778560821702.png',
  '/bakery_assorted_1778560745190.png'
];

export function getCleanProducts(): ProductItem[] {
  const uniqueCakesMap = new Map<string, ProductItem>();

  rawProducts.forEach((item: any, index: number) => {
    const rawTitle = (item.name || item.product_name || '').trim();
    if (!rawTitle || rawTitle.length < 4 || rawTitle.includes('dummy-image') || rawTitle === 'Know Us') return;

    // Parse title prefixes to de-duplicate core products and discover extra preview angle images
    let coreTitle = rawTitle;
    const prefixes = ['Top View of ', 'Front View of ', 'Side View of ', 'Close-up of ', 'Slice of ', 'Sliced View of ', 'Zoomed-in View of '];
    
    for (const pref of prefixes) {
      if (coreTitle.startsWith(pref)) {
        coreTitle = coreTitle.substring(pref.length).trim();
        break;
      }
    }

    if (coreTitle === 'Cake' || coreTitle.length < 4) return;

    const key = coreTitle.toLowerCase();
    let img = item.image_url;
    if (!img || img.includes('placeholder') || img.length < 5) {
      img = defaultImages[index % defaultImages.length];
    }

    if (!uniqueCakesMap.has(key)) {
      // Generate deterministic realistic pricing
      let numericPrice = 549;
      if (item.price && typeof item.price === 'string' && !item.price.includes('N/A')) {
        const parsed = parseInt(item.price.replace(/[^0-9]/g, ''), 10);
        if (!isNaN(parsed) && parsed > 0) numericPrice = parsed;
      } else {
        const hashSpread = [449, 499, 549, 599, 649, 699, 749, 799, 849, 899, 999, 1099, 1199];
        numericPrice = hashSpread[coreTitle.length % hashSpread.length];
      }

      let cat = 'cakes';
      const titleLower = coreTitle.toLowerCase();
      if (titleLower.includes('designer') || titleLower.includes('theme') || titleLower.includes('tier') || titleLower.includes('fondant') || titleLower.includes('royal')) {
        cat = 'designer';
      } else if (titleLower.includes('cookie') || titleLower.includes('biscuit') || titleLower.includes('biscoff')) {
        cat = 'cookies';
      } else if (titleLower.includes('jar') || titleLower.includes('brownie') || titleLower.includes('mousse') || titleLower.includes('cheesecake') || titleLower.includes('cupcake')) {
        cat = 'desserts';
      }

      let flavour = 'chocolate';
      if (titleLower.includes('fruit') || titleLower.includes('mango') || titleLower.includes('pineapple') || titleLower.includes('berry') || titleLower.includes('kiwi')) {
        flavour = 'fruit';
      } else if (titleLower.includes('butterscotch') || titleLower.includes('caramel') || titleLower.includes('biscoff')) {
        flavour = 'butterscotch';
      } else if (titleLower.includes('vanilla') || titleLower.includes('white') || titleLower.includes('velvet')) {
        flavour = 'vanilla';
      }

      uniqueCakesMap.set(key, {
        id: item.product_id || `prod_${uniqueCakesMap.size + 1}`,
        name: coreTitle,
        price: numericPrice,
        originalPrice: Math.round(numericPrice * 1.35),
        category: cat,
        flavour: flavour,
        isEggless: (uniqueCakesMap.size % 3 === 0) || titleLower.includes('eggless') || titleLower.includes('truffle'),
        isBestseller: uniqueCakesMap.size % 4 === 0,
        rating: (4.4 + (coreTitle.length % 6) * 0.1).toFixed(1),
        reviews: 24 + (coreTitle.length * 11) % 180,
        imageUrl: img,
        angles: [img], // start with primary image
        description: item.description || `Delight in the absolute pristine opulence of our freshly custom baked ${coreTitle}. Handcrafted using top-tier ingredients and delivered straight to your doorstep.`
      });
    } else {
      const existingProd = uniqueCakesMap.get(key)!;
      if (img && !existingProd.angles.includes(img)) {
        existingProd.angles.push(img);
      }
    }
  });

  const finalArray = Array.from(uniqueCakesMap.values());
  // Ensure we have at least standard absolute mock assets if source is completely empty
  if (finalArray.length === 0) {
    return [
      { id: '1', name: 'Royal Belgian Chocolate Truffle', price: 549, originalPrice: 799, category: 'cakes', flavour: 'chocolate', isEggless: true, isBestseller: true, rating: '4.9', reviews: 142, imageUrl: '/choco_truffle_cake_1778560769498.png', angles: ['/choco_truffle_cake_1778560769498.png', '/hero_cake_1778560729107.png'], description: 'Dark intense cocoa beans single origin baked with ultra pristine creamy truffle swirls.' },
      { id: '2', name: 'Luxe White Choco Velvet Splendor', price: 649, originalPrice: 899, category: 'designer', flavour: 'vanilla', isEggless: false, isBestseller: true, rating: '4.8', reviews: 98, imageUrl: '/white_choco_cake_1778560786673.png', angles: ['/white_choco_cake_1778560786673.png'], description: 'Elegant ivory white chocolate pearls nested flawlessly over fluffy light Madagascar sponge.' },
      { id: '3', name: 'Fresh Tropical Fruit Paradise', price: 599, originalPrice: 850, category: 'cakes', flavour: 'fruit', isEggless: true, isBestseller: false, rating: '4.7', reviews: 76, imageUrl: '/tropical_fruit_cake_1778560802560.png', angles: ['/tropical_fruit_cake_1778560802560.png'], description: 'Orchard fresh handpicked kiwis, cherries, and seasonal diced fruits infused with vanilla bean pure cream.' },
      { id: '4', name: 'Crunchy Caramel Butterscotch Bliss', price: 499, originalPrice: 700, category: 'cakes', flavour: 'butterscotch', isEggless: false, isBestseller: true, rating: '4.9', reviews: 210, imageUrl: '/butterscotch_cake_1778560821702.png', angles: ['/butterscotch_cake_1778560821702.png'], description: 'Caramelized roasted cashews embedded perfectly inside silky smooth classic golden ganache layers.' }
    ];
  }

  return finalArray;
}
