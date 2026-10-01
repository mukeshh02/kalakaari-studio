import fs from 'fs';

let html = fs.readFileSync('dist/index.html', 'utf8');

// Replace external TastyEdits upload URLs with local ./img/ paths
const uploadRegex = /https:\/\/www\.tastyedits\.com\/wp-content\/uploads\/[0-9]{4}\/[0-9]{2}\/([^\s"'`\)\\]+)/g;
const replacedFiles = new Set();

html = html.replace(uploadRegex, (fullMatch, filename) => {
  replacedFiles.add(filename);
  return `./img/${filename}`;
});

console.log(`Replaced ${replacedFiles.size} unique image URLs to local ./img/ paths.`);
replacedFiles.forEach(f => console.log('  -', f));

fs.writeFileSync('dist/index.html', html, 'utf8');
console.log('Successfully updated dist/index.html with local image paths!');
