const Markdown=require('markdown-it')();
const JSDOM=require('jsdom').JSDOM;

//Tools for calling imagemagick convert
const util = require('util');
const spawn = require('child_process').spawn;

//MathJAX init
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

function svg2gif(svgData){
  return new Promise((resolve,reject)=>{
    let convert=spawn('convert',['-background','none','-','GIF:-']);
    let errorMsg='', result=Buffer.alloc(0,0,'binary');
    convert.stderr.on('data', function(data){
      errorMsg+=data;
    });
    convert.stdout.setEncoding('binary');
    convert.stdout.on('data',(data)=>{
      result=Buffer.concat([result,Buffer.from(data,'binary')]);
    });
    convert.on('exit',(code)=>{
      if(code){
        reject(errorMsg);
        return;
      }
      resolve(result);
    });
    convert.stdin.write(svgData);
    convert.stdin.end();
  });
}
function processHTML(content,params={}){
  //Replace equations with corresponding images
  var dom=new JSDOM(content);
  var document=dom.window.document;
  var containers=document.querySelectorAll('mjx-container');

  let svgList=[];
  for(let item of containers){
    //Get svg data
    let svg=item.querySelector('svg');
    let width=parseFloat(svg.getAttribute('width'));
    let height=parseFloat(svg.getAttribute('height'));
    let scale=params.scale || 16;
    svg.setAttribute('width',`${width*scale}px`);
    svg.setAttribute('height',`${height*scale}px`);
    let svgContent='<?xml version="1.0" encoding="UTF-8" standalone="no"?>\n'+item.innerHTML;
    
    //Replace svg with image tag
    let img=document.createElement('img');
    let imgPath=`${params.imagePrefix||''}equation${svgList.length}.gif`;
    img.setAttribute('src',imgPath);
    item.parentNode.replaceChild(img,item);

    //Prepare data for conversion
    svgList.push({
      path:imgPath,
      data:svgContent
    });
  }

  return Promise.all(svgList.map(data=>svg2gif(data.data))).then((resp)=>{
    let len=resp.length, imgList=[];
    for(let i=0; i<len; i++){
      imgList.push({
        ...svgList[i],
        data:resp[i]
      });
    }
    return imgList;
  }).then((imgList)=>{
    return {
      html:document.body.innerHTML,
      image:imgList
    };
  });
}
module.exports=async function(content,params={}){
  var contentHTML=Markdown.render(content);
  var html = mathjax.document(contentHTML, {InputJax: tex, OutputJax: svg});
  html.render();
  return processHTML(adaptor.outerHTML(adaptor.root(html.document)),{
    ...params
  });
}

