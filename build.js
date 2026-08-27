#!/usr/bin/env node

/**
 * Build script to inject Google Maps API key from environment variables
 * Run: npm run build
 */

const fs = require('fs');
const path = require('path');

console.log('🔨 Starting build process...\n');

// Get API key from environment variable
const mapsApiKey = process.env.MAPS_API_KEY || '';

if (!mapsApiKey) {
  console.warn('⚠️  Warning: MAPS_API_KEY environment variable not set.');
  console.warn('   Maps will use fallback Google Maps links.\n');
}

// Read index.html
const indexPath = path.join(__dirname, 'index.html');
let htmlContent = fs.readFileSync(indexPath, 'utf8');

// Create the config script with the API key
const configScript = `<script>
  window.__APP_CONFIG__ = {
    MAPS_API_KEY: '${mapsApiKey}'
  };
</script>`;

// Replace the config.js reference with the injected config
const updatedHtml = htmlContent.replace(
  /<script src="\/config\.js"><\/script>/,
  configScript
);

// Write back the updated HTML
fs.writeFileSync(indexPath, updatedHtml, 'utf8');

if (mapsApiKey) {
  console.log('✅ API key injected successfully!');
  console.log(`   Key (first 10 chars): ${mapsApiKey.substring(0, 10)}...`);
} else {
  console.log('ℹ️  No API key injected - using fallback links');
}

console.log('✅ Build complete!\n');
