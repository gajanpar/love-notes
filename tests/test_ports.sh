#!/usr/bin/env bash
set -e

# Test 1: Unset
unset PORT
res1="${PORT:-10000}"
if [ "$res1" != "10000" ]; then
    echo "FAIL 1: Expected 10000, got $res1"
    exit 1
fi

# Test 2: Set to 10000
export PORT=10000
res2="${PORT:-10000}"
if [ "$res2" != "10000" ]; then
    echo "FAIL 2: Expected 10000, got $res2"
    exit 1
fi

# Test 3: Set to 8080
export PORT=8080
res3="${PORT:-10000}"
if [ "$res3" != "8080" ]; then
    echo "FAIL 3: Expected 8080, got $res3"
    exit 1
fi

# Test 4: Empty string
export PORT=""
res4="${PORT:-10000}"
if [ "$res4" != "10000" ]; then
    echo "FAIL 4: Expected 10000, got $res4"
    exit 1
fi

echo "ALL_PORT_CASES_PASSED: res1=$res1, res2=$res2, res3=$res3, res4=$res4"
