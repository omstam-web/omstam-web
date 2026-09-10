#!/usr/bin/env python3
"""Idempotent technical SEO maintenance for static article pages."""

from pathlib import Path
import re


ROOT = Path(__file__).resolve().parents[1]


def remove_bulk_author_meta() -> int:
    keep = {"הדרכה-להכנסת-פרשיות-לתפילין", "תעלומת-כתב-מור-וקציעה", "כתב-מור-וקציעה-היעבץ"}
    changed = 0
    for path in ROOT.glob("*/index.html"):
        if path.parent.name in keep:
            continue
        text = path.read_text(encoding="utf-8")
        clean = text.replace('<meta name="author" content="הרב יוחאי אוחיון">\n', "")
        if clean != text:
            path.write_text(clean, encoding="utf-8")
            changed += 1
    return changed


def complete_mor_uketziah_social_metadata() -> int:
    pages = {
        "תעלומת-כתב-מור-וקציעה": {
            "title": "כתב מור וקציעה – חלק א׳ | הרב יוחאי אוחיון",
            "description": "מה מקורו של הכתב המכונה כיום כתב מור וקציעה, וכיצד הכיר היעב״ץ את מסורת הכתב הספרדי?",
            "image": "mor-uketziah-part-1.webp",
            "published": "2026-08-23",
        },
        "כתב-מור-וקציעה-היעבץ": {
            "title": "מבחן מור וקציעה – חלק ב׳ | הרב יוחאי אוחיון",
            "description": "דברי היעב״ץ על צורת אותיות הכתב הספרדי ומבחן מעשי לכתב המכונה כיום מור וקציעה.",
            "image": "mor-uketziah-part-2.webp",
            "published": "2026-08-23",
        },
    }
    changed = 0
    for slug, values in pages.items():
        path = ROOT / slug / "index.html"
        text = path.read_text(encoding="utf-8")
        if 'property="og:title"' in text:
            continue
        canonical = f"https://omstam.com/{slug}/"
        image = f"https://omstam.com/assets/img/articles/{values['image']}"
        marker = f'<link rel="canonical" href="{canonical}">'
        metadata = marker + (
            f'<meta property="og:type" content="article"><meta property="og:locale" content="he_IL">'
            f'<meta property="og:title" content="{values["title"]}">'
            f'<meta property="og:description" content="{values["description"]}">'
            f'<meta property="og:url" content="{canonical}"><meta property="og:image" content="{image}">'
            '<meta property="og:site_name" content="מכון אמנות הסת״ם"><meta name="twitter:card" content="summary_large_image">'
            f'<script type="application/ld+json">{{"@context":"https://schema.org","@type":"Article","headline":"{values["title"].split(" | ")[0]}","description":"{values["description"]}","image":"{image}","datePublished":"{values["published"]}","dateModified":"{values["published"]}","author":{{"@type":"Person","name":"הרב יוחאי אוחיון"}},"publisher":{{"@type":"Organization","name":"מכון אמנות הסת״ם"}},"mainEntityOfPage":"{canonical}","inLanguage":"he-IL"}}</script>'
        )
        text = text.replace(marker, metadata, 1)
        path.write_text(text, encoding="utf-8")
        changed += 1
    return changed


def update_article_item_list() -> int:
    path = ROOT / "מאמרים" / "index.html"
    text = path.read_text(encoding="utf-8")
    url = "https://omstam.com/הדרכה-להכנסת-פרשיות-לתפילין/"
    if f'"url":"{url}"' in text:
        return 0
    marker = '{"@type":"ListItem","position":32,"url":"https://omstam.com/מאמר-הקטנת-והגדלת-קשר-הראש/","name":"מאמר הקטנת והגדלת קשר הראש"}'
    item = marker + ',{"@type":"ListItem","position":33,"url":"' + url + '","name":"הכנסת פרשיות לתפילין וסגירת הבתים — מדריך מקצועי"}'
    text = text.replace(marker, item, 1)
    path.write_text(text, encoding="utf-8")
    return 1


if __name__ == "__main__":
    total = remove_bulk_author_meta() + complete_mor_uketziah_social_metadata() + update_article_item_list()
    print(f"Updated {total} SEO records")
