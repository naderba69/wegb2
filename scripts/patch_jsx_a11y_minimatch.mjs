#!/usr/bin/env node
/**
 * eslint-plugin-jsx-a11y 6.10.2 treats minimatch's CommonJS export as a
 * callable default. minimatch 11 intentionally exposes `minimatch` as a named
 * function instead. We require minimatch >=11.0.1 to close GHSA-g3hv-75wg-m249,
 * so adapt the plugin's two internal consumers after every npm install.
 *
 * Delete this patch as soon as eslint-plugin-jsx-a11y publishes native
 * minimatch 11 support. The script is idempotent and fails loudly if the
 * upstream files change, preventing a silent, stale dependency patch.
 */
import { readFileSync, writeFileSync } from "node:fs";

const files = [
  "node_modules/eslint-plugin-jsx-a11y/lib/util/mayContainChildComponent.js",
  "node_modules/eslint-plugin-jsx-a11y/lib/util/mayHaveAccessibleLabel.js",
];
const legacy = 'var _minimatch = _interopRequireDefault(require("minimatch"));';
const patched = [
  'var _minimatchModule = require("minimatch");',
  'var _minimatch = { "default": typeof _minimatchModule === "function" ? _minimatchModule : _minimatchModule.minimatch };',
].join("\n");

for (const file of files) {
  const source = readFileSync(file, "utf8");
  if (source.includes(patched)) continue;
  if (!source.includes(legacy)) {
    throw new Error(`jsx-a11y minimatch compatibility patch is stale: ${file}`);
  }
  writeFileSync(file, source.replace(legacy, patched));
}

console.log("dependency patch: eslint-plugin-jsx-a11y ↔ minimatch 11 ready");
