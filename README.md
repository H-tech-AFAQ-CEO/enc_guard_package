# env-guard

Validate environment variables at runtime with type checking and required/optional support.

## Description

`env-guard` is a lightweight Node.js package that validates environment variables against a defined schema. It ensures your application has all required configuration before running, preventing runtime errors due to missing or invalid environment variables.

## Features

- **Type Validation** - Supports string, number, and boolean types
- **Required/Optional** - Mark variables as required or optional
- **Default Values** - Provide fallback values for optional variables
- **Clear Errors** - Readable error messages that help you debug quickly
- **Zero Dependencies** - Pure JavaScript, no external packages needed
- **CommonJS** - Compatible with all Node.js projects

## Installation

```bash
npm install env-guard
```

Or using yarn:

```bash
yarn add env-guard
```

## Usage

### Basic Example

```javascript
const checkEnv = require('env-guard');

// Define your schema
const schema = {
  PORT: 'number|required',
  DB_HOST: 'string|required',
  DEBUG: 'boolean|optional'
};

// Validate environment variables
const env = checkEnv(schema);

// Use validated variables
console.log(env.PORT);    // 3000 (converted to number)
console.log(env.DB_HOST); // 'localhost'
console.log(env.DEBUG);   // undefined (optional, not set)
```

### With Default Values

```javascript
const checkEnv = require('env-guard');

const schema = {
  PORT: 'number|optional|default:8080',
  NODE_ENV: 'string|optional|default:development',
  LOG_LEVEL: 'string|optional|default:info'
};

const env = checkEnv(schema);

console.log(env.PORT);      // 8080 (uses default)
console.log(env.NODE_ENV);  // 'development' (uses default)
```

### Boolean Values

Boolean variables accept multiple formats:

```javascript
const checkEnv = require('env-guard');

const schema = {
  FEATURE_ENABLED: 'boolean|required',
  DEBUG_MODE: 'boolean|optional'
};

// All these work: true, false, 1, 0, yes, no
process.env.FEATURE_ENABLED = 'true';
process.env.DEBUG_MODE = '0';

const env = checkEnv(schema);
console.log(env.FEATURE_ENABLED); // true
console.log(env.DEBUG_MODE);      // false
```

## API

### checkEnv(schema)

Validates environment variables against a schema and returns an object with validated values.

**Parameters:**

- `schema` (object) - An object where keys are environment variable names and values are validation rules

**Validation Rule Format:**

```
type|required|default:value
```

- `type` - `string`, `number`, or `boolean` (default: string)
- `required` - `required` or `optional` (default: optional)
- `default:value` - Default value when variable is not set

**Returns:**

- `object` - An object containing validated environment variables

**Throws:**

- `Error` - If validation fails or schema is invalid

## Rule Examples

| Rule | Description |
|------|-------------|
| `"string\|required"` | Required string |
| `"number\|required"` | Required number |
| `"boolean\|required"` | Required boolean |
| `"string\|optional"` | Optional string (returns undefined if not set) |
| `"number\|optional\|default:3000"` | Optional number, defaults to 3000 |
| `"string\|optional\|default:localhost"` | Optional string, defaults to "localhost" |

## Error Handling

When validation fails, `env-guard` throws an error with clear messages:

```
=== env-guard Validation Errors ===

  1. Missing required environment variable: "PORT"
  2. Invalid value for "DB_PORT": Invalid number: "abc"

Environment validation failed
```

## Complete Example

```javascript
const checkEnv = require('env-guard');

try {
  const env = checkEnv({
    // Required variables
    DATABASE_URL: 'string|required',
    API_KEY: 'string|required',
    PORT: 'number|required',
    
    // Optional variables with defaults
    NODE_ENV: 'string|optional|default:production',
    LOG_LEVEL: 'string|optional|default:error',
    MAX_CONNECTIONS: 'number|optional|default:100',
    DEBUG: 'boolean|optional|default:false'
  });

  // Start your application with validated config
  console.log('Environment validated successfully!');
  console.log('Running in:', env.NODE_ENV);
  console.log('Port:', env.PORT);
  
} catch (err) {
  console.error('Failed to validate environment:', err.message);
  process.exit(1);
}
```

## Running Tests

The package includes a test file to demonstrate usage:

```bash
npm test
```

## License

MIT License - Copyright (c) 2026 Afaq Ahmad

## Author

**Afaq Ahmad** - Developer

---

Made with ❤️ for Node.js developers