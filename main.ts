import { copyFileSync, existsSync, mkdirSync, chmodSync, statSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const src = join(here, "entry.png");

if (!existsSync(src)) {
  console.error(`entry.png not found next to main.ts (looked in ${here})`);
  process.exit(1);
}

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
mkdirSync(outDir, { recursive: true });

const dest = join(outDir, "entry.png");
copyFileSync(src, dest);
chmodSync(dest, 0o644);

const srcBytes = statSync(src).size;
const destBytes = statSync(dest).size;
if (destBytes !== srcBytes) {
  console.error(`copy verification failed: source ${srcBytes} bytes, wrote ${destBytes} bytes`);
  process.exit(1);
}

console.log(`Wrote ${dest} (${destBytes} bytes, verified against source)`);
