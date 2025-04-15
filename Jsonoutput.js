// saveOutput.js
const fs = require('fs');
const { execSync } = require('child_process');

// Run your original script and capture its output
const output = execSync('node pltable.js').toString().trim();

// Load package.json
const pkg = require('./package.json');

// Add the output to a custom field (e.g., "lastOutput")
pkg.lastOutput = output;

// Write back to package.json
fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2), 'utf-8');

console.log('Output saved to package.json under "lastOutput"');

