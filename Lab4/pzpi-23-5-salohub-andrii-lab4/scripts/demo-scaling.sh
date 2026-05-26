#!/usr/bin/env bash

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "${SCRIPT_DIR}/demo-lib.sh"

print_app_info "Horizontal scaling demo (2 machines)"

scale_to 2
start_stopped_machines
print_machines
run_distribution_test
run_load_test
print_machines

print_header "Demo completed"
