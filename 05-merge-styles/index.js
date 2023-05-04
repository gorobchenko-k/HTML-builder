const fs = require('fs');
const path = require('path');

const pathStyle = path.join(__dirname, 'styles');
const pathBundleFile = path.join(__dirname, 'project-dist', 'bundle.css');

fs.writeFile(
  pathBundleFile,
  '',
  (err) => {
    if (err) console.error('Erorr - ' + err);
  }
);

fs.readdir(pathStyle, { withFileTypes: true }, (err, files) => {
  if (err) {
    console.error('Erorr - ' + err);
  } else {
    files.forEach(file => {
      if (!file.isDirectory()) {
        const filePath = path.join(pathStyle, file.name);

        if (path.extname(filePath) === '.css') {
          fs.readFile(
            filePath,
            'utf-8',
            (err, data) => {
              if (err) console.error('Erorr - ' + err);
              fs.appendFile(
                pathBundleFile,
                data,
                (err) => {
                  if (err) console.error('Erorr - ' + err);
                }
              );
            }
          );
        }
      }
    });
  }
});
