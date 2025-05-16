const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const optimizeImage = async (inputPath, outputPath, options = {}) => {
  const {
    width = 1920,
    quality = 80,
    format = 'webp'
  } = options;

  try {
    await sharp(inputPath)
      .resize(width, null, {
        withoutEnlargement: true,
        fit: 'inside'
      })
      .toFormat(format, { quality })
      .toFile(outputPath);

    const stats = fs.statSync(outputPath);
    const originalStats = fs.statSync(inputPath);
    
    console.log(`Optimized ${path.basename(inputPath)}:`);
    console.log(`Original size: ${(originalStats.size / 1024 / 1024).toFixed(2)}MB`);
    console.log(`New size: ${(stats.size / 1024 / 1024).toFixed(2)}MB`);
    console.log(`Reduction: ${((1 - stats.size / originalStats.size) * 100).toFixed(1)}%`);
  } catch (error) {
    console.error(`Error optimizing ${inputPath}:`, error);
  }
};

// Optimize hero image
const heroImage = path.join(__dirname, '../public/heropic.jpg');
const optimizedHeroImage = path.join(__dirname, '../public/heropic.webp');

optimizeImage(heroImage, optimizedHeroImage, {
  width: 1920,
  quality: 80,
  format: 'webp'
}); 