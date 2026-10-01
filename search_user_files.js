import fs from 'fs';
import path from 'path';

const rootDir = process.cwd();

function scanDir(dir) {
  try {
    const list = fs.readdirSync(dir);
    for (const item of list) {
      if (item === 'node_modules' || item === '.git' || item === 'dist') continue;
      const full = path.join(dir, item);
      const stat = fs.statSync(full);
      if (stat.isDirectory()) {
        console.log("[FOLDER]", path.relative(rootDir, full));
        scanDir(full);
      } else {
        const ext = path.extname(item).toLowerCase();
        if (['.pdf', '.png', '.jpg', '.jpeg', '.webp', '.gif', '.svg'].includes(ext)) {
          console.log("  [FILE]", path.relative(rootDir, full));
        }
      }
    }
  } catch (e) {
    console.error("Error scanning:", dir, e.message);
  }
}

console.log("Scanning workspace root:", rootDir);
scanDir(rootDir);
