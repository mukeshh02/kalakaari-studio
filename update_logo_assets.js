import fs from 'fs';
import path from 'path';
import Jimp from 'jimp';
import potrace from 'potrace';

async function updateLogos() {
  const rootDir = process.cwd();
  const inputLogo = path.join(rootDir, '.png');
  const distImgDir = path.join(rootDir, 'dist', 'img');

  console.log('Processing input logo:', inputLogo);
  const img = await Jimp.read(inputLogo);
  img.autocrop();
  console.log('Autocropped dimensions:', img.bitmap.width, 'x', img.bitmap.height);

  // 1. Save cropped original & dark PNG
  await img.writeAsync(path.join(distImgDir, 'kalakaari-logo-dark.png'));
  await img.writeAsync(path.join(distImgDir, 'kalakaari-logo-original.png'));

  // Also save a non-hidden copy in root as backup
  await img.writeAsync(path.join(rootDir, 'kalakaari-studio-logo.png'));

  // 2. Generate White PNG (Light version for dark backgrounds)
  const lightImg = img.clone();
  lightImg.scan(0, 0, lightImg.bitmap.width, lightImg.bitmap.height, (x, y, idx) => {
    lightImg.bitmap.data[idx] = 255;     // R
    lightImg.bitmap.data[idx + 1] = 255; // G
    lightImg.bitmap.data[idx + 2] = 255; // B
  });
  await lightImg.writeAsync(path.join(distImgDir, 'kalakaari-logo-light.png'));

  // 3. Create Square (1080x1080) for OpenGraph / Favicon
  const squareImg = new Jimp(1080, 1080, 0x00000000);
  const scaledLight = lightImg.clone();
  scaledLight.scaleToFit(960, 960);
  const xOffset = Math.round((1080 - scaledLight.bitmap.width) / 2);
  const yOffset = Math.round((1080 - scaledLight.bitmap.height) / 2);
  squareImg.composite(scaledLight, xOffset, yOffset);
  await squareImg.writeAsync(path.join(distImgDir, 'kalakaari-logo-square.png'));

  // 4. Generate SVG via Potrace with high precision
  const tempCroppedPath = path.join(rootDir, 'temp_cropped.png');
  await img.writeAsync(tempCroppedPath);

  potrace.trace(tempCroppedPath, {
    color: '#FFFFFF',
    optTolerance: 0.2,
    turdSize: 2,
    threshold: 128
  }, (err, lightSvg) => {
    if (err) {
      console.error('Error tracing SVG:', err);
      return;
    }

    const darkSvg = lightSvg.replace(/fill="#FFFFFF"/g, 'fill="#111111"');

    fs.writeFileSync(path.join(distImgDir, 'kalakaari-logo-light.svg'), lightSvg);
    fs.writeFileSync(path.join(distImgDir, 'kalakaari-logo-dark.svg'), darkSvg);

    if (fs.existsSync(tempCroppedPath)) {
      fs.unlinkSync(tempCroppedPath);
    }

    console.log('Successfully updated all SVG & PNG logo assets in dist/img!');
  });
}

updateLogos().catch(console.error);
