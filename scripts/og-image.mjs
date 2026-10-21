// Generates public/og-image.png (1200×630) and public/apple-touch-icon.png (180×180).
// Run after changing branding: `npm run og`.
import sharp from 'sharp';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const root = new URL('../public/', import.meta.url);
const mark =
  '<path d="m71.66,0C32.08,0,0,32.08,0,71.66v144.34L216,0H71.66Z"/>' +
  '<path d="m432,216v144c0,39.76-32.24,72-72,72h-72c-39.76,0-72-32.24-72-72v-144L0,432v143.96c0,39.79,32.25,72.04,72.04,72.04h359.96l216-216V0l-216,216Z"/>';

const sans = "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif";
const mono = "'JetBrains Mono', 'Cascadia Mono', Consolas, 'Courier New', monospace";

const og = `
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <radialGradient id="glow" cx="0.85" cy="0" r="0.75">
      <stop offset="0" stop-color="#ffccd8" stop-opacity="0.16"/>
      <stop offset="1" stop-color="#ffccd8" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="1200" height="630" fill="#0a0a0b"/>
  <rect width="1200" height="630" fill="url(#glow)"/>
  <g transform="translate(80 72) scale(0.0926)" fill="#ffccd8">${mark}</g>
  <text x="152" y="108" font-family="${sans}" font-size="22" font-weight="600" letter-spacing="2" fill="#edebe6">ELIJAH KÜNSTLER</text>
  <text x="152" y="134" font-family="${mono}" font-size="15" letter-spacing="3" fill="#a1a1a8">IKU.GROUP</text>

  <text x="80" y="268" font-family="${mono}" font-size="17" letter-spacing="3" fill="#a1a1a8">AI PIPELINE ARCHITECT  |  EXECUTIVE PRODUCER  |  STRATEGIC ADVISOR</text>
  <text x="77" y="350" font-family="${sans}" font-size="54" font-weight="600" letter-spacing="-2" fill="#edebe6">Engineering Generative Systems.</text>
  <text x="77" y="416" font-family="${sans}" font-size="54" font-weight="600" letter-spacing="-2" fill="#a1a1a8">Producing High-Impact Commercial Media.</text>

  <line x1="80" x2="1120" y1="520" y2="520" stroke="#ffffff" stroke-opacity="0.1"/>
  <circle cx="86" cy="562" r="6" fill="#5be38f"/>
  <text x="104" y="568" font-family="${mono}" font-size="16" letter-spacing="2" fill="#a1a1a8">AVAILABLE FOR ADVISORY &amp; TURNKEY PRODUCTION</text>
  <text x="1120" y="568" text-anchor="end" font-family="${sans}" font-size="20" font-weight="500" fill="#ffccd8">www.ikunstler.com</text>
</svg>`;

await sharp(Buffer.from(og)).png().toFile(fileURLToPath(new URL('og-image.png', root)));

const favicon = await readFile(new URL('favicon.svg', root));
await sharp(favicon, { density: 300 })
  .resize(180, 180)
  .flatten({ background: '#0a0a0b' })
  .png()
  .toFile(fileURLToPath(new URL('apple-touch-icon.png', root)));

console.log('✓ og-image.png, apple-touch-icon.png');
