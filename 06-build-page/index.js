const fs = require('fs');
const path = require('path');

const pathTemplate = path.join(__dirname, 'template.html');
const pathIndex = path.join(__dirname, 'project-dist', 'index.html');

const pathProjectDir = path.join(__dirname, 'project-dist');
const pathComponents = path.join(__dirname, 'components');

const pathStyle = path.join(__dirname, 'styles');
const pathBundleFile = path.join(__dirname, 'project-dist', 'style.css');

let components = {};
let strTemplate = '';

function readDir(pathDir) {
  fs.readdir(path.join(__dirname, pathDir), { withFileTypes: true }, (err, files) => {
    if (err) throw err;

    files.forEach(file => {

      if (!file.isDirectory()) {

        fs.copyFile(path.join(__dirname, pathDir, file.name), path.join(pathProjectDir, pathDir, file.name), err => {
          if (err) throw err;
          // console.log('Файл ' + file.name + ' успешно скопирован');
        });
      } else {

        const newPathDir = path.join(pathDir, file.name);
        fs.mkdir(path.join(pathProjectDir, newPathDir), { recursive: true }, err => {
          if (err) console.error('Erorr - ' + err);
          readDir(newPathDir);
        });
      }
    });
  });
}

fs.readdir(pathComponents, { withFileTypes: true }, (err, files) => {
  if (err) {
    console.error('Erorr - ' + err);
  } else {

    files.forEach(file => {

      if (!file.isDirectory()) {
        const filePath = path.join(pathComponents, file.name);

        if (path.extname(filePath) === '.html') {

          fs.readFile(
            filePath,
            'utf-8',
            (err, data) => {
              if (err) console.error('Erorr - ' + err);

              const componentName = file.name.slice(0, -5);
              components[componentName] = data;
            }
          );
        }
      }
    });

    fs.mkdir(pathProjectDir, { recursive: true }, err => {
      if (err) console.error('Erorr - ' + err);

      fs.readFile(
        pathTemplate,
        'utf-8',
        (err, data) => {
          if (err) console.error('Erorr - ' + err);
          strTemplate += data;

          while (strTemplate.match(/{{\w+}}/)) {
            const matchReg = strTemplate.match(/{{\w+}}/);
            const indexOfComp = matchReg.index;
            const lenNameComp = matchReg[0].length;
            const componentName = matchReg[0].slice(2, -2);
            strTemplate = strTemplate.slice(0, indexOfComp) + components[componentName] + strTemplate.slice(indexOfComp + lenNameComp + 1);
          }

          fs.writeFile(pathIndex, strTemplate, (err) => {
            if (err) throw err;
          });
        });

      fs.writeFile(pathBundleFile, '', (err) => {
        if (err) console.error('Erorr - ' + err);
      });

      fs.readdir(pathStyle, { withFileTypes: true }, (err, files) => {
        if (err) {
          console.error('Erorr - ' + err);
        } else {

          files.forEach(file => {

            if (!file.isDirectory()) {

              const filePath = path.join(pathStyle, file.name);
              if (path.extname(filePath) === '.css') {

                fs.readFile(filePath, 'utf-8', (err, data) => {
                  if (err) console.error('Erorr - ' + err);

                  fs.appendFile(pathBundleFile, data, (err) => {
                    if (err) console.error('Erorr - ' + err);
                  });
                });
              }
            }
          });
        }
      });

      fs.rm(path.join(pathProjectDir, 'assets'),
        { recursive: true },
        () => {
          fs.mkdir(path.join(pathProjectDir, 'assets'), { recursive: true }, err => {
            if (err) console.error('Erorr - ' + err);
            readDir('assets');
          });
        });
    });
  }
});
