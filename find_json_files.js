import fs from 'fs';
import path from 'path';

const distDir = path.join(process.cwd(), 'dist');

function findJson(dir) {
  const files = fs.readdirSync(dir);
  for (const f of files) {
    const full = path.join(dir, f);
    if (fs.statSync(full).isDirectory()) {
      findJson(full);
    } else if (f.endsWith('.json')) {
      console.log("Found JSON:", path.relative(distDir, full));
    }
  }
}

findJson(distDir);
