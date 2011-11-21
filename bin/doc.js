/**
 * @author yuanyan
 */

var fs = require('fs');

var source = fs.readFileSync("../src/f1.js");

var result, comment, desc, method, ret, example, methods=[];
// {desc:"", method: "", return: "", example: ""}
function methodFactory(desc,method,ret ,example){
    return {desc:desc, method:method, ret:ret, example: example}
}


var pattern = /\/\*(.|\s)*?\*\//mg;
var methodPattern = /@method (.*)/;
var returnPattern = /@return (.*)/;
var mPattern = /\* (.*)/g;
var mpPattern = /\* /g;

while((result = pattern.exec(source)) != null) {
    //console.log("Matched '" + result[0] +
     //     "' at position " + result.index +
     //     " next search begins at position " + pattern.lastIndex);
		  
	comment = result[0];
	var isPrivate = /@private/ig.test(comment);
	var isPublic = /@method/ig.test(comment);
	if(!isPrivate && isPublic){
        desc = comment.split("@method")[0];
        desc = desc.match(mPattern).join("").replace(mpPattern,"");


       method = comment.match(methodPattern)[1];

       if(ret = comment.match(returnPattern)){
            ret = ret[1];
       };

        if(example = comment.split("@example")[1]){
            var mexample;
            if(mexample = example.match(mPattern)){
                example = mexample.join("\n").replace(mpPattern,"");
            }
        }

       var m = methodFactory(desc, method, ret, example);
       methods.push(m);
	}
	
}

var docs = {auth:"yuanyan", methods:methods};

fs.writeFileSync("../doc/docs.js","var docs = "+JSON.stringify(docs,null,"    "));

console.log("document generate success.");