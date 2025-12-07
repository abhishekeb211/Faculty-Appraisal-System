# Auto-Fix System Documentation

## Overview

The Auto-Fix System automatically identifies and fixes common code quality issues in your codebase. It integrates with ESLint, Prettier, and custom fix patterns to ensure consistent code quality.

## Features

### Code Formatting
- Automatic Prettier formatting
- Consistent indentation and spacing
- Standardized code style

### Linting Fixes
- ESLint auto-fixable issues
- Unused import removal
- Import organization
- Code quality improvements

### Console.log Replacement
- Removes or replaces console.log statements
- Uses logging utility in production
- Preserves logging in development

### Import Organization
- External imports first
- Internal imports second
- Relative imports last
- Alphabetical sorting

## Usage

### Command Line

```bash
# Basic usage
./scripts/auto-fix.sh

# Dry run (preview changes)
./scripts/auto-fix.sh --dry-run

# PowerShell (Windows)
.\scripts\auto-fix.ps1 -DryRun

# Node.js directly
node scripts/auto-fix.js --dry-run
```

### Options

| Option | Description | Example |
|--------|-------------|---------|
| `--dry-run` / `-d` | Preview changes without applying | `--dry-run` |
| `--log-level=LEVEL` | Set log level | `--log-level=DEBUG` |
| `--backup-dir=DIR` | Custom backup directory | `--backup-dir=./my-backups` |

### Programmatic Usage

```javascript
const AutoFixer = require('./scripts/auto-fix.js');

const fixer = new AutoFixer({
  dryRun: false,
  logLevel: 'INFO',
  backupDir: './backups'
});

fixer.runAutoFix().then(result => {
  console.log(`Fixed ${result.fixesApplied} files`);
});
```

## Configuration

### Fix Patterns (`scripts/fix-patterns.json`)

```json
{
  "patterns": {
    "consoleLogReplacement": {
      "enabled": true,
      "pattern": "console\\.(log|debug|info|warn|error)\\s*\\(",
      "replacement": {
        "production": "// Removed console statement",
        "development": "console.$1(",
        "utility": "logError"
      },
      "fileExtensions": [".js", ".jsx", ".ts", ".tsx"]
    },
    "importOrganization": {
      "enabled": true,
      "rules": {
        "externalFirst": true,
        "internalSecond": true,
        "relativeLast": true,
        "alphabetical": true
      }
    },
    "codeFormatting": {
      "enabled": true,
      "tools": ["prettier"],
      "config": ".prettierrc"
    },
    "linting": {
      "enabled": true,
      "tools": ["eslint"],
      "autoFix": true,
      "extensions": [".js", ".jsx", ".ts", ".tsx"]
    }
  },
  "safety": {
    "backupBeforeFix": true,
    "dryRunMode": false,
    "requireApproval": false,
    "maxFilesPerRun": 100,
    "excludedPaths": [
      "node_modules",
      "dist",
      "build",
      ".git",
      "coverage",
      "reports"
    ]
  }
}
```

## Fix Patterns

### Console.log Replacement

**Pattern:** `console.(log|debug|info|warn|error)`

**Before:**
```javascript
console.log('Debug message');
console.error('Error occurred');
```

**After (Production):**
```javascript
// Removed console statement
// Removed console statement
```

**After (Development):**
```javascript
console.log('Debug message'); // Preserved
console.error('Error occurred'); // Preserved
```

### Import Organization

**Before:**
```javascript
import { useState } from 'react';
import './styles.css';
import { api } from '../utils/api';
import axios from 'axios';
```

**After:**
```javascript
import axios from 'axios';
import { useState } from 'react';
import { api } from '../utils/api';
import './styles.css';
```

### Code Formatting

Automatically formats code using Prettier:
- Indentation
- Spacing
- Line breaks
- Quotes
- Semicolons

### ESLint Auto-Fix

Fixes automatically fixable ESLint issues:
- Missing semicolons
- Unused variables
- Import order
- Code style violations

## Safety Features

### Backup System

Before making changes, backups are created:
- Location: `.backups/` directory
- Format: Mirrors original directory structure
- Timestamp: Included in backup path

### Dry Run Mode

Preview changes without applying:
```bash
./scripts/auto-fix.sh --dry-run
```

Output shows what would be changed without modifying files.

### File Limits

- Maximum files per run: Configurable (default: 100)
- Excluded paths: node_modules, dist, build, etc.
- File type filtering: Only processes specified extensions

### Error Handling

- Continues on errors
- Logs all errors
- Provides summary of failures
- Preserves original files on error

## Integration

### GitHub Actions

Auto-fix runs automatically on:
- Pull requests
- Scheduled checks
- Manual triggers

### Pre-Commit Hook

Add to `.git/hooks/pre-commit`:

```bash
#!/bin/bash
./scripts/auto-fix.sh
git add -A
```

### Package.json Scripts

Add to `package.json`:

```json
{
  "scripts": {
    "fix": "./scripts/auto-fix.sh",
    "fix:dry": "./scripts/auto-fix.sh --dry-run"
  }
}
```

## Custom Fix Patterns

### Adding a Custom Pattern

Edit `scripts/auto-fix.js`:

```javascript
customFixPattern(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  const originalContent = content;
  
  // Your custom fix logic
  content = content.replace(/oldPattern/g, 'newReplacement');
  
  if (content !== originalContent) {
    this.createBackup(filePath);
    fs.writeFileSync(filePath, content, 'utf8');
    this.fixesApplied++;
    return true;
  }
  return false;
}
```

### Pattern Configuration

Add to `fix-patterns.json`:

```json
{
  "patterns": {
    "myCustomFix": {
      "enabled": true,
      "pattern": "your-regex-pattern",
      "replacement": "replacement-text",
      "fileExtensions": [".js", ".jsx"]
    }
  }
}
```

## Troubleshooting

### Fixes Not Applied

1. Check if pattern is enabled in `fix-patterns.json`
2. Verify file extensions match
3. Check excluded paths
4. Run with `--log-level=DEBUG` for details

### Backup Not Created

1. Verify `backupBeforeFix` is `true`
2. Check write permissions
3. Verify backup directory is writable

### ESLint/Prettier Not Running

1. Verify tools are installed: `npm list prettier eslint`
2. Check configuration files exist
3. Verify file extensions match

### Too Many Files Processed

1. Adjust `maxFilesPerRun` in configuration
2. Add more paths to `excludedPaths`
3. Use file type filtering

## Best Practices

1. **Start with Dry Run**: Always preview changes first
2. **Review Changes**: Check git diff after auto-fix
3. **Commit Separately**: Don't mix auto-fixes with feature changes
4. **Test After Fix**: Run tests after auto-fixing
5. **Use Incrementally**: Enable patterns gradually
6. **Monitor Logs**: Check log files for issues
7. **Backup Important Code**: Always have backups before bulk changes

## Limitations

### What Auto-Fix Can Do

✅ Format code  
✅ Fix ESLint auto-fixable issues  
✅ Remove unused imports  
✅ Replace console.log  
✅ Organize imports  
✅ Fix basic code style  

### What Auto-Fix Cannot Do

❌ Fix logic errors  
❌ Add missing functionality  
❌ Fix TypeScript type errors (non-auto-fixable)  
❌ Fix complex ESLint issues  
❌ Refactor complex code  
❌ Fix test failures  

## Examples

### Example 1: Basic Auto-Fix

```bash
# Run auto-fix
./scripts/auto-fix.sh

# Output:
# [INFO] Starting auto-fix...
# [INFO] Found 45 files to process
# [SUCCESS] Prettier formatted 45 files
# [SUCCESS] ESLint fixed 12 files
# [SUCCESS] Auto-fix completed
```

### Example 2: Dry Run

```bash
# Preview changes
./scripts/auto-fix.sh --dry-run

# Output:
# [INFO] Starting auto-fix (DRY RUN MODE)...
# [DEBUG] Would fix: src/components/Button.jsx
# [DEBUG] Would fix: src/utils/helpers.js
# [INFO] Files that would be fixed: 5
```

### Example 3: Custom Configuration

```json
{
  "patterns": {
    "consoleLogReplacement": {
      "enabled": false
    },
    "codeFormatting": {
      "enabled": true
    }
  },
  "safety": {
    "maxFilesPerRun": 50
  }
}
```

## API Reference

### AutoFixer Class

```javascript
class AutoFixer {
  constructor(options)
  runAutoFix(): Promise<Result>
  fixFile(filePath): void
  replaceConsoleLogs(filePath): boolean
  runPrettier(files): void
  runESLint(files): void
}
```

### Result Object

```javascript
{
  filesProcessed: number,
  fixesApplied: number,
  errors: number,
  success: boolean
}
```

## Contributing

To add new fix patterns:

1. Add pattern configuration to `fix-patterns.json`
2. Implement fix logic in `auto-fix.js`
3. Add tests (if applicable)
4. Update documentation
5. Submit pull request

---

**Last Updated**: December 2024  
**Maintained By**: Development Team