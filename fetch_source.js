import fs from 'node:fs';
import path from 'node:path';

const basePath = 'c:/Users/riyat/OneDrive/Pictures/New folder/bday_ar';

async function fetchSource() {
  try {
    const jsonPath = path.join(basePath, 'temp.json');
    if (!fs.existsSync(jsonPath)) {
      console.log('temp.json not found');
      return;
    }
    const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
    
    for (const file of data.files) {
      const content = file.code || file.content || file.source;
      if (content === undefined) {
        console.log(`Skipping ${file.path}: no content found. Keys: ${Object.keys(file).join(', ')}`);
        continue;
      }
      const filePath = path.join(basePath, file.path);
      const dir = path.dirname(filePath);
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      fs.writeFileSync(filePath, content);
      console.log(`Wrote ${file.path}`);
    }
    
    fs.unlinkSync(jsonPath);
    console.log('Source fetching complete.');
  } catch (err) {
    console.error('Error:', err);
  }
}

fetchSource();
