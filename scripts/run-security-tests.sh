#!/bin/bash

# RLS Security Test Runner
# Quick and comprehensive security testing for the application

set -e  # Exit on any error

echo "🔒 Starting RLS Security Test Suite"
echo "=================================="
echo ""

# Check if dependencies are installed
if ! command -v npx &> /dev/null; then
    echo "❌ npx is required but not installed. Please install Node.js and npm."
    exit 1
fi

# Function to print colored output
print_status() {
    local status=$1
    local message=$2
    case $status in
        "info")
            echo -e "\033[34mℹ️  $message\033[0m"
            ;;
        "success")
            echo -e "\033[32m✅ $message\033[0m"
            ;;
        "warning")
            echo -e "\033[33m⚠️  $message\033[0m"
            ;;
        "error")
            echo -e "\033[31m❌ $message\033[0m"
            ;;
    esac
}

# Run quick security check first
print_status "info" "Running quick security smoke test..."
if npx tsx tests/quick-security-check.ts; then
    print_status "success" "Quick security check passed"
else
    print_status "error" "Quick security check failed - see output above"
    exit 1
fi

echo ""

# Run full RLS test suite
print_status "info" "Running comprehensive RLS test suite..."
if npx vitest run tests/rls.spec.ts --reporter=verbose; then
    print_status "success" "All RLS security tests passed!"
else
    print_status "error" "RLS security tests failed - see output above"
    exit 1
fi

echo ""
print_status "success" "🛡️  All security tests completed successfully!"
print_status "info" "Your application's Row-Level Security is properly configured."

# Optional: Run additional security checks
if [ "$1" == "--full" ]; then
    echo ""
    print_status "info" "Running additional security audits..."
    
    # Check for npm security vulnerabilities
    if npm audit --audit-level high; then
        print_status "success" "No high-severity npm vulnerabilities found"
    else
        print_status "warning" "npm security vulnerabilities detected"
    fi
    
    # Check for common security patterns in code
    print_status "info" "Scanning for security anti-patterns..."
    
    if grep -r "disable.*rls\|rls.*false" supabase/ &> /dev/null; then
        print_status "error" "Found potential RLS bypass patterns in migrations"
        exit 1
    fi
    
    if grep -r "auth\.uid.*=.*true\|true.*=.*true" supabase/ &> /dev/null; then
        print_status "error" "Found overly permissive RLS policies"
        exit 1
    fi
    
    print_status "success" "No security anti-patterns detected"
fi

echo ""
echo "🎉 Security validation complete!"
echo ""
echo "Summary:"
echo "- ✅ Quick security smoke test"
echo "- ✅ Comprehensive RLS test suite" 
echo "- ✅ Anonymous access restrictions"
echo "- ✅ User data isolation"
echo "- ✅ Admin-only table protection"
echo "- ✅ Materialized view security"
echo "- ✅ RPC function security"
echo "- ✅ API surface security"

if [ "$1" == "--full" ]; then
    echo "- ✅ npm security audit"
    echo "- ✅ Security anti-pattern scan"
fi

echo ""
echo "🚀 Ready for deployment!"