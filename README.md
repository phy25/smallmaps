# smallmaps

A static [IIIF](https://iiif.io/) image host and map viewer built with [Build Awesome (Eleventy)](https://www.11ty.dev/). Each map is a Markdown file with YAML frontmatter; the build pre-generates IIIF image tiles, manifests, and a [Leaflet](https://leafletjs.com/) + [Allmaps](https://allmaps.org/) viewer.

Deployed at **[allmaps-st.phy.moe](https://allmaps-st.phy.moe)**.

Most of the code in this project was written with [Claude Sonnet 4.6](https://www.anthropic.com/news/claude-sonnet-4-6).

## Features

- IIIF Image API 3 pre-generated at build time with large tiles
- IIIF Presentation API 3 manifest per map
- Leaflet viewer with layer toggle and opacity control
- Georeference overlays via Allmaps

## Local development

**1. Install dependencies**

```bash
npm install
```

**2. Generate a self-signed certificate** (needed for Allmaps HTTPS requirement)

```bash
openssl req -x509 -newkey rsa:2048 -keyout key.pem -out cert.pem -days 365 -nodes -subj "/CN=localhost"
```

**3. Start the dev server**

```bash
BASE_URL=https://localhost:8000 npm run dev
```

The site is served at `https://localhost:8000`. On first visit, click through the browser's self-signed certificate warning (or add `cert.pem` to your system trust store).

## Adding a map

1. Create a folder under `src/maps/{id}/`
2. Add the source image (JPEG) to that folder
3. Create `src/maps/{id}/index.md` with YAML frontmatter:

```yaml
---
image_file: your-image.jpg

label:
  en: "Map Title"
  zh: "地图标题"

description: "A short description."
annotation_json_url: "https://annotations.allmaps.org/images/..."
more_link: "https://example.com"
edit_link: ""
---
```

The next build generates:

| Path | Description |
|------|-------------|
| `/maps/{id}/manifest.json` | IIIF Presentation manifest |
| `/maps/{id}/image/info.json` | IIIF image info |
| `/maps/{id}/image/full/{w},{h}/0/default.jpg` | Full-res tile |
| `/maps/{id}/image/full/{w/2},{h/2}/0/default.jpg` | Half-res tile |

## Build

```bash
npm run build
```

Output goes to `_site/`.
