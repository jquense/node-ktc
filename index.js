'use strict';

var _ = require('lodash')
  , compile = require('./lib/compile')
  , templates = require('./lib/templates')
  , uglify = require('uglify-js')
  , fs = require('fs')
  , path = require('path')

var defaults = {
    namespace: 'templates',
    minify: false,
    usewith: false,
    deps: {}
}

function processTemplate(file, useWith){
    var name = path.basename(file, path.extname(file))
      , data = fs.readFileSync(file, 'utf8');

    //remove BOM
    if (data.indexOf('\uFEFF') === 0) 
        data = data.substring(1);

    return data && 'templates[\'' + name + '\'] = ' + compile(data, { useWithBlock: useWith }); + '; \n\n'
}

module.exports = function(files, options){
    var output = ''
      , tmpls = {};

    _.defaults(options, defaults);

    _.reduce(files, function(obj, file){
        var name = path.basename(file, path.extname(file))
          , data = fs.readFileSync(file, 'utf8');

        if (data.indexOf('\uFEFF') === 0) data = data.substring(1);

        obj[name] = compile(data, { useWithBlock: options.usewith }); 

        return obj
    }, tmpls);

    options.dependency = splitDeps(options.dependency)

    if ( options.cjs)
        output = templates.cjs(_.extend({ templates: tmpls }, options))
    else if ( options.amd )
        output = templates.amd(_.extend({ templates: tmpls }, options))
    else 
        output = templates.umd(_.extend({ templates: tmpls }, options))


    if ( options.minify )
        output = uglify.minify(output, { fromString: true }).code

    return output
}

function splitDeps(deps){

    return _.compact([].concat(deps))
        .map(function(dep){
            var parts = dep.split(':');
        
            if ( parts.length >= 3)       return { cjs: "require('" + parts[0] + "')", amd: "'" + parts[1] + "'", alias: parts[2] }    
            else if ( parts.length === 2) return { cjs: "require('" + parts[0] + "')", amd: "'" + parts[0] + "'", alias: parts[1] }   
            else if ( parts.length === 1) return { cjs: "require('" + parts[0] + "')", amd: "'" + parts[0] + "'", alias: parts[0] }   
        })
}