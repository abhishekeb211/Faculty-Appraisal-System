#!/bin/bash
# Continuous Loop Orchestrator
# Runs the full validation, fix, test, build, and deploy cycle continuously

set -e

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
INTERVAL=${INTERVAL:-3600}  # Default: 1 hour (3600 seconds)
LOG_FILE="${LOG_FILE:-$PROJECT_ROOT/reports/continuous-loop-$(date +%Y%m%d-%H%M%S).log}"
STATUS_FILE="${STATUS_FILE:-$PROJECT_ROOT/reports/loop-status.json}"

# Flags
AUTO_FIX=${AUTO_FIX:-true}
AUTO_DEPLOY=${AUTO_DEPLOY:-false}
RUN_TESTS=${RUN_TESTS:-true}
HEALTH_CHECK=${HEALTH_CHECK:-true}
NOTIFY_ON_ERROR=${NOTIFY_ON_ERROR:-false}

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m'

log() {
    local level=$1
    shift
    local message="$@"
    local timestamp=$(date '+%Y-%m-%d %H:%M:%S')
    echo -e "[$timestamp] [$level] $message" | tee -a "$LOG_FILE"
}

log_info() { log "INFO" "${CYAN}$@${NC}"; }
log_success() { log "SUCCESS" "${GREEN}$@${NC}"; }
log_warn() { log "WARN" "${YELLOW}$@${NC}"; }
log_error() { log "ERROR" "${RED}$@${NC}"; }

log_section() {
    echo ""
    echo "============================================================"
    echo "$@"
    echo "============================================================"
    echo ""
}

# Update status file
update_status() {
    local status=$1
    local step=$2
    local message=$3
    
    cat > "$STATUS_FILE" <<EOF
{
    "status": "$status",
    "step": "$step",
    "message": "$message",
    "lastUpdate": "$(date -u +%Y-%m-%dT%H:%M:%SZ)",
    "loopCount": ${LOOP_COUNT:-0},
    "startTime": "$START_TIME"
}
EOF
}

# Check code quality
check_code_quality() {
    log_info "Checking code quality..."
    
    if ! npm run lint > /dev/null 2>&1; then
        log_warn "Code quality issues found"
        return 1
    fi
    
    log_success "Code quality check passed"
    return 0
}

# Auto-fix issues
auto_fix() {
    if [ "$AUTO_FIX" != "true" ]; then
        log_info "Auto-fix is disabled"
        return 0
    fi
    
    log_info "Running auto-fix..."
    
    if [ -f "$SCRIPT_DIR/auto-fix.sh" ]; then
        bash "$SCRIPT_DIR/auto-fix.sh" || {
            log_warn "Auto-fix completed with warnings"
            return 1
        }
    else
        log_warn "Auto-fix script not found"
        return 1
    fi
    
    log_success "Auto-fix completed"
    return 0
}

# Run tests
run_tests() {
    if [ "$RUN_TESTS" != "true" ]; then
        log_info "Tests are disabled"
        return 0
    fi
    
    log_info "Running tests..."
    
    if npm run test -- --run 2>&1 | tee -a "$LOG_FILE"; then
        log_success "All tests passed"
        return 0
    else
        log_error "Tests failed"
        return 1
    fi
}

# Build application
build_application() {
    log_info "Building application..."
    
    if npm run build 2>&1 | tee -a "$LOG_FILE"; then
        log_success "Build successful"
        return 0
    else
        log_error "Build failed"
        return 1
    fi
}

# Deploy application
deploy_application() {
    if [ "$AUTO_DEPLOY" != "true" ]; then
        log_info "Auto-deploy is disabled"
        return 0
    fi
    
    # Check if we're on main/master branch
    local current_branch=$(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo "unknown")
    if [ "$current_branch" != "main" ] && [ "$current_branch" != "master" ]; then
        log_info "Not on main/master branch (current: $current_branch). Skipping deployment."
        return 0
    fi
    
    log_info "Deploying application..."
    
    # Deployment logic would go here
    # This is a placeholder - actual deployment would depend on your platform
    log_warn "Deployment step not configured. Please implement deployment logic."
    
    return 0
}

# Health check deployment
health_check() {
    if [ "$HEALTH_CHECK" != "true" ]; then
        log_info "Health check is disabled"
        return 0
    fi
    
    log_info "Running health check..."
    
    if [ -f "$SCRIPT_DIR/health-check.sh" ]; then
        if bash "$SCRIPT_DIR/health-check.sh" 2>&1 | tee -a "$LOG_FILE"; then
            log_success "Health check passed"
            return 0
        else
            log_error "Health check failed"
            return 1
        fi
    else
        log_warn "Health check script not found"
        return 0
    fi
}

# Main loop
main_loop() {
    local loop_count=0
    START_TIME=$(date -u +%Y-%m-%dT%H:%M:%SZ)
    
    log_section "Continuous Loop System Started"
    log_info "Interval: ${INTERVAL} seconds"
    log_info "Auto-fix: $AUTO_FIX"
    log_info "Auto-deploy: $AUTO_DEPLOY"
    log_info "Run tests: $RUN_TESTS"
    log_info "Health check: $HEALTH_CHECK"
    
    while true; do
        loop_count=$((loop_count + 1))
        LOOP_COUNT=$loop_count
        
        log_section "Loop Iteration #$loop_count"
        update_status "running" "start" "Starting loop iteration $loop_count"
        
        local errors=0
        
        # Step 1: Check code quality
        update_status "running" "quality_check" "Checking code quality"
        if ! check_code_quality; then
            log_info "Code quality issues found, attempting auto-fix..."
            if ! auto_fix; then
                log_warn "Auto-fix could not resolve all issues"
                errors=$((errors + 1))
            fi
            # Re-check after auto-fix
            check_code_quality || {
                log_error "Code quality issues persist after auto-fix"
                errors=$((errors + 1))
            }
        fi
        
        # Step 2: Run tests
        update_status "running" "testing" "Running tests"
        if ! run_tests; then
            log_error "Tests failed - skipping deployment"
            errors=$((errors + 1))
            update_status "failed" "testing" "Tests failed"
            
            if [ "$NOTIFY_ON_ERROR" = "true" ]; then
                log_warn "Error notification would be sent here"
            fi
            
            log_info "Waiting ${INTERVAL} seconds before next iteration..."
            sleep $INTERVAL
            continue
        fi
        
        # Step 3: Build application
        update_status "running" "building" "Building application"
        if ! build_application; then
            log_error "Build failed - skipping deployment"
            errors=$((errors + 1))
            update_status "failed" "building" "Build failed"
            
            if [ "$NOTIFY_ON_ERROR" = "true" ]; then
                log_warn "Error notification would be sent here"
            fi
            
            log_info "Waiting ${INTERVAL} seconds before next iteration..."
            sleep $INTERVAL
            continue
        fi
        
        # Step 4: Deploy (if enabled and on main branch)
        update_status "running" "deploying" "Deploying application"
        if ! deploy_application; then
            log_error "Deployment failed"
            errors=$((errors + 1))
            update_status "failed" "deploying" "Deployment failed"
        fi
        
        # Step 5: Health check
        update_status "running" "health_check" "Running health check"
        if ! health_check; then
            log_error "Health check failed"
            errors=$((errors + 1))
            update_status "failed" "health_check" "Health check failed"
        fi
        
        # Update final status
        if [ $errors -eq 0 ]; then
            update_status "success" "complete" "All checks passed"
            log_success "Loop iteration #$loop_count completed successfully"
        else
            update_status "failed" "complete" "$errors error(s) occurred"
            log_warn "Loop iteration #$loop_count completed with $errors error(s)"
        fi
        
        log_info "Waiting ${INTERVAL} seconds before next iteration..."
        sleep $INTERVAL
    done
}

# Handle interrupts
trap 'log_info "Received interrupt signal. Stopping continuous loop..."; exit 0' INT TERM

# Change to project root
cd "$PROJECT_ROOT"

# Create reports directory
mkdir -p "$(dirname "$LOG_FILE")"

# Run main loop
main_loop