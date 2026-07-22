# Mapeo de URLs: omstam.com (WordPress) → sitio estático nuevo

Generado 2026-07-19. Base: `url-inventory.md` (47 URLs originales relevadas de los sitemaps de Yoast).

## Migradas 1:1 (misma URL exacta, contenido real extraído del sitio viejo)

Los 32 artículos del blog y las siguientes 13 páginas se migraron preservando **exactamente** la misma ruta/slug que tenían en WordPress, así no se pierde ningún link externo ni posicionamiento existente:

- `/תנאי-שימוש/`
- `/the-lectures-page/הרצאות/`
- `/שיעורים-בנושאים-שונים/`
- `/צרו-קשר/`
- `/דף-הקורסים/קורס-סופר/`
- `/דף-הקורסים/קורס-סופרי-סת״ם/`
- `/דף-הקורסים/קורס-מכניסי-פרשיות/`
- `/דף-הקורסים/רישום-לקורס-מכניסי-פרשיות-שיפוץ-תפילי/`
- `/שיעור-מיוחד/`
- `/the-lectures-page/`
- `/לימוד-כתיבת-סתם-כל-השלבים-הכלים-והדג/`
- `/דף-הקורסים/`
- `/צרו-קשר/מי_אנחנו/`

(Los 32 artículos están listados completos en `url-inventory.md`.)

## Nueva URL agregada (no rompe nada, es aditiva)

- `/מאמרים/` — índice/listado de los 32 artículos. No existía en el sitio viejo (no había un blog index separado), se agregó para navegación y SEO.

## NO migradas — requieren decisión antes de apagar el WordPress viejo

Estas 8 URLs existían en el sitemap original pero **no tienen equivalente en el sitio estático nuevo**, porque son funcionalidad de WooCommerce (carrito, checkout, cuenta) o páginas de archivo/taxonomía de WordPress, no contenido real:

| URL vieja | Por qué no se migró | Recomendación |
|---|---|---|
| `/חנות/` | Catálogo WooCommerce — confirmado con el cliente (2026-07-19) que no hace falta tienda online | Redirect 301 a `/` |
| `/חנות/checkout/` | Checkout de WooCommerce, no aplica sin carrito | Redirect 301 a `/` |
| `/חנות/עגלה/` | Carrito de WooCommerce | Redirect 301 a `/` |
| `/פרטי-הזמנה/` | Página de detalle de pedido (WooCommerce) | Redirect 301 a `/` |
| `/החשבון-שלי/` | Mi cuenta (WooCommerce) | Redirect 301 a `/` |
| `/category/general/` | Archivo de categoría de WordPress (listado automático) | Redirect 301 a `/מאמרים/` |
| `/author/y0548431060gmail-com/` | Archivo de autor de WordPress | Redirect 301 a `/מאמרים/` |
| `/author/admin/` | Archivo de autor de WordPress | Redirect 301 a `/מאמרים/` |
| `/צרו-קשר/מפת-אתר/` | Mapa del sitio generado por plugin viejo | Reemplazado por `/sitemap.xml` (máquinas) — para humanos se puede linkear `/מאמרים/` y el menú |

**Actualización (2026-07-22):** el sitio nuevo terminó sirviéndose directo desde este VPS vía nginx (no Bluehost) — ver `.github/workflows/deploy.yml` y `/etc/nginx/sites-available/omstam.com`. Los 8 redirects 301 (+ el de `/צרו-קשר/מפת-אתר/`) ya están configurados como bloques `location = ... { return 301 ...; }` en esa config de nginx y verificados con curl. Esta config vive fuera del repo git (es infraestructura del servidor, no del sitio estático), así que no se pierde en los `git reset --hard` del auto-deploy.

## Pendiente

- Nada pendiente de redirects. Falta decidir cuándo apagar el WordPress viejo en Bluehost.
