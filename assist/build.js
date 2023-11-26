const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');
let files = fs.readdirSync(path.join(process.cwd(), 'lib'))
for (const file of files){
    fs.rmSync(path.join(process.cwd(), 'lib', file), { recursive: true });
}
execSync(`tsc -p ${(path.join(process.cwd(),'tsconfig.m.json'))}`)
files = fs.readdirSync(path.join(process.cwd(), 'lib'))

for (const file of files) {
    if (file.endsWith('.js')){
        fs.renameSync(path.join(process.cwd(),'lib',file),path.join(process.cwd(),'lib',file.replace('.js','.mjs')))
    }
    if (file.endsWith('.d.ts')) {
        fs.renameSync(path.join(process.cwd(), 'lib', file), path.join(process.cwd(), 'lib', file.replace('.d.ts','.d.mts')))
    }
}
execSync(`tsc -p ${(path.join(process.cwd(), 'tsconfig.json'))}`)
files = fs.readdirSync(path.join(process.cwd(), 'lib'))
for (const file of files) {
    if (file.endsWith('.js')) {
        fs.renameSync(path.join(process.cwd(), 'lib', file), path.join(process.cwd(), 'lib', file.replace('.js', '.cjs')))
    }
}