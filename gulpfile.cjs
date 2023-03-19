const argv = require('yargs').argv;
const fs = require('fs-extra');
const path = require('path');

// CONFIGURATION
const name = 'celebrate';
const distDirectory = './dist';

// LINK

// eslint-disable-next-line jsdoc/require-returns
/**
 * Get the data path of Foundry VTT based on what is configured in `foundryconfig.json`
 */
function getDataPath() {
  const config = fs.readJSONSync('foundryconfig.json');

  if (config?.dataPath) {
    if (!fs.existsSync(path.resolve(config.dataPath))) {
      throw new Error('User Data path invalid, no Data directory found');
    }

    return path.resolve(config.dataPath);
  } else {
    throw new Error('No User Data path defined in foundryconfig.json');
  }
}

/**
 * Link build to User Data folder
 */
async function linkUserData() {
  let destinationDirectory;
  if (fs.existsSync(path.resolve(distDirectory, 'module.json'))) {
    destinationDirectory = 'modules';
  } else {
    throw new Error('Could not find module.json');
  }

  const linkDirectory = path.resolve(getDataPath(), 'Data', destinationDirectory, name);

  if (argv.clean || argv.c) {
    console.log(`Removing build in ${linkDirectory}.`);

    await fs.remove(linkDirectory);
  } else if (!fs.existsSync(linkDirectory)) {
    console.log(`Linking dist to ${linkDirectory}.`);
    await fs.ensureDir(path.resolve(linkDirectory, '..'));
    await fs.symlink(path.resolve(distDirectory), linkDirectory);
  }
}

exports.link = linkUserData;
