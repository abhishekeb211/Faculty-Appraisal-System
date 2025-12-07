#!/usr/bin/env node
/**
 * Intelligent Auto-Fix Utility
 * Automatically fixes common code quality issues in the codebase
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const Logger = require('./utils/logger');

// Configuration
const configPath = path.join(__dirname, 'fix-patterns.json');
const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));

class AutoFixer {
  constructor(options = {}) {
    this.logger = new Logger(options.logLevel || 'INFO');
    this.dryRun = options.dryRun || config.safety.dryRunMode;
    this.backupDir = options.backupDir || path.join(process.cwd(), '.backups');
    this.fixesApplied = 0;
    this.errors = [];
    this.projectRoot = process.cwd();
  }

  log(message, level = 'info') {
    this.logger[level](message);
  }

  ensureBackupDir() {
    if (!fs.existsSync(this.backupDir)) {
      fs.mkdirSync(this.backupDir, { recursive: true });
    }
  }

  createBackup(filePath) {
    if (!config.safety.backupBeforeFix) return null;
    
    this.ensureBackupDir();
    const relativePath = path.relative(this.projectRoot, filePath);
    const backupPath = path.join(this.backupDir, relativePath);
    const backupDir = path.dirname(backupPath);
    
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir, { recursive: true });
    }
    
    fs.copyFileSync(filePath, backupPath);
    return backupPath;
  }

  shouldExclude(filePath) {
    const relativePath = path.relative(this.projectRoot, filePath);
    return config.safety.excludedPaths.some(excluded => 
      relativePath.includes(excluded) || relativePath.startsWith(excluded)
    );
  }

  findAllFiles(dir, extensions) {
    const files = [];
    
    try {
      const entries = fs.readdirSync(dir, { withFileTypes: true });
      
      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        
        if (this.shouldExclude(fullPath)) continue;
        
        if (entry.isDirectory()) {
          files.push(...this.findAllFiles(fullPath, extensions));
        } else if (entry.isFile()) {
          const ext = path.extname(entry.name);
          if (extensions.includes(ext)) {
            files.push(fullPath);
          }
        }
      }
    } catch (error) {
      this.log(`Error reading directory ${dir}: ${error.message}`, 'warn');
    }
    
    return files;
  }

  runPrettier(files) {
    if (!config.patterns.codeFormatting.enabled) return;
    
    this.log('Running Prettier auto-formatting...', 'info');
    
    try {
      const prettierCmd = `npx prettier --write ${files.join(' ')}`;
      if (!this.dryRun) {
        execSync(prettierCmd, { stdio: 'inherit', cwd: this.projectRoot });
        this.log(`Prettier formatted ${files.length} files`, 'success');
      } else {
        this.log(`[DRY RUN] Would run: ${prettierCmd}`, 'debug');
      }
    } catch (error) {
      this.log(`Prettier error: ${error.message}`, 'error');
      this.errors.push({ type: 'prettier', error: error.message });
    }
  }

  runESLint(files) {
    if (!config.patterns.linting.enabled) return;
    
    this.log('Running ESLint auto-fix...', 'info');
    
    try {
      const eslintCmd = `npx eslint --fix ${files.join(' ')}`;
      if (!this.dryRun) {
        execSync(eslintCmd, { stdio: 'inherit', cwd: this.projectRoot });
        this.log(`ESLint fixed issues in files`, 'success');
      } else {
        this.log(`[DRY RUN] Would run: ${eslintCmd}`, 'debug');
      }
    } catch (error) {
      // ESLint may exit with non-zero if unfixable issues exist
      this.log(`ESLint completed (some issues may remain)`, 'warn');
    }
  }

  replaceConsoleLogs(filePath) {
    if (!config.patterns.consoleLogReplacement.enabled) return false;
    
    const ext = path.extname(filePath);
    if (!config.patterns.consoleLogReplacement.fileExtensions.includes(ext)) {
      return false;
    }

    try {
      let content = fs.readFileSync(filePath, 'utf8');
      const originalContent = content;
      
      // Replace console.log statements
      const pattern = new RegExp(config.patterns.consoleLogReplacement.pattern, 'g');
      const isProduction = process.env.NODE_ENV === 'production';
      
      if (pattern.test(content)) {
        const replacement = isProduction
          ? config.patterns.consoleLogReplacement.replacement.production
          : config.patterns.consoleLogReplacement.replacement.development;
        
        content = content.replace(pattern, replacement);
        
        if (content !== originalContent) {
          if (!this.dryRun) {
            this.createBackup(filePath);
            fs.writeFileSync(filePath, content, 'utf8');
            this.fixesApplied++;
            this.log(`Fixed console.log statements in ${path.relative(this.projectRoot, filePath)}`, 'info');
          } else {
            this.log(`[DRY RUN] Would fix console.log in ${path.relative(this.projectRoot, filePath)}`, 'debug');
          }
          return true;
        }
      }
    } catch (error) {
      this.log(`Error processing ${filePath}: ${error.message}`, 'error');
      this.errors.push({ file: filePath, type: 'consoleLog', error: error.message });
    }
    
    return false;
  }

  organizeImports(filePath) {
    // This would typically use a tool like eslint-plugin-import or organize-imports-cli
    // For now, we'll just log that it should be done
    this.log(`Import organization for ${path.relative(this.projectRoot, filePath)} should be handled by ESLint`, 'debug');
  }

  fixFile(filePath) {
    if (this.shouldExclude(filePath)) return;
    
    this.replaceConsoleLogs(filePath);
    this.organizeImports(filePath);
  }

  async runAutoFix() {
    this.logger.section('Auto-Fix System');
    this.log(`Starting auto-fix${this.dryRun ? ' (DRY RUN MODE)' : ''}...`, 'info');
    
    // Find all fixable files
    const extensions = ['.js', '.jsx', '.ts', '.tsx'];
    this.log('Scanning for files to fix...', 'info');
    const files = this.findAllFiles(this.projectRoot, extensions);
    this.log(`Found ${files.length} files to process`, 'info');
    
    if (files.length > config.safety.maxFilesPerRun) {
      this.log(`Warning: ${files.length} files exceeds max (${config.safety.maxFilesPerRun}). Processing first ${config.safety.maxFilesPerRun} files.`, 'warn');
      files.splice(config.safety.maxFilesPerRun);
    }
    
    // Fix individual files
    for (const file of files) {
      this.fixFile(file);
    }
    
    // Run formatting tools
    if (files.length > 0) {
      this.runPrettier(files);
      this.runESLint(files);
    }
    
    // Summary
    this.logger.section('Auto-Fix Summary');
    this.log(`Files processed: ${files.length}`, 'info');
    this.log(`Fixes applied: ${this.fixesApplied}`, this.fixesApplied > 0 ? 'success' : 'info');
    this.log(`Errors: ${this.errors.length}`, this.errors.length > 0 ? 'error' : 'info');
    
    if (this.errors.length > 0) {
      this.log('Errors encountered:', 'error');
      this.errors.forEach(err => {
        this.log(`  - ${err.type}: ${err.error}`, 'error');
      });
    }
    
    return {
      filesProcessed: files.length,
      fixesApplied: this.fixesApplied,
      errors: this.errors.length,
      success: this.errors.length === 0
    };
  }
}

// CLI Interface
if (require.main === module) {
  const args = process.argv.slice(2);
  const options = {
    dryRun: args.includes('--dry-run') || args.includes('-d'),
    logLevel: args.find(arg => arg.startsWith('--log-level='))?.split('=')[1] || 'INFO',
    backupDir: args.find(arg => arg.startsWith('--backup-dir='))?.split('=')[1],
  };
  
  const fixer = new AutoFixer(options);
  fixer.runAutoFix()
    .then(result => {
      process.exit(result.success ? 0 : 1);
    })
    .catch(error => {
      console.error('Fatal error:', error);
      process.exit(1);
    });
}

module.exports = AutoFixer;