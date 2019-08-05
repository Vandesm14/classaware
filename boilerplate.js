const fs = require('fs');

var file = fs.readFileSync('htmltemplate.txt', 'utf8');

fs.writeFileSync('htmltemplate.txt', JSON.stringify(file.split('\n')), 'utf8');