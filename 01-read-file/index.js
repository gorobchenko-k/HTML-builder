const fs = require('fs');
const path = require('path');

const pathToFile = path.join(__dirname, 'text.txt');
const readableStream = fs.createReadStream(pathToFile, 'utf-8');

let result = '';

readableStream.on('data', (chunk) => result += chunk);
readableStream.on('end', () => console.log(result));
readableStream.on('error', error => console.log('Error', error.message));