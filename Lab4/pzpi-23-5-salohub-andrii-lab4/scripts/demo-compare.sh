#!/usr/bin/env bash

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "${SCRIPT_DIR}/demo-lib.sh"

SINGLE_METRICS="/tmp/demo-single-metrics.json"
SCALED_METRICS="/tmp/demo-scaled-metrics.json"

print_header "Scaling comparison (single vs horizontal)"

print_subheader "Phase 1: Single instance"
export DEMO_METRICS_FILE="${SINGLE_METRICS}"
scale_to 1
stop_extra_machines
print_machines
run_distribution_test
run_load_test
print_machines

print_subheader "Phase 2: Horizontal scaling"
export DEMO_METRICS_FILE="${SCALED_METRICS}"
scale_to 2
start_stopped_machines
print_machines
run_distribution_test
run_load_test
print_machines

if [ -f "${SINGLE_METRICS}" ] && [ -f "${SCALED_METRICS}" ]; then
  print_comparison_summary "${SINGLE_METRICS}" "${SCALED_METRICS}"
else
  echo ""
  echo "  (метрики порівняння недоступні — перевірте fly CLI та jq)"
fi

print_header "Comparison completed"
