import os
import requests
from bs4 import BeautifulSoup
import json
import urllib.parse
import time

categories = [
    "/cakes",
    "/birthday-cakes",
    "/anniversary-cakes",
    "/designer-cakes"
]

base_url = "https://www.bakingo.com"
data_dir = "/Users/geu/Desktop/Bakery/bakingo_deep_data"
os.makedirs(data_dir, exist_ok=True)

headers = {
    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
}

all_products = []
downloaded_urls = set()

for category in categories:
    cat_name = category.strip('/').replace('-', '_')
    cat_dir = os.path.join(data_dir, cat_name)
    os.makedirs(cat_dir, exist_ok=True)
    
    print(f"Scraping category: {category}")
    
    for page in range(1, 3):  # 2 pages per category is usually enough for a solid redesign sample
        url = f"{base_url}{category}?page={page}" if page > 1 else f"{base_url}{category}"
        print(f"  Fetching {url}...")
        try:
            resp = requests.get(url, headers=headers, timeout=10)
            if resp.status_code != 200:
                print(f"    Failed with status {resp.status_code}")
                break
                
            soup = BeautifulSoup(resp.text, 'html.parser')
            
            # Find all images that look like product images
            images = soup.find_all('img')
            products_found = 0
            
            for img in images:
                src = img.get('src') or img.get('data-src')
                if not src:
                    continue
                
                if 'logo' in src.lower() or 'icon' in src.lower() or 'svg' in src.lower() or 'banner' in src.lower():
                    continue
                    
                alt = img.get('alt', '').strip()
                if not alt or 'cake' not in alt.lower():
                    # skip generic images if they don't have good alt text
                    if 'cake' not in src.lower():
                        continue
                
                if src.startswith('/'):
                    src = urllib.parse.urljoin(base_url, src)
                    
                # Modify URL for higher resolution if possible
                high_res_src = src.replace('w_400', 'w_800').replace('w_300', 'w_800').replace('w_200', 'w_800')
                
                if high_res_src in downloaded_urls:
                    continue
                    
                downloaded_urls.add(high_res_src)
                
                parent_a = img.find_parent('a')
                link = parent_a.get('href') if parent_a else None
                if link and link.startswith('/'):
                    link = urllib.parse.urljoin(base_url, link)
                
                # Try to find a price near the image
                price = "N/A"
                container = img.find_parent('div')
                if container:
                    # typical price class or rupees symbol
                    text_content = container.get_text()
                    if '₹' in text_content:
                        price_part = text_content[text_content.find('₹'):]
                        price = price_part.split()[0] if price_part.split() else "N/A"
                
                product_info = {
                    'name': alt if alt else 'Cake',
                    'price': price,
                    'image_url': high_res_src,
                    'link': link,
                    'category': cat_name
                }
                all_products.append(product_info)
                products_found += 1
                
                # Download image
                try:
                    img_data = requests.get(high_res_src, headers=headers, timeout=10).content
                    filename = "".join(c for c in product_info['name'] if c.isalnum() or c in (' ', '_', '-')).rstrip()
                    if not filename: filename = "cake"
                    filename = filename.replace(' ', '_')[:50] + f"_{len(downloaded_urls)}.jpg"
                    filepath = os.path.join(cat_dir, filename)
                    with open(filepath, 'wb') as f:
                        f.write(img_data)
                except Exception as e:
                    print(f"    Failed to download image {high_res_src}: {e}")
                    
            print(f"    Found {products_found} new products on page {page}")
            
            if products_found == 0:
                break
                
        except Exception as e:
            print(f"    Error scraping {url}: {e}")
            
        time.sleep(1)

with open(os.path.join(data_dir, 'all_products_metadata.json'), 'w') as f:
    json.dump(all_products, f, indent=4)

print(f"\\nDeep scraping completed! Total unique products downloaded: {len(downloaded_urls)}")
