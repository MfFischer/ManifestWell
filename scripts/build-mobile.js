/**
 * Mobile Build Script
 * Temporarily moves API routes during build since they're not used on mobile
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const apiPath = path.join(__dirname, '..', 'src', 'app', 'api');
const backupPath = path.join(__dirname, '..', 'src', 'app', '_api_backup');

function moveApi(from, to) {
  if (fs.existsSync(from)) {
    fs.renameSync(from, to);
    console.log(`Moved ${from} to ${to}`);
  }
}

function restoreApi() {
  moveApi(backupPath, apiPath);
}

// Handle script termination to restore API folder
process.on('exit', restoreApi);
process.on('SIGINT', () => { restoreApi(); process.exit(); });
process.on('SIGTERM', () => { restoreApi(); process.exit(); });
process.on('uncaughtException', (err) => {
  console.error(err);
  restoreApi();
  process.exit(1);
});

try {
  // Move API folder out of the way
  moveApi(apiPath, backupPath);

  // Run the build
  console.log('Building for mobile...');
  execSync('npx cross-env CAPACITOR_PLATFORM=true next build', {
    stdio: 'inherit',
    cwd: path.join(__dirname, '..')
  });

  console.log('Build successful!');
} catch (error) {
  console.error('Build failed:', error.message);
  process.exit(1);
} finally {
  // Restore API folder
  restoreApi();
}
