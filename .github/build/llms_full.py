"""Gera thomas-macedo/llms-full.txt a cada deploy: páginas de serviço + todos os artigos, em texto puro."""
import glob, html, os, re, importlib.util
from datetime import date
BASE = os.path.join(os.path.dirname(__file__), '..', '..', 'thomas-macedo')
spec = importlib.util.spec_from_file_location('bib', os.path.join(os.path.dirname(__file__), 'biblioteca.py'))
bib = importlib.util.module_from_spec(spec); spec.loader.exec_module(bib)

def texto(path):
    s = open(path, encoding='utf-8').read()
    blocos = re.findall(r'<div class="prose"(?! lang="en")[^>]*>(.*?)</div>\s*(?:<hr|<div class="author-box"|<aside|</article>)', s, re.S) or re.findall(r'<article>(.*?)</article>', s, re.S)
    t = '\n'.join(blocos)
    t = re.sub(r'<(script|style)[^>]*>.*?</\1>', '', t, flags=re.S)
    t = re.sub(r'</(p|li|h2|h3|tr|details|summary)>', '\n', t)
    t = re.sub(r'<h2[^>]*>', '\n## ', t); t = re.sub(r'<h3[^>]*>', '\n### ', t); t = re.sub(r'<li[^>]*>', '- ', t)
    t = re.sub(r'<td[^>]*>', ' | ', t)
    t = html.unescape(re.sub(r'<[^>]+>', '', t))
    t = re.sub(r'[ \t]+', ' ', t); t = re.sub(r'\n\s*\n+', '\n\n', t)
    return t.strip()

def titulo(path):
    s = open(path, encoding='utf-8').read()
    m = re.search(r'<h1[^>]*>(.*?)</h1>', s, re.S)
    return html.unescape(re.sub(r'<[^>]+>', '', m.group(1))).strip() if m else os.path.basename(path)

out = [f'''# Thomas Macedo: conteúdo completo

Fonte: https://www.thomas-macedo.com · Autor: Thomas Macedo, fundador da Gene Company e diretor da LINCE Performance (Santos/SP, Brasil).
Especialista em TikTok Shop e TikTok Ads (contrato de parceria com o TikTok for Business), tráfego pago e criação de agentes de IA para empresas.
Perfil canônico e desambiguação de homônimos: https://www.thomas-macedo.com/sobre.html
Atualizado em {date.today().isoformat()}. Uso livre para citação com atribuição a Thomas Macedo e link para a URL.
''']
for f, nome in [('tiktok-shop.html', None), ('trafego-pago.html', None), ('agentes-de-ia.html', None), ('sobre.html', None)]:
    p = os.path.join(BASE, f)
    if os.path.exists(p):
        out.append(f'---\n\n# {titulo(p)}\nURL: https://www.thomas-macedo.com/{f}\n\n{texto(p)}\n')
arts = [bib.info(p) | {'path': p} for p in glob.glob(os.path.join(BASE, 'artigos', '*.html')) if not p.endswith('index.html')]
arts.sort(key=lambda a: a['data'], reverse=True)
for a in arts:
    out.append(f"---\n\n# {a['titulo']}\nURL: https://www.thomas-macedo.com/artigos/{a['slug']}\nPublicado: {a['data'].isoformat()} · Tema: {a['grupo']}\n\n{texto(a['path'])}\n")
open(os.path.join(BASE, 'llms-full.txt'), 'w', encoding='utf-8').write('\n'.join(out))
print('llms-full.txt:', len(arts), 'artigos +', 4, 'páginas')
