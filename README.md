# Precompiler for Kendo UI Core Templates

`ktc` is a simple command line tool for precompiling [Kendo UI style templates](https://github.com/telerik/kendo-ui-core). the tool simply outputs a 
javascript file that contains the compiled templates. at which point they simply need to be included and called from you client code

One upside of this method is that you don't have to use the templates for just html, but any sort of templating
 you wish, case in point internally KTC uses templates it compiled to generate new templates :P
### Install

Requires Node.js to be installed on the your system

	npm install ktc

### Usage

<pre>
Usage: ktc ...

Options:
  -c, --cjs			Create an CommonJS module								[boolean]
  -a, --amd			Create an AMD module									[boolean]
  -i, --input		A glob pattern that matches input files					[string]
  -o, --output		A file name to output the compiled templates			[string]
  -n, --amdname     Specify an AMD module ID								[string]
  -g, --global      Specify a global namespace to attach templates too		[string]
  -m, --minify		Minify the output template code							[boolean]
  -d, --dependency  Specify template dependencies							[string]
  -w, --usewith		Templates should be compiled using with() blocks		[boolean]
</pre>

by default `ktc` will output a UMD wrapped file with no specified dependencies. In a traditional web
environment where there is an implicit relience on Globals, the default should be sufficent.

If you with to either explicitly state global dependencies or are working inside an AMD or CommonJS/Node 
environment, you will need to explicilty declare any dependencies.

#### Dependencies

Simply include any and all deps by module name

	ktc -i ./**/*.kendo -o ./templates.js -d lodash -d bluebird

in some cases you will probably need to alias your deps in order to get the output you wish. 
For example lodash is generally exposed as `_` but required like `require('lodash')`. In order 
to handle this you can pass `:` deliminated strings as dependencies.

	ktc -i ./**/*.kendo -o ./templates.js -d lodash:_ -d kendo-core:kendo -d jquery:$

the general format is `'commonjs:amd:exposedAs'` or `'cjsAndAmd:exposedAs` notice that the `exposedas` string 
should always match the object sitting on the `window` object (if applicable)

All of this will wrap your compiled templates inside a umd structure like this, for use in any environment

	(function(root, factory) {
		if(typeof exports === 'object') {
			module.exports = factory(require('lodash'), require('kendo-core'), require('jquery'));
		}
		else if(typeof define === 'function' && define.amd) {
			define(['lodash','kendo-core','jquery'],  factory);
		}
		else {
			root['superCool'] = factory( _, kendo, $);
		}
	}(this, function( _, kendo, $) {
		//compiled templates here!
	})

if you only need one type you make use of the `--cjs` and `--amd` flags
