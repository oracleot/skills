#!/usr/bin/env node
'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const exampleRoot = path.resolve(__dirname, '..');
const templateRoot = path.resolve(__dirname, '../../../templates/electron-live-demo');
const sharedFiles = [
  'scripts/runtime-smoke.cjs',
  'src/preload.cjs',
  'src/renderer/audience.html',
  'src/renderer/audience.js',
  'src/renderer/demo.css',
  'src/renderer/notes.html',
  'src/renderer/notes.js'
];

for (const relativePath of sharedFiles) {
  const example = fs.readFileSync(path.join(exampleRoot, relativePath), 'utf8');
  const template = fs.readFileSync(path.join(templateRoot, relativePath), 'utf8');
  assert.equal(example, template, `${relativePath} must match the canonical template`);
}

process.stdout.write('Telescope example matches canonical template shared files.\n');
