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

function formatProLabel(version, productName) {
    const majorMinor = String(version || '1.0.0').split('.').slice(0, 2).join('.');
    const base = productName || 'REFLUX PRO';
    return base.includes('v') ? base : `${base} v${majorMinor}`;
}

function main() {
    const freePkg = readPkg(FREE_PKG);
    const proPkg = readPkg(PRO_PKG);

    const manifest = {
        free: {
            version: freePkg.version,
            label: freePkg.productName || freePkg.build?.productName || 'REFLUX FREE',
            downloadUrl: 'https://www.refluxtweaks.com/downloads/REFLUX-FREE-Setup.exe',
            message: 'A new version of REFLUX FREE is ready. Please install the new version.'
        },
        pro: {
            version: proPkg.version,
            label: formatProLabel(proPkg.version, proPkg.build?.productName || proPkg.productName),
            downloadUrl: 'https://www.refluxtweaks.com/account',
            message: 'A new version of REFLUX PRO is ready. Please install the new version from your account.'
        }
    };

    fs.writeFileSync(OUT, `${JSON.stringify(manifest, null, 2)}\n`, 'utf8');
    console.log(`Wrote ${OUT}`);
    console.log(JSON.stringify(manifest, null, 2));
}

main();
