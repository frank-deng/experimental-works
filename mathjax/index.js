const fs=require('fs');

const mathjax = require('mathjax-full/js/mathjax.js').mathjax;
const TeX = require('mathjax-full/js/input/tex.js').TeX;
const SVG = require('mathjax-full/js/output/svg.js').SVG;
const liteAdaptor = require('mathjax-full/js/adaptors/liteAdaptor.js').liteAdaptor;
const RegisterHTMLHandler = require('mathjax-full/js/handlers/html.js').RegisterHTMLHandler;

const adaptor = liteAdaptor({
  fontSize:16
});
RegisterHTMLHandler(adaptor);

const tex = new TeX({packages:require('mathjax-full/js/input/tex/AllPackages.js').AllPackages});
const svg = new SVG({fontCache:'none', internalSpeechTitles:false});

var content=fs.readFileSync('test.md','UTF-8');
var contentHTML=require( "markdown" ).markdown.toHTML(content);
const html = mathjax.document(contentHTML, {InputJax: tex, OutputJax: svg});

html.render();
let result=adaptor.outerHTML(adaptor.root(html.document));
fs.writeFileSync('test.html', result);

const JSDOM=require('jsdom').JSDOM;
var dom=new JSDOM(result);
var document=dom.window.document;
var containers=document.querySelectorAll('mjx-container');
let idx=1;
for(let item of containers){
  let svg=item.querySelector('svg');
  let width=parseFloat(svg.getAttribute('width'));
  let height=parseFloat(svg.getAttribute('height'));
  width*=10; height*=10;
  svg.setAttribute('width',`${width}px`);
  svg.setAttribute('height',`${height}px`);
  fs.writeFileSync(`${idx}.svg`, '<?xml version="1.0" encoding="UTF-8" standalone="no"?>\n'+item.innerHTML);
  idx++;
}

//convert -background none input.svg output.gif




