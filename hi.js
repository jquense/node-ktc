(function(root, factory) {
    if(typeof exports === 'object') {
        module.exports = factory(require('lodash'),require('jquery'));
    }
    else if(typeof define === 'function' && define.amd) {
        define( ['lodash','jquery'],  factory);
    }
    else {
        root['undefined'] = factory(_,$);
    }
}(this, function(_,$) {

var templates = { }; 


templates['template'] = function (data) { 
var template, htmlEncode=function (value) { 
 return ("" + value).replace(/&/g, "&amp;").replace(/</g, "lt;").replace(/>/g, "&gt;");
}
template='<div>\r\n\t'+htmlEncode( arg1 )+'\r\n</div>';
return template;
};

return templates;
}));
