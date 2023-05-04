const fs = require('fs');
const path = require('path');

const dirPath = path.join(__dirname, 'files');

fs.mkdir(path.join(__dirname, 'files-copy'), { recursive: true }, err => {
  if (err) throw err;

  fs.readdir(path.join(__dirname, 'files-copy'), { withFileTypes: true }, (err, files) => {
    if (err) throw err;
    files.forEach(file => {
      fs.unlink(path.join(__dirname, 'files-copy', file.name), err => {
        if (err) throw err;
      });
    });
  });

  fs.readdir(dirPath, { withFileTypes: true }, (err, files) => {
    if (err) throw err;
    files.forEach(file => {
      if (!file.isDirectory()) {
        fs.copyFile(path.join(__dirname, 'files', file.name), path.join(__dirname, 'files-copy', file.name), err => {
          if (err) throw err;
          console.log('Файл успешно скопирован');
        });
      }
    });
  });
});
