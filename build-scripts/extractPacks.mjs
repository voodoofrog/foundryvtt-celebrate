import { extractPack } from '@foundryvtt/foundryvtt-cli';
import { promises as fs } from 'fs';

const MODULE_ID = process.cwd();

async function unpack() {
  const packs = await fs.readdir('./dist/packs');

  for (const pack of packs) {
    if (pack === '.gitattributes') continue;

    console.log(`[== Unpacking ${pack} ==]`);

    await extractPack(`${MODULE_ID}/dist/packs/${pack}`, `${MODULE_ID}/packs/${pack}`);
  }
}

unpack();
