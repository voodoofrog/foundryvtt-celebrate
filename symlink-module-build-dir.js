import yargs from 'yargs/yargs';
import { hideBin } from 'yargs/helpers';
import fs from 'fs-extra';
import { resolve } from 'path';

const { ensureDir, existsSync, readJSONSync, remove, symlink } = fs;
const argv = yargs(hideBin(process.argv)).argv;

const moduleDirectory = 'celebrate';
const buildDirectory = './dist';
const publicDirectory = './public';

/**
 * Get the data path for Foundry VTT based on what is configured in `foundry-data-path-config.json`
 */
function getFoundryDataPath() {
  const config = readJSONSync('foundry-data-path-config.json');

  if (config?.dataPath) {
    if (!existsSync(resolve(config.dataPath))) {
      throw new Error('Supplied Foundry data path is invalid, directory not found');
    }

    return resolve(config.dataPath);
  } else {
    throw new Error('No Foundry data path defined in foundry-data-path-config.json');
  }
}

/**
 * Handles symlinks from public folder to dist folder
 */
async function handleDistSymlinks() {
  if (argv.clean || argv.c) {
    await fs.readdirSync(publicDirectory).forEach(async (file) => {
      const linkDest = resolve(buildDirectory, file);
      console.log(`[== Removing link: ${linkDest} ==]\n`);
      await remove(linkDest);
    });
  } else {
    await fs.readdirSync(publicDirectory).forEach(async (file) => {
      const linkDest = resolve(buildDirectory, file);
      if (!existsSync(linkDest)) {
        const linkSrc = resolve(publicDirectory, file);
        console.log(`[== Linking ${file} to ${buildDirectory} ==]\n`);
        if (fs.statSync(linkSrc).isDirectory()) {
          await symlink(linkSrc, linkDest, 'dir');
        } else {
          await symlink(linkSrc, linkDest, 'file');
        }
      }
    });
  }
}

/**
 * Handles symlinks from build folder to Foundry VTT data folder
 */
async function handleFoundrySymlinks() {
  const destinationDirectory = 'modules';
  const symlinkDirectory = resolve(getFoundryDataPath(), 'Data', destinationDirectory, moduleDirectory);

  if (argv.clean || argv.c) {
    console.log(`[== Removing link: ${symlinkDirectory} ==]\n`);
    await remove(symlinkDirectory);
  } else if (!existsSync(symlinkDirectory)) {
    console.log(`[== Linking ${buildDirectory} to ${symlinkDirectory} ==]\n`);
    await ensureDir(resolve(symlinkDirectory, '..'));
    await symlink(resolve(buildDirectory), symlinkDirectory, 'dir');
  }
}

/**
 * Handles symlinks
 */
async function createSymlinks() {
  const distOnly = argv.distonly || argv.d;
  await handleDistSymlinks();
  if (!distOnly) {
    await handleFoundrySymlinks();
  }
}

createSymlinks();
