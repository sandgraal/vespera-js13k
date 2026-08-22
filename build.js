const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const html = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');
const zipPath = path.join(__dirname, 'game.zip');

execSync(`python3 -c "import zipfile; z=zipfile.ZipFile('${zipPath}', 'w', zipfile.ZIP_DEFLATED, compresslevel=9); z.write('index.html'); z.close()"`);

const bytes = fs.statSync(zipPath).size;
const limit = 13312;
console.log(`\nZip size: ${bytes} / ${limit} bytes (${((bytes/limit)*100).toFixed(1)}%) - Remaining: ${limit - bytes} bytes\n`);