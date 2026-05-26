#!/usr/bin/env bash

APP_NAME="${APP_NAME:-${FLY_APP_NAME:-apz-pzpi-23-5-salohub-andrii}}"
APP_URL="${APP_URL:-https://apz-pzpi-23-5-salohub-andrii.fly.dev}"
HEALTH_URL="${HEALTH_URL:-${APP_URL}/health}"
REQUEST_COUNT="${REQUEST_COUNT:-30}"
LOAD_DURATION="${LOAD_DURATION:-30}"
LOAD_CONNECTIONS="${LOAD_CONNECTIONS:-20}"

export NO_COLOR=1

FLY_CMD=""

resolve_fly_cmd() {
  if [ -n "${FLY_CMD}" ]; then
    return 0
  fi
  if command -v fly >/dev/null 2>&1; then
    FLY_CMD="fly"
  elif command -v flyctl >/dev/null 2>&1; then
    FLY_CMD="flyctl"
  elif [ -x "${HOME}/.fly/bin/flyctl" ]; then
    FLY_CMD="${HOME}/.fly/bin/flyctl"
  elif [ -x "${HOME}/.fly/bin/fly" ]; then
    FLY_CMD="${HOME}/.fly/bin/fly"
  fi
}

require_jq() {
  if ! command -v jq >/dev/null 2>&1; then
    echo "Помилка: потрібен jq (brew install jq)"
    exit 1
  fi
}

print_header() {
  echo ""
  echo "=== $1 ==="
}

print_subheader() {
  echo ""
  echo "--- $1 ---"
}

print_app_info() {
  print_header "$1"
  echo "App:  ${APP_NAME}"
  echo "URL:  ${HEALTH_URL}"
}

fly_machines_json() {
  resolve_fly_cmd
  if [ -z "${FLY_CMD}" ]; then
    echo "[]"
    return 1
  fi
  ${FLY_CMD} machines list -a "${APP_NAME}" --json 2>/dev/null || echo "[]"
}

print_machines() {
  print_subheader "Machines"
  resolve_fly_cmd
  require_jq

  if [ -z "${FLY_CMD}" ]; then
    echo "  (fly CLI не встановлений)"
    return 1
  fi

  local json count
  json="$(fly_machines_json)"
  count="$(echo "${json}" | jq 'length')"

  if [ "${count}" -eq 0 ]; then
    echo "  (machines не знайдено)"
    return 0
  fi

  printf "  Machines (%s):\n" "${count}"
  printf "  %-16s %-8s %-6s %s\n" "ID" "STATE" "REGION" "SIZE"
  echo "${json}" | jq -r '.[] | [
    .id,
    .state,
    .region,
    ((.config.guest.cpus // 1 | tostring) + "cpu-" + (.config.guest.memory_mb // 0 | tostring) + "mb")
  ] | @tsv' | while IFS=$'\t' read -r id state region size; do
    printf "  %-16s %-8s %-6s %s\n" "${id}" "${state}" "${region}" "${size}"
  done
}

scale_to() {
  local count="$1"
  resolve_fly_cmd
  if [ -z "${FLY_CMD}" ]; then
    echo "  (fly CLI не встановлений — пропускаємо scale count ${count})"
    return 1
  fi
  print_subheader "Scale to ${count} machine(s)"
  ${FLY_CMD} scale count "${count}" -a "${APP_NAME}" --yes 2>&1 | grep -v "Warning: Metrics token" || true
  sleep 2
}

start_stopped_machines() {
  resolve_fly_cmd
  require_jq
  if [ -z "${FLY_CMD}" ]; then
    echo "  (fly CLI не встановлений — пропускаємо)"
    return 1
  fi

  print_subheader "Start stopped machines"
  local started=0
  while read -r machine_id; do
    if [ -n "${machine_id}" ]; then
      ${FLY_CMD} machine start "${machine_id}" -a "${APP_NAME}" 2>&1 | grep -v "Warning: Metrics token" || true
      started=$((started + 1))
    fi
  done < <(fly_machines_json | jq -r '.[] | select(.state == "stopped") | .id')

  if [ "${started}" -eq 0 ]; then
    echo "  (немає зупинених machines)"
  fi
  sleep 2
}

stop_extra_machines() {
  resolve_fly_cmd
  require_jq
  if [ -z "${FLY_CMD}" ]; then
    echo "  (fly CLI не встановлений — пропускаємо)"
    return 1
  fi

  print_subheader "Stop extra machines (keep 1 active)"
  local json first_id machine_id stopped=0
  json="$(fly_machines_json)"
  first_id="$(echo "${json}" | jq -r '.[0].id // empty')"

  if [ -z "${first_id}" ]; then
    echo "  (machines не знайдено)"
    return 0
  fi

  ${FLY_CMD} machine start "${first_id}" -a "${APP_NAME}" 2>&1 | grep -v "Warning: Metrics token" || true

  while read -r machine_id; do
    if [ -n "${machine_id}" ] && [ "${machine_id}" != "${first_id}" ]; then
      ${FLY_CMD} machine stop "${machine_id}" -a "${APP_NAME}" 2>&1 | grep -v "Warning: Metrics token" || true
      stopped=$((stopped + 1))
    fi
  done < <(echo "${json}" | jq -r '.[].id')

  if [ "${stopped}" -eq 0 ]; then
    echo "  (зайвих machines немає)"
  else
    echo "  зупинено: ${stopped}"
  fi
  sleep 2
}

save_metrics() {
  local file="$1"
  if [ -n "${file}" ]; then
    mkdir -p "$(dirname "${file}")"
    cat > "${file}"
  fi
}

run_distribution_test() {
  require_jq
  print_subheader "Load distribution (${REQUEST_COUNT} requests)"

  local ids total unique
  ids="$(for _ in $(seq 1 "${REQUEST_COUNT}"); do
    curl -sf "${HEALTH_URL}" || echo '{"machineId":"error"}'
    echo
  done | jq -r '.machineId')"

  total="$(echo "${ids}" | grep -c . || true)"
  unique="$(echo "${ids}" | sort -u | grep -c . || true)"

  echo "${ids}" | sort | uniq -c | sort -rn | while read -r count machine_id; do
    local pct bar_len i bar=""
    pct=$((count * 100 / total))
    bar_len=$((pct / 5))
    for ((i = 0; i < bar_len; i++)); do bar+="|"; done
    printf "  %-16s |%-15s %3d (%2d%%)\n" "${machine_id}" "${bar}" "${count}" "${pct}"
  done

  echo "  Unique machines: ${unique}"

  if [ -n "${DEMO_METRICS_FILE:-}" ]; then
    jq -n \
      --argjson unique "${unique}" \
      --argjson total "${total}" \
      '{unique_machines: $unique, request_total: $total}' \
      | save_metrics "${DEMO_METRICS_FILE}.partial"
  fi
}

run_load_test() {
  require_jq
  print_subheader "Load test (${LOAD_DURATION}s, ${LOAD_CONNECTIONS} connections)"

  local json_file
  json_file="$(mktemp /tmp/demo-autocannon.XXXXXX.json)"
  npx --yes autocannon -c "${LOAD_CONNECTIONS}" -d "${LOAD_DURATION}" -j "${HEALTH_URL}" > "${json_file}" 2>/dev/null

  local total rps avg p99
  total="$(jq -r '.requests.total // .throughput.total // 0' "${json_file}")"
  rps="$(jq -r '.requests.average // .throughput.average // 0' "${json_file}")"
  avg="$(jq -r '.latency.mean // .latency.average // 0' "${json_file}")"
  p99="$(jq -r '.latency.p99 // .latency.p999 // 0' "${json_file}")"

  printf "  Requests total:  %s\n" "${total}"
  printf "  Requests/sec:    %s\n" "${rps}"
  printf "  Latency avg:     %s ms\n" "${avg}"
  printf "  Latency p99:     %s ms\n" "${p99}"

  if [ -n "${DEMO_METRICS_FILE:-}" ]; then
    local partial="${DEMO_METRICS_FILE}.partial"
    if [ -f "${partial}" ]; then
    jq -s '.[0] + {requests_total: .[1].requests_total, requests_per_sec: .[1].requests_per_sec, latency_avg_ms: .[1].latency_avg_ms, latency_p99_ms: .[1].latency_p99_ms}' \
      "${partial}" \
      <(jq -n \
        --argjson total "${total}" \
        --argjson rps "${rps}" \
        --argjson avg "${avg}" \
        --argjson p99 "${p99}" \
        '{requests_total: $total, requests_per_sec: $rps, latency_avg_ms: $avg, latency_p99_ms: $p99}') \
      > "${DEMO_METRICS_FILE}"
      rm -f "${partial}"
    else
      jq -n \
        --argjson total "${total}" \
        --argjson rps "${rps}" \
        --argjson avg "${avg}" \
        --argjson p99 "${p99}" \
        '{requests_total: $total, requests_per_sec: $rps, latency_avg_ms: $avg, latency_p99_ms: $p99}' \
        > "${DEMO_METRICS_FILE}"
    fi
  fi

  rm -f "${json_file}"
}

print_comparison_summary() {
  require_jq
  local single_file="$1"
  local scaled_file="$2"

  print_header "Comparison summary"
  printf "  %-22s %-22s %s\n" "Metric" "Single (1 machine)" "Scaled (2 machines)"

  local s_unique s_rps s_avg sc_unique sc_rps sc_avg
  s_unique="$(jq -r '.unique_machines // "—"' "${single_file}")"
  s_rps="$(jq -r '.requests_per_sec // "—"' "${single_file}")"
  s_avg="$(jq -r '.latency_avg_ms // "—"' "${single_file}")"
  sc_unique="$(jq -r '.unique_machines // "—"' "${scaled_file}")"
  sc_rps="$(jq -r '.requests_per_sec // "—"' "${scaled_file}")"
  sc_avg="$(jq -r '.latency_avg_ms // "—"' "${scaled_file}")"

  printf "  %-22s %-22s %s\n" "Unique machines" "${s_unique}" "${sc_unique}"
  printf "  %-22s %-22s %s\n" "Requests/sec" "${s_rps}" "${sc_rps}"
  printf "  %-22s %-22s %s\n" "Avg latency" "${s_avg} ms" "${sc_avg} ms"
}
