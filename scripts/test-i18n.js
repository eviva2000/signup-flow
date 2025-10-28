#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const locales = ['en-GB', 'da-DK'];
const namespaces = ['common', 'signup'];

console.log('🌍 Testing i18n System...\n');

// Test 1: Check if translation files exist
console.log('📁 Checking translation files...');
let filesExist = true;

for (const locale of locales) {
  for (const namespace of namespaces) {
    const filePath = path.join(__dirname, '..', 'public', 'locales', locale, `${namespace}.json`);
    if (fs.existsSync(filePath)) {
      console.log(`✅ ${locale}/${namespace}.json exists`);
    } else {
      console.log(`❌ ${locale}/${namespace}.json missing`);
      filesExist = false;
    }
  }
}

if (!filesExist) {
  console.log('\n❌ Some translation files are missing!');
  process.exit(1);
}

// Test 2: Validate JSON structure
console.log('\n📋 Validating JSON structure...');
let jsonValid = true;

for (const locale of locales) {
  for (const namespace of namespaces) {
    const filePath = path.join(__dirname, '..', 'public', 'locales', locale, `${namespace}.json`);
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      const json = JSON.parse(content);
      console.log(`✅ ${locale}/${namespace}.json is valid JSON`);
    } catch (error) {
      console.log(`❌ ${locale}/${namespace}.json has invalid JSON: ${error.message}`);
      jsonValid = false;
    }
  }
}

if (!jsonValid) {
  console.log('\n❌ Some translation files have invalid JSON!');
  process.exit(1);
}

// Test 3: Check key consistency between locales
console.log('\n🔑 Checking key consistency...');

function getKeys(obj, prefix = '') {
  let keys = [];
  for (const [key, value] of Object.entries(obj)) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    if (typeof value === 'object' && value !== null) {
      keys.push(...getKeys(value, fullKey));
    } else {
      keys.push(fullKey);
    }
  }
  return keys;
}

for (const namespace of namespaces) {
  console.log(`\nChecking ${namespace} namespace:`);
  
  const enPath = path.join(__dirname, '..', 'public', 'locales', 'en-GB', `${namespace}.json`);
  const daPath = path.join(__dirname, '..', 'public', 'locales', 'da-DK', `${namespace}.json`);
  
  const enContent = JSON.parse(fs.readFileSync(enPath, 'utf8'));
  const daContent = JSON.parse(fs.readFileSync(daPath, 'utf8'));
  
  const enKeys = getKeys(enContent).sort();
  const daKeys = getKeys(daContent).sort();
  
  // Find missing keys
  const missingInDanish = enKeys.filter(key => !daKeys.includes(key));
  const missingInEnglish = daKeys.filter(key => !enKeys.includes(key));
  
  if (missingInDanish.length === 0 && missingInEnglish.length === 0) {
    console.log(`✅ All keys match between locales (${enKeys.length} keys)`);
  } else {
    if (missingInDanish.length > 0) {
      console.log(`❌ Keys missing in Danish: ${missingInDanish.join(', ')}`);
    }
    if (missingInEnglish.length > 0) {
      console.log(`❌ Keys missing in English: ${missingInEnglish.join(', ')}`);
    }
  }
}

// Test 4: Check for interpolation placeholders
console.log('\n🔄 Checking interpolation placeholders...');

function findInterpolations(obj, prefix = '') {
  let interpolations = [];
  for (const [key, value] of Object.entries(obj)) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    if (typeof value === 'string') {
      const matches = value.match(/{{(\w+)}}/g);
      if (matches) {
        interpolations.push({
          key: fullKey,
          placeholders: matches.map(m => m.replace(/[{}]/g, ''))
        });
      }
    } else if (typeof value === 'object' && value !== null) {
      interpolations.push(...findInterpolations(value, fullKey));
    }
  }
  return interpolations;
}

for (const namespace of namespaces) {
  for (const locale of locales) {
    const filePath = path.join(__dirname, '..', 'public', 'locales', locale, `${namespace}.json`);
    const content = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    const interpolations = findInterpolations(content);
    
    if (interpolations.length > 0) {
      console.log(`📝 ${locale}/${namespace} has ${interpolations.length} interpolation(s):`);
      interpolations.forEach(({ key, placeholders }) => {
        console.log(`   ${key}: ${placeholders.join(', ')}`);
      });
    }
  }
}

console.log('\n✅ i18n system validation complete!');
console.log('\n🚀 You can now test the system by running:');
console.log('   npm run dev');
console.log('   Then visit: http://localhost:3000/test-i18n');