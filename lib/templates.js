
var templates = { }; 
 
var _ = require('lodash'); 


templates['amd'] = function (data) { 
var template, htmlEncode=function (value) { 
 return ("" + value).replace(/&/g, "&amp;").replace(/</g, "lt;").replace(/>/g, "&gt;");
}
template='define('+( data.amdname ? "'" + data.amdname +"', " : '')+' '+( data.dependency.length ? "[" + _.pluck(data.dependency, 'amd') +"], " : '')+' function( '+( _.pluck(data.dependency, 'alias') )+'){\r\nvar templates = { }; \r\n\r\n'; for(var key in data.templates) { ;template+='\r\ntemplates[\''+( key )+'\'] = '+( data.templates[key] )+';\r\n'; } ;template+='\r\nreturn templates;\r\n});\r\n';
return template;
};

templates['cjs'] = function (data) { 
var template, htmlEncode=function (value) { 
 return ("" + value).replace(/&/g, "&amp;").replace(/</g, "lt;").replace(/>/g, "&gt;");
}
template='\r\nvar templates = { }; \r\n'; if( data.dependency.length ) { ;template+=' \r\nvar '+( data.dependency.map(function(d, i){ return  d.alias + ' = ' + d.cjs }) )+'; \r\n'; } ;template+='\r\n'; for(var key in data.templates) { ;template+='\r\ntemplates[\''+( key )+'\'] = '+( data.templates[key] )+';\r\n'; } ;template+='\r\n\r\nmodule.exports = templates;\r\n';
return template;
};

templates['umd'] = function (data) { 
var template, htmlEncode=function (value) { 
 return ("" + value).replace(/&/g, "&amp;").replace(/</g, "lt;").replace(/>/g, "&gt;");
}
template='(function(root, factory) {\r\n    if(typeof exports === \'object\') {\r\n        module.exports = factory('+( _.pluck(data.dependency, 'cjs') )+');\r\n    }\r\n    else if(typeof define === \'function\' && define.amd) {\r\n        define('+( data.amdname ? "'" + data.amdname +"', " : '')+' '+( data.dependency.length ? "[" + _.pluck(data.dependency, 'amd') +"], " : '')+' factory);\r\n    }\r\n    else {\r\n        root[\''+( data.global )+'\'] = factory('+( _.pluck(data.dependency, 'alias') )+');\r\n    }\r\n}(this, function('+( _.pluck(data.dependency, 'alias') )+') {\r\n\r\nvar templates = { }; \r\n'; for(var key in data.templates) { ;template+='\r\n\r\ntemplates[\''+( key )+'\'] = '+( data.templates[key] )+';\r\n'; } ;template+='\r\nreturn templates;\r\n}));\r\n';
return template;
};


module.exports = templates;
