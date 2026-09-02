import fs from 'node:fs';
import path from 'node:path';

const basePath = 'c:/Users/riyat/OneDrive/Pictures/New folder/bday_ar';
const htmlPath = path.join(basePath, 'public/landing-pages/meng-to-sketchbook.html');

let html = fs.readFileSync(htmlPath, 'utf8');

// Replace the <nav> block to include Memories
const navOriginal = /<nav>\s*<a href="#plates">Journal<\/a>\s*<a href="#about">About<\/a>\s*<\/nav>/;
const navReplacement = `<nav>
        <a href="#plates">Journal</a>
        <a href="#about">About</a>
        <a href="#" onclick="window.parent.document.getElementById('memories').scrollIntoView({behavior:'smooth'}); return false;">Memories</a>
      </nav>`;

html = html.replace(navOriginal, navReplacement);

fs.writeFileSync(htmlPath, html, 'utf8');
console.log('HTML successfully patched to include Memories tab!');
