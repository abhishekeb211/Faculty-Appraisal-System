#!/bin/bash
# Watch Mode Script - File watcher with auto-fix and test on save
# For development mode with automatic validation

set -e

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

# Colors
CYAN='\033[0;36m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

log() {
    echo -e "${CYAN}[WATCH]${NC} $@"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $@"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $@"
}

check_dependencies() {
    log "Checking dependencies..."
    
    # Check for file watcher tools
    if command -v fswatch &> /dev/null; then
        WATCHER="fswatch"
        log_success "Using fswatch for file watching"
        return 0
    elif command -v inotifywait &> /dev/null; then
        WATCHER="inotifywait"
        log_success "Using inotifywait for file watching"
        return 0
    else
        log_warn "No file watcher found. Install fswatch (macOS) or inotify-tools (Linux)"
        log "Running auto-fix once and exiting..."
        return 1
    fi
}

run_auto_fix() {
    log "File changed - running auto-fix..."
    bash "$SCRIPT_DIR/auto-fix.sh" 2>&1 | grep -v "^\[" || true
    log_success "Auto-fix completed"
}

run_tests() {
    log "Running tests..."
    npm run test -- --run 2>&1 | tail -n 5 || true
}

watch_files() {
    log "Starting file watcher..."
    log "Watching: src/**/*.{js,jsx,ts,tsx}"
    log "Press Ctrl+C to stop"
    
    local watch_paths=(
        "$PROJECT_ROOT/src"
        "$PROJECT_ROOT/scripts"
    )
    
    case $WATCHER in
        fswatch)
            fswatch -o "${watch_paths[@]}" | while read f; do
                run_auto_fix
                run_tests
            done
            ;;
        inotifywait)
            inotifywait -m -r -e modify,create,delete "${watch_paths[@]}" --format '%w%f' | while read file; do
                if [[ "$file" =~ \.(js|jsx|ts|tsx)$ ]]; then
                    run_auto_fix
                    run_tests
                fi
            done
            ;;
    esac
}

main() {
    cd "$PROJECT_ROOT"
    
    log "Watch Mode - Auto-fix and Test on Save"
    
    if ! check_dependencies; then
        run_auto_fix
        exit 0
    fi
    
    watch_files
}

trap 'log "Stopping file watcher..."; exit 0' INT TERM

main