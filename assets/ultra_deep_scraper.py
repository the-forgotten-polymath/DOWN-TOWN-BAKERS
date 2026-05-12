import os
import requests
from bs4 import BeautifulSoup
import json
import time

input_dir = "/Users/geu/Desktop/Bakery/bakingo_deep_data"
output_dir = "/Users/geu/Desktop/Bakery/bakingo/bakingo_deep_data1"

if not os.path.exists(output_dir):
    os.makedirs(output_dir)

metadata_file = os.path.join(input_dir, "all_products_metadata.json")
enriched_file = os.path.join(output_dir, "enriched_products.json")

headers = {
    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
}

if not os.path.exists(metadata_file):
    print("Metadata file not found. Run deep_scraper.py first.")
    exit(1)

with open(metadata_file, "r") as f:
    products = json.load(f)

print(f"Loaded {len(products)} products. Starting deep extraction...")

# To avoid running for hours, you can limit this to the first 50-100 products for a redesign prototype.
# Change this slice to `products` if you want all 674 products.
target_products = products

enriched_data = []

for i, product in enumerate(target_products):
    link = product.get("link")
    if not link:
        enriched_data.append(product)
        continue
        
    print(f"[{i+1}/{len(target_products)}] Scraping details for: {product['name']}")
    try:
        resp = requests.get(link, headers=headers, timeout=10)
        soup = BeautifulSoup(resp.text, 'html.parser')
        
        # Extract Description
        description = ""
        desc_div = soup.find('div', class_=lambda c: c and 'description' in c.lower())
        if desc_div:
            description = desc_div.get_text(separator="\n", strip=True)
        else:
            # Fallback to paragraph tags
            paragraphs = soup.find_all('p')
            for p in paragraphs:
                if len(p.text) > 100:
                    description += p.text + "\n"
                    
        # Extract Gallery Images
        gallery_images = []
        for img in soup.find_all('img'):
            src = img.get('src') or img.get('data-src')
            if src and 'media/images' in src and ('w_800' in src or 'w_400' in src):
                gallery_images.append(src.replace('w_400', 'w_800'))
                
        # Deduplicate
        gallery_images = list(set(gallery_images))
        
        # Extract Weight Options (Often in list items or buttons)
        weight_options = []
        labels = soup.find_all('label')
        for label in labels:
            if 'kg' in label.text.lower() or 'gm' in label.text.lower():
                weight_options.append(label.text.strip())
                
        product['full_description'] = description.strip()
        product['gallery_images'] = gallery_images
        product['weight_options'] = list(set(weight_options))
        
        enriched_data.append(product)
        
    except Exception as e:
        print(f"  Error scraping {link}: {e}")
        enriched_data.append(product)
        
    time.sleep(1) # Be polite to their server

with open(enriched_file, "w") as f:
    json.dump(enriched_data, f, indent=4)

print(f"\nDeep extraction completed! Saved {len(enriched_data)} enriched products to {enriched_file}.")
