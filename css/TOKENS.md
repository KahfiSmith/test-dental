# Design Tokens → Figma Variables

Sumber: `css/tokens.css`  
Semua komponen di `site.css` memakai `var(--…)` dari file ini.

## Kenapa layout “gak kebaca” di Figma?

Impor HTML→Figma sering gagal pada:

| Di web | Masalah di Figma |
|--------|------------------|
| `1.35rem`, `3.15rem` acak | Frame/spacing tidak grid |
| Multi-layer `radial-gradient` + `blur` | Jadi rectangle kosong / stacking aneh |
| `mask-image` / `mask-composite` | Tidak ter-parse |
| Multi `box-shadow` | Shadow hilang atau digabung salah |
| Negative margin full-bleed | Auto-layout patah |

Token + scale 8pt mengurangi nilai acak; komponen pakai ukuran tetap (`64px` circle, `48px` button, `72px` header).

## Collections di Figma

Buat **Local variables** dengan collection:

### 1. Color

| Variable | Value |
|----------|-------|
| `soap/50` | `#f7fcf8` |
| `soap/100` | `#eef8f0` |
| `soap/200` | `#d8f0de` |
| `soap/300` | `#b5e2c2` |
| `leaf/400` | `#5ec07a` |
| `leaf/500` | `#3aab5c` |
| `leaf/600` | `#2d8f4b` |
| `leaf/700` | `#247240` |
| `leaf/800` | `#1f5c36` |
| `leaf/900` | `#1a4a2d` |
| `ink/50` … `ink/950` | lihat tokens.css |
| `page` | `#fafbfb` |
| `white` | `#ffffff` |

### 2. Spacing (number, unit px)

| Token | px |
|-------|-----|
| `space/1` | 4 |
| `space/2` | 8 |
| `space/3` | 12 |
| `space/4` | 16 |
| `space/5` | 20 |
| `space/6` | 24 |
| `space/8` | 32 |
| `space/10` | 40 |
| `space/12` | 48 |
| `space/16` | 64 |
| `space/18` | 72 |
| `shell` | 1088 |

### 3. Type (number px)

| Token | Size | Weight |
|-------|------|--------|
| `text/sm` | 13 | 600–700 |
| `text/base` | 15 | 500–600 |
| `text/lg` | 16 | 700 |
| `text/2xl` | 20 | 700 |
| `text/5xl` | 40 | 700 |
| `text/6xl` | 48 | 700 |

Font: **Quicksand** (Bold / SemiBold / Medium).

### 4. Radius

| Token | px |
|-------|-----|
| `radius/md` | 12 |
| `radius/lg` | 16 |
| `radius/xl` | 20 |
| `radius/2xl` | 24 |
| `radius/full` | 9999 |

### 5. Effect styles (shadows)

| Style | CSS token |
|-------|-----------|
| Soft | `--shadow-soft` |
| Card | `--shadow-card` |
| Lift | `--shadow-lift` |
| Nav | `--shadow-nav` |
| Glow | `--shadow-glow` |
| CTA | `--shadow-cta` |

## Komponen kunci (ukuran tetap)

| Komponen | Spec |
|----------|------|
| Header | h **72**, gutter 20/24, shell 1088 |
| Hero CTA | h **48**, radius full, padding-x 24 |
| Hero action icon | **64×64** circle |
| Hero action grid | 2-col mobile / 4-col ≥768 |
| Trust strip | radius 20, padding 20–24 × 24–40 |
| Access card | radius 20, padding 20, icon 44×44 |
| Input | h **44**, radius 12 |
| Footer | solid dark green stack, text 15 |

## Tips convert

1. Import / rebuild **frame per section** (header, hero, trust, actions, content, footer), bukan 1 page blur.
2. Orbs hero (`filter: blur`) → di Figma ganti ellipse solid opacity rendah, **jangan** expect blur CSS.
3. Gradient strip actions → 1 rectangle fill soap-200/100, 4 auto-layout items.
4. Jangan andalkan `::before` connector line — di Figma gambar garis 2px manual antar icon.
5. Pakai Auto Layout + variables di atas; hindari absolute random positioning.

## File order di HTML

```html
<link rel="stylesheet" href="css/tokens.css" />
<link rel="stylesheet" href="css/site.css" />
```

`tokens.css` **harus** sebelum `site.css` dan sebelum Tailwind generate (atau setidaknya sebelum body render styles yang pakai `var()`).
