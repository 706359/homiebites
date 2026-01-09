/**
 * Script to generate a secure bcrypt hash for the admin password
 * 
 * Usage:
 *   node scripts/generate-admin-hash.js [password]
 * 
 * If no password is provided, it will use the default: Bless@@!!##12
 * 
 * Output: Copy the hash to your .env file as ADMIN_PASSWORD_HASH=...
 */

import bcrypt from 'bcryptjs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function generateHash() {
  // Get password from command line argument or use default
  const password = process.argv[2] || 'Bless@@!!##12';
  
  if (!password || password.length < 8) {
    console.error('❌ Error: Password must be at least 8 characters long');
    process.exit(1);
  }
  
  console.log('🔐 Generating secure password hash...\n');
  console.log(`Password: ${password.replace(/./g, '*')} (${password.length} characters)\n`);
  
  try {
    // Use 12 rounds for good security
    const saltRounds = 12;
    const hash = await bcrypt.hash(password, saltRounds);
    
    console.log('✅ Hash generated successfully!\n');
    console.log('📋 Add this to your .env file:\n');
    console.log(`ADMIN_PASSWORD_HASH=${hash}\n`);
    console.log('⚠️  Important Security Notes:');
    console.log('   - Never commit your .env file to version control');
    console.log('   - Keep your .env file secure and backed up');
    console.log('   - Remove ADMIN_PASSWORD (plain text) after setting ADMIN_PASSWORD_HASH');
    console.log('   - The hash is one-way - you cannot recover the original password from it\n');
    
    // Also show what to remove
    console.log('🗑️  You can now remove or comment out:');
    console.log('   ADMIN_PASSWORD=...\n');
    
  } catch (error) {
    console.error('❌ Error generating hash:', error.message);
    process.exit(1);
  }
}

generateHash();
