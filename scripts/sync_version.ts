import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';

/**
 * Syncs the version from root package.json down to electron, frontend, and backend environments.
 */
function syncVersion() {
  try {
    const projectRoot = resolve(__dirname, '..');
    const rootPackageJsonPath = join(projectRoot, 'package.json');

    console.log(`Reading master version from: ${rootPackageJsonPath}`);

    if (!existsSync(rootPackageJsonPath)) {
      throw new Error(`Master package.json not found at ${rootPackageJsonPath}`);
    }

    const rootPackageJson = JSON.parse(readFileSync(rootPackageJsonPath, 'utf-8'));
    const version = rootPackageJson.version;

    if (!version) {
      throw new Error('Version missing in root package.json');
    }

    console.log(`Master version declared as: ${version}`);

    // Update pyproject.toml
    const pyprojectPath = join(projectRoot, 'akagi_backend', 'pyproject.toml');
    console.log(`Updating ${pyprojectPath}...`);
    let pyprojectContent = readFileSync(pyprojectPath, 'utf-8');
    pyprojectContent = pyprojectContent.replace(
      /^(\s*version\s*=\s*)["']([^"']+)["']/m,
      `$1"${version}"`,
    );
    writeFileSync(pyprojectPath, pyprojectContent);
    console.log(`✅ Synced to pyproject.toml`);

    // Update electron/package.json
    const electronPackageJsonPath = join(projectRoot, 'electron', 'package.json');
    console.log(`Updating ${electronPackageJsonPath}...`);
    const electronPackageJson = JSON.parse(readFileSync(electronPackageJsonPath, 'utf-8'));
    electronPackageJson.version = version;
    writeFileSync(electronPackageJsonPath, JSON.stringify(electronPackageJson, null, 2) + '\n');
    console.log(`✅ Synced to electron/package.json`);

    // Update frontend/package.json
    const frontendPackageJsonPath = join(projectRoot, 'akagi_frontend', 'package.json');
    console.log(`Updating ${frontendPackageJsonPath}...`);
    const frontendPackageJson = JSON.parse(readFileSync(frontendPackageJsonPath, 'utf-8'));
    frontendPackageJson.version = version;
    if (frontendPackageJson._comment) {
      delete frontendPackageJson._comment;
    }
    writeFileSync(frontendPackageJsonPath, JSON.stringify(frontendPackageJson, null, 2) + '\n');
    console.log(`✅ Synced to akagi_frontend/package.json`);

    console.log(`🎉 Monorepo version successfully synced!`);
  } catch (error) {
    console.error('❌ Failed to sync versions:', error);
    process.exit(1);
  }
}

syncVersion();
