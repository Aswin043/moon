const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Function to get directory size
function getDirectorySize(dirPath) {
  let size = 0;
  const files = fs.readdirSync(dirPath);
  
  for (const file of files) {
    const filePath = path.join(dirPath, file);
    const stats = fs.statSync(filePath);
    
    if (stats.isDirectory()) {
      size += getDirectorySize(filePath);
    } else {
      size += stats.size;
    }
  }
  
  return size;
}

// Function to format size
function formatSize(bytes) {
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  if (bytes === 0) return '0 Byte';
  const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
  return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
}

// Analyze bundle
console.log('Analyzing bundle size...\n');

// Check .next directory
const nextDir = path.join(__dirname, '../.next');
if (fs.existsSync(nextDir)) {
  const nextSize = getDirectorySize(nextDir);
  console.log(`.next directory size: ${formatSize(nextSize)}`);
  
  // Check specific directories
  const staticDir = path.join(nextDir, 'static');
  if (fs.existsSync(staticDir)) {
    const staticSize = getDirectorySize(staticDir);
    console.log(`Static files size: ${formatSize(staticSize)}`);
  }
}

// Check public directory
const publicDir = path.join(__dirname, '../public');
if (fs.existsSync(publicDir)) {
  const publicSize = getDirectorySize(publicDir);
  console.log(`\nPublic directory size: ${formatSize(publicSize)}`);
  
  // List large files in public directory
  console.log('\nLarge files in public directory:');
  const files = fs.readdirSync(publicDir);
  files.forEach(file => {
    const filePath = path.join(publicDir, file);
    const stats = fs.statSync(filePath);
    if (stats.size > 1024 * 1024) { // Files larger than 1MB
      console.log(`${file}: ${formatSize(stats.size)}`);
    }
  });
}

// Check node_modules size
const nodeModulesDir = path.join(__dirname, '../node_modules');
if (fs.existsSync(nodeModulesDir)) {
  const nodeModulesSize = getDirectorySize(nodeModulesDir);
  console.log(`\nnode_modules size: ${formatSize(nodeModulesSize)}`);
}

console.log('\nBundle analysis complete!'); 