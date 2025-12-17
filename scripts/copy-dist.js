import { copyFileSync, mkdirSync, readdirSync, statSync, rmSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');
const distDir = join(rootDir, 'client', 'dist');

function copyRecursive(src, dest) {
  const stats = statSync(src);
  
  if (stats.isDirectory()) {
    if (!readdirSync(rootDir).includes(dest.split(/[/\\]/).pop())) {
      mkdirSync(dest, { recursive: true });
    }
    
    const files = readdirSync(src);
    for (const file of files) {
      const srcPath = join(src, file);
      const destPath = join(dest, file);
      copyRecursive(srcPath, destPath);
    }
  } else {
    copyFileSync(src, dest);
  }
}

// 루트에 배포할 파일들만 복사 (소스 파일은 제외)
const filesToCopy = ['index.html', 'assets', 'videos', 'vite.svg', '_redirects'];

console.log('Copying build files to root...');

for (const file of filesToCopy) {
  const srcPath = join(distDir, file);
  const destPath = join(rootDir, file);
  
  try {
    const stats = statSync(srcPath);
    if (stats.isFile() || stats.isDirectory()) {
      // 기존 파일/폴더 삭제
      try {
        const destStats = statSync(destPath);
        if (destStats.isDirectory()) {
          rmSync(destPath, { recursive: true, force: true });
        } else {
          rmSync(destPath, { force: true });
        }
      } catch (e) {
        // 파일이 없으면 무시
      }
      
      copyRecursive(srcPath, destPath);
      console.log(`✓ Copied ${file}`);
    }
  } catch (e) {
    console.warn(`⚠ Skipped ${file}: ${e.message}`);
  }
}

console.log('Done! Files copied to root directory.');

