// scripts/deploy-front.mjs
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const SSH_HOST = "cx-vps";
const REMOTE_DIR = "/srv/cx/front/landing";
const LOCAL_DIST = path.resolve("dist");

function run(cmd, args, opts = {}) {
  console.log(`\n> ${cmd} ${args.join(" ")}`);
  execFileSync(cmd, args, { stdio: "inherit", ...opts });
}

function exists(p) {
  try { fs.accessSync(p); return true; } catch { return false; }
}

function runNpm(args) {
  const nodeExe = process.execPath;

  const candidates = [
    path.resolve(nodeExe, "..", "node_modules", "npm", "bin", "npm-cli.js"),
    path.resolve(nodeExe, "..", "..", "node_modules", "npm", "bin", "npm-cli.js"),
    "/usr/local/lib/node_modules/npm/bin/npm-cli.js",
    "/usr/lib/node_modules/npm/bin/npm-cli.js",
  ];

  const npmCli = candidates.find(exists);

  if (npmCli) {
    return run(nodeExe, [npmCli, ...args]);
  }

  try {
    return run("npm.cmd", args);
  } catch {
    try {
      return run("npm", args);
    } catch {
      console.error(
        `\nERROR: Could not locate npm-cli.js and could not run npm from PATH.\n` +
        `Tried:\n- ${candidates.join("\n- ")}\n\n` +
        `Fix options:\n` +
        `1) Run this from a normal PowerShell (not conda "(base)")\n` +
        `2) Ensure Node was installed with npm\n` +
        `3) Ensure npm is in PATH (where.exe npm)\n`
      );
      process.exit(1);
    }
  }
}

function main() {
  // 1) build locally (includes vite build + prerender-blog.mjs)
  runNpm(["run", "build"]);

  if (!exists(LOCAL_DIST)) {
    console.error(`\nERROR: dist folder not found at: ${LOCAL_DIST}`);
    process.exit(1);
  }

  // 2) verify prerendered blog pages are present in dist
  const blogListHtml = path.join(LOCAL_DIST, 'en', 'blog', 'index.html');
  if (!exists(blogListHtml)) {
    console.error(
      `\nERROR: Prerendered blog pages not found in dist.\n` +
      `Expected: ${blogListHtml}\n` +
      `The prerender-blog.mjs script may have failed.\n`
    );
    process.exit(1);
  }
  console.log('  ✓ Prerendered blog pages verified in dist\n');

  const stamp = new Date().toISOString().replace(/[:.]/g, "-");
  const archiveName = `dist-${stamp}.tar.gz`;
  const archivePath = path.resolve(archiveName);
  if (exists(archivePath)) fs.unlinkSync(archivePath);

  run("tar", ["-czf", archiveName, "dist"]);

  const releasesDir = `${REMOTE_DIR}/.releases`;
  const remoteArchive = `${releasesDir}/${archiveName}`;
  const remoteReleaseDir = `${releasesDir}/dist-${stamp}`;

  run("ssh", [SSH_HOST, `mkdir -p "${releasesDir}"`]);
  run("scp", [archiveName, `${SSH_HOST}:${remoteArchive}`]);

  const remoteCmd = `
set -e

mkdir -p "${remoteReleaseDir}"
tar -xzf "${remoteArchive}" -C "${remoteReleaseDir}"

# backup old dist if exists
if [ -d "${REMOTE_DIR}/dist" ]; then
  mv "${REMOTE_DIR}/dist" "${REMOTE_DIR}/dist.bak-${stamp}"
fi

# move new dist into place
mv "${remoteReleaseDir}/dist" "${REMOTE_DIR}/dist"

# remove uploaded archive
rm -f "${remoteArchive}"

# --- cleanup policy ---
# keep last 5 dist backups
ls -1dt "${REMOTE_DIR}/dist.bak-"* 2>/dev/null | tail -n +6 | xargs -r rm -rf

# keep last 10 release folders (dist-*)
ls -1dt "${releasesDir}/dist-"* 2>/dev/null | tail -n +11 | xargs -r rm -rf

echo "Deployed to ${REMOTE_DIR}/dist"
`.trim();

  run("ssh", [SSH_HOST, remoteCmd]);

  fs.unlinkSync(archivePath);
  console.log("\n✅ Deploy finished.");
}

main();
