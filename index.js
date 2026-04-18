/**
 * env-guard - Validate environment variables at runtime
 * @author Afaq Ahmad (Developer)
 * @license MIT
 */

const PACKAGE_NAME = 'env-guard';
const PACKAGE_VERSION = '1.0.0';
const AUTHOR = 'Afaq Ahmad';

/**
 * Parses a validation rule string into an object
 * @param {string} rule - Rule string like "string|required" or "number|optional|default:8080"
 * @returns {object} Parsed rule object with type, required, and default properties
 */
function parseRule(rule) {
  const parts = rule.split('|');
  const parsed = {
    type: 'string',
    required: false,
    default: undefined
  };

  for (const part of parts) {
    const trimmed = part.trim().toLowerCase();

    if (['string', 'number', 'boolean'].includes(trimmed)) {
      parsed.type = trimmed;
    } else if (trimmed === 'required') {
      parsed.required = true;
    } else if (trimmed === 'optional') {
      parsed.required = false;
    } else if (trimmed.startsWith('default:')) {
      const defaultValue = trimmed.substring(8).trim();
      if (parsed.type === 'number') {
        parsed.default = Number(defaultValue);
      } else if (parsed.type === 'boolean') {
        parsed.default = defaultValue === 'true' || defaultValue === '1' || defaultValue === 'yes';
      } else {
        parsed.default = defaultValue;
      }
    }
  }

  return parsed;
}

/**
 * Converts a value to the specified type
 * @param {string} value - The raw string value from env
 * @param {string} type - Target type (string, number, boolean)
 * @returns {*} The converted value
 */
function convertValue(value, type) {
  switch (type) {
    case 'number':
      const num = Number(value);
      if (isNaN(num)) {
        throw new Error(`Invalid number: "${value}"`);
      }
      return num;

    case 'boolean':
      const lower = value.toLowerCase().trim();
      if (lower === 'true' || lower === '1' || lower === 'yes') {
        return true;
      }
      if (lower === 'false' || lower === '0' || lower === 'no') {
        return false;
      }
      throw new Error(`Invalid boolean: "${value}". Use true/false, 1/0, or yes/no`);

    case 'string':
    default:
      return value;
  }
}

/**
 * Validates environment variables against a schema
 * @param {object} schema - Object with env var names as keys and validation rules as values
 * @returns {object} Object containing validated environment variables
 * @throws {Error} Throws if validation fails
 */
function checkEnv(schema) {
  if (!schema || typeof schema !== 'object') {
    throw new Error('Schema must be a non-null object');
  }

  const validatedEnv = {};
  const errors = [];

  for (const [envVar, rule] of Object.entries(schema)) {
    const currentValue = process.env[envVar];
    const parsedRule = parseRule(rule);

    if (currentValue === undefined || currentValue === '') {
      if (parsedRule.required) {
        if (parsedRule.default !== undefined) {
          validatedEnv[envVar] = parsedRule.default;
        } else {
          errors.push(`Missing required environment variable: "${envVar}"`);
        }
      } else {
        if (parsedRule.default !== undefined) {
          validatedEnv[envVar] = parsedRule.default;
        }
      }
    } else {
      try {
        validatedEnv[envVar] = convertValue(currentValue, parsedRule.type);
      } catch (err) {
        errors.push(`Invalid value for "${envVar}": ${err.message}`);
      }
    }
  }

  if (errors.length > 0) {
    console.error(`\n=== ${PACKAGE_NAME} Validation Errors ===\n`);
    errors.forEach((err, index) => {
      console.error(`  ${index + 1}. ${err}`);
    });
    console.error('\n');
    throw new Error('Environment validation failed');
  }

  console.log(`\n✓ All environment variables are valid! [${PACKAGE_NAME} v${PACKAGE_VERSION} by ${AUTHOR}]\n`);

  return validatedEnv;
}

module.exports = checkEnv;
module.exports.VERSION = PACKAGE_VERSION;
module.exports.AUTHOR = AUTHOR;