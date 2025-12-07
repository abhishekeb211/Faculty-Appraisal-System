#!/bin/bash
# Deployment Health Check Script
# Validates that the deployed application is healthy and functioning correctly

set -e

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

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
    echo -e "[$timestamp] [$level] $message"
}

log_info() { log "INFO" "${CYAN}$@${NC}"; }
log_success() { log "SUCCESS" "${GREEN}$@${NC}"; }
log_warn() { log "WARN" "${YELLOW}$@${NC}"; }
log_error() { log "ERROR" "${RED}$@${NC}"; }

# Configuration from environment or defaults
HEALTH_CHECK_URL="${HEALTH_CHECK_URL:-}"
DEPLOYMENT_URL="${DEPLOYMENT_URL:-}"
MAX_RETRIES=${MAX_RETRIES:-3}
RETRY_DELAY=${RETRY_DELAY:-5}
TIMEOUT=${TIMEOUT:-30}

check_endpoint() {
    local url=$1
    local description=$2
    
    log_info "Checking $description: $url"
    
    for i in $(seq 1 $MAX_RETRIES); do
        if curl -f -s -o /dev/null -w "%{http_code}" --max-time $TIMEOUT "$url" > /tmp/health_check_response 2>&1; then
            local status_code=$(cat /tmp/health_check_response)
            if [ "$status_code" -ge 200 ] && [ "$status_code" -lt 400 ]; then
                log_success "$description is healthy (HTTP $status_code)"
                return 0
            else
                log_warn "$description returned HTTP $status_code (attempt $i/$MAX_RETRIES)"
            fi
        else
            log_warn "$description is not responding (attempt $i/$MAX_RETRIES)"
        fi
        
        if [ $i -lt $MAX_RETRIES ]; then
            sleep $RETRY_DELAY
        fi
    done
    
    log_error "$description health check failed after $MAX_RETRIES attempts"
    return 1
}

check_build_exists() {
    log_info "Checking if build directory exists..."
    
    if [ -d "$PROJECT_ROOT/dist" ] && [ "$(ls -A $PROJECT_ROOT/dist 2>/dev/null)" ]; then
        log_success "Build directory exists and is not empty"
        return 0
    else
        log_error "Build directory is missing or empty"
        return 1
    fi
}

check_env_vars() {
    log_info "Checking environment variables..."
    
    if [ -f "$PROJECT_ROOT/.env" ]; then
        log_success ".env file exists"
    else
        log_warn ".env file not found (may be expected in CI/CD)"
    fi
    
    return 0
}

main() {
    log_info "Starting deployment health check..."
    
    local errors=0
    
    # Check build exists
    if ! check_build_exists; then
        errors=$((errors + 1))
    fi
    
    # Check environment variables
    check_env_vars
    
    # Check deployment URL if provided
    if [ -n "$DEPLOYMENT_URL" ]; then
        if ! check_endpoint "$DEPLOYMENT_URL" "Deployment URL"; then
            errors=$((errors + 1))
        fi
    fi
    
    # Check health check endpoint if provided
    if [ -n "$HEALTH_CHECK_URL" ]; then
        if ! check_endpoint "$HEALTH_CHECK_URL" "Health Check Endpoint"; then
            errors=$((errors + 1))
        fi
    fi
    
    # Summary
    if [ $errors -eq 0 ]; then
        log_success "All health checks passed"
        exit 0
    else
        log_error "Health check failed with $errors error(s)"
        exit 1
    fi
}

cd "$PROJECT_ROOT"
main