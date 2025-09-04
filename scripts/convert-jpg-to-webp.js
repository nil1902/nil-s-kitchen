const glob = require('glob');
const sharp = require('sharp');
const path = require('path');

async function convertAllJpgToWebp() {
  const jpgFiles = glob.sync('nil-s-kitchen-1/public/assets/**/*.jpg');
  const promises = jpgFiles.map(async (file) => {
    const webpFile = file.replace(/\.jpg$/i, '.webp');
    try {
      await sharp(file).toFile(webpFile);
      console.log(`Converted ${file} -> ${webpFile}`);
    } catch (err) {
      console.error(`Error converting ${file}:`, err);
    }
  });
  await Promise.all(promises);
  console.log('All conversions complete.');
}

convertAllJpgToWebp(); 