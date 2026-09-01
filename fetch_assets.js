import fs from 'node:fs';
import path from 'node:path';
import https from 'node:https';

const basePath = 'c:/Users/riyat/OneDrive/Pictures/New folder/bday_ar';

const assets = [
  'public/landing-pages/meng-to-sketchbook/bg-wash.jpg',
  'public/landing-pages/meng-to-sketchbook/bloom.png',
  'public/landing-pages/meng-to-sketchbook/botanic-gardens.png',
  'public/landing-pages/meng-to-sketchbook/botany-left.png',
  'public/landing-pages/meng-to-sketchbook/botany-right.png',
  'public/landing-pages/meng-to-sketchbook/buddha-tooth.png',
  'public/landing-pages/meng-to-sketchbook/divider.png',
  'public/landing-pages/meng-to-sketchbook/gardens-by-the-bay.png',
  'public/landing-pages/meng-to-sketchbook/instrument-serif-italic.woff2',
  'public/landing-pages/meng-to-sketchbook/instrument-serif.woff2',
  'public/landing-pages/meng-to-sketchbook/joo-chiat.png',
  'public/landing-pages/meng-to-sketchbook/lau-pa-sat.png',
  'public/landing-pages/meng-to-sketchbook/marina-bay-sands.png',
  'public/landing-pages/meng-to-sketchbook/marina-bay-skyline.png',
  'public/landing-pages/meng-to-sketchbook/merlion.png',
  'public/landing-pages/meng-to-sketchbook/newsreader.woff2',
  'public/landing-pages/meng-to-sketchbook/singapore-river.png'
];

const downloadFile = (url, dest) => {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode !== 200) {
        reject(new Error(`Failed to download ${url}: ${res.statusCode}`));
        return;
      }
      const dir = path.dirname(dest);
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      const file = fs.createWriteStream(dest);
      res.pipe(file);
      file.on('finish', () => {
        file.close();
        resolve();
      });
    }).on('error', (err) => {
      fs.unlink(dest, () => {});
      reject(err);
    });
  });
};

async function fetchAssets() {
  for (const asset of assets) {
    const url = `https://threeui.com/${asset.replace('public/', '')}`;
    const dest = path.join(basePath, asset);
    console.log(`Downloading ${url}...`);
    try {
      await downloadFile(url, dest);
      console.log(`Saved ${dest}`);
    } catch (e) {
      console.error(e);
    }
  }
}

fetchAssets();
