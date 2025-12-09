#!/usr/bin/env node
/**
 * Simple test script to verify auto-fix system is working
 */

const fs = require('fs');
const path = require('path');

console.log('='.repeat(60));
console.log('Auto-Fix System Test');
console.log('='.repeat(60));
console.log('');

// Check if required files exist
const checks = [
  { name: 'Auto-Fix Script', path: 'scripts/auto-fix.js' },
  { name: 'Fix Patterns Config', path: 'scripts/fix-patterns.json' },
  { name: 'Logger Utility', path: 'scripts/utils/logger.js' },
  { name: 'Package.json', path: 'package.json' },
];

let allPassed = true;

checks.forEach(check => {
  const fullPath = path.join(process.cwd(), check.path);
  const exists = fs.existsSync(fullPath);
  
  if (exists) {
    console.log(`✅ ${check.name}: Found`);
  } else {
    console.log(`❌ ${check.name}: Missing`);
    allPassed = false;
  }
});

console.log('');

// Check Node.js version
const nodeVersion = process.version;
console.log(`Node.js Version: ${nodeVersion}`);

// Check if config is valid JSON
try {
  const configPath = path.join(process.cwd(), 'scripts/fix-patterns.json');
  const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
  console.log('✅ Configuration file is valid JSON');
  console.log(`   - Auto-fix patterns: ${Object.keys(config.patterns || {}).length}`);
  console.log(`   - Backup enabled: ${config.safety?.backupBeforeFix || false}`);
} catch (error) {
  console.log(`❌ Configuration file error: ${error.message}`);
  allPassed = false;
}

console.log('');

// Test finding source files
try {
  const srcPath = path.join(process.cwd(), 'src');
  if (fs.existsSync(srcPath)) {
    const files = [];
    function findFiles(dir, extensions) {
      if (!fs.existsSync(dir)) return;
      const entries = fs.readdirSync(dir, { withFileTypes: true });
      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory() && !entry.name.startsWith('.') && entry.name !== 'node_modules') {
          findFiles(fullPath, extensions);
        } else if (entry.isFile()) {
          const ext = path.extname(entry.name);
          if (extensions.includes(ext)) {
            files.push(fullPath);
          }
        }
      }
    }
    
    findFiles(srcPath, ['.js', '.jsx', '.ts', '.tsx']);
    console.log(`✅ Found ${files.length} source files to check`);
    
    if (files.length > 0) {
      console.log(`   Sample files:`);
      files.slice(0, 3).forEach(file => {
        const relative = path.relative(process.cwd(), file);
        console.log(`   - ${relative}`);
      });
      if (files.length > 3) {
        console.log(`   ... and ${files.length - 3} more`);
      }
    }
  } else {
    console.log('⚠️  src directory not found');
  }
} catch (error) {
  console.log(`⚠️  Error scanning files: ${error.message}`);
}

console.log('');
console.log('='.repeat(60));

if (allPassed) {
  console.log('✅ All checks passed! Auto-fix system is ready.');
  console.log('');
  console.log('Next steps:');
  console.log('  1. Run: npm run auto-fix:dry-run');
  console.log('  2. Review what would be fixed');
  console.log('  3. Run: npm run auto-fix (to apply fixes)');
  process.exit(0);
} else {
  console.log('❌ Some checks failed. Please review the errors above.');
  process.exit(1);
}