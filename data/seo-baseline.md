# Baseline SEO actual de omstam.com (WordPress, previo a la migración)

Relevado el 2026-07-19. Sirve como referencia para no perder nada al reconstruir el sitio estático.

## Identidad del sitio

- Negocio: Rav Yohai Ohayon — cursos de escritura de STa"M (Sefer Torá, Tefilín, Mezuzot), estilo sefaradí.
- Título home: `הרב יוחאי אוחיון- קורס כתיבת סת"ם- השתלמויות בסת"ם- הרב יוחאי אוחיון - לימוד כתיבת סת"ם ספרדית`
- Meta description home: `קורס כתיבת סת"ם ברמה גבוהה - עד כ5 משתתפים בקבוצה - לימוד כתיבה להיות סופר סת"ם ולכתוב מזוזות תפילין וספר תורה, לימוד ההלכה ותעודה, עד להצלחה`
- Idioma: hebreo (he_IL), sitio RTL.
- Logo/OG image: `wp-content/uploads/2023/02/LOGO-OMSTAM.jpg`

## SEO técnico presente (plugin Yoast activo)

- Title, meta description, canonical por página.
- Open Graph completo (title, description, url, site_name, image + dimensiones).
- Twitter card (summary_large_image).
- `sitemap_index.xml` con post-sitemap, page-sitemap, category-sitemap, author-sitemap (ver `url-inventory.md`).
- `robots.txt` permite todo el crawl, apunta al sitemap.

## Schema.org (JSON-LD, @graph de Yoast)

Tipos presentes en el home: `Article/Report`, `WebPage`, `ImageObject`, `BreadcrumbList`, `WebSite`, `Organization`, `Person`.

Esto es justo la señal que usan los motores de IA (Google AI Overviews, ChatGPT, Perplexity) para identificar autoridad/expertise de una persona/negocio real (E-E-A-T). Al reconstruir hay que:

- Mantener/mejorar el schema `Person` del Rav Yohai Ohayon (autor, credenciales, foto).
- Mantener `Organization` con datos de contacto reales.
- Agregar `Course` schema para los cursos (קורס כתיבת סת"ם, קורס סופרי סת"ם, קורס מכניסי פרשיות, etc. — ver `url-inventory.md`).
- Agregar `FAQPage` schema donde haya preguntas frecuentes, para favorecer respuestas directas de IA.
- Considerar `llms.txt` en la raíz para guiar a agentes de IA sobre el contenido del sitio.

## Pendiente de relevar antes de reconstruir

- Extraer title/description/schema de cada URL individual de `url-inventory.md` (no solo el home), usando el mirror local en `site-mirror/`.
- Confirmar estructura de "חנות" (tienda WooCommerce: /חנות/, /חנות/checkout/, /חנות/עגלה/) — ver si sigue siendo necesaria o se simplifica en el sitio nuevo.
- Mapeo 1:1 de URLs antiguas → nuevas (si cambia la estructura) para armar redirects 301 y no perder posicionamiento.
