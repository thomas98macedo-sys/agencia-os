# Como publicar o site na HostGator (passo a passo)

O site é **HTML estático**, então roda direto na HostGator — sem servidor Node, sem build. Leva ~10 minutos.

## Antes de começar
- Domínio: **thomas-macedo.com** (com `www`). Se o seu for diferente (ex.: `.com` ou sem `www`), me avise que eu ajusto as URLs canônicas e o `.htaccess`.
- Tenha em mãos o login do **cPanel** da HostGator.

---

## Opção A — Upload pelo cPanel (recomendado)

1. Entre no **cPanel** da HostGator.
2. Abra o **Gerenciador de Arquivos** (File Manager).
3. Entre na pasta do seu domínio:
   - Domínio principal: `public_html`
   - Domínio adicional/addon: a pasta criada para ele (ex.: `public_html/thomasmacedo`).
4. **(Recomendado)** Se houver arquivos antigos lá (ex.: um `index.html` padrão da HostGator), apague ou faça backup.
5. Clique em **Upload** e envie o arquivo **`thomasmacedo-site.zip`**.
6. Volte ao Gerenciador de Arquivos, clique com o botão direito no `.zip` e escolha **Extract** (Extrair).
7. Confirme que os arquivos ficaram **na raiz** da pasta (o `index.html` precisa estar direto em `public_html`, e não dentro de uma subpasta). Depois pode apagar o `.zip`.
8. Ative o **"Show Hidden Files"** (Configurações → mostrar arquivos ocultos) para confirmar que o **`.htaccess`** foi extraído. Ele cuida do HTTPS, do `www` e do cache.

Pronto. Acesse **https://www.thomas-macedo.com** para conferir.

---

## Opção B — Upload por FTP
1. No cPanel, em **Contas de FTP**, crie/pegue suas credenciais.
2. Use um cliente FTP (FileZilla). Conecte com host, usuário e senha.
3. Entre em `public_html` e arraste para lá **todo o conteúdo** da pasta `thomas-macedo` (index.html, marcas.html, styles.css, site.js, sitemap.xml, robots.txt, icon.svg, og-image.jpg, `.htaccess`, e as pastas `artigos/` e `img/`).

---

## SSL (cadeado HTTPS)
A HostGator oferece **SSL grátis (Let's Encrypt)**. Em geral já vem ativo. Se o cadeado não aparecer:
- cPanel → **SSL/TLS Status** → selecione o domínio → **Run AutoSSL**.
- Aguarde alguns minutos. O `.htaccess` já força o HTTPS automaticamente.

---

## Depois de publicar (para ranquear)
1. **Google Search Console** (search.google.com/search-console): adicione o domínio e envie o sitemap `https://www.thomas-macedo.com/sitemap.xml`.
2. **Perfil da Empresa no Google** (Google Business Profile): crie/atualize com Santos/Baixada — fundamental para SEO local.
3. Coloque o link do site na **bio do Instagram** e no **LinkedIn** (reforça o `sameAs`).
4. Valide os dados estruturados no **Rich Results Test** (search.google.com/test/rich-results).

## Estrutura final no servidor
```
public_html/
├── index.html              (Tráfego Pago)
├── marcas.html             (Marcas & E-commerce)
├── styles.css
├── site.js
├── sitemap.xml
├── robots.txt
├── icon.svg
├── og-image.jpg
├── .htaccess
├── artigos/
│   ├── index.html          (lista de artigos)
│   └── ...6 artigos.html
└── img/                    (fotos)
```
