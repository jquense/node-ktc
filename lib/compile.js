var _ = require('lodash')
  , util = require('util') 

  
/* the following code contains both modified and unmodified code licensed to Telerik Kendo UI Core under Apache v2
*  the notice of which is below, and of course applies where applicable -@theporchrat
*
* ------------------------------------------------------------------------------------------------
* Copyright © 2014 Telerik
*
* Licensed under the Apache License, Version 2.0 (the "License"); 
* you may not use this file except in compliance with the License.You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software distributed under the License is 
* distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and limitations under the License.
*/

var argumentNameRegExp = /^\w+/
  , encodeRegExp = /\$\{([^}]*)\}/g
  , escapedCurlyRegExp = /\\\}/g
  , curlyRegExp = /__CURLY__/g
  , escapedSharpRegExp = /\\#/g
  , sharpRegExp = /__SHARP__/g
  , defaults = {
        paramName: "data",
        useWithBlock: true, 
    };


    module.exports = function compile(template, options) {
        var settings = _.defaults(options, defaults)
          , paramName = settings.paramName
          , argumentName = paramName.match(argumentNameRegExp)[0]
          , useWithBlock = settings.useWithBlock
          , functionBody = "var template, htmlEncode=function (value) { \n return (\"\" + value).replace(/&/g, \"&amp;\").replace(/</g, \"lt;\").replace(/>/g, \"&gt;\");\n}\n"
          , fn, parts, idx;

        if (typeof template === 'function')
            return template;
        
        functionBody += useWithBlock ? "with(" + paramName + "){\n   " : '';
        functionBody += "template=";

        parts = template
            .replace(escapedCurlyRegExp, "__CURLY__")
            .replace(encodeRegExp, "#=htmlEncode($1)#")
            .replace(curlyRegExp, "}")
            .replace(escapedSharpRegExp, "__SHARP__")
            .split("#");

        for (idx = 0; idx < parts.length; idx ++)
            functionBody += compilePart(parts[idx], idx % 2 === 0);
        
        functionBody += useWithBlock ? ";\n}" : ";";
        functionBody += "\nreturn template;";
        functionBody = functionBody.replace(sharpRegExp, "#");


        return 'function (' + argumentName +') { \n' + functionBody + '\n}';
    }

    function compilePart(part, stringPart) {
         if (stringPart) {
             return "'" +
                 part.split("'").join("\\'")
                     .split('\\"').join('\\\\\\"')
                     .replace(/\n/g, "\\n")
                     .replace(/\r/g, "\\r")
                     .replace(/\t/g, "\\t") + "'";
         } else {
             var first = part.charAt(0),
                 rest = part.substring(1);

             if (first === "=") {
                 return "+(" + rest + ")+";
             } else if (first === ":") {
                 return "+htmlEncode(" + rest + ")+";
             } else {
                 return ";" + part + ";template+=";
             }
         }
     }

    