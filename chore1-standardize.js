#!/usr/bin/env node
/**
 * chore1-standardize.js
 * Standardize on npm, move dev-only deps to devDependencies, and add helper scripts.
 *
 * Usage:
 *   node tools/chore1-standardize.js
 *
 * This script is idempotent and safe to re-run.
 */
const fs = require('fs');
const path = require('path');

const REPO_ROOT = process.cwd();
const pkgPath = path.join(REPO_ROOT, 'package.json');
if (!fs.existsSync(pkgPath)) {
  console.error('❌ package.json not found. Run this from your repo root.');
  process.exit(1);
}

const devOnly = new Set([
  'vitest',
  '@vitest/ui',
  '@testing-library/react',
  '@testing-library/jest-dom',
  '@testing-library/user-event',
  'typedoc',
  'eslint',
  '@typescript-eslint/eslint-plugin',
  '@typescript-eslint/parser',
  'eslint-config-prettier',
  'prettier'
]);

/** Load and mutate package.json */
const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
pkg.dependencies = pkg.dependencies || {};
pkg.devDependencies = pkg.devDependencies || {};
pkg.scripts = pkg.scripts || {};

let changed = false;

// Move dev-only packages
for (const name of Object.keys(pkg.dependencies)) {
  if (devOnly.has(name)) {
    pkg.devDependencies[name] = pkg.dependencies[name];
    delete pkg.dependencies[name];
    changed = true;
    console.log(`→ Moved ${name} to devDependencies`);
  }
}

// Ensure helper scripts
if (!pkg.scripts['type-check']) {
  pkg.scripts['type-check'] = 'tsc --noEmit';
  changed = true;
  console.log('→ Added script: type-check');
}
if (!pkg.scripts['lint:fix']) {
  pkg.scripts['lint:fix'] = 'eslint . --fix';
  changed = true;
  console.log('→ Added script: lint:fix');
}

// Write back package.json if changed
if (changed) {
  fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n', 'utf8');
  console.log('✅ Updated package.json');
} else {
  console.log('ℹ️ No changes needed in package.json');
}

// Remove Bun/Yarn lockfiles if present
const lockfiles = ['bun.lockb', 'yarn.lock'];
let removedAny = false;
for (const f of lockfiles) {
  const p = path.join(REPO_ROOT, f);
  if (fs.existsSync(p)) {
    try {
      fs.rmSync(p);
      removedAny = true;
      console.log(`→ Removed ${f}`);
    } catch (e) {
      console.warn(`⚠️ Could not remove ${f}: ${e.message}`);
    }
  }
}

if (!removedAny) {
  console.log('ℹ️ No Bun/Yarn lockfiles found to remove.');
}

console.log('\nNext steps:');
console.log('  1) npm install');
console.log('  2) npm run build');
console.log('  3) npm run type-check');
console.log('  4) npm test -- --run');
console.log('\nDone.');
