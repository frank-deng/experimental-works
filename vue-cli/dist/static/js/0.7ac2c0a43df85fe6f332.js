webpackJsonp([0],{"+4+D":function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var i=n("d7EF"),r=n.n(i),a=n("//Fk"),o=n.n(a),s=n("g5qz"),c=function(t,e,n,i){if(e<0||n<0||e>=t.width||n>=t.height)return!1;var r=t.data[n*t.width+e];return r+=i,t.data[n*t.width+e]=r,!0};var l={props:{image:null,layout:{default:"fit"},dither:{default:"floyd-steinberg"}},data:function(){return{result:null,preview:!1}},watch:{image:{immediate:!0,handler:function(t){var e=this;t instanceof File?this.$nextTick(function(){e.processImage()}):console.error("Invalid type of image object.")}},layout:function(){var t=this;this.$nextTick(function(){t.processImage()})},dither:function(){var t=this;this.$nextTick(function(){t.processImage()})}},methods:{processImage:function(){var t=this;return new o.a(function(e,n){var i=new FileReader,r=new Image;i.addEventListener("load",function(t){r.src=t.target.result}),r.addEventListener("load",function(){e(r)}),r.addEventListener("error",function(){n("图片加载失败")}),i.readAsDataURL(t.image)}).then(function(e){var n=t.$refs.targetImage.width,i=t.$refs.targetImage.height,a=void 0,o=void 0;switch(t.layout){case"fit":var l=Object(s.b)(n,i,2*e.width,e.height),u=r()(l,2);a=u[0],o=u[1];break;case"fill":var f=Object(s.a)(n,i,2*e.width,e.height),d=r()(f,2);a=d[0],o=d[1];break;case"stretch":a=n,o=i;break;case"center":case"tile":a=e.width,o=e.height}var h=(t.$refs.targetImage.width-a)/2,v=(t.$refs.targetImage.height-o)/2,m=t.$refs.targetImage.getContext("2d");if(m.fillStyle="#000000",m.fillRect(0,0,n,i),"tile"==t.layout)for(var p=t.$refs.targetImage.getContext("2d"),g=0;g<=i;g+=o)for(var w=0;w<=n;w+=a)p.drawImage(e,0,0,e.width,e.height,w,g,a,o);else m.drawImage(e,0,0,e.width,e.height,h,v,a,o);var b=m.getImageData(0,0,n,i);t.result=function(t,e){for(var n={width:t.width,height:t.height,data:new Array(t.width*t.height)},i=0;i<t.height;i++)for(var r=0;r<t.width;r++){var a=4*(i*t.width+r),o=t.data[a],s=t.data[a+1],l=t.data[a+2],u=Math.floor(.2125*o+.7154*s+.0721*l);n.data[i*t.width+r]=u}if("none"==e)for(var f=0;f<t.height;f++)for(var d=0;d<t.width;d++){var h=n.data[f*t.width+d];n.data[f*t.width+d]=h<128?0:255}else if("ordered"==e)for(var v=[[0,48,12,60,3,51,15,63],[32,16,44,28,35,19,47,31],[8,56,4,52,11,59,7,55],[40,24,36,20,43,27,39,23],[2,50,14,62,1,49,13,61],[34,18,46,30,33,17,45,29],[10,58,6,54,9,57,5,53],[42,26,38,22,41,25,37,21]],m=0;m<t.height;m++)for(var p=0;p<t.width;p++){var g=Math.floor(64*n.data[m*t.width+p]/255),w=7&p,b=7&m;n.data[m*t.width+p]=g<=v[b][w]?0:255}else if("min-avg-error"==e)for(var y=0;y<t.height;y++)for(var _=0;_<t.width;_++){var x=n.data[y*t.width+_],k=x<128?0:255;n.data[y*t.width+_]=k;var I=x-k;c(n,_+1,y,7*I/48),c(n,_+2,y,5*I/48),c(n,_-2,y+1,3*I/48),c(n,_-1,y+1,5*I/48),c(n,_,y+1,7*I/48),c(n,_+1,y+1,5*I/48),c(n,_+2,y+1,3*I/48),c(n,_-2,y+2,1*I/48),c(n,_-1,y+2,3*I/48),c(n,_,y+2,5*I/48),c(n,_+1,y+2,3*I/48),c(n,_+2,y+2,1*I/48)}else for(var P=0;P<t.height;P++)for(var R=0;R<t.width;R++){var j=n.data[P*t.width+R],L=j<128?0:255;n.data[P*t.width+R]=L;var E=j-L;c(n,R+1,P,7*E/16),c(n,R-1,P+1,3*E/16),c(n,R,P+1,5*E/16),c(n,R+1,P+1,1*E/16)}for(var M=t.width/8,O=new Uint8Array(M*t.height),S=0;S<t.height;S++)for(var $=0;$<t.width;$++)n.data[S*t.width+$]&&(O[S*M+($>>3)]|=1<<7-(7&$));return n.data=O,n}(b,t.dither),function(t,e){for(var n=e.width/8,i=0;i<e.height;i++)for(var r=0;r<e.width;r++){var a=i*n+(r>>3),o=e.data[a]&1<<7-(7&r),s=4*(i*e.width+r);t.data[s]=t.data[s+1]=t.data[s+2]=o?255:0}}(b,t.result),m.putImageData(b,0,0),t.$emit("change",t.result)})},doPreview:function(){var t=this;this.result&&(this.preview=!0,this.$nextTick(function(){var e=t.$refs.targetImagePreview.width,n=t.$refs.targetImagePreview.height,i=t.$refs.targetImagePreview.getContext("2d");i.fillStyle="#000000",i.fillRect(0,0,e,n);var r=i.getImageData(0,0,e,n);!function(t,e){for(var n=e.width/8,i=0;i<e.height;i++)for(var r=0;r<e.width;r++){var a=i*n+(r>>3),o=e.data[a]&1<<7-(7&r),s=4*(2*i*e.width+r);t.data[s]=t.data[s+1]=t.data[s+2]=o?255:0,s=4*((2*i+1)*e.width+r),t.data[s]=t.data[s+1]=t.data[s+2]=o?255:0}}(r,t.result),i.putImageData(r,0,0)}))}}},u={render:function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",[n("canvas",{ref:"targetImage",staticClass:"targetImage",attrs:{width:"640",height:"200"},on:{click:t.doPreview}}),t._v(" "),t.preview?n("el-dialog",{attrs:{"append-to-body":!0,width:"680px",top:"20px",visible:t.preview},on:{"update:visible":function(e){t.preview=e}}},[n("canvas",{ref:"targetImagePreview",staticClass:"targetImagePreview",attrs:{width:"640",height:"400"},on:{click:t.doPreview}})]):t._e()],1)},staticRenderFns:[]};var f=n("VU/8")(l,u,!1,function(t){n("m2HB")},"data-v-625971d4",null);e.default=f.exports},"//Fk":function(t,e,n){t.exports={default:n("U5ju"),__esModule:!0}},"2+tA":function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var i={render:function(){var t=this.$createElement,e=this._self._c||t;return e("div",{staticClass:"addFile"},[e("el-button",{attrs:{size:"small",type:"primary",icon:"el-icon-plus"},on:{click:this.pickImage}}),this._v(" "),e("input",{ref:"filePicker",staticClass:"filePicker",attrs:{type:"file",multiple:"multiple"},on:{change:this.handleChange}})],1)},staticRenderFns:[]};var r=n("VU/8")({data:function(){return{}},methods:{pickImage:function(){this.$refs.filePicker.click()},handleChange:function(t){this.$emit("upload",this.$refs.filePicker.files)}}},i,!1,function(t){n("gSw/")},"data-v-fba49ba4",null);e.default=r.exports},"2KxR":function(t,e){t.exports=function(t,e,n,i){if(!(t instanceof e)||void 0!==i&&i in t)throw TypeError(n+": incorrect invocation!");return t}},"5PlU":function(t,e,n){var i=n("RY/4"),r=n("dSzd")("iterator"),a=n("/bQp");t.exports=n("FeBl").isIterable=function(t){var e=Object(t);return void 0!==e[r]||"@@iterator"in e||a.hasOwnProperty(i(e))}},"82Mu":function(t,e,n){var i=n("7KvD"),r=n("L42u").set,a=i.MutationObserver||i.WebKitMutationObserver,o=i.process,s=i.Promise,c="process"==n("R9M2")(o);t.exports=function(){var t,e,n,l=function(){var i,r;for(c&&(i=o.domain)&&i.exit();t;){r=t.fn,t=t.next;try{r()}catch(i){throw t?n():e=void 0,i}}e=void 0,i&&i.enter()};if(c)n=function(){o.nextTick(l)};else if(!a||i.navigator&&i.navigator.standalone)if(s&&s.resolve){var u=s.resolve(void 0);n=function(){u.then(l)}}else n=function(){r.call(i,l)};else{var f=!0,d=document.createTextNode("");new a(l).observe(d,{characterData:!0}),n=function(){d.data=f=!f}}return function(i){var r={fn:i,next:void 0};e&&(e.next=r),t||(t=r,n()),e=r}}},"9ALO":function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var i=n("BO1k"),r=n.n(i);var a=function(t,e,n,i,r){for(var a=0;a<r;a++)t[e+a]=n[i+a]};var o=n("t4zo"),s={components:{addImage:n("2+tA").default,processImage:n("+4+D").default},data:function(){return{imageList:[],layoutSelection:[{label:"适应",value:"fit"},{label:"居中",value:"center"},{label:"拉伸",value:"stretch"},{label:"填充",value:"fill"},{label:"平铺",value:"tile"}],ditherSelection:[{label:"无",value:"none"},{label:"Ordered",value:"ordered"},{label:"Floyd-Steinberg",value:"floyd-steinberg"},{label:"Minimized Average Error",value:"min-avg-error"}]}},methods:{updateFileList:function(t,e){this.fileList=e},newImage:function(t){var e=!0,n=!1,i=void 0;try{for(var a,o=r()(t);!(e=(a=o.next()).done);e=!0){var s=a.value;this.imageList.push({file:s,fileName:s.name,layout:"fit",dither:"floyd-steinberg",image:null})}}catch(t){n=!0,i=t}finally{try{!e&&o.return&&o.return()}finally{if(n)throw i}}},deleteImage:function(t){this.imageList.splice(t,1)},moveUpImage:function(t){if(!(t<=0)){var e=this.imageList[t];this.$set(this.imageList,t,this.imageList[t-1]),this.$set(this.imageList,t-1,e)}},moveDownImage:function(t){if(!(t>=this.imageList.length-1)){var e=this.imageList[t];this.$set(this.imageList,t,this.imageList[t+1]),this.$set(this.imageList,t+1,e)}},writeResult:function(t,e){t.image=e},saveImage:function(t){var e=this.imageList[t].image;e&&Object(o.saveAs)(function(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:void 0,n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:void 0,i=document.createElement("canvas");i.width=t.width,i.height=t.height;var r=i.getContext("2d");r.fillStyle="#000000",r.fillRect(0,0,i.width,i.height);for(var a=r.getImageData(0,0,i.width,i.height),o=t.width,s=t.height,c=t.width/8,l=0;l<s;l++)for(var u=0;u<o;u++){var f=l*c+(u>>3),d=t.data[f]&1<<7-(7&u),h=4*(l*o+u);a.data[h]=a.data[h+1]=a.data[h+2]=d?255:0,a.data[h+3]=255}return r.putImageData(a,0,0),i.toDataURL(e,n)}(e,"image/png"))},saveImageCGA:function(t){var e=this.imageList[t].image;e&&Object(o.saveAs)(function(t){if(640!=t.width||200!=t.height)throw new Error("Invalid image format: 640x200 monochrome image required.");var e=new Uint8Array(16392),n=[253,0,184,0,0,0,64];a(e,0,n,0,n.length);for(var i=0,r=0;r<t.height;r+=2)a(e,7+80*i,t.data,80*r,80),i++;i=0;for(var o=1;o<t.height;o+=2)a(e,8199+80*i,t.data,80*o,80),i++;return e[16391]=26,new Blob([e])}(e),"image.pic")}},mounted:function(){}},c={render:function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"retro-ppt"},[n("addImage",{on:{upload:t.newImage}}),t._v(" "),n("el-table",{attrs:{data:t.imageList}},[n("el-table-column",{attrs:{prop:"fileName",label:"文件名",fixed:"left"}}),t._v(" "),n("el-table-column",{attrs:{prop:"layout",label:"布局方式",width:100},scopedSlots:t._u([{key:"default",fn:function(e){return[n("el-select",{model:{value:e.row.layout,callback:function(n){t.$set(e.row,"layout",n)},expression:"scope.row.layout"}},t._l(t.layoutSelection,function(t){return n("el-option",{key:t.value,attrs:{value:t.value,label:t.label}})}))]}}])}),t._v(" "),n("el-table-column",{attrs:{prop:"dither",label:"抖动方式",width:"100"},scopedSlots:t._u([{key:"default",fn:function(e){return[n("el-select",{model:{value:e.row.dither,callback:function(n){t.$set(e.row,"dither",n)},expression:"scope.row.dither"}},t._l(t.ditherSelection,function(t){return n("el-option",{key:t.value,attrs:{value:t.value,label:t.label}})}))]}}])}),t._v(" "),n("el-table-column",{attrs:{label:"预览",width:"200"},scopedSlots:t._u([{key:"default",fn:function(e){return[n("processImage",{attrs:{image:e.row.file,layout:e.row.layout,dither:e.row.dither},on:{change:function(n){t.writeResult(e.row,n)}}})]}}])}),t._v(" "),n("el-table-column",{attrs:{width:"150",align:"right"},scopedSlots:t._u([{key:"default",fn:function(e){return[n("el-button-group",[n("el-button",{attrs:{size:"small",icon:"el-icon-caret-top",disabled:e.$index<=0},on:{click:function(n){t.moveUpImage(e.$index)}}}),t._v(" "),n("el-button",{attrs:{size:"small",icon:"el-icon-caret-bottom",disabled:e.$index>=t.imageList.length-1},on:{click:function(n){t.moveDownImage(e.$index)}}}),t._v(" "),n("el-button",{attrs:{size:"small",icon:"el-icon-delete"},on:{click:function(n){t.deleteImage(e.$index)}}})],1),t._v(" "),n("el-button-group",[n("el-button",{attrs:{size:"small",icon:"el-icon-download"},on:{click:function(n){t.saveImage(e.$index)}}}),t._v(" "),n("el-button",{attrs:{size:"small",icon:"el-icon-download"},on:{click:function(n){t.saveImageCGA(e.$index)}}},[t._v("CGA")])],1)]}}])})],1)],1)},staticRenderFns:[]};var l=n("VU/8")(s,c,!1,function(t){n("fbGl")},"data-v-83e93b8a",null);e.default=l.exports},CXw9:function(t,e,n){"use strict";var i,r,a,o,s=n("O4g8"),c=n("7KvD"),l=n("+ZMJ"),u=n("RY/4"),f=n("kM2E"),d=n("EqjI"),h=n("lOnJ"),v=n("2KxR"),m=n("NWt+"),p=n("t8x9"),g=n("L42u").set,w=n("82Mu")(),b=n("qARP"),y=n("dNDb"),_=n("iUbK"),x=n("fJUb"),k=c.TypeError,I=c.process,P=I&&I.versions,R=P&&P.v8||"",j=c.Promise,L="process"==u(I),E=function(){},M=r=b.f,O=!!function(){try{var t=j.resolve(1),e=(t.constructor={})[n("dSzd")("species")]=function(t){t(E,E)};return(L||"function"==typeof PromiseRejectionEvent)&&t.then(E)instanceof e&&0!==R.indexOf("6.6")&&-1===_.indexOf("Chrome/66")}catch(t){}}(),S=function(t){var e;return!(!d(t)||"function"!=typeof(e=t.then))&&e},$=function(t,e){if(!t._n){t._n=!0;var n=t._c;w(function(){for(var i=t._v,r=1==t._s,a=0,o=function(e){var n,a,o,s=r?e.ok:e.fail,c=e.resolve,l=e.reject,u=e.domain;try{s?(r||(2==t._h&&D(t),t._h=1),!0===s?n=i:(u&&u.enter(),n=s(i),u&&(u.exit(),o=!0)),n===e.promise?l(k("Promise-chain cycle")):(a=S(n))?a.call(n,c,l):c(n)):l(i)}catch(t){u&&!o&&u.exit(),l(t)}};n.length>a;)o(n[a++]);t._c=[],t._n=!1,e&&!t._h&&A(t)})}},A=function(t){g.call(c,function(){var e,n,i,r=t._v,a=U(t);if(a&&(e=y(function(){L?I.emit("unhandledRejection",r,t):(n=c.onunhandledrejection)?n({promise:t,reason:r}):(i=c.console)&&i.error&&i.error("Unhandled promise rejection",r)}),t._h=L||U(t)?2:1),t._a=void 0,a&&e.e)throw e.v})},U=function(t){return 1!==t._h&&0===(t._a||t._c).length},D=function(t){g.call(c,function(){var e;L?I.emit("rejectionHandled",t):(e=c.onrejectionhandled)&&e({promise:t,reason:t._v})})},C=function(t){var e=this;e._d||(e._d=!0,(e=e._w||e)._v=t,e._s=2,e._a||(e._a=e._c.slice()),$(e,!0))},F=function(t){var e,n=this;if(!n._d){n._d=!0,n=n._w||n;try{if(n===t)throw k("Promise can't be resolved itself");(e=S(t))?w(function(){var i={_w:n,_d:!1};try{e.call(t,l(F,i,1),l(C,i,1))}catch(t){C.call(i,t)}}):(n._v=t,n._s=1,$(n,!1))}catch(t){C.call({_w:n,_d:!1},t)}}};O||(j=function(t){v(this,j,"Promise","_h"),h(t),i.call(this);try{t(l(F,this,1),l(C,this,1))}catch(t){C.call(this,t)}},(i=function(t){this._c=[],this._a=void 0,this._s=0,this._d=!1,this._v=void 0,this._h=0,this._n=!1}).prototype=n("xH/j")(j.prototype,{then:function(t,e){var n=M(p(this,j));return n.ok="function"!=typeof t||t,n.fail="function"==typeof e&&e,n.domain=L?I.domain:void 0,this._c.push(n),this._a&&this._a.push(n),this._s&&$(this,!1),n.promise},catch:function(t){return this.then(void 0,t)}}),a=function(){var t=new i;this.promise=t,this.resolve=l(F,t,1),this.reject=l(C,t,1)},b.f=M=function(t){return t===j||t===o?new a(t):r(t)}),f(f.G+f.W+f.F*!O,{Promise:j}),n("e6n0")(j,"Promise"),n("bRrM")("Promise"),o=n("FeBl").Promise,f(f.S+f.F*!O,"Promise",{reject:function(t){var e=M(this);return(0,e.reject)(t),e.promise}}),f(f.S+f.F*(s||!O),"Promise",{resolve:function(t){return x(s&&this===o?j:this,t)}}),f(f.S+f.F*!(O&&n("dY0y")(function(t){j.all(t).catch(E)})),"Promise",{all:function(t){var e=this,n=M(e),i=n.resolve,r=n.reject,a=y(function(){var n=[],a=0,o=1;m(t,!1,function(t){var s=a++,c=!1;n.push(void 0),o++,e.resolve(t).then(function(t){c||(c=!0,n[s]=t,--o||i(n))},r)}),--o||i(n)});return a.e&&r(a.v),n.promise},race:function(t){var e=this,n=M(e),i=n.reject,r=y(function(){m(t,!1,function(t){e.resolve(t).then(n.resolve,i)})});return r.e&&i(r.v),n.promise}})},EqBC:function(t,e,n){"use strict";var i=n("kM2E"),r=n("FeBl"),a=n("7KvD"),o=n("t8x9"),s=n("fJUb");i(i.P+i.R,"Promise",{finally:function(t){var e=o(this,r.Promise||a.Promise),n="function"==typeof t;return this.then(n?function(n){return s(e,t()).then(function(){return n})}:t,n?function(n){return s(e,t()).then(function(){throw n})}:t)}})},L42u:function(t,e,n){var i,r,a,o=n("+ZMJ"),s=n("knuC"),c=n("RPLV"),l=n("ON07"),u=n("7KvD"),f=u.process,d=u.setImmediate,h=u.clearImmediate,v=u.MessageChannel,m=u.Dispatch,p=0,g={},w=function(){var t=+this;if(g.hasOwnProperty(t)){var e=g[t];delete g[t],e()}},b=function(t){w.call(t.data)};d&&h||(d=function(t){for(var e=[],n=1;arguments.length>n;)e.push(arguments[n++]);return g[++p]=function(){s("function"==typeof t?t:Function(t),e)},i(p),p},h=function(t){delete g[t]},"process"==n("R9M2")(f)?i=function(t){f.nextTick(o(w,t,1))}:m&&m.now?i=function(t){m.now(o(w,t,1))}:v?(a=(r=new v).port2,r.port1.onmessage=b,i=o(a.postMessage,a,1)):u.addEventListener&&"function"==typeof postMessage&&!u.importScripts?(i=function(t){u.postMessage(t+"","*")},u.addEventListener("message",b,!1)):i="onreadystatechange"in l("script")?function(t){c.appendChild(l("script")).onreadystatechange=function(){c.removeChild(this),w.call(t)}}:function(t){setTimeout(o(w,t,1),0)}),t.exports={set:d,clear:h}},Mhyx:function(t,e,n){var i=n("/bQp"),r=n("dSzd")("iterator"),a=Array.prototype;t.exports=function(t){return void 0!==t&&(i.Array===t||a[r]===t)}},"NWt+":function(t,e,n){var i=n("+ZMJ"),r=n("msXi"),a=n("Mhyx"),o=n("77Pl"),s=n("QRG4"),c=n("3fs2"),l={},u={};(e=t.exports=function(t,e,n,f,d){var h,v,m,p,g=d?function(){return t}:c(t),w=i(n,f,e?2:1),b=0;if("function"!=typeof g)throw TypeError(t+" is not iterable!");if(a(g)){for(h=s(t.length);h>b;b++)if((p=e?w(o(v=t[b])[0],v[1]):w(t[b]))===l||p===u)return p}else for(m=g.call(t);!(v=m.next()).done;)if((p=r(m,w,v.value,e))===l||p===u)return p}).BREAK=l,e.RETURN=u},U5ju:function(t,e,n){n("M6a0"),n("zQR9"),n("+tPU"),n("CXw9"),n("EqBC"),n("jKW+"),t.exports=n("FeBl").Promise},Xd32:function(t,e,n){n("+tPU"),n("zQR9"),t.exports=n("5PlU")},bRrM:function(t,e,n){"use strict";var i=n("7KvD"),r=n("FeBl"),a=n("evD5"),o=n("+E39"),s=n("dSzd")("species");t.exports=function(t){var e="function"==typeof r[t]?r[t]:i[t];o&&e&&!e[s]&&a.f(e,s,{configurable:!0,get:function(){return this}})}},d7EF:function(t,e,n){"use strict";e.__esModule=!0;var i=a(n("us/S")),r=a(n("BO1k"));function a(t){return t&&t.__esModule?t:{default:t}}e.default=function(){return function(t,e){if(Array.isArray(t))return t;if((0,i.default)(Object(t)))return function(t,e){var n=[],i=!0,a=!1,o=void 0;try{for(var s,c=(0,r.default)(t);!(i=(s=c.next()).done)&&(n.push(s.value),!e||n.length!==e);i=!0);}catch(t){a=!0,o=t}finally{try{!i&&c.return&&c.return()}finally{if(a)throw o}}return n}(t,e);throw new TypeError("Invalid attempt to destructure non-iterable instance")}}()},dNDb:function(t,e){t.exports=function(t){try{return{e:!1,v:t()}}catch(t){return{e:!0,v:t}}}},dY0y:function(t,e,n){var i=n("dSzd")("iterator"),r=!1;try{var a=[7][i]();a.return=function(){r=!0},Array.from(a,function(){throw 2})}catch(t){}t.exports=function(t,e){if(!e&&!r)return!1;var n=!1;try{var a=[7],o=a[i]();o.next=function(){return{done:n=!0}},a[i]=function(){return o},t(a)}catch(t){}return n}},fJUb:function(t,e,n){var i=n("77Pl"),r=n("EqjI"),a=n("qARP");t.exports=function(t,e){if(i(t),r(e)&&e.constructor===t)return e;var n=a.f(t);return(0,n.resolve)(e),n.promise}},fbGl:function(t,e){},g5qz:function(t,e,n){"use strict";e.b=function(t,e,n,i){var r=n/i>t/e?n/t:i/e;return[n/r,i/r]},e.a=function(t,e,n,i){var r=n/i>t/e?i/e:n/t;return[n/r,i/r]}},"gSw/":function(t,e){},iUbK:function(t,e,n){var i=n("7KvD").navigator;t.exports=i&&i.userAgent||""},"jKW+":function(t,e,n){"use strict";var i=n("kM2E"),r=n("qARP"),a=n("dNDb");i(i.S,"Promise",{try:function(t){var e=r.f(this),n=a(t);return(n.e?e.reject:e.resolve)(n.v),e.promise}})},knuC:function(t,e){t.exports=function(t,e,n){var i=void 0===n;switch(e.length){case 0:return i?t():t.call(n);case 1:return i?t(e[0]):t.call(n,e[0]);case 2:return i?t(e[0],e[1]):t.call(n,e[0],e[1]);case 3:return i?t(e[0],e[1],e[2]):t.call(n,e[0],e[1],e[2]);case 4:return i?t(e[0],e[1],e[2],e[3]):t.call(n,e[0],e[1],e[2],e[3])}return t.apply(n,e)}},m2HB:function(t,e){},msXi:function(t,e,n){var i=n("77Pl");t.exports=function(t,e,n,r){try{return r?e(i(n)[0],n[1]):e(n)}catch(e){var a=t.return;throw void 0!==a&&i(a.call(t)),e}}},qARP:function(t,e,n){"use strict";var i=n("lOnJ");t.exports.f=function(t){return new function(t){var e,n;this.promise=new t(function(t,i){if(void 0!==e||void 0!==n)throw TypeError("Bad Promise constructor");e=t,n=i}),this.resolve=i(e),this.reject=i(n)}(t)}},t4zo:function(t,e,n){(function(n){var i,r,a;r=[],void 0===(a="function"==typeof(i=function(){"use strict";function e(t,e,n){var i=new XMLHttpRequest;i.open("GET",t),i.responseType="blob",i.onload=function(){o(i.response,e,n)},i.onerror=function(){console.error("could not download file")},i.send()}function i(t){var e=new XMLHttpRequest;return e.open("HEAD",t,!1),e.send(),200<=e.status&&299>=e.status}function r(t){try{t.dispatchEvent(new MouseEvent("click"))}catch(n){var e=document.createEvent("MouseEvents");e.initMouseEvent("click",!0,!0,window,0,0,0,80,20,!1,!1,!1,!1,0,null),t.dispatchEvent(e)}}var a="object"==typeof window&&window.window===window?window:"object"==typeof self&&self.self===self?self:"object"==typeof n&&n.global===n?n:void 0,o=a.saveAs||("object"!=typeof window||window!==a?function(){}:"download"in HTMLAnchorElement.prototype?function(t,n,o){var s=a.URL||a.webkitURL,c=document.createElement("a");n=n||t.name||"download",c.download=n,c.rel="noopener","string"==typeof t?(c.href=t,c.origin===location.origin?r(c):i(c.href)?e(t,n,o):r(c,c.target="_blank")):(c.href=s.createObjectURL(t),setTimeout(function(){s.revokeObjectURL(c.href)},4e4),setTimeout(function(){r(c)},0))}:"msSaveOrOpenBlob"in navigator?function(t,n,a){if(n=n||t.name||"download","string"!=typeof t)navigator.msSaveOrOpenBlob(function(t,e){return void 0===e?e={autoBom:!1}:"object"!=typeof e&&(console.warn("Deprecated: Expected third argument to be a object"),e={autoBom:!e}),e.autoBom&&/^\s*(?:text\/\S*|application\/xml|\S*\/\S*\+xml)\s*;.*charset\s*=\s*utf-8/i.test(t.type)?new Blob(["\ufeff",t],{type:t.type}):t}(t,a),n);else if(i(t))e(t,n,a);else{var o=document.createElement("a");o.href=t,o.target="_blank",setTimeout(function(){r(o)})}}:function(t,n,i,r){if((r=r||open("","_blank"))&&(r.document.title=r.document.body.innerText="downloading..."),"string"==typeof t)return e(t,n,i);var o="application/octet-stream"===t.type,s=/constructor/i.test(a.HTMLElement)||a.safari,c=/CriOS\/[\d]+/.test(navigator.userAgent);if((c||o&&s)&&"object"==typeof FileReader){var l=new FileReader;l.onloadend=function(){var t=l.result;t=c?t:t.replace(/^data:[^;]*;/,"data:attachment/file;"),r?r.location.href=t:location=t,r=null},l.readAsDataURL(t)}else{var u=a.URL||a.webkitURL,f=u.createObjectURL(t);r?r.location=f:location.href=f,r=null,setTimeout(function(){u.revokeObjectURL(f)},4e4)}});a.saveAs=o.saveAs=o,void 0!==t&&(t.exports=o)})?i.apply(e,r):i)||(t.exports=a)}).call(e,n("DuR2"))},t8x9:function(t,e,n){var i=n("77Pl"),r=n("lOnJ"),a=n("dSzd")("species");t.exports=function(t,e){var n,o=i(t).constructor;return void 0===o||void 0==(n=i(o)[a])?e:r(n)}},"us/S":function(t,e,n){t.exports={default:n("Xd32"),__esModule:!0}},"xH/j":function(t,e,n){var i=n("hJx8");t.exports=function(t,e,n){for(var r in e)n&&t[r]?t[r]=e[r]:i(t,r,e[r]);return t}}});