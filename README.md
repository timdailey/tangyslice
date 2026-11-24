# Tangyslice Collective site

Jekyll site deployed to GitHub Pages by `.github/workflows/jekyll.yml` on push to `main`.

## Post images

Keep images small so the blog stays fast. For each post in `_posts/`:

| Front matter | Size | Notes |
|---|---|---|
| `thumb` | 960×540 webp, under ~70 KB | Used on the home page, blog index and thank-you page. |
| (no field) | 320×180 webp named `<thumb>-320.webp` | Optional. When present, list views load this instead. |
| `og_image` | 1200×630 or 1280×720 webp, under ~120 KB | Social share image. Pages without one use `/assets/img/og-default.webp`. |

Images inside a post should be at most 1600 px wide. Add the size so the page doesn't jump while it loads:

```markdown
![Alt text](/assets/img/blog/example.webp){: width="1600" height="900" loading="lazy"}
```

With ImageMagick:

```sh
convert source.png -resize 960x540^ -gravity center -extent 960x540 -quality 78 post-thumb.webp
convert source.png -resize 320x180^ -gravity center -extent 320x180 -quality 78 post-thumb-320.webp
```

## Fonts

Teko, Inter and IBM Plex Serif are self-hosted in `assets/fonts/` and declared at the top of `assets/css/main.css`.
