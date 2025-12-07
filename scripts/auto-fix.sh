#!/bin/bash
# Auto-Fix Script - Comprehensive auto-fix script for common code quality issues
# Cross-platform shell script wrapper

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
LOG_FILE="${LOG_FILE:-$PROJECT_ROOT/reports/auto-fix-$(date +%Y%m%d-%H%M%S).log}"

# Create reports directory if it doesn't exist
mkdir -p "$(dirname "$LOG_FILE")"

log() {
    local level=$1
    shift
    local message="$@"
    local timestamp=$(date '+%Y-%m-%d %H:%M:%S')
    echo -e "[$timestamp] [$level] $message" | tee -a "$LOG_FILE"
}

log_info() {
    log "INFO" "${CYAN}$@${NC}"
}

log_success() {
    log "SUCCESS" "${GREEN}$@${NC}"
}

log_warn() {
    log "WARN" "${YELLOW}$@${NC}"
}

log_error() {
    log "ERROR" "${RED}$@${NC}"
}

log_section() {
    echo ""
    echo "============================================================"
    echo "$@"
    echo "============================================================"
    echo ""
}

# Parse arguments
DRY_RUN=false
FORCE=false

while [[ $# -gt 0 ]]; do
    case $1 in
        --dry-run|-d)
            DRY_RUN=true
            shift
            ;;
        --force|-f)
            FORCE=true
            shift
            ;;
        *)
            log_error "Unknown option: $1"
            exit 1
            ;;
    esac
done

cd "$PROJECT_ROOT"

log_section "Auto-Fix System"
log_info "Starting auto-fix${DRY_RUN:+ (DRY RUN MODE)}..."

# Check if Node.js is available
if ! command -v node &> /dev/null; then
    log_error "Node.js is not installed. Please install Node.js to use auto-fix."
    exit 1
fi

# Check if npm is available
if ! command -v npm &> /dev/null; then
    log_error "npm is not installed. Please install npm to use auto-fix."
    exit 1
fi

# Run the Node.js auto-fix utility
log_info "Running intelligent auto-fix utility..."

if [ "$DRY_RUN" = true ]; then
    node "$SCRIPT_DIR/auto-fix.js" --dry-run --log-level=INFO
else
    node "$SCRIPT_DIR/auto-fix.js" --log-level=INFO
fi

AUTO_FIX_EXIT_CODE=$?

if [ $AUTO_FIX_EXIT_CODE -ne 0 ]; then
    log_warn "Auto-fix utility completed with warnings"
fi

# Run Prettier if available
if command -v npx &> /dev/null; then
    log_info "Running Prettier auto-formatting..."
    
    if [ "$DRY_RUN" = true ]; then
        log_info "[DRY RUN] Would run: npx prettier --write \"src/**/*.{js,jsx,ts,tsx}\""
    else
        if npx prettier --write "src/**/*.{js,jsx,ts,tsx}" 2>&1 | tee -a "$LOG_FILE"; then
            log_success "Prettier formatting completed"
        else
            log_warn "Prettier completed with warnings"
        fi
    fi
fi

# Run ESLint auto-fix if available
if command -v npx &> /dev/null; then
    log_info "Running ESLint auto-fix..."
    
    if [ "$DRY_RUN" = true ]; then
        log_info "[DRY RUN] Would run: npx eslint --fix \"src/**/*.{js,jsx,ts,tsx}\""
    else
        if npx eslint --fix "src/**/*.{js,jsx,ts,tsx}" 2>&1 | tee -a "$LOG_FILE"; then
            log_success "ESLint auto-fix completed"
        else
            log_warn "ESLint completed (some issues may remain unfixable)"
        fi
    fi
fi

# Type check if TypeScript
if [ -f "tsconfig.json" ]; then
    log_info "Running TypeScript type check..."
    
    if [ "$DRY_RUN" = true ]; then
        log_info "[DRY RUN] Would run: npm run type-check"
    else
        if npm run type-check 2>&1 | tee -a "$LOG_FILE"; then
            log_success "TypeScript type check passed"
        else
            log_warn "TypeScript type check found issues (non-blocking)"
        fi
    fi
fi

log_section "Auto-Fix Complete"
log_success "Auto-fix process completed. Check log: $LOG_FILE"

exit 0