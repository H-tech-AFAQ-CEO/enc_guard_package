/**
 * env-guard - Test Examples
 * Run with: node test.js
 */

const checkEnv = require('./index.js');

console.log('=== env-guard Test Suite ===\n');

// Test 1: All valid - required variables present
console.log('Test 1: All valid (required variables present)');
process.env.PORT = '3000';
process.env.DB_HOST = 'localhost';
process.env.DEBUG = 'true';

try {
  const result = checkEnv({
    PORT: 'number|required',
    DB_HOST: 'string|required',
    DEBUG: 'boolean|required'
  });
  console.log('Result:', result);
  console.log('✓ Test 1 passed\n');
} catch (err) {
  console.error('✗ Test 1 failed:', err.message, '\n');
}

// Clear test variables
delete process.env.PORT;
delete process.env.DB_HOST;
delete process.env.DEBUG;

// Test 2: Optional variables with defaults
console.log('Test 2: Optional variables with defaults');
process.env.NODE_ENV = 'development';

try {
  const result = checkEnv({
    NODE_ENV: 'string|optional|default:production',
    PORT: 'number|optional|default:8080',
    DEBUG: 'boolean|optional|default:false'
  });
  console.log('Result:', result);
  console.log('✓ Test 2 passed\n');
} catch (err) {
  console.error('✗ Test 2 failed:', err.message, '\n');
}

delete process.env.NODE_ENV;

// Test 3: Missing required variable
console.log('Test 3: Missing required variable');
process.env.PORT = '3000';

try {
  checkEnv({
    PORT: 'number|required',
    API_KEY: 'string|required'
  });
  console.error('✗ Test 3 should have thrown\n');
} catch (err) {
  console.log('✓ Test 3 passed - correctly threw error\n');
}

delete process.env.PORT;

// Test 4: Invalid number value
console.log('Test 4: Invalid number value');
process.env.PORT = 'not-a-number';

try {
  checkEnv({
    PORT: 'number|required'
  });
  console.error('✗ Test 4 should have thrown\n');
} catch (err) {
  console.log('✓ Test 4 passed - correctly threw error\n');
}

delete process.env.PORT;

// Test 5: Invalid boolean value
console.log('Test 5: Invalid boolean value');
process.env.FLAG = 'maybe';

try {
  checkEnv({
    FLAG: 'boolean|required'
  });
  console.error('✗ Test 5 should have thrown\n');
} catch (err) {
  console.log('✓ Test 5 passed - correctly threw error\n');
}

delete process.env.FLAG;

// Test 6: Empty schema
console.log('Test 6: Empty schema');
try {
  const result = checkEnv({});
  console.log('Result:', result);
  console.log('✓ Test 6 passed\n');
} catch (err) {
  console.error('✗ Test 6 failed:', err.message, '\n');
}

// Test 7: Boolean true/false values
console.log('Test 7: Boolean various values');
process.env.VALUE1 = 'true';
process.env.VALUE2 = 'false';
process.env.VALUE3 = '1';
process.env.VALUE4 = '0';
process.env.VALUE5 = 'yes';
process.env.VALUE6 = 'no';

try {
  const result = checkEnv({
    VALUE1: 'boolean|required',
    VALUE2: 'boolean|required',
    VALUE3: 'boolean|required',
    VALUE4: 'boolean|required',
    VALUE5: 'boolean|required',
    VALUE6: 'boolean|required'
  });
  console.log('Result:', result);
  console.log('✓ Test 7 passed\n');
} catch (err) {
  console.error('✗ Test 7 failed:', err.message, '\n');
}

console.log('=== All Tests Complete ===');