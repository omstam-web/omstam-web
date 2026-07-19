# OMSTAM WEB

Renovación de `omstam.com`, migrando del WordPress actual a un sitio estático (HTML/CSS/JS), siguiendo el mismo enfoque usado en yadstam.com y hebraika.com.

## Estado

- [x] Snapshot de referencia del sitio WordPress actual (`site-mirror/`, no versionado — ver más abajo).
- [ ] Definición de estilo/diseño nuevo (pendiente, lo aporta el cliente).
- [ ] Construcción del sitio estático.
- [ ] Deploy a Bluehost.
- [ ] Entrega al cliente para edición vía Codex.

## Referencia del sitio original

`site-mirror/` contiene una copia estática (wget mirror) de `omstam.com` tal como se veía al momento de la migración. Es solo referencia de contenido/diseño para reconstruir — no se versiona en git por su peso (~165MB) y por venir de una instalación WordPress.

## Estructura principal

```text
.
├── assets/       # imágenes, video, iconos
├── components/   # fragmentos HTML reutilizables
├── data/         # contenido/catálogo en JSON
├── pages/        # páginas internas
├── styles/       # CSS
├── index.html
├── robots.txt
└── sitemap.xml
```
