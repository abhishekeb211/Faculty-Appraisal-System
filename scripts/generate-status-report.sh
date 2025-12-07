#!/bin/bash
# Status Report Generator
# Generates HTML/JSON status reports for build, test, and deployment status

set -e

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
REPORTS_DIR="${REPORTS_DIR:-$PROJECT_ROOT/reports}"
TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S')
REPORT_FILE="${REPORT_FILE:-$REPORTS_DIR/status-report-$(date +%Y%m%d-%H%M%S).html}"
JSON_REPORT="${JSON_REPORT:-$REPORTS_DIR/status-report-$(date +%Y%m%d-%H%M%S).json}"

# Colors
CYAN='\033[0;36m'
GREEN='\033[0;32m'
NC='\033[0m'

log() {
    echo -e "${CYAN}[INFO]${NC} $@"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $@"
}

collect_build_status() {
    if [ -d "$PROJECT_ROOT/dist" ] && [ "$(ls -A $PROJECT_ROOT/dist 2>/dev/null)" ]; then
        echo "pass"
    else
        echo "fail"
    fi
}

collect_test_status() {
    if npm run test -- --run > /dev/null 2>&1; then
        echo "pass"
    else
        echo "fail"
    fi
}

collect_git_info() {
    local branch=$(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo "unknown")
    local commit=$(git rev-parse --short HEAD 2>/dev/null || echo "unknown")
    local commit_date=$(git log -1 --format=%cd --date=iso 2>/dev/null || echo "unknown")
    
    echo "{\"branch\":\"$branch\",\"commit\":\"$commit\",\"commitDate\":\"$commit_date\"}"
}

generate_json_report() {
    log "Generating JSON status report..."
    
    local build_status=$(collect_build_status)
    local test_status=$(collect_test_status)
    local git_info=$(collect_git_info)
    
    cat > "$JSON_REPORT" <<EOF
{
    "timestamp": "$TIMESTAMP",
    "project": "$(basename $PROJECT_ROOT)",
    "git": $git_info,
    "status": {
        "build": "$build_status",
        "tests": "$test_status",
        "overall": "$([ "$build_status" = "pass" ] && [ "$test_status" = "pass" ] && echo "pass" || echo "fail")"
    },
    "metrics": {
        "buildSize": "$(du -sh $PROJECT_ROOT/dist 2>/dev/null | cut -f1 || echo "N/A")",
        "testCoverage": "N/A"
    }
}
EOF
    
    log_success "JSON report generated: $JSON_REPORT"
}

generate_html_report() {
    log "Generating HTML status report..."
    
    local build_status=$(collect_build_status)
    local test_status=$(collect_test_status)
    local git_info=$(collect_git_info)
    local overall_status="$([ "$build_status" = "pass" ] && [ "$test_status" = "pass" ] && echo "pass" || echo "fail")"
    
    local status_color="$([ "$overall_status" = "pass" ] && echo "#28a745" || echo "#dc3545")"
    local status_text="$([ "$overall_status" = "pass" ] && echo "✓ Healthy" || echo "✗ Issues Detected")"
    
    cat > "$REPORT_FILE" <<EOF
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Status Report - $(basename $PROJECT_ROOT)</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            background: #f5f5f5;
            padding: 20px;
            color: #333;
        }
        .container {
            max-width: 1200px;
            margin: 0 auto;
            background: white;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            padding: 30px;
        }
        h1 {
            color: #333;
            margin-bottom: 10px;
        }
        .timestamp {
            color: #666;
            margin-bottom: 30px;
        }
        .status-banner {
            background: $status_color;
            color: white;
            padding: 20px;
            border-radius: 6px;
            margin-bottom: 30px;
            text-align: center;
            font-size: 24px;
            font-weight: bold;
        }
        .section {
            margin-bottom: 30px;
        }
        .section h2 {
            color: #333;
            margin-bottom: 15px;
            padding-bottom: 10px;
            border-bottom: 2px solid #eee;
        }
        .status-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 15px;
            background: #f9f9f9;
            border-radius: 4px;
            margin-bottom: 10px;
        }
        .status-badge {
            padding: 5px 15px;
            border-radius: 20px;
            font-weight: bold;
            font-size: 14px;
        }
        .status-pass {
            background: #28a745;
            color: white;
        }
        .status-fail {
            background: #dc3545;
            color: white;
        }
        .info-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 15px;
        }
        .info-item {
            padding: 15px;
            background: #f9f9f9;
            border-radius: 4px;
        }
        .info-label {
            font-weight: bold;
            color: #666;
            margin-bottom: 5px;
        }
        .info-value {
            color: #333;
            font-size: 18px;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Status Report</h1>
        <div class="timestamp">Generated: $TIMESTAMP</div>
        
        <div class="status-banner">
            $status_text
        </div>
        
        <div class="section">
            <h2>Build Status</h2>
            <div class="status-item">
                <span>Build Directory</span>
                <span class="status-badge status-$build_status">$build_status</span>
            </div>
        </div>
        
        <div class="section">
            <h2>Test Status</h2>
            <div class="status-item">
                <span>Test Suite</span>
                <span class="status-badge status-$test_status">$test_status</span>
            </div>
        </div>
        
        <div class="section">
            <h2>Project Information</h2>
            <div class="info-grid">
                <div class="info-item">
                    <div class="info-label">Project</div>
                    <div class="info-value">$(basename $PROJECT_ROOT)</div>
                </div>
                <div class="info-item">
                    <div class="info-label">Build Size</div>
                    <div class="info-value">$(du -sh $PROJECT_ROOT/dist 2>/dev/null | cut -f1 || echo "N/A")</div>
                </div>
            </div>
        </div>
    </div>
</body>
</html>
EOF
    
    log_success "HTML report generated: $REPORT_FILE"
}

main() {
    log "Generating status reports..."
    
    mkdir -p "$REPORTS_DIR"
    
    generate_json_report
    generate_html_report
    
    log_success "Status reports generated successfully"
    log "  - JSON: $JSON_REPORT"
    log "  - HTML: $REPORT_FILE"
}

cd "$PROJECT_ROOT"
main