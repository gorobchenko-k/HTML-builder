const fs = require('fs');
const path = require('path');

const dirPath = path.join(__dirname, 'secret-folder');

fs.readdir(dirPath, { withFileTypes: true }, (err, files) => {
  if (err) {
    console.error('Erorr - ' + err);
  } else {
    files.forEach(file => {
      if (!file.isDirectory()) {
        const filePath = path.join(dirPath, file.name);
        fs.stat(filePath, (err, stat) => {
          if (err) {
            console.error('Erorr - ' + err);
          } else {
            const fileName = path.basename(filePath).slice(0, path.basename(filePath).indexOf(path.extname(filePath)));
            const fileExtName = path.extname(filePath).slice(1);
            console.log(fileName + ' - ' + fileExtName + ' - ' + stat['size'] + ' байт');
          }
        });
      }
    });
  }
});