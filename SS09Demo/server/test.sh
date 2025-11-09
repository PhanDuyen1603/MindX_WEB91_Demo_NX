#!/bin/bash

# Test Script cho Lesson 9 API
BASE_URL="http://localhost:3001"

echo "========================================="
echo "🧪 TESTING LESSON 9 APIs"
echo "========================================="
echo ""

# 1. Register Manager
echo "📝 Test 1: Register Manager..."
MANAGER_REG=$(curl -s -X POST "$BASE_URL/auth/register" \
  -H "Content-Type: application/json" \
  -d '{"email":"manager@test.com","password":"123456","role":"MANAGER"}')
echo "$MANAGER_REG" | head -c 200
echo ""
echo ""

# 2. Login Manager
echo "🔐 Test 2: Login Manager..."
MANAGER_LOGIN=$(curl -s -X POST "$BASE_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"manager@test.com","password":"123456"}')
echo "$MANAGER_LOGIN" | head -c 200
MANAGER_TOKEN=$(echo $MANAGER_LOGIN | grep -o '"token":"[^"]*' | sed 's/"token":"//')
echo ""
echo "Manager Token: ${MANAGER_TOKEN:0:50}..."
echo ""

# 3. Manager create profile
echo "👤 Test 3: Manager create profile..."
MANAGER_PROFILE=$(curl -s -X POST "$BASE_URL/profile" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $MANAGER_TOKEN" \
  -d '{"name":"Nguyễn Văn A","email":"manager@test.com","phone":"0901234567","department":"Sales"}')
echo "$MANAGER_PROFILE" | head -c 200
echo ""
echo ""

# 4. Manager create Employee
echo "👥 Test 4: Manager create Employee..."
EMPLOYEE_CREATE=$(curl -s -X POST "$BASE_URL/admin/employees" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $MANAGER_TOKEN" \
  -d '{"email":"employee1@test.com","password":"123456","name":"Nhân viên 1","phone":"0912345678"}')
echo "$EMPLOYEE_CREATE" | head -c 200
echo ""
echo ""

# 5. Login Employee
echo "🔐 Test 5: Login Employee..."
EMPLOYEE_LOGIN=$(curl -s -X POST "$BASE_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"employee1@test.com","password":"123456"}')
echo "$EMPLOYEE_LOGIN" | head -c 200
EMPLOYEE_TOKEN=$(echo $EMPLOYEE_LOGIN | grep -o '"token":"[^"]*' | sed 's/"token":"//')
echo ""
echo "Employee Token: ${EMPLOYEE_TOKEN:0:50}..."
echo ""

# 6. Employee create Property
echo "🏠 Test 6: Employee create Property..."
PROPERTY_CREATE=$(curl -s -X POST "$BASE_URL/properties" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $EMPLOYEE_TOKEN" \
  -d '{"address":"123 Nguyễn Huệ, Q1, HCM","price":"5000000000","area":100,"status":"ON_SALE"}')
echo "$PROPERTY_CREATE" | head -c 200
PROPERTY_ID=$(echo $PROPERTY_CREATE | grep -o '"_id":"[^"]*' | sed 's/"_id":"//')
echo ""
echo "Property ID: $PROPERTY_ID"
echo ""

# 7. Register Customer
echo "📝 Test 7: Register Customer..."
CUSTOMER_REG=$(curl -s -X POST "$BASE_URL/auth/register" \
  -H "Content-Type: application/json" \
  -d '{"email":"customer1@test.com","password":"123456","role":"CUSTOMER"}')
echo "$CUSTOMER_REG" | head -c 200
echo ""
echo ""

# 8. Login Customer
echo "🔐 Test 8: Login Customer..."
CUSTOMER_LOGIN=$(curl -s -X POST "$BASE_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"customer1@test.com","password":"123456"}')
echo "$CUSTOMER_LOGIN" | head -c 200
CUSTOMER_TOKEN=$(echo $CUSTOMER_LOGIN | grep -o '"token":"[^"]*' | sed 's/"token":"//')
echo ""
echo "Customer Token: ${CUSTOMER_TOKEN:0:50}..."
echo ""

# 9. Customer create profile
echo "👤 Test 9: Customer create profile..."
CUSTOMER_PROFILE=$(curl -s -X POST "$BASE_URL/profile" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $CUSTOMER_TOKEN" \
  -d '{"name":"Khách hàng 1","email":"customer1@test.com","phone":"0923456789","address":"456 Lê Lợi, Q1, HCM"}')
echo "$CUSTOMER_PROFILE" | head -c 200
echo ""
echo ""

# 10. Customer create Deposit Order
echo "💰 Test 10: Customer create Deposit Order..."
DEPOSIT_CREATE=$(curl -s -X POST "$BASE_URL/deposits" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $CUSTOMER_TOKEN" \
  -d "{\"propertyId\":\"$PROPERTY_ID\",\"depositAmount\":\"500000000\"}")
echo "$DEPOSIT_CREATE" | head -c 200
echo ""
echo ""

# 11. Employee view my properties
echo "🏘️  Test 11: Employee view my properties..."
MY_PROPERTIES=$(curl -s -X GET "$BASE_URL/properties/my-properties" \
  -H "Authorization: Bearer $EMPLOYEE_TOKEN")
echo "$MY_PROPERTIES" | head -c 200
echo ""
echo ""

# 12. Customer view my deposit orders
echo "📋 Test 12: Customer view my deposit orders..."
MY_ORDERS=$(curl -s -X GET "$BASE_URL/deposits/my-orders" \
  -H "Authorization: Bearer $CUSTOMER_TOKEN")
echo "$MY_ORDERS" | head -c 200
echo ""
echo ""

# 13. Manager view all deposit orders
echo "📊 Test 13: Manager view all deposit orders..."
ALL_ORDERS=$(curl -s -X GET "$BASE_URL/admin/deposit-orders" \
  -H "Authorization: Bearer $MANAGER_TOKEN")
echo "$ALL_ORDERS" | head -c 200
echo ""
echo ""

# 14. Manager view my employees
echo "👔 Test 14: Manager view my employees..."
MY_EMPLOYEES=$(curl -s -X GET "$BASE_URL/admin/my-employees" \
  -H "Authorization: Bearer $MANAGER_TOKEN")
echo "$MY_EMPLOYEES" | head -c 200
echo ""
echo ""

echo "========================================="
echo "✅ ALL TESTS COMPLETED!"
echo "========================================="

