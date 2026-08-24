/*
 * Vespera build. Pipeline:
 *   1. read readable root index.html
 *   2. extract the single inline <script> (the game)
 *   3. terser-minify that JS
 *   4. Roadroller-pack it into a self-extracting payload
 *   5. re-inline, then html-minifier-terser the surrounding HTML/CSS
 *      (minifyJS:false so the packed script is left untouched)
 *   6. zip (DEFLATE-9) to dist/game.zip and assert the 13,312-byte budget.
 * Root index.html stays readable & playable (GitHub Pages serves it directly).
 * Run: npm run build
 */
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const { minify } = require('html-minifier-terser');
const { minify: terser } = require('terser');

const ROOT = __dirname;
const SRC = path.join(ROOT, 'index.html');
const DIST_DIR = path.join(ROOT, 'dist');
const DIST = path.join(DIST_DIR, 'index.html');
const ZIP = path.join(DIST_DIR, 'game.zip');
const LIMIT = 13312;

(async () => {
  const html = fs.readFileSync(SRC, 'utf8');

  const m = html.match(/<script>([\s\S]*)<\/script>/);
  if (!m) throw new Error('no <script> block found');
  const rawJs = m[1];

  // 1) terser
  const t = await terser(rawJs, {
    compress: { passes: 3 },
    mangle: { toplevel: true },
    format: { comments: false },
  });
  const minJs = t.code;

  // 2) roadroller (ESM-only: load via dynamic import)
  const { Packer } = await import('roadroller');
  const packer = new Packer([{ data: minJs, type: 'js', action: 'eval' }], {});
  await packer.optimize(1);
  const { firstLine, secondLine } = packer.makeDecoder();
  const packed = firstLine + '\n' + secondLine;

  // 3) re-inline, then minify the shell (leave the packed script alone)
  const shell = html.replace(m[0], '<script>' + packed + '</script>');
  const out = await minify(shell, {
    collapseWhitespace: true,
    collapseBooleanAttributes: true,
    collapseInlineTagWhitespace: true,
    removeComments: true,
    removeAttributeQuotes: true,
    removeRedundantAttributes: true,
    removeEmptyAttributes: true,
    removeOptionalTags: true,
    minifyCSS: true,
    minifyJS: false,
  });

  fs.mkdirSync(DIST_DIR, { recursive: true });
  fs.writeFileSync(DIST, out);
  if (fs.existsSync(ZIP)) fs.unlinkSync(ZIP);

  execFileSync('python3', ['-c',
    'import sys,zipfile\n' +
    'z=zipfile.ZipFile(sys.argv[1],"w",zipfile.ZIP_DEFLATED,compresslevel=9)\n' +
    'z.write(sys.argv[2],"index.html")\n' +
    'z.close()',
    ZIP, DIST]);

  const bytes = fs.statSync(ZIP).size;
  const pct = ((bytes / LIMIT) * 100).toFixed(1);
  console.log(`\nJS (terser)  : ${Buffer.byteLength(minJs)} bytes`);
  console.log(`JS (packed)  : ${Buffer.byteLength(packed)} bytes`);
  console.log(`HTML (final) : ${Buffer.byteLength(out)} bytes`);
  console.log(`Zip size     : ${bytes} / ${LIMIT} bytes (${pct}%)`);
  console.log(`Remaining    : ${LIMIT - bytes} bytes\n`);
  if (bytes > LIMIT) {
    console.error(`✗ OVER BUDGET by ${bytes - LIMIT} bytes`);
    process.exit(1);
  }
  console.log('✓ Under budget\n');
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
