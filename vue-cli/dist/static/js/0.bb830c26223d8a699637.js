webpackJsonp([0],{"+4+D":function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var r=n("d7EF"),i=n.n(r),o=n("//Fk"),a=n.n(o),s={props:{image:null,layout:{default:"fit"},dither:{default:"floyd-steinberg"}},data:function(){return{}},watch:{image:{immediate:!0,handler:function(t){var e=this;t instanceof File?this.$nextTick(function(){e.processImage()}):console.error("Invalid type of image object.")}},layout:function(){var t=this;this.$nextTick(function(){t.processImage()})},dither:function(){var t=this;this.$nextTick(function(){t.processImage()})}},methods:{processImage:function(){var t=this;return new a.a(function(e,n){var r=new FileReader,i=new Image;r.addEventListener("load",function(t){i.src=t.target.result}),i.addEventListener("load",function(){e(i)}),i.addEventListener("error",function(){n("图片加载失败")}),r.readAsDataURL(t.image)}).then(function(e){var n,r,o,a,s,c=t.$refs.targetImage.width,u=t.$refs.targetImage.height,l=void 0,f=void 0;switch(t.layout){case"fit":var d=(n=c,r=u,o=2*e.width,a=e.height,[o/(s=o/a>n/r?o/n:a/r),a/s]),h=i()(d,2);l=h[0],f=h[1];break;case"fill":var v=function(t,e,n,r){var i=n/r>t/e?r/e:n/t;return[n/i,r/i]}(c,u,2*e.width,e.height),p=i()(v,2);l=p[0],f=p[1];break;case"stretch":l=c,f=u;break;case"center":case"tile":l=e.width,f=e.height}var m=(t.$refs.targetImage.width-l)/2,g=(t.$refs.targetImage.height-f)/2,y=t.$refs.targetImage.getContext("2d");if(y.fillStyle="#000000",y.fillRect(0,0,c,u),"tile"==t.layout)for(var w=t.$refs.targetImage.getContext("2d"),_=0;_<=u;_+=f)for(var b=0;b<=c;b+=l)w.drawImage(e,0,0,e.width,e.height,b,_,l,f);else y.drawImage(e,0,0,e.width,e.height,m,g,l,f);var x=y.getImageData(0,0,c,u);!function(t,e){for(var n=0;n<e.height;n++)for(var r=0;r<e.width;r++){var i=4*(n*e.width+r);t.data[i]=t.data[i+1]=t.data[i+2]=e.data[n*e.width+r]}}(x,function(t,e){for(var n={width:t.width,height:t.height,data:new Array(t.width*t.height)},r=0;r<t.height;r++)for(var i=0;i<t.width;i++){var o=4*(r*t.width+i),a=t.data[o],s=t.data[o+1],c=t.data[o+2],u=Math.floor(.2125*a+.7154*s+.0721*c);n.data[r*t.width+i]=u}if("none"==e)for(var l=0;l<t.height;l++)for(var f=0;f<t.width;f++){var d=n.data[l*t.width+f];n.data[l*t.width+f]=d<128?0:255}else if("ordered"==e)for(var h=[[0,48,12,60,3,51,15,63],[32,16,44,28,35,19,47,31],[8,56,4,52,11,59,7,55],[40,24,36,20,43,27,39,23],[2,50,14,62,1,49,13,61],[34,18,46,30,33,17,45,29],[10,58,6,54,9,57,5,53],[42,26,38,22,41,25,37,21]],v=0;v<t.height;v++)for(var p=0;p<t.width;p++){var m=Math.floor(64*n.data[v*t.width+p]/255),g=7&p,y=7&v;n.data[v*t.width+p]=m<=h[y][g]?0:255}return n}(x,t.dither)),y.putImageData(x,0,0)})}}},c={render:function(){var t=this.$createElement,e=this._self._c||t;return e("div",[e("canvas",{ref:"targetImage",staticClass:"targetImage",attrs:{width:"640",height:"200"}})])},staticRenderFns:[]};var u=n("VU/8")(s,c,!1,function(t){n("RbGP")},"data-v-93f216be",null);e.default=u.exports},"//Fk":function(t,e,n){t.exports={default:n("U5ju"),__esModule:!0}},"2+tA":function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var r={render:function(){var t=this.$createElement,e=this._self._c||t;return e("div",{staticClass:"addFile"},[e("el-button",{attrs:{size:"small",type:"primary",icon:"el-icon-plus"},on:{click:this.pickImage}}),this._v(" "),e("input",{ref:"filePicker",staticClass:"filePicker",attrs:{type:"file",multiple:"multiple"},on:{change:this.handleChange}})],1)},staticRenderFns:[]};var i=n("VU/8")({data:function(){return{}},methods:{pickImage:function(){this.$refs.filePicker.click()},handleChange:function(t){this.$emit("upload",this.$refs.filePicker.files)}}},r,!1,function(t){n("gSw/")},"data-v-fba49ba4",null);e.default=i.exports},"2KxR":function(t,e){t.exports=function(t,e,n,r){if(!(t instanceof e)||void 0!==r&&r in t)throw TypeError(n+": incorrect invocation!");return t}},"5PlU":function(t,e,n){var r=n("RY/4"),i=n("dSzd")("iterator"),o=n("/bQp");t.exports=n("FeBl").isIterable=function(t){var e=Object(t);return void 0!==e[i]||"@@iterator"in e||o.hasOwnProperty(r(e))}},"82Mu":function(t,e,n){var r=n("7KvD"),i=n("L42u").set,o=r.MutationObserver||r.WebKitMutationObserver,a=r.process,s=r.Promise,c="process"==n("R9M2")(a);t.exports=function(){var t,e,n,u=function(){var r,i;for(c&&(r=a.domain)&&r.exit();t;){i=t.fn,t=t.next;try{i()}catch(r){throw t?n():e=void 0,r}}e=void 0,r&&r.enter()};if(c)n=function(){a.nextTick(u)};else if(!o||r.navigator&&r.navigator.standalone)if(s&&s.resolve){var l=s.resolve(void 0);n=function(){l.then(u)}}else n=function(){i.call(r,u)};else{var f=!0,d=document.createTextNode("");new o(u).observe(d,{characterData:!0}),n=function(){d.data=f=!f}}return function(r){var i={fn:r,next:void 0};e&&(e.next=i),t||(t=i,n()),e=i}}},"9ALO":function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var r=n("BO1k"),i=n.n(r),o={components:{addImage:n("2+tA").default,processImage:n("+4+D").default},data:function(){return{imageList:[],layoutSelection:[{label:"适应",value:"fit"},{label:"居中",value:"center"},{label:"拉伸",value:"stretch"},{label:"填充",value:"fill"},{label:"平铺",value:"tile"}],ditherSelection:[{label:"无",value:"none"},{label:"Ordered",value:"ordered"},{label:"Floyd-Steinberg",value:"floyd-steinberg"},{label:"Floyd-Steinberg 2",value:"floyd-steinberg2"}]}},methods:{updateFileList:function(t,e){this.fileList=e},newImage:function(t){var e=!0,n=!1,r=void 0;try{for(var o,a=i()(t);!(e=(o=a.next()).done);e=!0){var s=o.value;this.imageList.push({file:s,fileName:s.name,layout:"fit",dither:"floyd-steinberg"})}}catch(t){n=!0,r=t}finally{try{!e&&a.return&&a.return()}finally{if(n)throw r}}},deleteImage:function(t){this.imageList.splice(t,1)},moveUpImage:function(t){if(!(t<=0)){var e=this.imageList[t];this.$set(this.imageList,t,this.imageList[t-1]),this.$set(this.imageList,t-1,e)}},moveDownImage:function(t){if(!(t>=this.imageList.length-1)){var e=this.imageList[t];this.$set(this.imageList,t,this.imageList[t+1]),this.$set(this.imageList,t+1,e)}}},mounted:function(){}},a={render:function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"retro-ppt"},[n("addImage",{on:{upload:t.newImage}}),t._v(" "),n("el-table",{attrs:{data:t.imageList}},[n("el-table-column",{attrs:{prop:"fileName",label:"文件名"}}),t._v(" "),n("el-table-column",{attrs:{prop:"layout",label:"布局方式",width:160},scopedSlots:t._u([{key:"default",fn:function(e){return[n("el-select",{model:{value:e.row.layout,callback:function(n){t.$set(e.row,"layout",n)},expression:"scope.row.layout"}},t._l(t.layoutSelection,function(t){return n("el-option",{key:t.value,attrs:{value:t.value,label:t.label}})}))]}}])}),t._v(" "),n("el-table-column",{attrs:{prop:"dither",label:"抖动方式",width:200},scopedSlots:t._u([{key:"default",fn:function(e){return[n("el-select",{model:{value:e.row.dither,callback:function(n){t.$set(e.row,"dither",n)},expression:"scope.row.dither"}},t._l(t.ditherSelection,function(t){return n("el-option",{key:t.value,attrs:{value:t.value,label:t.label}})}))]}}])}),t._v(" "),n("el-table-column",{attrs:{label:"预览",width:200},scopedSlots:t._u([{key:"default",fn:function(t){return[n("processImage",{attrs:{image:t.row.file,layout:t.row.layout,dither:t.row.dither}})]}}])}),t._v(" "),n("el-table-column",{attrs:{fixed:"right",width:"160",align:"right"},scopedSlots:t._u([{key:"default",fn:function(e){return[n("el-button-group",[n("el-button",{attrs:{size:"small",icon:"el-icon-arrow-up",disabled:e.$index<=0},on:{click:function(n){t.moveUpImage(e.$index)}}}),t._v(" "),n("el-button",{attrs:{size:"small",icon:"el-icon-arrow-down",disabled:e.$index>=t.imageList.length-1},on:{click:function(n){t.moveDownImage(e.$index)}}}),t._v(" "),n("el-button",{attrs:{size:"small",icon:"el-icon-delete"},on:{click:function(n){t.deleteImage(e.$index)}}})],1)]}}])})],1)],1)},staticRenderFns:[]};var s=n("VU/8")(o,a,!1,function(t){n("vFKe")},"data-v-38441674",null);e.default=s.exports},CXw9:function(t,e,n){"use strict";var r,i,o,a,s=n("O4g8"),c=n("7KvD"),u=n("+ZMJ"),l=n("RY/4"),f=n("kM2E"),d=n("EqjI"),h=n("lOnJ"),v=n("2KxR"),p=n("NWt+"),m=n("t8x9"),g=n("L42u").set,y=n("82Mu")(),w=n("qARP"),_=n("dNDb"),b=n("iUbK"),x=n("fJUb"),P=c.TypeError,k=c.process,I=k&&k.versions,M=I&&I.v8||"",R=c.Promise,j="process"==l(k),L=function(){},E=i=w.f,S=!!function(){try{var t=R.resolve(1),e=(t.constructor={})[n("dSzd")("species")]=function(t){t(L,L)};return(j||"function"==typeof PromiseRejectionEvent)&&t.then(L)instanceof e&&0!==M.indexOf("6.6")&&-1===b.indexOf("Chrome/66")}catch(t){}}(),$=function(t){var e;return!(!d(t)||"function"!=typeof(e=t.then))&&e},F=function(t,e){if(!t._n){t._n=!0;var n=t._c;y(function(){for(var r=t._v,i=1==t._s,o=0,a=function(e){var n,o,a,s=i?e.ok:e.fail,c=e.resolve,u=e.reject,l=e.domain;try{s?(i||(2==t._h&&U(t),t._h=1),!0===s?n=r:(l&&l.enter(),n=s(r),l&&(l.exit(),a=!0)),n===e.promise?u(P("Promise-chain cycle")):(o=$(n))?o.call(n,c,u):c(n)):u(r)}catch(t){l&&!a&&l.exit(),u(t)}};n.length>o;)a(n[o++]);t._c=[],t._n=!1,e&&!t._h&&O(t)})}},O=function(t){g.call(c,function(){var e,n,r,i=t._v,o=D(t);if(o&&(e=_(function(){j?k.emit("unhandledRejection",i,t):(n=c.onunhandledrejection)?n({promise:t,reason:i}):(r=c.console)&&r.error&&r.error("Unhandled promise rejection",i)}),t._h=j||D(t)?2:1),t._a=void 0,o&&e.e)throw e.v})},D=function(t){return 1!==t._h&&0===(t._a||t._c).length},U=function(t){g.call(c,function(){var e;j?k.emit("rejectionHandled",t):(e=c.onrejectionhandled)&&e({promise:t,reason:t._v})})},C=function(t){var e=this;e._d||(e._d=!0,(e=e._w||e)._v=t,e._s=2,e._a||(e._a=e._c.slice()),F(e,!0))},A=function(t){var e,n=this;if(!n._d){n._d=!0,n=n._w||n;try{if(n===t)throw P("Promise can't be resolved itself");(e=$(t))?y(function(){var r={_w:n,_d:!1};try{e.call(t,u(A,r,1),u(C,r,1))}catch(t){C.call(r,t)}}):(n._v=t,n._s=1,F(n,!1))}catch(t){C.call({_w:n,_d:!1},t)}}};S||(R=function(t){v(this,R,"Promise","_h"),h(t),r.call(this);try{t(u(A,this,1),u(C,this,1))}catch(t){C.call(this,t)}},(r=function(t){this._c=[],this._a=void 0,this._s=0,this._d=!1,this._v=void 0,this._h=0,this._n=!1}).prototype=n("xH/j")(R.prototype,{then:function(t,e){var n=E(m(this,R));return n.ok="function"!=typeof t||t,n.fail="function"==typeof e&&e,n.domain=j?k.domain:void 0,this._c.push(n),this._a&&this._a.push(n),this._s&&F(this,!1),n.promise},catch:function(t){return this.then(void 0,t)}}),o=function(){var t=new r;this.promise=t,this.resolve=u(A,t,1),this.reject=u(C,t,1)},w.f=E=function(t){return t===R||t===a?new o(t):i(t)}),f(f.G+f.W+f.F*!S,{Promise:R}),n("e6n0")(R,"Promise"),n("bRrM")("Promise"),a=n("FeBl").Promise,f(f.S+f.F*!S,"Promise",{reject:function(t){var e=E(this);return(0,e.reject)(t),e.promise}}),f(f.S+f.F*(s||!S),"Promise",{resolve:function(t){return x(s&&this===a?R:this,t)}}),f(f.S+f.F*!(S&&n("dY0y")(function(t){R.all(t).catch(L)})),"Promise",{all:function(t){var e=this,n=E(e),r=n.resolve,i=n.reject,o=_(function(){var n=[],o=0,a=1;p(t,!1,function(t){var s=o++,c=!1;n.push(void 0),a++,e.resolve(t).then(function(t){c||(c=!0,n[s]=t,--a||r(n))},i)}),--a||r(n)});return o.e&&i(o.v),n.promise},race:function(t){var e=this,n=E(e),r=n.reject,i=_(function(){p(t,!1,function(t){e.resolve(t).then(n.resolve,r)})});return i.e&&r(i.v),n.promise}})},EqBC:function(t,e,n){"use strict";var r=n("kM2E"),i=n("FeBl"),o=n("7KvD"),a=n("t8x9"),s=n("fJUb");r(r.P+r.R,"Promise",{finally:function(t){var e=a(this,i.Promise||o.Promise),n="function"==typeof t;return this.then(n?function(n){return s(e,t()).then(function(){return n})}:t,n?function(n){return s(e,t()).then(function(){throw n})}:t)}})},L42u:function(t,e,n){var r,i,o,a=n("+ZMJ"),s=n("knuC"),c=n("RPLV"),u=n("ON07"),l=n("7KvD"),f=l.process,d=l.setImmediate,h=l.clearImmediate,v=l.MessageChannel,p=l.Dispatch,m=0,g={},y=function(){var t=+this;if(g.hasOwnProperty(t)){var e=g[t];delete g[t],e()}},w=function(t){y.call(t.data)};d&&h||(d=function(t){for(var e=[],n=1;arguments.length>n;)e.push(arguments[n++]);return g[++m]=function(){s("function"==typeof t?t:Function(t),e)},r(m),m},h=function(t){delete g[t]},"process"==n("R9M2")(f)?r=function(t){f.nextTick(a(y,t,1))}:p&&p.now?r=function(t){p.now(a(y,t,1))}:v?(o=(i=new v).port2,i.port1.onmessage=w,r=a(o.postMessage,o,1)):l.addEventListener&&"function"==typeof postMessage&&!l.importScripts?(r=function(t){l.postMessage(t+"","*")},l.addEventListener("message",w,!1)):r="onreadystatechange"in u("script")?function(t){c.appendChild(u("script")).onreadystatechange=function(){c.removeChild(this),y.call(t)}}:function(t){setTimeout(a(y,t,1),0)}),t.exports={set:d,clear:h}},Mhyx:function(t,e,n){var r=n("/bQp"),i=n("dSzd")("iterator"),o=Array.prototype;t.exports=function(t){return void 0!==t&&(r.Array===t||o[i]===t)}},"NWt+":function(t,e,n){var r=n("+ZMJ"),i=n("msXi"),o=n("Mhyx"),a=n("77Pl"),s=n("QRG4"),c=n("3fs2"),u={},l={};(e=t.exports=function(t,e,n,f,d){var h,v,p,m,g=d?function(){return t}:c(t),y=r(n,f,e?2:1),w=0;if("function"!=typeof g)throw TypeError(t+" is not iterable!");if(o(g)){for(h=s(t.length);h>w;w++)if((m=e?y(a(v=t[w])[0],v[1]):y(t[w]))===u||m===l)return m}else for(p=g.call(t);!(v=p.next()).done;)if((m=i(p,y,v.value,e))===u||m===l)return m}).BREAK=u,e.RETURN=l},RbGP:function(t,e){},U5ju:function(t,e,n){n("M6a0"),n("zQR9"),n("+tPU"),n("CXw9"),n("EqBC"),n("jKW+"),t.exports=n("FeBl").Promise},Xd32:function(t,e,n){n("+tPU"),n("zQR9"),t.exports=n("5PlU")},bRrM:function(t,e,n){"use strict";var r=n("7KvD"),i=n("FeBl"),o=n("evD5"),a=n("+E39"),s=n("dSzd")("species");t.exports=function(t){var e="function"==typeof i[t]?i[t]:r[t];a&&e&&!e[s]&&o.f(e,s,{configurable:!0,get:function(){return this}})}},d7EF:function(t,e,n){"use strict";e.__esModule=!0;var r=o(n("us/S")),i=o(n("BO1k"));function o(t){return t&&t.__esModule?t:{default:t}}e.default=function(){return function(t,e){if(Array.isArray(t))return t;if((0,r.default)(Object(t)))return function(t,e){var n=[],r=!0,o=!1,a=void 0;try{for(var s,c=(0,i.default)(t);!(r=(s=c.next()).done)&&(n.push(s.value),!e||n.length!==e);r=!0);}catch(t){o=!0,a=t}finally{try{!r&&c.return&&c.return()}finally{if(o)throw a}}return n}(t,e);throw new TypeError("Invalid attempt to destructure non-iterable instance")}}()},dNDb:function(t,e){t.exports=function(t){try{return{e:!1,v:t()}}catch(t){return{e:!0,v:t}}}},dY0y:function(t,e,n){var r=n("dSzd")("iterator"),i=!1;try{var o=[7][r]();o.return=function(){i=!0},Array.from(o,function(){throw 2})}catch(t){}t.exports=function(t,e){if(!e&&!i)return!1;var n=!1;try{var o=[7],a=o[r]();a.next=function(){return{done:n=!0}},o[r]=function(){return a},t(o)}catch(t){}return n}},fJUb:function(t,e,n){var r=n("77Pl"),i=n("EqjI"),o=n("qARP");t.exports=function(t,e){if(r(t),i(e)&&e.constructor===t)return e;var n=o.f(t);return(0,n.resolve)(e),n.promise}},"gSw/":function(t,e){},iUbK:function(t,e,n){var r=n("7KvD").navigator;t.exports=r&&r.userAgent||""},"jKW+":function(t,e,n){"use strict";var r=n("kM2E"),i=n("qARP"),o=n("dNDb");r(r.S,"Promise",{try:function(t){var e=i.f(this),n=o(t);return(n.e?e.reject:e.resolve)(n.v),e.promise}})},knuC:function(t,e){t.exports=function(t,e,n){var r=void 0===n;switch(e.length){case 0:return r?t():t.call(n);case 1:return r?t(e[0]):t.call(n,e[0]);case 2:return r?t(e[0],e[1]):t.call(n,e[0],e[1]);case 3:return r?t(e[0],e[1],e[2]):t.call(n,e[0],e[1],e[2]);case 4:return r?t(e[0],e[1],e[2],e[3]):t.call(n,e[0],e[1],e[2],e[3])}return t.apply(n,e)}},msXi:function(t,e,n){var r=n("77Pl");t.exports=function(t,e,n,i){try{return i?e(r(n)[0],n[1]):e(n)}catch(e){var o=t.return;throw void 0!==o&&r(o.call(t)),e}}},qARP:function(t,e,n){"use strict";var r=n("lOnJ");t.exports.f=function(t){return new function(t){var e,n;this.promise=new t(function(t,r){if(void 0!==e||void 0!==n)throw TypeError("Bad Promise constructor");e=t,n=r}),this.resolve=r(e),this.reject=r(n)}(t)}},t8x9:function(t,e,n){var r=n("77Pl"),i=n("lOnJ"),o=n("dSzd")("species");t.exports=function(t,e){var n,a=r(t).constructor;return void 0===a||void 0==(n=r(a)[o])?e:i(n)}},"us/S":function(t,e,n){t.exports={default:n("Xd32"),__esModule:!0}},vFKe:function(t,e){},"xH/j":function(t,e,n){var r=n("hJx8");t.exports=function(t,e,n){for(var i in e)n&&t[i]?t[i]=e[i]:r(t,i,e[i]);return t}}});