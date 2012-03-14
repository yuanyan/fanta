/**
 * @author yuanyan
 */
var fs = require("fs");
var JSHINT = require("../lib/jshint/jshint.js").JSHINT;


var JsFiles = ["../src/f1.js"];

var JsHintConfig = {
    forin:true,
    loopfunc:true
};


for (var i = 0; i < JsFiles.length; i++) {
    var file = JsFiles[i];
    if (!JSHINT(fs.readFileSync(file, "utf8"), JsHintConfig)) {

        for (var i = 0, err; err = JSHINT.errors[i]; i++) {
            console.log(err.reason + ' (line: ' + err.line + ', character: ' + err.character + ')');
            console.log('> ' + (err.evidence || '').replace(/^\s*(\S*(\s+\S+)*)\s*$/, "$1"));
            console.log('');
        }

    }

}


