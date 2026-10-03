# Baixa: (1) fotos da pasta "Modelos IA" do Drive; (2) fotos oficiais de produto das lojas Shopify das marcas
import json, os, re, subprocess, urllib.request
OUT = 'thomas-macedo/img/raw'
os.makedirs(OUT + '/modelos', exist_ok=True); os.makedirs(OUT + '/produtos', exist_ok=True)
log = open(OUT + '/log.txt', 'w')
def L(*a): print(*a); print(*a, file=log); log.flush()
drive = {'modelo-1': '1L2bG2YgZ7SJSuegvQhI6nZf9LzihG9Ec', 'modelo-2': '1_q5uQjjxKGveSOVf4I1J2DISLdG0Nnyk',
         'modelo-3': '1_nO-Qv8T9p4WYkL6fXVhr4Dulok8CT_T', 'modelo-4': '1MkGkWvJ3D59OikfVeHgd0gnVmNqbf0a5', 'modelo-5': '1LqbKtkaZzipx9NlgSdsZEu1zgueztYea'}
for k, fid in drive.items():
    r = subprocess.run(['gdown', f'https://drive.google.com/uc?id={fid}', '-O', f'{OUT}/modelos/{k}.png', '-q'])
    L('drive', k, r.returncode, os.path.getsize(f'{OUT}/modelos/{k}.png') if os.path.exists(f'{OUT}/modelos/{k}.png') else 0)
UA = {'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/129 Safari/537.36'}
stores = {'tuyo': 'https://tuyo.com.br', 'apex': 'https://apx.com.br', 'rocket': 'https://www.rocketlabz.com.br'}
for slug, base in stores.items():
    try:
        req = urllib.request.Request(base + '/products.json?limit=250', headers=UA)
        prods = json.load(urllib.request.urlopen(req, timeout=30))['products']
        L(slug, 'produtos:', len(prods))
        for p in prods:
            L('   -', p['handle'], '|', p['title'][:70], '| imgs', len(p.get('images', [])))
        # baixa a 1ª imagem dos 8 primeiros produtos + qualquer creatina/gummy
        pick = prods[:8] + [p for p in prods if re.search(r'creatin|gumm|goma', p['title'], re.I)]
        seen = set()
        for p in pick:
            if p['handle'] in seen or not p.get('images'): continue
            seen.add(p['handle'])
            src = p['images'][0]['src']
            dst = f"{OUT}/produtos/{slug}--{p['handle'][:50]}.{src.split('?')[0].rsplit('.',1)[-1][:4]}"
            urllib.request.urlretrieve(src, dst); L('   baixou', dst)
    except Exception as e:
        L(slug, 'ERRO', e)
