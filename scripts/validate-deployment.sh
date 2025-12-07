#!/bin/bash
# Comprehensive Deployment Validation Script
# Validates deployment endpoints, functionality, and metrics

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

# Configuration from environment
DEPLOYMENT_URL="${DEPLOYMENT_URL:-}"
API_BASE_URL="${API_BASE_URL:-}"
TIMEOUT=${TIMEOUT:-30}

validate_http_response() {
    local url=$1
    local expected_status=$2
    local description=$3
    
    log_info "Validating $description..."
    
    local status_code=$(curl -s -o /dev/null -w "%{http_code}" --max-time $TIMEOUT "$url" 2>/dev/null || echo "000")
    
    if [ "$status_code" = "$expected_status" ]; then
        log_success "$description: HTTP $status_code (expected)"
        return 0
    else
        log_error "$description: HTTP $status_code (expected $expected_status)"
        return 1
    fi
}

validate_html_content() {
    local url=$1
    
    log_info "Validating HTML content..."
    
    local content=$(curl -s --max-time $TIMEOUT "$url" 2>/dev/null || echo "")
    
    if echo "$content" | grep -q "<!DOCTYPE html\|<html"; then
        log_success "Valid HTML content detected"
        return 0
    else
        log_error "Invalid or missing HTML content"
        return 1
    fi
}

validate_api_endpoint() {
    local endpoint=$1
    local method=${2:-GET}
    
    log_info "Validating API endpoint: $method $endpoint"
    
    case $method in
        GET)
            if curl -f -s --max-time $TIMEOUT "$endpoint" > /dev/null 2>&1; then
                log_success "API endpoint is accessible"
                return 0
            else
                log_warn "API endpoint is not accessible or returned an error"
                return 1
            fi
            ;;
        *)
            log_warn "Method $method validation not implemented"
            return 0
            ;;
    esac
}

validate_performance() {
    local url=$1
    local max_time=${2:-3}
    
    log_info "Validating response time (max: ${max_time}s)..."
    
    local start_time=$(date +%s.%N)
    curl -s -o /dev/null --max-time $TIMEOUT "$url" > /dev/null 2>&1
    local end_time=$(date +%s.%N)
    
    local duration=$(echo "$end_time - $start_time" | bc)
    
    if (( $(echo "$duration <= $max_time" | bc -l) )); then
        log_success "Response time: ${duration}s (within ${max_time}s limit)"
        return 0
    else
        log_warn "Response time: ${duration}s (exceeds ${max_time}s limit)"
        return 1
    fi
}

main() {
    log_info "Starting comprehensive deployment validation..."
    
    local errors=0
    
    if [ -z "$DEPLOYMENT_URL" ]; then
        log_warn "DEPLOYMENT_URL not set. Skipping URL-based validation."
        log_info "Set DEPLOYMENT_URL environment variable to validate deployed URL."
    else
        log_info "Validating deployment at: $DEPLOYMENT_URL"
        
        # Validate main page
        if ! validate_http_response "$DEPLOYMENT_URL" "200" "Main Page"; then
            errors=$((errors + 1))
        fi
        
        # Validate HTML content
        if ! validate_html_content "$DEPLOYMENT_URL"; then
            errors=$((errors + 1))
        fi
        
        # Validate performance
        validate_performance "$DEPLOYMENT_URL" 3 || {
            log_warn "Performance check failed (non-blocking)"
        }
    fi
    
    # Validate API if URL provided
    if [ -n "$API_BASE_URL" ]; then
        log_info "Validating API at: $API_BASE_URL"
        validate_api_endpoint "$API_BASE_URL" "GET" || {
            log_warn "API validation failed (non-blocking)"
        }
    fi
    
    # Summary
    if [ $errors -eq 0 ]; then
        log_success "Deployment validation passed"
        exit 0
    else
        log_error "Deployment validation failed with $errors error(s)"
        exit 1
    fi
}

cd "$PROJECT_ROOT"
main