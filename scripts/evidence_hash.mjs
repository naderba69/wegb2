#!/usr/bin/env node
/** Print a stable evidence receipt without changing any review status. */
import { createHash } from "node:crypto";
import { readFileSync, statSync } from "node:fs";
import { extname, relative, resolve, sep } from "node:path";

const ROOT = process.cwd();
const input = process.argv[2];
if (!input) {
  console.error("usage: npm run evidence:hash -- <artifact-path>");
  process.exit(1);
}
const absolute = resolve(ROOT, input);
const rel = relative(ROOT, absolute);
if (rel.startsWith(`..${sep}`) || rel === "..") {
  console.error("artifact must be inside the repository workspace");
  process.exit(1);
}
const data = readFileSync(absolute);
const mediaByExt = {
  ".pdf": "application/pdf",
  ".html": "text/html",
  ".htm": "text/html",
  ".json": "application/json",
  ".md": "text/markdown",
  ".txt": "text/plain",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
};
console.log(JSON.stringify({
  artifactPath: rel.replaceAll(sep, "/"),
  bytes: statSync(absolute).size,
  mediaType: mediaByExt[extname(absolute).toLowerCase()] ?? "application/octet-stream",
  sha256: createHash("sha256").update(data).digest("hex"),
}, null, 2));
