"""Gera a seção "Todas as matérias" da home a partir de thomas-macedo/artigos/*.html.
Roda em todo deploy (pages.yml) — novas matérias entram sozinhas.
Substitui o bloco entre <!-- BIBLIOTECA:INICIO --> e <!-- BIBLIOTECA:FIM --> em thomas-macedo/index.html."""
import glob, html, os, re
from datetime import date

BASE = os.path.join(os.path.dirname(__file__), '..', '..', 'thomas-macedo')
GRUPOS = [  # (nome, palavras-chave no slug/título) — a 1ª que bater define o grupo
    ('TikTok Shop & Ads', ['tiktok']),
    ('Tráfego pago', ['trafego', 'tráfego', 'meta-ads', 'google-ads', 'ads', 'criativo', 'roas', 'cac', 'campanha', 'verba', 'pixel', 'remarketing', 'advantage', 'lance', 'oferta']),
    ('Marcas & e-commerce', ['marca', 'branding', 'ecommerce', 'e-commerce', 'shopify', 'loja', 'produto', 'white-label', 'frete', 'marketplace', 'checkout', 'carrinho', 'recompra', 'naming', 'posicionamento']),
    ('Agência & escala', ['agencia', 'agência', 'assessoria', 'cliente', 'processo', 'pops', 'time', 'onboarding', 'retencao', 'retenção', 'cobrar', 'proposta', 'escalar']),
    ('IA & agentes', ['ia', 'agente', 'gpt', 'claude', 'chatbot', 'automacao', 'automação', 'llm', 'rag', 'prompt', 'multiverso', 'livro']),
]
MESES = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez']

def info(path):
    s = open(path, encoding='utf-8').read()
    m = re.search(r'<h1[^>]*>(.*?)</h1>', s, re.S) or re.search(r'<title>(.*?)</title>', s, re.S)
    titulo = re.sub(r'<[^>]+>', '', m.group(1)).split(' | ')[0].strip() if m else os.path.basename(path)
    titulo = html.unescape(re.sub(r'\s+', ' ', titulo))
    titulo = re.sub(r'\s*—\s*', ': ', titulo).replace(': :', ':')
    d = re.search(r'article:published_time" content="(\d{4})-(\d{2})-(\d{2})', s)
    dt = date(int(d.group(1)), int(d.group(2)), int(d.group(3))) if d else date(2026, 1, 1)
    slug = os.path.basename(path)
    chave = (slug + ' ' + titulo).lower()
    grupo = next((g for g, ks in GRUPOS if any(re.search(r'(^|[^a-z])' + re.escape(k) + r'([^a-z]|$)', chave) for k in ks)), 'IA & agentes')
    return {'slug': slug, 'titulo': titulo, 'data': dt, 'grupo': grupo}

def gerar():
    arts = [info(p) for p in glob.glob(os.path.join(BASE, 'artigos', '*.html')) if not p.endswith('index.html')]
    arts.sort(key=lambda a: (a['data'], a['titulo']), reverse=True)
    cols = []
    for g, _ in GRUPOS:
        itens = [a for a in arts if a['grupo'] == g]
        if not itens: continue
        lis = '\n'.join(
            f'            <li><a href="./artigos/{html.escape(a["slug"])}">{html.escape(a["titulo"])}</a>'
            f'<time datetime="{a["data"].isoformat()}">{a["data"].day:02d} {MESES[a["data"].month-1]}</time></li>'
            for a in itens)
        mais = (f'\n          <button class="bib-more" type="button">Ver todas as {len(itens)} <span aria-hidden="true">↓</span></button>' if len(itens) > 8 else '')
        cols.append(f'''        <div class="bib-col">
          <h3>{html.escape(g)} <span>{len(itens)}</span></h3>
          <ul>
{lis}
          </ul>{mais}
        </div>''')
    hoje = max(a['data'] for a in arts)
    return f'''<!-- BIBLIOTECA:INICIO -->
  <section class="bib" id="biblioteca" aria-label="Todas as matérias publicadas">
    <div class="wrap">
      <div class="sec-head">
        <div>
          <span class="eyebrow eyebrow-ink">Biblioteca</span>
          <h2 class="title mt-s">Todas as matérias publicadas</h2>
        </div>
        <p class="lead">{len(arts)} matérias sobre TikTok Shop, tráfego pago, marcas, agências e IA. Atualizado automaticamente a cada publicação (última: {hoje.day:02d} {MESES[hoje.month-1]} {hoje.year}).</p>
      </div>
      <div class="bib-grid">
{chr(10).join(cols)}
      </div>
    </div>
  </section>
  <!-- BIBLIOTECA:FIM -->'''

if __name__ == '__main__':
    idx = os.path.join(BASE, 'index.html')
    s = open(idx, encoding='utf-8').read()
    bloco = gerar()
    if '<!-- BIBLIOTECA:INICIO -->' in s:
        s = re.sub(r'<!-- BIBLIOTECA:INICIO -->.*?<!-- BIBLIOTECA:FIM -->', lambda m: bloco, s, flags=re.S)
    else:
        s = s.replace('  <footer>', '  ' + bloco + '\n\n  <footer>', 1)
    open(idx, 'w', encoding='utf-8').write(s)
    print('biblioteca gerada:', s.count('class="bib-col"'), 'grupos')
