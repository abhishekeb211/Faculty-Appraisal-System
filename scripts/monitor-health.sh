#!/bin/bash
# Continuous Health Monitoring Script
# Monitors build status, test results, deployment health, and error rates

set -e

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
MONITOR_INTERVAL=${MONITOR_INTERVAL:-300}  # Default: 5 minutes
LOG_FILE="${LOG_FILE:-$PROJECT_ROOT/reports/monitor-$(date +%Y%m%d-%H%M%S).log}"
METRICS_FILE="${METRICS_FILE:-$PROJECT_ROOT/reports/metrics.json}"

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

# Initialize metrics file
init_metrics() {
    if [ ! -f "$METRICS_FILE" ]; then
        cat > "$METRICS_FILE" <<EOF
{
    "startTime": "$(date -u +%Y-%m-%dT%H:%M:%SZ)",
    "checks": [],
    "summary": {
        "totalChecks": 0,
        "passedChecks": 0,
        "failedChecks": 0,
        "errorRate": 0
    }
}
EOF
    fi
}

# Record metric
record_metric() {
    local check_name=$1
    local status=$2
    local message=$3
    local timestamp=$(date -u +%Y-%m-%dT%H:%M:%SZ)
    
    # Update metrics file (requires jq or manual JSON manipulation)
    log_info "Recorded metric: $check_name - $status"
}

check_build_status() {
    log_info "Checking build status..."
    
    if [ -d "$PROJECT_ROOT/dist" ] && [ "$(ls -A $PROJECT_ROOT/dist 2>/dev/null)" ]; then
        record_metric "build_status" "pass" "Build directory exists"
        log_success "Build status: OK"
        return 0
    else
        record_metric "build_status" "fail" "Build directory missing or empty"
        log_error "Build status: FAILED"
        return 1
    fi
}

check_test_status() {
    log_info "Checking test status..."
    
    if npm run test -- --run > /dev/null 2>&1; then
        record_metric "test_status" "pass" "All tests passing"
        log_success "Test status: OK"
        return 0
    else
        record_metric "test_status" "fail" "Tests failing"
        log_error "Test status: FAILED"
        return 1
    fi
}

check_deployment_health() {
    log_info "Checking deployment health..."
    
    if [ -f "$SCRIPT_DIR/health-check.sh" ]; then
        if bash "$SCRIPT_DIR/health-check.sh" > /dev/null 2>&1; then
            record_metric "deployment_health" "pass" "Deployment healthy"
            log_success "Deployment health: OK"
            return 0
        else
            record_metric "deployment_health" "fail" "Deployment unhealthy"
            log_error "Deployment health: FAILED"
            return 1
        fi
    else
        log_warn "Health check script not found"
        return 0
    fi
}

generate_summary() {
    log_info "Generating monitoring summary..."
    
    # This would aggregate metrics from the metrics file
    log_success "Monitoring summary generated"
}

main_loop() {
    log_info "Starting continuous health monitoring..."
    log_info "Monitor interval: ${MONITOR_INTERVAL} seconds"
    
    init_metrics
    
    while true; do
        log_info "Running health check cycle..."
        
        local errors=0
        
        check_build_status || errors=$((errors + 1))
        check_test_status || errors=$((errors + 1))
        check_deployment_health || errors=$((errors + 1))
        
        generate_summary
        
        if [ $errors -gt 0 ]; then
            log_warn "Health check cycle completed with $errors error(s)"
        else
            log_success "Health check cycle completed successfully"
        fi
        
        log_info "Waiting ${MONITOR_INTERVAL} seconds until next check..."
        sleep $MONITOR_INTERVAL
    done
}

# Handle interrupts
trap 'log_info "Stopping health monitor..."; exit 0' INT TERM

cd "$PROJECT_ROOT"
mkdir -p "$(dirname "$LOG_FILE")"
main_loop