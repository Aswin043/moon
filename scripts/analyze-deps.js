const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

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

function formatSize(bytes) {
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  if (bytes === 0) return '0 Byte';
  const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
  return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
}

const nodeModulesDir = path.join(__dirname, '../node_modules');
const packages = fs.readdirSync(nodeModulesDir)
  .filter(dir => !dir.startsWith('.'))
  .map(dir => {
    const dirPath = path.join(nodeModulesDir, dir);
    const size = getDirectorySize(dirPath);
    return { name: dir, size };
  })
  .sort((a, b) => b.size - a.size);

console.log('Package sizes in node_modules:\n');
packages.forEach(pkg => {
  console.log(`${pkg.name}: ${formatSize(pkg.size)}`);
});

const totalSize = packages.reduce((sum, pkg) => sum + pkg.size, 0);
console.log(`\nTotal size: ${formatSize(totalSize)}`); 