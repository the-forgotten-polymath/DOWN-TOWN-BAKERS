import os
import requests
from bs4 import BeautifulSoup
import json
import urllib.parse

base_url = "https://www.bakingo.com/cakes"
data_dir = "/Users/geu/Desktop/Bakery/bakingo"
os.makedirs(data_dir, exist_ok=True)

headers = {
    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
}

response = requests.get(base_url, headers=headers)
soup = BeautifulSoup(response.text, 'html.parser')

cakes = []
# Many times images are inside a specific container, but we can just grab all images and filter
images = soup.find_all('img')
for idx, img in enumerate(images):
    src = img.get('src') or img.get('data-src')
    if not src:
        continue
    
    if src.startswith('/'):
        src = urllib.parse.urljoin(base_url, src)
        
    alt = img.get('alt', f'cake_{idx}')
    if not alt.strip():
        alt = f'cake_{idx}'
        
    if 'logo' in src.lower() or 'icon' in src.lower() or 'svg' in src.lower():
        continue
        
    cakes.append({
        'name': alt,
        'image_url': src
    })

with open(os.path.join(data_dir, 'cakes_info.json'), 'w') as f:
    json.dump(cakes, f, indent=4)

downloaded_count = 0
for i, cake in enumerate(cakes):
    try:
        img_data = requests.get(cake['image_url'], headers=headers).content
        filename = "".join(c for c in cake['name'] if c.isalnum() or c in (' ', '_', '-')).rstrip()
        filename = filename.replace(' ', '_')[:50] + f"_{i}.jpg"
        filepath = os.path.join(data_dir, filename)
        with open(filepath, 'wb') as f:
            f.write(img_data)
        downloaded_count += 1
    except Exception as e:
        print(f"Failed to download {cake['image_url']}: {e}")

print(f"Scraping completed. Downloaded {downloaded_count} images to {data_dir}.")
