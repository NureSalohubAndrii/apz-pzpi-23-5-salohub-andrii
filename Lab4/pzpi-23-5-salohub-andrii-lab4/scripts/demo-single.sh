#!/usr/bin/env bash

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "${SCRIPT_DIR}/demo-lib.sh"

print_app_info "Single instance demo (1 machine)"

scale_to 1
stop_extra_machines
print_machines
run_distribution_test
run_load_test
print_machines

print_header "Demo completed"
