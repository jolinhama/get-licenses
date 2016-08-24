#!/usr/bin/env node

var fs      = require('fs'),
    program = require('commander');

program
  .version('1.0.0')
  .parse(process.argv);

var args = program.args;

// If not arguments display the help view
if(!args.length) return program.help();

var destDir   = args[1] ? ('./' + args[1] + '/') : './licenses/', // {string} the directory to place the licenses in
    sourceDir = args[0].split(','), // {string} the source directory to get the files from
    path,     // {string} the individual directory to get license info from
    fileName; // {string} the destination and filename

// Check to see if the destination directory exists and create it if it doesn't
if(!fs.existsSync(destDir)) {
  fs.mkdir(destDir);
}

// Grab of the file name from the specified directory and search for the license information

var currentSource;
var licenseFilePatterns = ['LICENSE','LICENSE.md','license.txt','package.json','bower.json'];

for(var i = 0, len1 = sourceDir.length; i < len1; i++) {
  currentSource = sourceDir[i];

  fs.readdir('./' + currentSource + '/', function(err, files) {
    if (err) throw err;

    // loop over each file
    for(var y = 0, len2 = files.length; y < len2; y++) {
      path = './' + currentSource + '/' + files[y];
      fileName = destDir + files[y];

      licenseFilePatterns.every(function (licensePattern) {
        var patternFilePath = path + '/' + licensePattern;
        try {
          fs.accessSync(patternFilePath);
          fs.createReadStream(patternFilePath)
              .pipe(fs.createWriteStream(fileName));
          return false;
        }
        catch(e) {}
        return true;
     });
    }
  });
}


