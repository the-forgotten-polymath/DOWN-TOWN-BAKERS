document.addEventListener('DOMContentLoaded', () => {
  // --- DOM Elements Cache ---
  const navbar = document.getElementById('navbar');
  const productsGrid = document.getElementById('productsGrid');
  const catalogCountEl = document.getElementById('catalogCount');
  const activeFiltersContainer = document.getElementById('activeFiltersContainer');
  const cartCountEl = document.getElementById('cartCount');
  const cartToast = document.getElementById('cartToast');
  const scrollTopBtn = document.getElementById('scrollTop');

  // Filter dropdowns
  const filterCategory = document.getElementById('filterCategory');
  const filterFlavour = document.getElementById('filterFlavour');
  const filterType = document.getElementById('filterType');
  const sortOption = document.getElementById('sortOption');

  // Side Cart Drawer elements
  const sideCartOverlay = document.getElementById('sideCartOverlay');
  const sideCartDrawer = document.getElementById('sideCartDrawer');
  const closeCartBtn = document.getElementById('closeCartBtn');
  const cartDrawerItemsContainer = document.getElementById('cartDrawerItemsContainer');
  const cartSubtotalEl = document.getElementById('cartSubtotal');
  const cartExtraFeesEl = document.getElementById('cartExtraFees');
  const cartDiscountEl = document.getElementById('cartDiscount');
  const cartTotalPayableEl = document.getElementById('cartTotalPayable');
  const discountLineRow = document.getElementById('discountLineRow');
  const couponInput = document.getElementById('couponInput');
  const applyCouponBtn = document.getElementById('applyCouponBtn');
  const couponMsg = document.getElementById('couponMsg');
  const proceedCheckoutBtn = document.getElementById('proceedCheckoutBtn');

  // PDP Modal Elements
  const pdpModalOverlay = document.getElementById('pdpModalOverlay');
  const pdpModalContainer = document.getElementById('pdpModalContainer');
  const pdpCloseBtn = document.getElementById('pdpCloseBtn');
  const pdpMainImage = document.getElementById('pdpMainImage');
  const pdpThumbnailsTrack = document.getElementById('pdpThumbnailsTrack');
  const pdpCategoryTag = document.getElementById('pdpCategoryTag');
  const pdpTitle = document.getElementById('pdpTitle');
  const pdpCurrentPrice = document.getElementById('pdpCurrentPrice');
  const pdpOriginalPrice = document.getElementById('pdpOriginalPrice');
  const pdpRatingNum = document.getElementById('pdpRatingNum');
  const pdpVegBadge = document.getElementById('pdpVegBadge');
  const pdpPincodeInput = document.getElementById('pdpPincodeInput');
  const pdpCheckPinBtn = document.getElementById('pdpCheckPinBtn');
  const pdpPincodeStatus = document.getElementById('pdpPincodeStatus');
  const pdpWeightSelector = document.getElementById('pdpWeightSelector');
  const pdpCakeMessage = document.getElementById('pdpCakeMessage');
  const pdpBuyNowBtn = document.getElementById('pdpBuyNowBtn');
  const pdpAddToCartBtn = document.getElementById('pdpAddToCartBtn');
  const pdpDescText = document.getElementById('pdpDescText');

  // Checkout Modal Elements
  const checkoutModalOverlay = document.getElementById('checkoutModalOverlay');
  const checkoutModalContainer = document.getElementById('checkoutModalContainer');
  const checkoutCloseBtn = document.getElementById('checkoutCloseBtn');
  const finalGatewayAmount = document.getElementById('finalGatewayAmount');

  // --- App Global State ---
  let productsData = [];
  let filteredProducts = [];
  let cart = [];
  let activeCustomizerProduct = null;
  let customizerState = {
    basePrice: 0,
    weightMultiplier: 1,
    weightLabel: '0.5 Kg',
    isEggless: false,
    egglessFee: 50,
    addonsCost: 0,
    selectedAddons: [],
    message: ''
  };
  let appliedDiscountPercent = 0;
  let selectedSlotFee = 0;

  // --- Initialize App ---
  init();

  async function init() {
    setupScrollEffects();
    setupCitySelector();
    setupCartDrawerTriggers();
    setupCheckoutJourneyFlow();
    await fetchAndPrepareProducts();
    setupFiltersLogic();
    renderProductsGrid();
    setupCategoryBannersNavigation();
    setupNewsletter();
  }

  function setupCitySelector() {
    const selectedCityEl = document.getElementById('selectedCity');
    const options = document.querySelectorAll('.city-option');
    options.forEach(opt => {
      opt.addEventListener('click', (e) => {
        e.stopPropagation();
        options.forEach(o => o.classList.remove('active'));
        opt.classList.add('active');
        if (selectedCityEl) {
          selectedCityEl.textContent = opt.textContent.trim();
        }
        showToast(`📍 Delivery coverage optimized for ${opt.textContent.replace('Deliver to ', '')}`);
      });
    });
  }

  // --- 1. Fetch & Transform Dataset ---
  async function fetchAndPrepareProducts() {
    try {
      const res = await fetch('enriched_products.json');
      if (!res.ok) throw new Error('Failed to load dataset');
      const rawData = await res.json();

      // Fallback arrays for mapping beautiful visuals and parameters
      const defaultImages = [
        'hero_cake_1778560729107.png',
        'choco_truffle_cake_1778560769498.png',
        'white_choco_cake_1778560786673.png',
        'tropical_fruit_cake_1778560802560.png',
        'butterscotch_cake_1778560821702.png',
        'bakery_assorted_1778560745190.png'
      ];

      const uniqueCakesMap = new Map();

      rawData.forEach((item, index) => {
        const rawTitle = (item.name || item.product_name || '').trim();
        if (!rawTitle || rawTitle.length < 4 || rawTitle.includes('dummy-image') || rawTitle === 'Know Us') return;

        // Parse title prefixes to de-duplicate core products and discover extra preview angle images
        let coreTitle = rawTitle;
        const prefixes = ['Top View of ', 'Front View of ', 'Side View of ', 'Close-up of ', 'Slice of '];
        
        for (const pref of prefixes) {
          if (coreTitle.startsWith(pref)) {
            coreTitle = coreTitle.substring(pref.length).trim();
            break;
          }
        }

        // If coreTitle is just "Cake" or generic, skip unless we need unique entry representation
        if (coreTitle === 'Cake' || coreTitle.length < 4) return;

        const key = coreTitle.toLowerCase();
        let img = item.image_url;
        if (!img || img.includes('placeholder') || img.length < 5) {
          img = defaultImages[index % defaultImages.length];
        }

        if (!uniqueCakesMap.has(key)) {
          // Generate deterministic realistic pricing
          let numericPrice = 499;
          if (item.price && typeof item.price === 'string' && !item.price.includes('N/A')) {
            const parsed = parseInt(item.price.replace(/[^0-9]/g, ''), 10);
            if (!isNaN(parsed) && parsed > 0) numericPrice = parsed;
          } else {
            // Elegant spread based on title hash length
            const hashSpread = [449, 499, 549, 599, 649, 699, 749, 799, 849, 899, 999, 1099, 1199];
            numericPrice = hashSpread[coreTitle.length % hashSpread.length];
          }

          let cat = 'cakes';
          const titleLower = coreTitle.toLowerCase();
          if (titleLower.includes('designer') || titleLower.includes('tier') || titleLower.includes('fondant') || titleLower.includes('royal')) {
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
            originalPrice: Math.round(numericPrice * 1.4),
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
          // If we found a matching secondary angle record, push its image beautifully into the master product's angles array
          const existingProd = uniqueCakesMap.get(key);
          if (img && !existingProd.angles.includes(img)) {
            existingProd.angles.push(img);
          }
        }
      });

      productsData = Array.from(uniqueCakesMap.values());
      filteredProducts = [...productsData];
    } catch (err) {
      console.warn('Using standard premium backup dataset due to offline environment:', err);
      // Hardcoded premium objects to guarantee zero UI blank gaps
      productsData = [
        { id: '1', name: 'Royal Belgian Chocolate Truffle', price: 549, originalPrice: 799, category: 'cakes', flavour: 'chocolate', isEggless: true, isBestseller: true, rating: '4.9', reviews: 142, imageUrl: 'choco_truffle_cake_1778560769498.png', angles: ['choco_truffle_cake_1778560769498.png', 'hero_cake_1778560729107.png'], description: 'Dark intense cocoa beans single origin baked with ultra pristine creamy truffle swirls.' },
        { id: '2', name: 'Luxe White Choco Velvet Splendor', price: 649, originalPrice: 899, category: 'designer', flavour: 'vanilla', isEggless: false, isBestseller: true, rating: '4.8', reviews: 98, imageUrl: 'white_choco_cake_1778560786673.png', angles: ['white_choco_cake_1778560786673.png'], description: 'Elegant ivory white chocolate pearls nested flawlessly over fluffy light Madagascar sponge.' },
        { id: '3', name: 'Fresh Tropical Fruit Paradise Paradise', price: 599, originalPrice: 850, category: 'cakes', flavour: 'fruit', isEggless: true, isBestseller: false, rating: '4.7', reviews: 76, imageUrl: 'tropical_fruit_cake_1778560802560.png', angles: ['tropical_fruit_cake_1778560802560.png'], description: 'Orchard fresh handpicked kiwis, cherries, and seasonal diced fruits infused with vanilla bean pure cream.' },
        { id: '4', name: 'Crunchy Caramel Butterscotch Bliss', price: 499, originalPrice: 700, category: 'cakes', flavour: 'butterscotch', isEggless: false, isBestseller: true, rating: '4.9', reviews: 210, imageUrl: 'butterscotch_cake_1778560821702.png', angles: ['butterscotch_cake_1778560821702.png'], description: 'Caramelized roasted cashews embedded perfectly inside silky smooth classic golden ganache layers.' },
        { id: '5', name: 'Signature Handcrafted Berry Bliss Splendor', price: 749, originalPrice: 1099, category: 'designer', flavour: 'fruit', isEggless: true, isBestseller: true, rating: '4.9', reviews: 310, imageUrl: 'hero_cake_1778560729107.png', angles: ['hero_cake_1778560729107.png'], description: 'Lavish premium ruby chocolate shards layered elegantly with freshly harvested wild blueberries.' },
        { id: '6', name: 'Assorted Gourmet Cookie Tin Collection', price: 349, originalPrice: 499, category: 'cookies', flavour: 'chocolate', isEggless: true, isBestseller: false, rating: '4.6', reviews: 45, imageUrl: 'bakery_assorted_1778560745190.png', angles: ['bakery_assorted_1778560745190.png'], description: 'Crunchy rich double loaded chocolate chunk and salted caramel melt-in-mouth specialty handcrafted cookies.' }
      ];
      filteredProducts = [...productsData];
    }
  }

  // --- 2. Live Filters & Sorting Engine ---
  function setupFiltersLogic() {
    const applyFilters = () => {
      const catVal = filterCategory.value;
      const flavVal = filterFlavour.value;
      const typeVal = filterType.value;
      const sortVal = sortOption.value;

      filteredProducts = productsData.filter(p => {
        if (catVal !== 'all' && p.category !== catVal) return false;
        if (flavVal !== 'all' && p.flavour !== flavVal) return false;
        if (typeVal === 'eggless' && !p.isEggless) return false;
        if (typeVal === 'bestseller' && !p.isBestseller) return false;
        return true;
      });

      // Sorting
      if (sortVal === 'price-low') {
        filteredProducts.sort((a, b) => a.price - b.price);
      } else if (sortVal === 'price-high') {
        filteredProducts.sort((a, b) => b.price - a.price);
      } else if (sortVal === 'rating') {
        filteredProducts.sort((a, b) => parseFloat(b.rating) - parseFloat(a.rating));
      } else {
        // default popularity tracking
        filteredProducts.sort((a, b) => b.reviews - a.reviews);
      }

      renderProductsGrid();
      updateActiveFilterPills(catVal, flavVal, typeVal);
    };

    filterCategory.addEventListener('change', applyFilters);
    filterFlavour.addEventListener('change', applyFilters);
    filterType.addEventListener('change', applyFilters);
    sortOption.addEventListener('change', applyFilters);

    // Support trigger coming from inline footer category buttons
    document.querySelectorAll('.footer-col a[data-filter]').forEach(link => {
      link.addEventListener('click', (e) => {
        const tgtCat = link.getAttribute('data-filter');
        filterCategory.value = tgtCat;
        applyFilters();
      });
    });
  }

  function updateActiveFilterPills(cat, flav, type) {
    activeFiltersContainer.innerHTML = '';
    let hasFilters = false;

    const createPill = (text, resetCallback) => {
      hasFilters = true;
      const pill = document.createElement('div');
      pill.className = 'filter-pill';
      pill.innerHTML = `<span>${text}</span><button aria-label="Remove filter">&times;</button>`;
      pill.querySelector('button').addEventListener('click', resetCallback);
      activeFiltersContainer.appendChild(pill);
    };

    if (cat !== 'all') {
      createPill(`Category: ${filterCategory.options[filterCategory.selectedIndex].text}`, () => {
        filterCategory.value = 'all';
        filterCategory.dispatchEvent(new Event('change'));
      });
    }
    if (flav !== 'all') {
      createPill(`Flavour: ${filterFlavour.options[filterFlavour.selectedIndex].text}`, () => {
        filterFlavour.value = 'all';
        filterFlavour.dispatchEvent(new Event('change'));
      });
    }
    if (type !== 'all') {
      createPill(`Type: ${filterType.options[filterType.selectedIndex].text}`, () => {
        filterType.value = 'all';
        filterType.dispatchEvent(new Event('change'));
      });
    }

    // Add clear all command link if multiple items exist
    if (hasFilters) {
      const clearAll = document.createElement('button');
      clearAll.className = 'btn-ghost btn-xs';
      clearAll.style.padding = '0.2rem 0.6rem';
      clearAll.textContent = 'Clear All';
      clearAll.addEventListener('click', () => {
        filterCategory.value = 'all';
        filterFlavour.value = 'all';
        filterType.value = 'all';
        filterCategory.dispatchEvent(new Event('change'));
      });
      activeFiltersContainer.appendChild(clearAll);
    }
  }

  // --- 3. Render Catalog Layout with Framer Motion Observers ---
  function renderProductsGrid() {
    productsGrid.innerHTML = '';
    catalogCountEl.textContent = `Showing ${filteredProducts.length} premium creations`;

    if (filteredProducts.length === 0) {
      productsGrid.innerHTML = `
        <div class="loading-state" style="padding: 3rem 1rem;">
          <span style="font-size: 3rem; display:block; margin-bottom:1rem;">🧑‍🍳</span>
          <h3>No treats match your refined criteria</h3>
          <p style="color:var(--text-muted); margin-top:0.5rem;">Try clearing individual tags or category selection above</p>
        </div>
      `;
      return;
    }

    // Setup state-of-the-art IntersectionObserver for Framer Motion entry spring physics
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const cardEl = entry.target;
          // Trigger entry transitions smoothly with customized spring physics
          setTimeout(() => {
            cardEl.classList.add('in-view');
          }, parseInt(cardEl.style.getPropertyValue('--stagger-delay') || 0, 10));
          obs.unobserve(cardEl);
        }
      });
    }, { threshold: 0.05 });

    filteredProducts.forEach((prod, i) => {
      const card = document.createElement('div');
      card.className = 'product-card';
      // Inline column stagger computation for elite Framer Motion experience
      const staggerDelay = (i % 4) * 50;
      card.style.setProperty('--stagger-delay', `${staggerDelay}ms`);
      
      let badgesHtml = '';
      if (prod.isBestseller) badgesHtml += `<span class="pdp-badge bestseller">🔥 Premium Bestseller</span>`;
      if (prod.isEggless) badgesHtml += `<span class="pdp-badge veg" style="top:${prod.isBestseller ? '40px' : '12px'}">🟢 100% Eggless</span>`;

      // Safe image loading handler ensuring offline layout beauty
      const safeFallback = "this.onerror=null; this.src='choco_truffle_cake_1778560769498.png';";

      card.innerHTML = `
        ${badgesHtml}
        <button class="wishlist-heart" aria-label="Wishlist">♡</button>
        <div class="product-img-wrap" style="cursor: pointer;">
          <img src="${prod.imageUrl}" alt="${prod.name}" loading="lazy" onerror="${safeFallback}" />
          <div class="product-overlay">
            <button class="quick-view-btn" data-id="${prod.id}">Customize &amp; Order</button>
          </div>
        </div>
        <div class="product-info">
          <span style="font-size:0.75rem; color:var(--text-muted); text-transform:uppercase; font-weight:700;">${prod.category}</span>
          <h3 style="cursor: pointer;" class="card-title-link" data-id="${prod.id}">${prod.name}</h3>
          <div class="stars">★★★★★ <span>${prod.rating}</span> <span style="font-size:0.7rem; color:var(--text-muted);">(${prod.reviews})</span></div>
          <div class="price-row">
            <span class="price">₹${prod.price}</span>
            <span class="original">₹${prod.originalPrice}</span>
            <button class="add-cart-btn" data-id="${prod.id}" aria-label="Add to cart">🛒</button>
          </div>
        </div>
      `;

      // Event bindings
      card.querySelector('.wishlist-heart').addEventListener('click', (e) => {
        e.stopPropagation();
        const heart = e.currentTarget;
        heart.classList.toggle('active');
        heart.textContent = heart.classList.contains('active') ? '♥' : '♡';
        heart.style.color = heart.classList.contains('active') ? 'var(--primary)' : 'var(--text-muted)';
        showToast(heart.classList.contains('active') ? 'Saved to your handcrafted wishlist' : 'Removed from wishlist');
      });

      // Quick view click triggers Immersive PDP Overlay Modal
      const triggerPDP = () => openPDPModal(prod);
      card.querySelector('.product-img-wrap').addEventListener('click', triggerPDP);
      card.querySelector('.quick-view-btn').addEventListener('click', (e) => { e.stopPropagation(); triggerPDP(); });
      card.querySelector('.card-title-link').addEventListener('click', triggerPDP);

      // Instant inline Cart insertion
      card.querySelector('.add-cart-btn').addEventListener('click', (e) => {
        e.stopPropagation();
        const baseItem = {
          id: `${prod.id}_base`,
          masterId: prod.id,
          name: prod.name,
          price: prod.price,
          imageUrl: prod.imageUrl,
          weightLabel: '0.5 Kg',
          isEggless: prod.isEggless,
          customMessage: '',
          quantity: 1
        };
        addToCartEngine(baseItem);
        
        // Inline micro bounce animation
        const btn = e.currentTarget;
        btn.style.transform = 'scale(1.3)';
        setTimeout(() => btn.style.transform = '', 200);
      });

      productsGrid.appendChild(card);
      observer.observe(card);
    });
  }

  // --- 4. PDP Immersive Customizer Logic ---
  function openPDPModal(product) {
    activeCustomizerProduct = product;
    
    // Reset internal customizer session tracker
    customizerState = {
      basePrice: product.price,
      weightMultiplier: 1,
      weightLabel: '0.5 Kg',
      isEggless: product.isEggless,
      egglessFee: 50,
      addonsCost: 0,
      selectedAddons: [],
      message: ''
    };

    // Populate static data properties
    pdpMainImage.src = product.imageUrl;
    pdpCategoryTag.textContent = product.category;
    pdpTitle.textContent = product.name;
    pdpRatingNum.textContent = product.rating;
    pdpDescText.textContent = product.description;
    pdpCakeMessage.value = '';
    pdpPincodeInput.value = '';
    pdpPincodeStatus.innerHTML = '<span>⚡ Check pincode to view guaranteed fresh delivery time slots</span>';

    // Safe inline image load handler
    pdpMainImage.onerror = () => { pdpMainImage.src = 'choco_truffle_cake_1778560769498.png'; };

    // Veg / Eggless states mapping
    pdpVegBadge.textContent = product.isEggless ? '🟢 100% Pure Veg / Eggless' : '🟡 Confectioner Choice';
    pdpVegBadge.style.color = product.isEggless ? '#10B981' : '#D97706';

    // Set dietary toggles radio selection
    const eggRadios = document.getElementsByName('pdpEggType');
    eggRadios.forEach(radio => {
      if (product.isEggless) {
        if (radio.value === 'eggless') radio.checked = true;
      } else {
        if (radio.value === 'egg') radio.checked = true;
      }
    });

    // Reset addons checkboxes
    document.querySelectorAll('.pdp-addon-check').forEach(chk => {
      chk.checked = false;
    });

    // Reset weight buttons active tracking
    const weightPills = pdpWeightSelector.querySelectorAll('.weight-pill');
    weightPills.forEach((pill, idx) => {
      pill.classList.remove('active');
      if (idx === 0) pill.classList.add('active'); // standard 0.5kg default
    });

    // Populate Alternative Angle Thumbnails track dynamically from discovered angles array!
    pdpThumbnailsTrack.innerHTML = '';
    const uniqueAnglesArray = Array.from(new Set(product.angles || [product.imageUrl]));
    
    // Fallback if less than 2 angles to show dynamic angle previews
    if (uniqueAnglesArray.length < 2) {
      uniqueAnglesArray.push('choco_truffle_cake_1778560769498.png');
      uniqueAnglesArray.push('white_choco_cake_1778560786673.png');
    }

    uniqueAnglesArray.forEach((src, idx) => {
      const th = document.createElement('div');
      th.className = `pdp-thumb-item ${idx === 0 ? 'active' : ''}`;
      const safeFallbackThumb = "this.onerror=null; this.src='choco_truffle_cake_1778560769498.png';";
      th.innerHTML = `<img src="${src}" alt="Angle ${idx + 1}" onerror="${safeFallbackThumb}" />`;
      th.addEventListener('click', () => {
        pdpThumbnailsTrack.querySelectorAll('.pdp-thumb-item').forEach(t => t.classList.remove('active'));
        th.classList.add('active');
        pdpMainImage.src = src;
      });
      pdpThumbnailsTrack.appendChild(th);
    });

    // Compute live UI pricing rendering
    recalculatePDPAmount();

    // Show modal transition
    pdpModalOverlay.classList.add('show');
    pdpModalContainer.classList.add('show');
    document.body.style.overflow = 'hidden'; // Lock base document scrolling
  }

  function recalculatePDPAmount() {
    let currentCalc = customizerState.basePrice * customizerState.weightMultiplier;
    
    // Add extra fee if switched to eggless manually when base isn't purely eggless
    if (customizerState.isEggless && !activeCustomizerProduct.isEggless) {
      currentCalc += customizerState.egglessFee;
    }
    
    // Append addons items check amounts
    currentCalc += customizerState.addonsCost;

    const finalComputed = Math.round(currentCalc);
    pdpCurrentPrice.textContent = `₹${finalComputed}`;
    pdpOriginalPrice.textContent = `₹${Math.round(finalComputed * 1.4)}`;
  }

  // Bind Customizer dynamic interaction hooks
  pdpWeightSelector.addEventListener('click', (e) => {
    const pill = e.target.closest('.weight-pill');
    if (!pill) return;
    
    pdpWeightSelector.querySelectorAll('.weight-pill').forEach(p => p.classList.remove('active'));
    pill.classList.add('active');

    customizerState.weightMultiplier = parseFloat(pill.getAttribute('data-multiplier'));
    customizerState.weightLabel = pill.textContent.trim();
    recalculatePDPAmount();
  });

  document.getElementsByName('pdpEggType').forEach(radio => {
    radio.addEventListener('change', () => {
      customizerState.isEggless = (radio.value === 'eggless');
      recalculatePDPAmount();
    });
  });

  document.querySelectorAll('.pdp-addon-check').forEach(chk => {
    chk.addEventListener('change', () => {
      let addonFee = 0;
      customizerState.selectedAddons = [];
      document.querySelectorAll('.pdp-addon-check:checked').forEach(c => {
        addonFee += parseFloat(c.getAttribute('data-cost'));
        customizerState.selectedAddons.push(c.nextElementSibling.textContent.trim().split(' ')[0] + ' ' + c.value);
      });
      customizerState.addonsCost = addonFee;
      recalculatePDPAmount();
    });
  });

  // Pincode validation verification action
  pdpCheckPinBtn.addEventListener('click', () => {
    const val = pdpPincodeInput.value.trim();
    if (val.length < 6 || isNaN(val)) {
      pdpPincodeStatus.innerHTML = `<span style="color:var(--primary);">⚠️ Please provide a pristine 6-digit Indian PIN Code</span>`;
      return;
    }
    
    // Simulate real backend query slot generation
    pdpCheckPinBtn.textContent = 'Checking...';
    pdpCheckPinBtn.disabled = true;

    setTimeout(() => {
      pdpCheckPinBtn.textContent = 'Verify';
      pdpCheckPinBtn.disabled = false;
      
      const slotsArray = [
        '🎉 Fast Handcrafted Air-Conditioned Dispatch guaranteed in 45 minutes today!',
        '✨ Pristine Slot Available! Live rider dispatch slot reserved.',
        '🚀 Express Delivery Route supported. Fresh delivery slot guaranteed!'
      ];
      const randomSlot = slotsArray[val.charCodeAt(0) % slotsArray.length];
      pdpPincodeStatus.innerHTML = `<span style="color:#10B981; font-weight:700;">✓ PIN ${val}: ${randomSlot}</span>`;
    }, 600);
  });

  // Tabs layout controller inside PDP Modal
  document.querySelectorAll('.pdp-tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const tgt = btn.getAttribute('data-tab');
      document.querySelectorAll('.pdp-tab-btn').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.pdp-tab-pane').forEach(p => p.classList.remove('active'));
      
      btn.classList.add('active');
      document.getElementById(`pane-${tgt}`).classList.add('active');
    });
  });

  // Add customized bundle to cart actions
  const submitCustomizedProductToCart = (openDrawerDirectly = true) => {
    const finalCalculatedPrice = parseInt(pdpCurrentPrice.textContent.replace(/[^0-9]/g, ''), 10);
    const configuredItem = {
      id: `${activeCustomizerProduct.id}_${customizerState.weightLabel.replace(/\s+/g, '')}_${customizerState.isEggless ? 'eggless' : 'egg'}`,
      masterId: activeCustomizerProduct.id,
      name: activeCustomizerProduct.name,
      price: finalCalculatedPrice,
      imageUrl: activeCustomizerProduct.imageUrl,
      weightLabel: customizerState.weightLabel,
      isEggless: customizerState.isEggless,
      customMessage: pdpCakeMessage.value.trim(),
      addons: [...customizerState.selectedAddons],
      quantity: 1
    };

    addToCartEngine(configuredItem);
    closePDPModal();
    if (openDrawerDirectly) openSideCartDrawer();
  };

  pdpBuyNowBtn.addEventListener('click', () => submitCustomizedProductToCart(true));
  pdpAddToCartBtn.addEventListener('click', () => submitCustomizedProductToCart(false));

  function closePDPModal() {
    pdpModalOverlay.classList.remove('show');
    pdpModalContainer.classList.remove('show');
    document.body.style.overflow = '';
  }

  pdpCloseBtn.addEventListener('click', closePDPModal);
  pdpModalOverlay.addEventListener('click', closePDPModal);


  // --- 5. Persistent Side Cart System ---
  function setupCartDrawerTriggers() {
    // Open cart drawer triggers
    const cartTriggerLinks = [
      document.querySelector('.cart-wrapper'),
      document.querySelector('.header-actions a[href="#"]'),
      document.querySelector('.nav-links a[href="#"]')
    ];
    cartTriggerLinks.forEach(trigger => {
      if (trigger) {
        trigger.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          openSideCartDrawer();
        });
      }
    });

    closeCartBtn.addEventListener('click', closeSideCartDrawer);
    sideCartOverlay.addEventListener('click', closeSideCartDrawer);

    // Coupon verification mechanics
    applyCouponBtn.addEventListener('click', () => {
      const code = couponInput.value.trim().toUpperCase();
      if (code === 'CHOCO20' || code === 'BAKER20') {
        appliedDiscountPercent = 20;
        couponMsg.className = 'coupon-msg success';
        couponMsg.textContent = '🎉 Splendid! 20% flat concession activated.';
      } else if (code.length > 2) {
        appliedDiscountPercent = 10; // generic secret 10% fallback
        couponMsg.className = 'coupon-msg success';
        couponMsg.textContent = '✨ Premium valid voucher applied! 10% instant savings.';
      } else {
        couponMsg.className = 'coupon-msg error';
        couponMsg.textContent = '❌ Unrecognized code. Use simulation hint CHOCO20';
        appliedDiscountPercent = 0;
      }
      recalculateCartTotals();
    });

    // Inside drawer upsells buttons
    document.querySelectorAll('.add-addon-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const addonType = btn.getAttribute('data-addon');
        const cost = parseInt(btn.getAttribute('data-price'), 10);
        
        // Add addon as direct cart unit line
        const upsellItem = {
          id: `addon_${addonType}`,
          masterId: 'addon',
          name: addonType === 'sparkler' ? '🕯️ Golden Sparkler Candle' : '🎉 Party Popper special Set',
          price: cost,
          imageUrl: 'bakery_assorted_1778560745190.png',
          weightLabel: 'Accessory',
          isEggless: true,
          customMessage: '',
          quantity: 1
        };
        addToCartEngine(upsellItem);
        btn.textContent = 'Added ✓';
        btn.disabled = true;
        btn.style.opacity = '0.5';
      });
    });

    // Empty state trigger button
    document.getElementById('shopEmptyBtn').addEventListener('click', () => {
      closeSideCartDrawer();
      document.getElementById('bestsellers').scrollIntoView({ behavior: 'smooth' });
    });

    // Trigger Multi-Step Checkout Modal
    proceedCheckoutBtn.addEventListener('click', () => {
      closeSideCartDrawer();
      startCheckoutJourneyOverlay();
    });
  }

  function addToCartEngine(item) {
    // See if matching config item already added
    const existingIndex = cart.findIndex(c => c.id === item.id && c.customMessage === item.customMessage);
    if (existingIndex > -1) {
      cart[existingIndex].quantity += item.quantity;
    } else {
      cart.push(item);
    }

    // Refresh display indicators
    updateCartUI();
    showToast(`🛒 Added ${item.name} beautifully to basket`);
  }

  function updateCartUI() {
    // Total Items aggregate
    const totalUnits = cart.reduce((acc, curr) => acc + curr.quantity, 0);
    cartCountEl.textContent = totalUnits;
    
    // Fill inner drawer UI list rows
    cartDrawerItemsContainer.innerHTML = '';
    
    if (cart.length === 0) {
      const emptyStateClone = document.getElementById('emptyCartState');
      if (emptyStateClone) {
        emptyStateClone.style.display = 'block';
        cartDrawerItemsContainer.appendChild(emptyStateClone);
      }
      proceedCheckoutBtn.disabled = true;
      document.getElementById('cartCrossSells').style.display = 'none';
    } else {
      proceedCheckoutBtn.disabled = false;
      document.getElementById('cartCrossSells').style.display = 'block';
      
      cart.forEach(item => {
        const row = document.createElement('div');
        row.className = 'cart-item-row';
        
        let addonString = '';
        if (item.addons && item.addons.length > 0) {
          addonString = `<br/><span style="color:#8B5CF6;">📦 Includes Add-ons</span>`;
        }

        let msgString = '';
        if (item.customMessage) {
          msgString = `<br/><span style="color:#D97706;">✍️ "${item.customMessage}"</span>`;
        }

        row.innerHTML = `
          <img src="${item.imageUrl}" alt="item" class="cart-item-img" />
          <div class="cart-item-info">
            <h4>${item.name}</h4>
            <div class="cart-item-customs">
              ${item.weightLabel} | ${item.isEggless ? '🟢 Eggless' : '🟡 Regular'}
              ${addonString}
              ${msgString}
            </div>
            <div class="cart-item-qty-row">
              <div class="qty-controls">
                <button class="dec-qty" data-id="${item.id}">-</button>
                <span style="font-weight:700; font-size:0.85rem;">${item.quantity}</span>
                <button class="inc-qty" data-id="${item.id}">+</button>
              </div>
              <span class="item-row-price">₹${item.price * item.quantity}</span>
            </div>
          </div>
          <button class="remove-item-btn" data-id="${item.id}" aria-label="Remove item">&times;</button>
        `;

        // Listeners for modifications
        row.querySelector('.dec-qty').addEventListener('click', () => {
          item.quantity--;
          if (item.quantity <= 0) {
            cart = cart.filter(c => c.id !== item.id);
          }
          updateCartUI();
        });

        row.querySelector('.inc-qty').addEventListener('click', () => {
          item.quantity++;
          updateCartUI();
        });

        row.querySelector('.remove-item-btn').addEventListener('click', () => {
          cart = cart.filter(c => c.id !== item.id);
          updateCartUI();
        });

        cartDrawerItemsContainer.appendChild(row);
      });
    }

    recalculateCartTotals();
  }

  function recalculateCartTotals() {
    let sub = 0;
    let customizationFeesAggregate = 0;

    cart.forEach(item => {
      sub += item.price * item.quantity;
      // Estimate inline special fees aggregate embedded
      if (item.isEggless && item.masterId !== 'addon') customizationFeesAggregate += 50 * item.quantity;
    });

    cartSubtotalEl.textContent = `₹${sub}`;
    cartExtraFeesEl.textContent = `₹${customizationFeesAggregate} Included`;

    // Concessions logic
    let discountAmount = 0;
    if (appliedDiscountPercent > 0) {
      discountAmount = Math.round((sub * appliedDiscountPercent) / 100);
      discountLineRow.style.display = 'flex';
      cartDiscountEl.textContent = `-₹${discountAmount}`;
    } else {
      discountLineRow.style.display = 'none';
    }

    const finalPay = sub - discountAmount + selectedSlotFee;
    cartTotalPayableEl.textContent = `₹${Math.max(0, finalPay)}`;
    finalGatewayAmount.textContent = `₹${Math.max(0, finalPay)}`; // sync to final payment overlay step
  }

  function openSideCartDrawer() {
    sideCartOverlay.classList.add('show');
    sideCartDrawer.classList.add('show');
    document.body.style.overflow = 'hidden';
    updateCartUI();
  }

  function closeSideCartDrawer() {
    sideCartOverlay.classList.remove('show');
    sideCartDrawer.classList.remove('show');
    document.body.style.overflow = '';
  }


  // --- 6. Immersive Secure Checkout Journey State Machine ---
  function setupCheckoutJourneyFlow() {
    // Close hooks
    checkoutCloseBtn.addEventListener('click', closeCheckoutJourneyModal);
    checkoutModalOverlay.addEventListener('click', closeCheckoutJourneyModal);

    // Multi-Step Next / Back routing mechanics
    const switchStep = (toStepNum) => {
      document.querySelectorAll('.checkout-step-body').forEach(b => b.classList.remove('active'));
      document.getElementById('stepBodySuccess').classList.remove('active');
      document.getElementById(`stepBody${toStepNum}`).classList.add('active');

      // Update Top steps trackers layout
      document.querySelectorAll('.step-marker').forEach((m, idx) => {
        if (idx < toStepNum) {
          m.classList.add('active');
        } else {
          m.classList.remove('active');
        }
      });
    };

    // Back hooks
    document.querySelectorAll('.back-step-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const targetStep = parseInt(btn.getAttribute('data-step'), 10);
        switchStep(targetStep);
      });
    });

    // Step 1: Authentication Logic
    const step1NextBtn = document.getElementById('step1NextBtn');
    const checkoutPhone = document.getElementById('checkoutPhone');
    const otpArea = document.getElementById('otpArea');

    step1NextBtn.addEventListener('click', () => {
      const phoneVal = checkoutPhone.value.trim();
      if (phoneVal.length < 10 || isNaN(phoneVal)) {
        alert('⚠️ Kindly enter a pristine 10-digit smartphone identity');
        return;
      }

      if (otpArea.style.display === 'none') {
        // Trigger simulated OTP dispatch view
        otpArea.style.display = 'block';
        step1NextBtn.textContent = 'Verify Secure OTP 🔒';
        
        // Auto-focus first inline OTP box
        setTimeout(() => otpArea.querySelector('.otp-inp').focus(), 100);
      } else {
        // Validate OTP input simulation
        const otps = Array.from(otpArea.querySelectorAll('.otp-inp')).map(inp => inp.value).join('');
        if (otps.length < 4) {
          alert('💡 Type any 4 digits simulation validation (e.g. 1234)');
          return;
        }
        // Success verified
        switchStep(2);
      }
    });

    // Auto tabs focus advance inside OTP simulation input layer
    document.querySelectorAll('.otp-inp').forEach((inp, i, arr) => {
      inp.addEventListener('input', () => {
        if (inp.value.length === 1 && i < arr.length - 1) {
          arr[i + 1].focus();
        }
      });
    });

    // Step 2: Immersive Map Simulator
    document.getElementById('adjustMapBtn').addEventListener('click', (e) => {
      const btn = e.currentTarget;
      btn.textContent = 'Calibrating Satellite Hub...';
      setTimeout(() => {
        btn.textContent = 'GPS Accurate ✓';
        document.getElementById('mapCoordStatus').textContent = 'Live Synced: 13.0827° N, 80.2707° E';
        document.getElementById('shipAddress').value = 'Downtown Signature Green Hub Condominiums, Block 4B, MG Avenue Express Road';
        document.getElementById('shipPincode').value = '560001';
      }, 800);
    });

    document.getElementById('step2NextBtn').addEventListener('click', () => {
      const name = document.getElementById('shipName').value.trim();
      const addr = document.getElementById('shipAddress').value.trim();
      const pin = document.getElementById('shipPincode').value.trim();

      if (!name || !addr || !pin) {
        alert('⚠️ Recipient Full Name, Line Address, and Pincode are strictly required for our dispatch drivers');
        return;
      }
      switchStep(3);
    });

    // Step 3: Logistics Premium Slots tracking
    document.querySelectorAll('input[name="deliverySlot"]').forEach(radio => {
      radio.addEventListener('change', () => {
        document.querySelectorAll('.slot-option-card').forEach(c => c.classList.remove('active'));
        radio.closest('.slot-option-card').classList.add('active');

        selectedSlotFee = parseInt(radio.getAttribute('data-fee'), 10);
        recalculateCartTotals();
      });
    });

    document.getElementById('step3NextBtn').addEventListener('click', () => {
      switchStep(4);
    });

    // Step 4: Payments Tabs Engine
    document.querySelectorAll('.pay-tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const targetPay = btn.getAttribute('data-pay');
        document.querySelectorAll('.pay-tab-btn').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.pay-pane').forEach(p => p.classList.remove('active'));

        btn.classList.add('active');
        document.getElementById(`pay-${targetPay}`).classList.add('active');
      });
    });

    // Final trigger authorizing transaction
    document.getElementById('triggerFinalPaymentBtn').addEventListener('click', () => {
      const triggerBtn = document.getElementById('triggerFinalPaymentBtn');
      triggerBtn.textContent = '🔒 Authorizing Secured Bank Protocol...';
      triggerBtn.disabled = true;

      setTimeout(() => {
        triggerBtn.textContent = 'Payment Captured Successfully ✨';
        triggerBtn.disabled = false;

        // Route beautifully to the festive confetti confirmation final interface
        document.querySelectorAll('.checkout-step-body').forEach(b => b.classList.remove('active'));
        document.getElementById('stepBodySuccess').classList.add('active');

        // Assign dynamic randomized Order ID
        document.getElementById('generatedOrderId').textContent = `DTB-${Math.floor(10000000 + Math.random() * 90000000)}`;
        
        // Empty inline cart session cleanly
        cart = [];
        updateCartUI();
      }, 1500);
    });

    // Confetti final modal continue button
    document.getElementById('continueShoppingBtn').addEventListener('click', () => {
      closeCheckoutJourneyModal();
      document.getElementById('bestsellers').scrollIntoView({ behavior: 'smooth' });
    });
  }

  function startCheckoutJourneyOverlay() {
    checkoutModalOverlay.classList.add('show');
    checkoutModalContainer.classList.add('show');
    document.body.style.overflow = 'hidden';

    // Ensure step 1 always loads beautifully
    document.querySelectorAll('.checkout-step-body').forEach(b => b.classList.remove('active'));
    document.getElementById('stepBodySuccess').classList.remove('active');
    document.getElementById('stepBody1').classList.add('active');

    // Reset step tracker markers
    document.querySelectorAll('.step-marker').forEach((m, idx) => {
      if (idx === 0) m.classList.add('active');
      else m.classList.remove('active');
    });

    // Reset OTP simulation inputs to state ready
    const otpArea = document.getElementById('otpArea');
    if (otpArea) {
      otpArea.style.display = 'none';
      document.getElementById('step1NextBtn').textContent = 'Send Secure OTP';
      otpArea.querySelectorAll('.otp-inp').forEach(inp => inp.value = '');
    }
  }

  function closeCheckoutJourneyModal() {
    checkoutModalOverlay.classList.remove('show');
    checkoutModalContainer.classList.remove('show');
    document.body.style.overflow = '';
  }


  // --- 7. Supporting Navbar Toggles & Utilities ---
  function setupScrollEffects() {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 20) navbar.classList.add('scrolled');
      else navbar.classList.remove('scrolled');

      if (window.scrollY > 500) scrollTopBtn.classList.add('show');
      else scrollTopBtn.classList.remove('show');
    });

    scrollTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  function setupCategoryBannersNavigation() {
    const catCards = document.querySelectorAll('.cat-card');
    catCards.forEach(card => {
      card.addEventListener('click', () => {
        catCards.forEach(c => c.classList.remove('active'));
        card.classList.add('active');
        
        const targetFilter = card.getAttribute('data-cat');
        if (targetFilter && filterCategory) {
          // If match filter option, assign it automatically
          if (['cakes', 'designer', 'cookies', 'desserts'].includes(targetFilter)) {
            filterCategory.value = targetFilter;
            filterCategory.dispatchEvent(new Event('change'));
          } else if (targetFilter === 'butterscotch') {
            filterFlavour.value = 'butterscotch';
            filterFlavour.dispatchEvent(new Event('change'));
          }
        }
        
        document.getElementById('bestsellers').scrollIntoView({ behavior: 'smooth' });
      });
    });
  }

  function setupNewsletter() {
    const form = document.getElementById('newsletterForm');
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const inp = document.getElementById('emailInput');
        if (inp && inp.value) {
          showToast('🎉 Magnifique! You have joined Downtown Bakers insider circle.');
          inp.value = '';
        }
      });
    }
  }

  let toastTimeoutTracker;
  function showToast(messageText) {
    cartToast.textContent = messageText;
    cartToast.classList.add('show');
    
    clearTimeout(toastTimeoutTracker);
    toastTimeoutTracker = setTimeout(() => {
      cartToast.classList.remove('show');
    }, 3200);
  }

});
