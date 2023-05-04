const fs = require('fs');
const { stdout, stdin, stderr } = process;
const path = require('path');

const pathToFile = path.join(__dirname, 'output.txt');
const outputFile = fs.createWriteStream(pathToFile);

stdout.write('Введите текст для записи в файл: \n');
stdin.on('data', (data) => {
  if (data.toString().includes('exit')) {
    process.exit();
  } else {
    outputFile.write(data);
  }
});

process.on('SIGINT', () => process.exit());
process.on('exit', () => stdout.write('Файл записан'));
process.on('error', error => stderr.write('Error', error.message));