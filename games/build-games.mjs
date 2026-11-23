// Builds games: (1) copies each game into dist/games/<name>/ for the own site,
// (2) creates release/<name>-crazygames.zip with the CrazyGames SDK v3 enabled, plus cover images.
// Usage: node games/build-games.mjs [--release]
import fs from 'node:fs'; import path from 'node:path'; import { execFileSync } from 'node:child_process';
const GAMES = fs.readdirSync('games').filter(d => fs.existsSync(`games/${d}/index.html`));
const FILES = ['index.html', 'core.js', 'game.js'];
const SDK = '<script src="https://sdk.crazygames.com/crazygames-sdk-v3.js"></script>';
export function buildForSite(out = 'dist/games') {
  for (const g of GAMES) { fs.mkdirSync(`${out}/${g}`, { recursive: true }); for (const f of FILES) fs.copyFileSync(`games/${g}/${f}`, `${out}/${g}/${f}`); }
  return GAMES;
}
function release() {
  for (const g of GAMES) {
    const tmp = `release/.tmp-${g}`; fs.rmSync(tmp, { recursive: true, force: true }); fs.mkdirSync(tmp, { recursive: true });
    for (const f of FILES) fs.copyFileSync(`games/${g}/${f}`, `${tmp}/${f}`);
    fs.writeFileSync(`${tmp}/index.html`, fs.readFileSync(`${tmp}/index.html`, 'utf8').replace('<!--PLATFORM_SDK-->', SDK));
    const zip = path.resolve(`release/${g}-crazygames.zip`); fs.rmSync(zip, { force: true });
    execFileSync('python3', ['-c', `import zipfile,os,sys\nz=zipfile.ZipFile(sys.argv[1],'w',zipfile.ZIP_DEFLATED)\nfor f in os.listdir(sys.argv[2]): z.write(os.path.join(sys.argv[2],f),f)\nz.close()`, zip, tmp]);
    fs.rmSync(tmp, { recursive: true }); console.log('wrote', zip);
  }
}
if (process.argv.includes('--release')) release();
