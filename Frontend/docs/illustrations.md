# 2D Illustration Guide (Cars and Scenes)

Recommended free resources (commercial-friendly):
- unDraw — https://undraw.co/illustrations (clean SVGs, no attribution)
- SVG Repo — https://www.svgrepo.com (large SVG/icon library)
- Open Doodles — https://www.opendoodles.com (hand-drawn style SVGs)
- Icons8 Illustrations — https://icons8.com/illustrations (many free)
- Storyset by Freepik — https://storyset.com (attribution required on free)

Tips:
- Prefer SVG for crisp scaling and easy color changes (inline or via `currentColor`).
- Match the landing page’s simple black/white road aesthetic for consistency.
- Keep shapes simple and readable from a distance.

## How to Integrate

1) Pick assets
   - Example: `car-broken.svg` (hood open), `car-driving.svg` (moving).

2) Add to your project
   - Put files in `public/images/` (e.g., `/public/images/car-broken.jpg`).

3) Use in components (Next.js Image)
\`\`\`tsx
import Image from "next/image"

export function RoadCars() {
  return (
    <div className="relative h-40 bg-black">
      <Image
        src="/images/car-broken.jpg"
        alt="Car with hood open — breakdown"
        width={140}
        height={70}
        className="absolute left-[6%] bottom-6"
        priority
      />
      <Image
        src="/images/car-driving.jpg"
        alt="Car driving — breakthrough"
        width={160}
        height={80}
        className="absolute right-[10%] bottom-5"
        priority
      />
    </div>
  )
}
\`\`\`

4) Recolor SVGs (optional)
- Change `fill`/`stroke` in the SVG file, or set them to `currentColor` and apply Tailwind text classes.

5) Accessibility
- Use descriptive `alt` text; use `alt=""` and `aria-hidden="true"` if purely decorative.

6) Performance
- Provide explicit `width`/`height` for predictable layout.
- Use `priority` for above-the-fold images.

7) Replacing current placeholders
- Replace `public/images/car-broken.jpg` and `car-driving.png` with your chosen files (same names) or update the `src` in `components/landing-hero.tsx`.
