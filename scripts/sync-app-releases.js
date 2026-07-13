'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const OUT = path.join(ROOT, 'public', 'app-releases.json');

const FREE_PKG = 'C:\\! REFLUX FREE TWEAKING UTILITY\\package.json';
const PRO_PKG = 'C:\\! REFLUX PRO TWEAKING UTILITY\\package.json';

function readPkg(filePath) {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function formatProLabel(version) {
    return `REFLUX PRO v${String(version || '1.0.0').trim()}`;
}

function formatFreeLabel(version, productName) {
    const base = productName || 'REFLUX FREE';
    return `${base} v${String(version || '1.0.0').trim()}`;
}

function main() {
    const freePkg = readPkg(FREE_PKG);
    const proPkg = readPkg(PRO_PKG);

    const manifest = {
        free: {
            version: freePkg.version,
            label: formatFreeLabel(freePkg.version, freePkg.productName || freePkg.build?.productName),
            downloadUrl: 'https://www.refluxtweaks.com/downloads/REFLUX-FREE-Setup.exe',
            message: 'A new version of REFLUX FREE is ready. Please install the new version.'
        },
        pro: {
            version: proPkg.version,
            label: formatProLabel(proPkg.version),
            downloadUrl: 'https://www.refluxtweaks.com/account',
            message: 'A new version of REFLUX PRO is ready. Please install the new version from your account.'
        }
    };

    fs.writeFileSync(OUT, `${JSON.stringify(manifest, null, 2)}\n`, 'utf8');
    console.log(`Wrote ${OUT}`);
    console.log(JSON.stringify(manifest, null, 2));
}

main();
