const crypto = require('crypto');

/**
 * Generates a random salt for password hashing
 */
const generateSalt = () => {
  return crypto.randomBytes(16).toString('hex');
};

/**
 * Hash a password with a given salt
 * @param {string} password - The plain text password
 * @param {string} salt - The salt for hashing
 * @returns {string} The hashed password
 */
const hashPassword = (password, salt) => {
  return crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
};

/**
 * Verify a password against a hash
 * @param {string} password - The plain text password to verify
 * @param {string} hash - The stored hash to compare against
 * @param {string} salt - The salt used for hashing
 * @returns {boolean} Whether the password matches
 */
const verifyPassword = (password, hash, salt) => {
  const passwordHash = hashPassword(password, salt);
  return passwordHash === hash;
};

/**
 * Generate a secure random token for password reset
 * @returns {string} A random token
 */
const generateToken = () => {
  return crypto.randomBytes(32).toString('hex');
};

/**
 * Generate a JWT token for authentication
 * @param {Object} payload - The data to include in the token
 * @param {string} secret - The secret key for signing
 * @param {number} expiresIn - Token expiration in seconds
 * @returns {string} The JWT token
 */
const generateJWT = (payload, secret, expiresIn = 86400) => {
  const header = {
    alg: 'HS256',
    typ: 'JWT'
  };
  
  const now = Math.floor(Date.now() / 1000);
  const claims = {
    ...payload,
    iat: now,
    exp: now + expiresIn
  };
  
  const base64Header = Buffer.from(JSON.stringify(header)).toString('base64url');
  const base64Payload = Buffer.from(JSON.stringify(claims)).toString('base64url');
  
  const signature = crypto
    .createHmac('sha256', secret)
    .update(`${base64Header}.${base64Payload}`)
    .digest('base64url');
  
  return `${base64Header}.${base64Payload}.${signature}`;
};

/**
 * Verify and decode a JWT token
 * @param {string} token - The JWT token to verify
 * @param {string} secret - The secret key for verification
 * @returns {Object|null} The decoded payload or null if invalid
 */
const verifyJWT = (token, secret) => {
  try {
    const [headerB64, payloadB64, signatureB64] = token.split('.');
    
    // Verify signature
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(`${headerB64}.${payloadB64}`)
      .digest('base64url');
    
    if (expectedSignature !== signatureB64) {
      return null;
    }
    
    // Decode payload
    const payload = JSON.parse(Buffer.from(payloadB64, 'base64url').toString());
    
    // Check expiration
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
      return null;
    }
    
    return payload;
  } catch (error) {
    console.error('JWT verification error:', error);
    return null;
  }
};

module.exports = {
  generateSalt,
  hashPassword,
  verifyPassword,
  generateToken,
  generateJWT,
  verifyJWT
};